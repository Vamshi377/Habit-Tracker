import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import NotificationToast from './NotificationToast';

const NotificationPopupManager = () => {
  // Safely access notifications with a default empty array
  const { notifications = [] } = useSelector((state) => state.notifications || { notifications: [] });
  const [toasts, setToasts] = useState([]);
  const prevNotificationsRef = useRef(null);
  
  // Create a notification sound
  const notificationSound = useRef(new Audio('/notification-sound.mp3'));

  // Check for new notifications
  useEffect(() => {
    if (!notifications || !notifications.length) {
      // Save current notifications for future comparison
      prevNotificationsRef.current = notifications || [];
      return;
    }

    // If first load, just set the ref without showing toasts
    if (!prevNotificationsRef.current) {
      prevNotificationsRef.current = notifications;
      return;
    }

    // Find new notifications by comparing with previous state
    const newNotifications = notifications.filter(notification => {
      // Consider a notification new if it wasn't in our previous state
      return !prevNotificationsRef.current.some(prevNotification => 
        prevNotification._id === notification._id
      );
    });
    
    // If we have new notifications, show them as toasts
    if (newNotifications.length > 0) {
      // Only show toasts for newer notifications (within last 10 seconds)
      const recentNotifications = newNotifications.filter(notification => {
        const notificationTime = new Date(notification.createdAt).getTime();
        const currentTime = new Date().getTime();
        return (currentTime - notificationTime) < 10000; // 10 seconds
      });
      
      if (recentNotifications.length > 0) {
        // Add toast notifications
        setToasts(prev => [
          ...prev,
          ...recentNotifications.map(notification => ({
            id: notification._id,
            notification
          }))
        ]);
        
        // Play notification sound
        try {
          notificationSound.current.play().catch(e => 
            console.log('Could not play notification sound:', e)
          );
        } catch (error) {
          console.log('Error playing notification sound:', error);
        }
      }
    }
    
    // Update the previous notifications reference
    prevNotificationsRef.current = notifications;
  }, [notifications]);
  
  // Function to remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // If no toasts, don't render anything
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map(({ id, notification }, index) => (
        <NotificationToast
          key={id}
          notification={notification}
          onClose={() => removeToast(id)}
          style={{
            transform: `translateY(${index * -10}px)`,
            zIndex: 100 - index
          }}
        />
      ))}
    </div>
  );
};

export default NotificationPopupManager;