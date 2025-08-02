// server/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      _id:       String,
      name:      String,
      price:     Number,
      imageUrl:  String,
      quantity:  Number,
    }
  ],
  total:      { type: Number, required: true },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
