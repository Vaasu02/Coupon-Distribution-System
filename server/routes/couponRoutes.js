const express = require('express');
const router = express.Router();
const { trackUser, checkClaimEligibility } = require('../middleware/trackingMiddleware');
const {
  getNextAvailableCoupon,
  claimCoupon,
  checkClaimStatus
} = require('../controllers/couponController');

// Apply tracking middleware to all routes
router.use(trackUser);

// Get next available coupon
router.get('/next', getNextAvailableCoupon);

// Claim a coupon
router.post('/claim', checkClaimEligibility, claimCoupon);

// Check claim status
router.get('/status', checkClaimStatus);

module.exports = router; 