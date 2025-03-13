import React from 'react';
import { toast } from 'react-toastify';
import { useCoupon } from '../../context/CouponContext';
import './CouponCard.css';

const CouponCard = ({ coupon }) => {
  const { claimCoupon, loading } = useCoupon();

  const handleClaim = async () => {
    try {
      const result = await claimCoupon(coupon.code);
      if (result) {
        toast.success('Coupon claimed successfully!');
      }
    } catch (error) {
      toast.error('Failed to claim coupon. Please try again.');
    }
  };

  return (
    <div className="coupon-card">
      <div className="coupon-card-header">
        <h3>Your Discount Coupon</h3>
        <span className="coupon-value">${coupon.value} OFF</span>
      </div>
      
      <div className="coupon-card-body">
        <div className="coupon-code">
          <label>Coupon Code:</label>
          <span>{coupon.code}</span>
        </div>
        
        <div className="coupon-description">
          <p>{coupon.description}</p>
        </div>
      </div>
      
      <div className="coupon-card-footer">
        <button
          className="btn btn-primary"
          onClick={handleClaim}
          disabled={loading}
        >
          {loading ? 'Claiming...' : 'Claim Now'}
        </button>
      </div>
    </div>
  );
};

export default CouponCard; 