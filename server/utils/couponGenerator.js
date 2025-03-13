const crypto = require('crypto');
const { COUPON_PREFIX, COUPON_LENGTH } = require('../config/constants');

/**
 * Generate a random string of specified length
 */
const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .toUpperCase()
    .slice(0, length);
};

/**
 * Generate a unique coupon code
 */
const generateCouponCode = () => {
  const randomPart = generateRandomString(COUPON_LENGTH - COUPON_PREFIX.length);
  return `${COUPON_PREFIX}${randomPart}`;
};

/**
 * Generate multiple coupon objects
 */
const generateCoupons = (count, valueRange = { min: 10, max: 50 }) => {
  const coupons = [];
  for (let i = 0; i < count; i++) {
    coupons.push({
      code: generateCouponCode(),
      description: `Discount Coupon ${i + 1}`,
      value: Math.floor(Math.random() * (valueRange.max - valueRange.min + 1)) + valueRange.min,
      isActive: true,
      isClaimed: false
    });
  }
  return coupons;
};

module.exports = {
  generateCouponCode,
  generateCoupons
}; 