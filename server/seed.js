// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Food     = require('./models/Food');

const sampleFoods = [
  { name: 'Margherita Pizza', price: 8.99, imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Veggie Burger',     price: 6.49, imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Caesar Salad',      price: 5.99, imageUrl: 'https://via.placeholder.com/150' },
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Food.deleteMany({});
    await Food.insertMany(sampleFoods);
    console.log('✅ Seeded foods');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
