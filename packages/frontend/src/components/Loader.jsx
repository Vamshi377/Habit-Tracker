import React from 'react';

const Loader = ({ size = "default", color = "blue" }) => {
  // Size variants
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-12 w-12 border-4",
    large: "h-16 w-16 border-4"
  };

  // Color variants
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
    gray: "border-gray-500"
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div 
        className={`
          ${sizeClasses[size] || sizeClasses.default}
          ${colorClasses[color] || colorClasses.blue}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Loader;