import React from 'react';
import { 
  FaTrophy, 
  FaFire, 
  FaCheckDouble, 
  FaMedal, 
  FaUsers,
  FaLock, 
  FaCheck 
} from 'react-icons/fa';

const AchievementCard = ({ achievement, unlocked }) => {
  // Helper to select icon based on achievement type
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'streak':
        return <FaFire className="text-orange-500" size={24} />;
      case 'completion':
        return <FaCheckDouble className="text-blue-500" size={24} />;
      case 'level':
        return <FaMedal className="text-yellow-500" size={24} />;
      case 'community':
        return <FaUsers className="text-purple-500" size={24} />;
      default:
        return <FaTrophy className="text-amber-500" size={24} />;
    }
  };

  // Helper to get badge color based on achievement rarity
  const getBadgeColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'uncommon':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'legendary':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 
      ${unlocked 
        ? 'border-green-500 dark:border-green-400' 
        : 'border-gray-300 dark:border-gray-600'}`}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-medium ${unlocked 
          ? 'text-gray-800 dark:text-white' 
          : 'text-gray-500 dark:text-gray-400'}`}
        >
          {achievement.title}
        </h3>
        <div className={`flex items-center justify-center rounded-full w-8 h-8 
          ${unlocked 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
        >
          {unlocked ? <FaCheck /> : <FaLock />}
        </div>
      </div>
      
      <p className={`mt-2 text-sm ${unlocked 
        ? 'text-gray-600 dark:text-gray-300' 
        : 'text-gray-500 dark:text-gray-400'}`}
      >
        {achievement.description}
      </p>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          +{achievement.xpReward} XP
        </span>
        {unlocked && (
          <span className="ml-2">• Unlocked</span>
        )}
        {!unlocked && achievement.requirement && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: '0%' }}
              ></div>
            </div>
            <div className="text-right mt-0.5">
              0/{achievement.requirement}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;