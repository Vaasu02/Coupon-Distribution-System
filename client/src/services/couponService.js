import api from './api';

const couponService = {
  // Get next available coupon
  getNextCoupon: async () => {
    return api.get('/coupons/next');
  },

  // Claim a coupon
  claimCoupon: async (code) => {
    return api.post('/coupons/claim', { code });
  },

  // Check claim status
  checkClaimStatus: async () => {
    return api.get('/coupons/status');
  },

  // Get tracking information
  getTrackingInfo: async () => {
    return api.get('/tracking/info');
  }
};

export default couponService; 