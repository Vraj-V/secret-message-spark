
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiryTimestamp: number;
  onExpire?: () => void;
  className?: string;
}

export const CountdownTimer = ({ 
  expiryTimestamp, 
  onExpire,
  className 
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = expiryTimestamp - Date.now();
      
      if (difference <= 0) {
        setIsExpired(true);
        onExpire && onExpire();
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [expiryTimestamp, onExpire]);

  // Format time with leading zeros
  const formatTime = (value: number) => value.toString().padStart(2, '0');

  if (isExpired) {
    return <div className={className}>Expired</div>;
  }

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-1 text-sm font-medium">
        <span className="text-muted-foreground">Expires in:</span>
        <div className="text-primary">
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
