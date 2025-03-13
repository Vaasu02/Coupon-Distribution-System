import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCoupon } from '../../context/CouponContext';
import CouponCard from './CouponCard';
import ClaimStatus from './ClaimStatus';
import './CouponContainer.css';

const CouponContainer = () => {
  const {
    currentCoupon,
    claimStatus,
    loading,
    error,
    getNextCoupon,
    checkClaimStatus
  } = useCoupon();

  useEffect(() => {
    // Check claim status on component mount
    checkClaimStatus();
  }, [checkClaimStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleGetCoupon = async () => {
    const status = await checkClaimStatus();
    if (status?.canClaim) {
      await getNextCoupon();
    } else {
      toast.warning(`Please wait ${Math.ceil(status?.timeRemaining / 60)} minutes before claiming another coupon.`);
    }
  };

  return (
    <div className="coupon-container">
      <div className="coupon-header">
        <h2>Welcome to the Coupon Distribution System</h2>
        <p>Get your exclusive discount coupons here!</p>
      </div>

      <ClaimStatus status={claimStatus} />

      <div className="coupon-content">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : currentCoupon ? (
          <CouponCard coupon={currentCoupon} />
        ) : (
          <div className="get-coupon-section">
            <button
              className="btn btn-primary"
              onClick={handleGetCoupon}
              disabled={loading || (claimStatus && !claimStatus.canClaim)}
            >
              Get Your Coupon
            </button>
          </div>
        )}
      </div>

      <div className="coupon-instructions">
        <h3>How it works:</h3>
        <ul>
          <li>Click the "Get Your Coupon" button to receive a unique discount coupon</li>
          <li>Each user can claim one coupon per hour</li>
          <li>Coupons are distributed in a fair, round-robin manner</li>
          <li>Make sure to claim your coupon before it expires</li>
        </ul>
      </div>
    </div>
  );
};

export default CouponContainer; 