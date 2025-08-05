// server/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      imageUrl: String,
    }
  ],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryFee: {
    type: Number,
    default: 2.99,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'wallet'],
    default: 'card',
  },
  stripeSessionId: String,
  stripePaymentIntentId: String,
  deliveryAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  cancelReason: String,
  refundAmount: {
    type: Number,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual for order number
OrderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Pre-save middleware to calculate totals
OrderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('deliveryFee') || this.isModified('tax')) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.total = this.subtotal + this.deliveryFee + this.tax;
  }
  next();
});

// Instance method to update status
OrderSchema.methods.updateStatus = function(newStatus, reason = null) {
  this.status = newStatus;
  
  if (newStatus === 'cancelled' && reason) {
    this.cancelReason = reason;
  }
  
  if (newStatus === 'delivered') {
    this.actualDeliveryTime = new Date();
  }
  
  return this.save();
};

// Static method to get order statistics
OrderSchema.statics.getOrderStats = function(userId = null) {
  const matchStage = userId ? { user: mongoose.Types.ObjectId(userId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' },
      },
    },
  ]);
};

module.exports = mongoose.model('Order', OrderSchema);
