const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create Stripe checkout session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *     responses:
 *       200:
 *         description: Checkout session created
 *       400:
 *         description: Invalid request
 */
router.post('/create-checkout-session', authenticate, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Fee',
        },
        unit_amount: 299, // ₹2.99 in paise
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        items: JSON.stringify(items),
      },
    });

    logger.info('Stripe checkout session created', { 
      sessionId: session.id, 
      userId: req.user._id 
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    logger.error('Stripe session creation error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify payment and create order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified and order created
 *       400:
 *         description: Invalid session or payment failed
 */
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Check if order already exists for this session
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return res.json({ 
        message: 'Order already exists', 
        order: existingOrder 
      });
    }

    // Parse items from metadata
    const items = JSON.parse(session.metadata.items);
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: items.map(item => ({
        food: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      subtotal,
      deliveryFee,
      total,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      stripeSessionId: sessionId,
      stripePaymentIntentId: session.payment_intent,
      deliveryAddress: {
        // TODO: Get from user profile or session
        street: 'Default Address',
        city: 'Default City',
        state: 'Default State',
        zipCode: '000000',
        country: 'India',
      },
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    await order.populate('user', 'name email');

    logger.info('Order created from payment verification', { 
      orderId: order._id, 
      sessionId, 
      userId: req.user._id 
    });

    res.json({
      message: 'Payment verified and order created successfully',
      order,
    });
  } catch (error) {
    logger.error('Payment verification error:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        logger.info('Checkout session completed', { sessionId: session.id });
        
        // Update order payment status if needed
        await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          { 
            paymentStatus: 'paid',
            status: 'confirmed',
            stripePaymentIntentId: session.payment_intent,
          }
        );
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        logger.info('Payment intent succeeded', { paymentIntentId: paymentIntent.id });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        logger.warn('Payment intent failed', { paymentIntentId: failedPayment.id });
        
        // Update order payment status
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: failedPayment.id },
          { paymentStatus: 'failed' }
        );
        break;

      default:
        logger.info('Unhandled event type', { type: event.type });
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;