import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBell, 
  FaTrophy, 
  FaUserFriends,
  FaExclamationTriangle,
  FaComment,
  FaThumbsUp,
  FaTimes
} from 'react-icons/fa';

const NotificationToast = ({ notification, onClose, autoClose = 5000 }) => {
  const navigate = useNavigate();
  
  // Close notification after autoClose milliseconds
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);
  
  // Handle notification click
  const handleClick = () => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    onClose();
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <FaTrophy className="text-amber-500" />;
      case 'social':
        return <FaUserFriends className="text-blue-500" />;
      case 'system':
        return <FaBell className="text-purple-500" />;
      case 'reminder':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'comment':
        return <FaComment className="text-green-500" />;
      case 'like':
        return <FaThumbsUp className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  return (
    <div 
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-blue-500 animate-slide-in z-50 cursor-pointer"
      onClick={handleClick}
      style={{animation: 'slideIn 0.3s ease-out'}}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="ml-3 flex-1 pr-8">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {notification.message}
          </p>
          {notification.actionUrl && (
            <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
              {notification.actionText || 'View details'}
            </button>
          )}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;