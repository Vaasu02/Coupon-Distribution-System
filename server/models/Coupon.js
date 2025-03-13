const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isClaimed: {
    type: Boolean,
    default: false
  },
  claimedAt: {
    type: Date,
    default: null
  },
  claimedBy: {
    ipAddress: {
      type: String,
      default: null
    },
    sessionId: {
      type: String,
      default: null
    }
  }
}, { timestamps: true });

// Add index for faster queries
couponSchema.index({ isClaimed: 1, isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema); 