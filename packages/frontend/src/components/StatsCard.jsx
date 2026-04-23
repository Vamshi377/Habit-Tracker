import React from 'react';

const StatsCard = ({ title, value, description, icon, color, progress }) => {
  // Determine color classes based on the color prop
  const getColorClasses = (colorName) => {
    switch (colorName) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-100 dark:border-blue-900/30',
          progressBg: 'bg-blue-100 dark:bg-blue-900/30',
          progressFill: 'bg-blue-500 dark:bg-blue-400'
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-100 dark:border-green-900/30',
          progressBg: 'bg-green-100 dark:bg-green-900/30',
          progressFill: 'bg-green-500 dark:bg-green-400'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-900/30',
          progressBg: 'bg-amber-100 dark:bg-amber-900/30',
          progressFill: 'bg-amber-500 dark:bg-amber-400'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-100 dark:border-orange-900/30',
          progressBg: 'bg-orange-100 dark:bg-orange-900/30',
          progressFill: 'bg-orange-500 dark:bg-orange-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-100 dark:border-purple-900/30',
          progressBg: 'bg-purple-100 dark:bg-purple-900/30',
          progressFill: 'bg-purple-500 dark:bg-purple-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-100 dark:border-gray-700',
          progressBg: 'bg-gray-200 dark:bg-gray-700',
          progressFill: 'bg-gray-500 dark:bg-gray-400'
        };
    }
  };
  
  const colorClasses = getColorClasses(color);

  return (
    <div className={`rounded-lg shadow p-5 border ${colorClasses.border} ${colorClasses.bg}`}>
      <div className="flex justify-between mb-2">
        <div className={`text-sm font-medium ${colorClasses.text}`}>
          {title}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses.bg}`}>
          {icon}
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      
      {description && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
      
      {progress !== undefined && (
        <div className="mt-3">
          <div className={`w-full ${colorClasses.progressBg} rounded-full h-1.5`}>
            <div
              className={`${colorClasses.progressFill} h-1.5 rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;