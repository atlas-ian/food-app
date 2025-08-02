require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Food     = require('./models/Food');

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
