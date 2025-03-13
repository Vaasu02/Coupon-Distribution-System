const mongoose = require('mongoose');

const distributionPointerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'main',
    unique: true
  },
  currentPosition: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('DistributionPointer', distributionPointerSchema); 