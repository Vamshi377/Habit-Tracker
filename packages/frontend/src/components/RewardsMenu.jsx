// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getRewards } from '../features/rewards/rewardSlice';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// const RewardsMenu = () => {
//   const dispatch = useDispatch();
//   // Add a fallback object with empty arrays to prevent destructuring errors
//   const { rewards = [], isLoading = false } = useSelector(state => state.rewards || {});
//   const [isOpen, setIsOpen] = useState(false);
  
//   useEffect(() => {
//     dispatch(getRewards());
//   }, [dispatch]);
  
//   // Group rewards by type - with safety check
//   const groupedRewards = rewards && rewards.length ? rewards.reduce((groups, reward) => {
//     if (!groups[reward.type]) {
//       groups[reward.type] = [];
//     }
//     groups[reward.type].push(reward);
//     return groups;
//   }, {}) : {};
  
//   const toggleMenu = () => setIsOpen(!isOpen);
  
//   if (isLoading) {
//     return (
//       <div className="py-2 px-4">
//         <div className="flex items-center justify-between">
//           <span className="text-gray-500 dark:text-gray-400 text-sm">Rewards</span>
//           <div className="w-4 h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
//         </div>
//       </div>
//     );
//   }
  
//   if (!rewards || rewards.length === 0) {
//     return (
//       <div className="py-2 px-4">
//         <div className="flex items-center justify-between">
//           <span className="text-gray-500 dark:text-gray-400 text-sm">Rewards</span>
//           <span className="text-xs text-gray-400 dark:text-gray-500">0</span>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
//       <button 
//         className="flex items-center justify-between w-full py-2 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
//         onClick={toggleMenu}
//       >
//         <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
//           <span className="mr-2">🏆</span> My Rewards
//         </span>
//         <div className="flex items-center">
//           <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
//             {rewards.length}
//           </span>
//           {isOpen ? (
//             <FaChevronUp className="ml-2 text-gray-400 dark:text-gray-500" size={12} />
//           ) : (
//             <FaChevronDown className="ml-2 text-gray-400 dark:text-gray-500" size={12} />
//           )}
//         </div>
//       </button>
      
//       {isOpen && Object.keys(groupedRewards).length > 0 && (
//         <div className="mt-1 space-y-1 pl-4 pr-2">
//           {Object.entries(groupedRewards).map(([type, typeRewards]) => (
//             <div key={type} className="mb-3">
//               <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 pl-2">
//                 {type.charAt(0).toUpperCase() + type.slice(1)}s
//               </div>
              
//               <div className="space-y-1">
//                 {typeRewards.map((reward, index) => (
//                   <div 
//                     key={index}
//                     className="flex items-center py-1 px-2 text-sm text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <span className="mr-2 text-lg">{reward.icon}</span>
//                     <div>
//                       <div className="text-xs font-medium">{reward.title}</div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         {new Date(reward.createdAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RewardsMenu;





import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRewards } from '../features/rewards/rewardSlice';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const RewardsMenu = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  // Add a fallback object with empty arrays to prevent destructuring errors
  const { rewards = [], isLoading = false } = useSelector(state => state.rewards || {});
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    dispatch(getRewards());
  }, [dispatch]);
  
  // Group rewards by type - with safety check
  const groupedRewards = rewards && rewards.length ? rewards.reduce((groups, reward) => {
    if (!groups[reward.type]) {
      groups[reward.type] = [];
    }
    groups[reward.type].push(reward);
    return groups;
  }, {}) : {};
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // For collapsed sidebar - show compact version
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-lg">🏆</span>
        {rewards.length > 0 && (
          <span className="mt-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {rewards.length}
          </span>
        )}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="py-2 px-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Rewards</span>
          <div className="w-4 h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!rewards || rewards.length === 0) {
    return (
      <div className="py-2 px-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Rewards</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">0</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
      <button 
        className="flex items-center justify-between w-full py-2 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
        onClick={toggleMenu}
      >
        <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <span className="mr-2">🏆</span> My Rewards
        </span>
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {rewards.length}
          </span>
          {isOpen ? (
            <FaChevronUp className="ml-2 text-gray-400 dark:text-gray-500" size={12} />
          ) : (
            <FaChevronDown className="ml-2 text-gray-400 dark:text-gray-500" size={12} />
          )}
        </div>
      </button>
      
      {isOpen && Object.keys(groupedRewards).length > 0 && (
        <div className="mt-1 space-y-1 pl-4 pr-2">
          {Object.entries(groupedRewards).map(([type, typeRewards]) => (
            <div key={type} className="mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 pl-2">
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </div>
              
              <div className="space-y-1">
                {typeRewards.map((reward, index) => (
                  <div 
                    key={index}
                    className="flex items-center py-1 px-2 text-sm text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2 text-lg">{reward.icon}</span>
                    <div>
                      <div className="text-xs font-medium">{reward.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(reward.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsMenu;