require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Food     = require('./models/Food');
const Order    = require('./models/Order')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URI, PORT = 4000 } = process.env;

// Health check
app.get('/', (_req, res) => res.send('API is running'));

// GET /api/foods → returns all food items
app.get('/api/foods', async (_req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Admin check
const admin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user && user.isAdmin) return next();
  res.status(403).json({ message: 'Not authorized as admin' });
};

// GET /api/admin/orders → all orders
app.get('/api/admin/orders', protect, admin, async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch orders' });
  }
});


// Connect DB & start server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server listening on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  });

  // POST /api/orders
 app.post('/api/orders', async (req, res) => {
   try {
     const { items, total } = req.body;
     const order = await Order.create({ items, total });
     res.status(201).json(order);
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Could not place order' });
   }
 });

 // POST /api/create-checkout-session
app.post('/api/create-checkout-session', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const lineItems = items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: i.name,
          images: [i.imageUrl],
        },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { userId: req.user.id },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
});
