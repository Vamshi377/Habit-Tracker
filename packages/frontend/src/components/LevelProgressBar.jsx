import React from 'react';

const LevelProgressBar = ({ level, experience, requiredExperience }) => {
  const percentage = Math.min(Math.floor((experience / requiredExperience) * 100), 100);
  
  return (
    <div className="flex items-center">
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mr-2">
        Lvl {level}
      </span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-2">
        {experience}/{requiredExperience} XP
      </span>
    </div>
  );
};

export default LevelProgressBar;