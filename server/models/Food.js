// server/models/Food.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    maxlength: [100, 'Food name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters'],
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  preparationTime: {
    type: Number, // in minutes
    min: [1, 'Preparation time must be at least 1 minute'],
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
}, { timestamps: true });

// Indexes for better query performance
FoodSchema.index({ name: 'text', description: 'text' });
FoodSchema.index({ category: 1 });
FoodSchema.index({ price: 1 });
FoodSchema.index({ isAvailable: 1 });
FoodSchema.index({ 'rating.average': -1 });
FoodSchema.index({ createdAt: -1 });

// Virtual for formatted price
FoodSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toFixed(2)}`;
});

// Instance method to update rating
FoodSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

module.exports = mongoose.model('Food', FoodSchema);
