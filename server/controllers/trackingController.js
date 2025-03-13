const Tracking = require('../models/Tracking');

/**
 * Get tracking information for the current user
 */
const getTrackingInfo = async (req, res) => {
  try {
    const { ipAddress, sessionId } = req.trackingInfo;

    const tracking = await Tracking.findOne({
      $or: [{ ipAddress }, { sessionId }]
    });

    if (!tracking) {
      return res.json({
        success: true,
        tracking: {
          claimCount: 0,
          isBlocked: false,
          lastClaimTime: null
        }
      });
    }

    return res.json({
      success: true,
      tracking: {
        claimCount: tracking.claimCount,
        isBlocked: tracking.isBlocked,
        lastClaimTime: tracking.lastClaimTime,
        blockExpiresAt: tracking.blockExpiresAt
      }
    });
  } catch (error) {
    console.error('Error getting tracking info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving tracking information'
    });
  }
};

/**
 * Block a user for suspicious activity
 * This would typically be called by an admin or automated system
 */
const blockUser = async (req, res) => {
  try {
    const { ipAddress, sessionId, duration } = req.body;
    
    if (!ipAddress && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Either IP address or session ID is required'
      });
    }

    const blockDuration = duration || 24 * 60 * 60 * 1000; // Default 24 hours
    const blockExpiresAt = new Date(Date.now() + blockDuration);

    const query = {
      $or: []
    };

    if (ipAddress) query.$or.push({ ipAddress });
    if (sessionId) query.$or.push({ sessionId });

    const result = await Tracking.updateMany(
      query,
      {
        isBlocked: true,
        blockExpiresAt
      }
    );

    return res.json({
      success: true,
      message: 'User blocked successfully',
      blockExpiresAt,
      affected: result.modifiedCount
    });
  } catch (error) {
    console.error('Error blocking user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error blocking user'
    });
  }
};

/**
 * Unblock a previously blocked user
 */
const unblockUser = async (req, res) => {
  try {
    const { ipAddress, sessionId } = req.body;
    
    if (!ipAddress && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Either IP address or session ID is required'
      });
    }

    const query = {
      $or: []
    };

    if (ipAddress) query.$or.push({ ipAddress });
    if (sessionId) query.$or.push({ sessionId });

    const result = await Tracking.updateMany(
      query,
      {
        isBlocked: false,
        blockExpiresAt: null
      }
    );

    return res.json({
      success: true,
      message: 'User unblocked successfully',
      affected: result.modifiedCount
    });
  } catch (error) {
    console.error('Error unblocking user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error unblocking user'
    });
  }
};

module.exports = {
  getTrackingInfo,
  blockUser,
  unblockUser
}; 