const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configurations
const connectDatabase = require('./config/database');
const constants = require('./config/constants');

// Initialize Express app
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: constants.CORS_ORIGINS,
  credentials: true
}));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW,
  max: constants.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Connect to MongoDB
connectDatabase();

// Import routes
const couponRoutes = require('./routes/couponRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

// Use routes
app.use('/api/coupons', couponRoutes);
app.use('/api/tracking', trackingRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Coupon Distribution API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
