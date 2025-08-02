// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Food     = require('./models/Food');

// sample menu items (now 5 products)
const sampleFoods = [
  {
    name:     'Margherita Pizza',
    price:     8.99,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/pizza.jpg`
      : 'http://localhost:3000/images/pizza.jpg'
  },
  {
    name:     'Veggie Burger',
    price:     6.49,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/burger.jpg`
      : 'http://localhost:3000/images/burger.jpg'
  },
  {
    name:     'Caesar Salad',
    price:     5.99,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/salad.jpg`
      : 'http://localhost:3000/images/salad.jpg'
  },
  {
    name:     'Spicy Chicken Wings',
    price:     7.99,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/wings.jpg`
      : 'http://localhost:3000/images/wings.jpg'
  },
  {
    name:     'Chocolate Brownie',
    price:     4.50,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/choclate.jpg`
      : 'http://localhost:3000/images/choclate.jpg'
  },

  {
    name:     'coke',
    price:     2.50,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/coke.jpg`
      : 'http://localhost:3000/images/coke.jpg'
  },
  {
    name:     'Pancakes',
    price:     9.50,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/Pancakes.jpg`
      : 'http://localhost:3000/images/Pancakes.jpg'
  },
  {
    name:     'Bread',
    price:     5.00,
    imageUrl:  process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/images/Bread.jpg`
      : 'http://localhost:3000/images/Bread.jpg'
  },
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Food.deleteMany({});
    await Food.insertMany(sampleFoods);
    console.log('✅ Seeded foods (5 items)');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });