import React from 'react';

import { useState, useEffect } from 'react';

const TimeAgo = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const pastDate = new Date(date);
      const timeDiff = now - pastDate;
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (seconds < 60) {
        setTimeAgo('just now');
      } else if (minutes < 60) {
        setTimeAgo(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`);
      } else if (hours < 24) {
        setTimeAgo(`${hours} ${hours === 1 ? 'hour' : 'hours'} ago`);
      } else if (days < 7) {
        setTimeAgo(`${days} ${days === 1 ? 'day' : 'days'} ago`);
      } else {
        // Format date as MM/DD/YYYY or based on locale
        setTimeAgo(pastDate.toLocaleDateString());
      }
    };
    
    calculateTimeAgo();
    
    // Update time every minute for recent posts
    const interval = setInterval(calculateTimeAgo, 60000);
    
    return () => clearInterval(interval);
  }, [date]);
  
  return <>{timeAgo}</>;
};

export default TimeAgo;