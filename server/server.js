require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Food     = require('./models/Food');
const Order    = require('./models/Order');
const User     = require('./models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect, admin } = require('./middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URI, PORT = 5000, JWT_SECRET } = process.env;

// Health check
app.get('/', (_req, res) => res.send('API is running'));

// Auth routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

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