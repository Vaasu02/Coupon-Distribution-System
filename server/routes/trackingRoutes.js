const express = require('express');
const router = express.Router();
const { trackUser } = require('../middleware/trackingMiddleware');
const {
  getTrackingInfo,
  blockUser,
  unblockUser
} = require('../controllers/trackingController');

// Apply tracking middleware to all routes
router.use(trackUser);

// Get tracking information for current user
router.get('/info', getTrackingInfo);

// Block a user (admin only)
router.post('/block', blockUser);

// Unblock a user (admin only)
router.post('/unblock', unblockUser);

module.exports = router; 