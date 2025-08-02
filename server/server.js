require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());

const PORT = process.env.PORT || 4000;
app.get('/', (_req, res) => res.send('API is running'));
app.listen(PORT, () => console.log(`Server  is listening on ${PORT}`));


const mongoose = require('mongoose');
const Food = require('./models/Food');

mongoose.connect(process.env.MONGO_URI);

app.get('/api/foods', async (_req, res) => {
  const foods = await Food.find();
  res.json(foods);
});
