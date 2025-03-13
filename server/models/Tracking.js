const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  lastClaimTime: {
    type: Date,
    default: Date.now
  },
  claimCount: {
    type: Number,
    default: 1
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockExpiresAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Create compound index for faster lookups
trackingSchema.index({ ipAddress: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model('Tracking', trackingSchema); 