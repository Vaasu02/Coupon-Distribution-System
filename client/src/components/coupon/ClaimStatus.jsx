import React, { useState, useEffect } from 'react';
import './ClaimStatus.css';

const ClaimStatus = ({ status }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (status?.timeRemaining) {
      setTimeLeft(status.timeRemaining);
    }
  }, [status]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!status || (status.canClaim && !status.isBlocked)) {
    return null;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`claim-status ${status.isBlocked ? 'blocked' : 'cooldown'}`}>
      {status.isBlocked ? (
        <div className="status-message">
          <span className="status-icon">🚫</span>
          <p>Your account is temporarily blocked</p>
          {status.blockExpiresAt && (
            <p className="time-remaining">
              Block expires in: {formatTime(timeLeft)}
            </p>
          )}
        </div>
      ) : (
        <div className="status-message">
          <span className="status-icon">⏳</span>
          <p>Please wait before claiming another coupon</p>
          <p className="time-remaining">
            Time remaining: {formatTime(timeLeft)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClaimStatus; 