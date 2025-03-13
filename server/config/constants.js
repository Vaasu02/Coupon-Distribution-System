module.exports = {
  // Coupon settings
  COUPON_PREFIX: 'COUP',
  COUPON_LENGTH: 8,
  
  // Time settings (in milliseconds)
  DEFAULT_COOLDOWN: 3600000, // 1 hour
  DEFAULT_BLOCK_DURATION: 86400000, // 24 hours
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Cookie settings
  COOKIE_MAX_AGE: 86400000, // 24 hours
  
  // Security
  CORS_ORIGINS: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // HTTP Status codes
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  }
}; 