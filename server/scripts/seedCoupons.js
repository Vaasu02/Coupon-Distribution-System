require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const { generateCoupons } = require('../utils/couponGenerator');

const seedCoupons = async (count = 50) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coupon-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Generate coupons
    const coupons = generateCoupons(count);

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Insert new coupons
    await Coupon.insertMany(coupons);
    console.log(`Successfully seeded ${count} coupons`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

// Execute the seeding if this script is run directly
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 50;
  seedCoupons(count);
}

module.exports = seedCoupons; 