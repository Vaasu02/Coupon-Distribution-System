import React, { createContext, useContext, useState, useCallback } from 'react';
import couponService from '../services/couponService';

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [claimStatus, setClaimStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get next available coupon
  const getNextCoupon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await couponService.getNextCoupon();
      setCurrentCoupon(response.coupon);
      return response.coupon;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Claim a coupon
  const claimCoupon = useCallback(async (code) => {
    try {
      setLoading(true);
      setError(null);
      const response = await couponService.claimCoupon(code);
      setCurrentCoupon(null);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check claim status
  const checkClaimStatus = useCallback(async () => {
    try {
      const response = await couponService.checkClaimStatus();
      setClaimStatus(response);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Clear current coupon
  const clearCoupon = useCallback(() => {
    setCurrentCoupon(null);
    setError(null);
  }, []);

  const value = {
    currentCoupon,
    claimStatus,
    loading,
    error,
    getNextCoupon,
    claimCoupon,
    checkClaimStatus,
    clearCoupon
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
};

// Custom hook to use the coupon context
export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};

export default CouponContext; 