const Coupon = require('../models/Coupon');
const Tracking = require('../models/Tracking');
const DistributionPointer = require('../models/DistributionPointer');

/**
 * Get the next available coupon in round-robin fashion
 */
const getNextAvailableCoupon = async (req, res) => {
  try {
    // Get or create distribution pointer
    let pointer = await DistributionPointer.findOne({ name: 'main' });
    if (!pointer) {
      pointer = await DistributionPointer.create({ name: 'main' });
    }

    // Find total number of coupons
    const totalCoupons = await Coupon.countDocuments({ isActive: true });
    if (totalCoupons === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active coupons available'
      });
    }

    // Find next available coupon starting from current position
    let coupon = await Coupon.findOne({
      isActive: true,
      isClaimed: false
    }).skip(pointer.currentPosition);

    // If no coupon found after current position, start from beginning
    if (!coupon) {
      pointer.currentPosition = 0;
      await pointer.save();
      
      coupon = await Coupon.findOne({
        isActive: true,
        isClaimed: false
      });
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'No available coupons found'
      });
    }

    // Update pointer position
    pointer.currentPosition = (pointer.currentPosition + 1) % totalCoupons;
    pointer.lastUpdated = new Date();
    await pointer.save();

    // Return coupon details without sensitive information
    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        value: coupon.value
      }
    });
  } catch (error) {
    console.error('Error getting next coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving coupon'
    });
  }
};

/**
 * Claim a coupon
 */
const claimCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const { ipAddress, sessionId } = req.trackingInfo;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    // Find and update coupon atomically
    const coupon = await Coupon.findOneAndUpdate(
      {
        code,
        isActive: true,
        isClaimed: false
      },
      {
        isClaimed: true,
        claimedAt: new Date(),
        claimedBy: { ipAddress, sessionId }
      },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or already claimed'
      });
    }

    // Update or create tracking record
    await Tracking.findOneAndUpdate(
      { ipAddress, sessionId },
      {
        lastClaimTime: new Date(),
        $inc: { claimCount: 1 }
      },
      { upsert: true }
    );

    return res.json({
      success: true,
      message: 'Coupon claimed successfully',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        value: coupon.value
      }
    });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Error claiming coupon'
    });
  }
};

/**
 * Check claim status and remaining time
 */
const checkClaimStatus = async (req, res) => {
  try {
    const { ipAddress, sessionId } = req.trackingInfo;
    const cooldownPeriod = parseInt(process.env.COUPON_CLAIM_COOLDOWN) || 3600000;

    const tracking = await Tracking.findOne({
      $or: [{ ipAddress }, { sessionId }]
    }).sort({ lastClaimTime: -1 });

    if (!tracking) {
      return res.json({
        success: true,
        canClaim: true
      });
    }

    const timeSinceLastClaim = Date.now() - tracking.lastClaimTime;
    const canClaim = timeSinceLastClaim >= cooldownPeriod && !tracking.isBlocked;
    const timeRemaining = Math.max(0, cooldownPeriod - timeSinceLastClaim);

    return res.json({
      success: true,
      canClaim,
      timeRemaining: Math.ceil(timeRemaining / 1000),
      isBlocked: tracking.isBlocked,
      blockExpiresAt: tracking.blockExpiresAt
    });
  } catch (error) {
    console.error('Error checking claim status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking claim status'
    });
  }
};

module.exports = {
  getNextAvailableCoupon,
  claimCoupon,
  checkClaimStatus
}; 