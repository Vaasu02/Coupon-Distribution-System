const Tracking = require('../models/Tracking');
const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to track user sessions and IP addresses
 */
const trackUser = async (req, res, next) => {
  try {
    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Check for existing session cookie or create a new one
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      // Set cookie to expire in 24 hours
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }
    
    // Attach tracking info to request object for use in controllers
    req.trackingInfo = {
      ipAddress,
      sessionId
    };
    
    next();
  } catch (error) {
    console.error('Error in tracking middleware:', error);
    next(error);
  }
};

/**
 * Middleware to check if user is allowed to claim a coupon
 */
const checkClaimEligibility = async (req, res, next) => {
  try {
    const { ipAddress, sessionId } = req.trackingInfo;
    const cooldownPeriod = parseInt(process.env.COUPON_CLAIM_COOLDOWN) || 3600000; // Default 1 hour
    
    // Check if IP or session has claimed recently
    const tracking = await Tracking.findOne({
      $or: [
        { ipAddress },
        { sessionId }
      ]
    }).sort({ lastClaimTime: -1 });
    
    if (tracking) {
      // Check if user is blocked
      if (tracking.isBlocked && tracking.blockExpiresAt > new Date()) {
        return res.status(403).json({
          success: false,
          message: 'You are temporarily blocked from claiming coupons',
          timeRemaining: Math.ceil((tracking.blockExpiresAt - new Date()) / 1000)
        });
      }
      
      // Check cooldown period
      const timeSinceLastClaim = Date.now() - tracking.lastClaimTime;
      if (timeSinceLastClaim < cooldownPeriod) {
        const timeRemaining = Math.ceil((cooldownPeriod - timeSinceLastClaim) / 1000);
        return res.status(429).json({
          success: false,
          message: 'You have recently claimed a coupon',
          timeRemaining
        });
      }
    }
    
    // User is eligible to claim
    next();
  } catch (error) {
    console.error('Error checking claim eligibility:', error);
    next(error);
  }
};

module.exports = {
  trackUser,
  checkClaimEligibility
}; 