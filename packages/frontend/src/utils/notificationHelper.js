import { toast } from 'react-toastify';
import { FaBell, FaTrophy, FaUserFriends, FaExclamationTriangle, FaComment, FaThumbsUp } from 'react-icons/fa';
import React from 'react';

// Create a singleton notification sound that can be reused
let notificationSound;

// Keep just this path since we know it's the correct one
const soundPath = '../assets/notification-sound.mp3';

// Initialize the notification sound (call this when your app starts)
export const initNotificationSound = () => {
  try {
    // Create and load the audio only once
    notificationSound = new Audio(soundPath);
    
    // Preload the audio
    notificationSound.load();
    
    console.log('Notification sound initialized');
    
    // Optional: Test sound loaded correctly
    notificationSound.addEventListener('canplaythrough', () => {
      console.log('Notification sound loaded successfully');
    });
    
    notificationSound.addEventListener('error', (e) => {
      console.error('Error loading notification sound:', e);
    });
  } catch (err) {
    console.error('Failed to initialize notification sound:', err);
  }
};

// Play the notification sound with better error handling
export const playNotificationSound = () => {
  if (notificationSound) {
    // Reset the sound to the beginning if it's already playing
    notificationSound.currentTime = 0;
    
    // Play with user interaction context to avoid browser restrictions
    const playPromise = notificationSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.error('Failed to play notification sound:', err);
        
        // Create a new instance as a fallback approach
        try {
          const fallbackSound = new Audio(soundPath);
          fallbackSound.play().catch(innerErr => {
            console.error('Fallback sound also failed:', innerErr);
          });
        } catch (e) {
          console.error('Could not create fallback sound:', e);
        }
      });
    }
  } else {
    console.warn('Notification sound not initialized yet, creating now');
    initNotificationSound();
    
    // Try to play immediately after initialization
    setTimeout(() => {
      if (notificationSound) {
        notificationSound.play().catch(err => {
          console.error('Delayed sound play failed:', err);
        });
      }
    }, 100);
  }
};

// Get notification icon component for toast notifications
export const getNotificationIconComponent = (type) => {
  switch (type) {
    case 'achievement':
      return () => React.createElement(FaTrophy, { className: "text-amber-500" });
    case 'social':
      return () => React.createElement(FaUserFriends, { className: "text-blue-500" });
    case 'system':
      return () => React.createElement(FaBell, { className: "text-purple-500" });
    case 'reminder':
      return () => React.createElement(FaExclamationTriangle, { className: "text-orange-500" });
    case 'comment':
      return () => React.createElement(FaComment, { className: "text-green-500" });
    case 'like':
      return () => React.createElement(FaThumbsUp, { className: "text-blue-500" });
    default:
      return () => React.createElement(FaBell, { className: "text-gray-500" });
  }
};

// Show a notification toast and play sound
export const showNotification = (notification) => {
  // Play sound
  playNotificationSound();
  
  // Show toast
  toast.info(
    React.createElement('div', null, 
      React.createElement('strong', null, notification.title),
      React.createElement('p', { className: "text-sm" }, notification.message)
    ),
    {
      icon: getNotificationIconComponent(notification.type)
    }
  );
};