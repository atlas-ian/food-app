const express = require('express');
+const Order = require('../models/Order');
+const Food = require('../models/Food');
+const { authenticate, requireAdmin } = require('../middleware/auth');
+const { validate, schemas } = require('../middleware/validation');
+const logger = require('../utils/logger');
+
+const router = express.Router();
+
+/**
+ * @swagger
+ * /api/orders:
+ *   post:
+ *     summary: Create a new order
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     requestBody:
+ *       required: true
+ *       content:
+ *         application/json:
+ *           schema:
+ *             type: object
+ *             required:
+ *               - items
+ *               - deliveryAddress
+ *             properties:
+ *               items:
+ *                 type: array
+ *               deliveryAddress:
+ *                 type: object
+ *     responses:
+ *       201:
+ *         description: Order created successfully
+ *       400:
+ *         description: Invalid order data
+ */
+router.post('/', authenticate, validate(schemas.createOrder), async (req, res) => {
   try {
-    const { items, total } = req.body;
+    const { items, deliveryAddress, notes } = req.body;
     
-    if (!items || !Array.isArray(items) || items.length === 0) {
-      return res.status(400).json({ message: 'Order must contain items' });
+    // Validate food items exist and are available
+    const foodIds = items.map(item => item._id);
+    const foods = await Food.find({ 
+      _id: { $in: foodIds }, 
+      isAvailable: true 
+    });
+    
+    if (foods.length !== items.length) {
+      return res.status(400).json({ message: 'Some items are no longer available' });
     }
 
-    if (!total || total <= 0) {
-      return res.status(400).json({ message: 'Order total must be greater than 0' });
+    // Validate prices (prevent price manipulation)
+    const validatedItems = items.map(item => {
+      const food = foods.find(f => f._id.toString() === item._id);
+      if (!food) {
+        throw new Error(`Food item ${item._id} not found`);
+      }
+      if (Math.abs(food.price - item.price) > 0.01) {
+        throw new Error(`Price mismatch for ${food.name}`);
+      }
+      return {
+        food: food._id,
+        name: food.name,
+        price: food.price,
+        quantity: item.quantity,
+        imageUrl: food.imageUrl,
+      };
+    });
+
+    // Calculate totals
+    const subtotal = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
+    const deliveryFee = 2.99;
+    const tax = 0; // Add tax calculation if needed
+    const total = subtotal + deliveryFee + tax;
+
+    // Create order
+    const order = await Order.create({
+      user: req.user._id,
+      items: validatedItems,
+      subtotal,
+      deliveryFee,
+      tax,
+      total,
+      deliveryAddress,
+      notes,
+      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
+    });
+
+    // Populate the order for response
+    await order.populate('user', 'name email');
+
+    logger.info('Order created', { orderId: order._id, userId: req.user._id, total });
+
+    res.status(201).json({
+      message: 'Order created successfully',
+      order,
+    });
+  } catch (error) {
+    logger.error('Create order error:', error);
+    res.status(500).json({ message: 'Server error while creating order' });
+  }
+});
+
+/**
+ * @swagger
+ * /api/orders:
+ *   get:
+ *     summary: Get user's orders
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     parameters:
+ *       - in: query
+ *         name: page
+ *         schema:
+ *           type: integer
+ *         description: Page number
+ *       - in: query
+ *         name: limit
+ *         schema:
+ *           type: integer
+ *         description: Number of orders per page
+ *     responses:
+ *       200:
+ *         description: List of user orders
+ */
+router.get('/', authenticate, validate(schemas.paginationQuery, 'query'), async (req, res) => {
+  try {
+    const { page, limit } = req.query;
+    const skip = (page - 1) * limit;
+
+    const [orders, total] = await Promise.all([
+      Order.find({ user: req.user._id })
+        .sort({ createdAt: -1 })
+        .skip(skip)
+        .limit(limit)
+        .populate('user', 'name email')
+        .lean(),
+      Order.countDocuments({ user: req.user._id }),
+    ]);
+
+    res.json({
+      orders,
+      pagination: {
+        page,
+        limit,
+        total,
+        pages: Math.ceil(total / limit),
+      },
+    });
+  } catch (error) {
+    logger.error('Get orders error:', error);
+    res.status(500).json({ message: 'Server error while fetching orders' });
+  }
+});
+
+/**
+ * @swagger
+ * /api/orders/{id}:
+ *   get:
+ *     summary: Get single order
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     parameters:
+ *       - in: path
+ *         name: id
+ *         required: true
+ *         schema:
+ *           type: string
+ *         description: Order ID
+ *     responses:
+ *       200:
+ *         description: Order details
+ *       404:
+ *         description: Order not found
+ */
+router.get('/:id', authenticate, validate(schemas.mongoId, 'params'), async (req, res) => {
+  try {
+    const order = await Order.findOne({
+      _id: req.params.id,
+      user: req.user._id,
+    }).populate('user', 'name email');
+
+    if (!order) {
+      return res.status(404).json({ message: 'Order not found' });
     }

-    const order = await Order.create({ items, total });
-    res.status(201).json(order);
-  } catch (err) {
-    console.error('Error creating order:', err);
-    res.status(500).json({ message: 'Could not place order' });
+    res.json(order);
+  } catch (error) {
+    logger.error('Get order error:', error);
+    res.status(500).json({ message: 'Server error while fetching order' });
   }
 });

-// POST /api/create-checkout-session
-app.post('/api/create-checkout-session', async (req, res) => {
+/**
+ * @swagger
+ * /api/orders/{id}/cancel:
+ *   put:
+ *     summary: Cancel an order
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     parameters:
+ *       - in: path
+ *         name: id
+ *         required: true
+ *         schema:
+ *           type: string
+ *         description: Order ID
+ *     requestBody:
+ *       content:
+ *         application/json:
+ *           schema:
+ *             type: object
+ *             properties:
+ *               reason:
+ *                 type: string
+ *     responses:
+ *       200:
+ *         description: Order cancelled successfully
+ *       400:
+ *         description: Cannot cancel order
+ *       404:
+ *         description: Order not found
+ */
+router.put('/:id/cancel', authenticate, validate(schemas.mongoId, 'params'), async (req, res) => {
   try {
-    const { items } = req.body;
+    const { reason } = req.body;
+    
+    const order = await Order.findOne({
+      _id: req.params.id,
+      user: req.user._id,
+    });
+
+    if (!order) {
+      return res.status(404).json({ message: 'Order not found' });
+    }
+
+    // Check if order can be cancelled
+    if (['delivered', 'cancelled'].includes(order.status)) {
+      return res.status(400).json({ message: 'Cannot cancel this order' });
+    }
+
+    await order.updateStatus('cancelled', reason);
+
+    logger.info('Order cancelled', { orderId: order._id, userId: req.user._id, reason });
+
+    res.json({
+      message: 'Order cancelled successfully',
+      order,
+    });
+  } catch (error) {
+    logger.error('Cancel order error:', error);
+    res.status(500).json({ message: 'Server error while cancelling order' });
+  }
+});
+
+// Admin routes
+
+/**
+ * @swagger
+ * /api/orders/admin/all:
+ *   get:
+ *     summary: Get all orders (Admin only)
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     parameters:
+ *       - in: query
+ *         name: page
+ *         schema:
+ *           type: integer
+ *         description: Page number
+ *       - in: query
+ *         name: limit
+ *         schema:
+ *           type: integer
+ *         description: Number of orders per page
+ *       - in: query
+ *         name: status
+ *         schema:
+ *           type: string
+ *         description: Filter by status
+ *     responses:
+ *       200:
+ *         description: List of all orders
+ *       403:
+ *         description: Admin access required
+ */
+router.get('/admin/all', authenticate, requireAdmin, validate(schemas.paginationQuery, 'query'), async (req, res) => {
+  try {
+    const { page, limit, status } = req.query;
+    const skip = (page - 1) * limit;
+
+    // Build query
+    const query = {};
+    if (status) {
+      query.status = status;
+    }
+
+    const [orders, total] = await Promise.all([
+      Order.find(query)
+        .sort({ createdAt: -1 })
+        .skip(skip)
+        .limit(limit)
+        .populate('user', 'name email')
+        .lean(),
+      Order.countDocuments(query),
+    ]);
+
+    res.json({
+      orders,
+      pagination: {
+        page,
+        limit,
+        total,
+        pages: Math.ceil(total / limit),
+      },
+    });
+  } catch (error) {
+    logger.error('Get all orders error:', error);
+    res.status(500).json({ message: 'Server error while fetching orders' });
+  }
+});
+
+/**
+ * @swagger
+ * /api/orders/{id}/status:
+ *   put:
+ *     summary: Update order status (Admin only)
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     parameters:
+ *       - in: path
+ *         name: id
+ *         required: true
+ *         schema:
+ *           type: string
+ *         description: Order ID
+ *     requestBody:
+ *       required: true
+ *       content:
+ *         application/json:
+ *           schema:
+ *             type: object
+ *             required:
+ *               - status
+ *             properties:
+ *               status:
+ *                 type: string
+ *                 enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
+ *     responses:
+ *       200:
+ *         description: Order status updated successfully
+ *       404:
+ *         description: Order not found
+ */
+router.put('/:id/status', authenticate, requireAdmin, validate(schemas.mongoId, 'params'), validate(schemas.updateOrderStatus), async (req, res) => {
+  try {
+    const { status } = req.body;
     
-    if (!items || !Array.isArray(items) || items.length === 0) {
-      return res.status(400).json({ message: 'Cart items are required' });
+    const order = await Order.findById(req.params.id);
+
+    if (!order) {
+      return res.status(404).json({ message: 'Order not found' });
     }

-    const lineItems = items.map(i => ({
-      price_data: {
-        currency: 'inr',
-        product_data: {
-          name: i.name,
-          images: i.imageUrl ? [i.imageUrl] : [],
-        },
-        unit_amount: Math.round(i.price * 100),
-      },
-      quantity: i.quantity,
-    }));
-
-    const session = await stripe.checkout.sessions.create({
-      payment_method_types: ['card'],
-      line_items: lineItems,
-      mode: 'payment',
-      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
-      cancel_url: `${process.env.CLIENT_URL}/cart`,
-    });
-
-    res.json({ url: session.url });
-  } catch (err) {
-    console.error('Stripe session creation error:', err);
-    res.status(500).json({ message: 'Stripe session creation failed' });
+    await order.updateStatus(status);
+    await order.populate('user', 'name email');
+
+    logger.info('Order status updated', { 
+      orderId: order._id, 
+      newStatus: status, 
+      updatedBy: req.user._id 
+    });
+
+    res.json({
+      message: 'Order status updated successfully',
+      order,
+    });
+  } catch (error) {
+    logger.error('Update order status error:', error);
+    res.status(500).json({ message: 'Server error while updating order status' });
   }
 });

-// Error handling middleware
-app.use((err, req, res, next) => {
-  console.error('Unhandled error:', err);
-  res.status(500).json({ message: 'Something went wrong!' });
+/**
+ * @swagger
+ * /api/orders/admin/stats:
+ *   get:
+ *     summary: Get order statistics (Admin only)
+ *     tags: [Orders]
+ *     security:
+ *       - bearerAuth: []
+ *     responses:
+ *       200:
+ *         description: Order statistics
+ */
+router.get('/admin/stats', authenticate, requireAdmin, async (req, res) => {
+  try {
+    const stats = await Order.getOrderStats();
+    
+    // Get additional stats
+    const [totalRevenue, todayOrders, thisMonthOrders] = await Promise.all([
+      Order.aggregate([
+        { $match: { status: 'delivered' } },
+        { $group: { _id: null, total: { $sum: '$total' } } },
+      ]),
+      Order.countDocuments({
+        createdAt: {
+          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
+        },
+      }),
+      Order.countDocuments({
+        createdAt: {
+          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
+        },
+      }),
+    ]);
+
+    res.json({
+      statusStats: stats,
+      totalRevenue: totalRevenue[0]?.total || 0,
+      todayOrders,
+      thisMonthOrders,
+    });
+  } catch (error) {
+    logger.error('Get order stats error:', error);
+    res.status(500).json({ message: 'Server error while fetching order statistics' });
+  }
 });

-// 404 handler
-app.use('*', (req, res) => {
-  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
-});
-
-// Connect DB & start server
-mongoose
-  .connect(MONGO_URI, { 
-    useNewUrlParser: true, 
-    useUnifiedTopology: true,
-  })
-  .then(() => {
-    console.log('✅ MongoDB connected successfully');
-    app.listen(PORT, '0.0.0.0', () => {
-      console.log(`🚀 Server listening on port ${PORT}`);
-      console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
-      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
-    });
-  })
-  .catch(err => {
-    console.error('❌ DB connection error:', err.message);
-    process.exit(1);
-  });
-
-// Graceful shutdown
-process.on('SIGTERM', () => {
-  console.log('SIGTERM received, shutting down gracefully');
-  mongoose.connection.close(() => {
-    console.log('MongoDB connection closed');
-    process.exit(0);
-  });
-});
+module.exports = router;