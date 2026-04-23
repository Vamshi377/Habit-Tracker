// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux'; // Add useDispatch
// import { 
//   FaHome, 
//   FaPlus, 
//   FaUser, 
//   FaTrophy, 
//   FaUsers, 
//   FaBell, 
//   FaCog,
//   FaTimes,
//   FaChartLine,
//   FaChevronLeft,
//   FaChevronRight
// } from 'react-icons/fa';
// import RewardsMenu from './RewardsMenu';

// const Sidebar = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch(); // Add this line
//   const { user } = useSelector((state) => state.auth);
//   const [isCollapsed, setIsCollapsed] = useState(false);
  
//   // Calculate progress to next level
//   const currentXP = user?.experience || 0;
//   const requiredXP = (user?.level || 1) * 100;
//   const progressPercentage = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  
//   // Add this useEffect to force re-render when the component mounts
//   useEffect(() => {
//     // This will force the sidebar to re-evaluate the user state
//     const refreshTimer = setInterval(() => {
//       // This is a harmless state update that will cause React to check for changes
//       setIsCollapsed(prev => prev);
//     }, 1000); // Check every second
    
//     return () => clearInterval(refreshTimer);
//   }, []);
  
//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };
  
//   return (
//     <>
//       {/* Mobile backdrop */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
//           onClick={onClose}
//         ></div>
//       )}
    
//       {/* Sidebar */}
//       <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-30 transition-all duration-300 transform 
//         ${isCollapsed ? 'w-16' : 'w-64'} 
//         ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//       >
//         {/* Close button at the top */}
//         <div className="absolute top-2 right-2 lg:hidden">
//           <button 
//             onClick={onClose} 
//             className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
//             aria-label="Close sidebar"
//           >
//             <FaTimes size={20} />
//           </button>
//         </div>
        
//         {/* Collapse toggle button */}
//         <div className="absolute top-2 right-2 hidden lg:block">
//           <button 
//             onClick={toggleCollapse} 
//             className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
//             aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
//           </button>
//         </div>
        
//         {/* Sidebar header with logo */}
//         <div className="flex justify-center items-center p-4 border-b border-gray-200 dark:border-gray-700">
//           {isCollapsed ? (
//             <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">HQ</h2>
//           ) : (
//             <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">HabitQuest</h2>
//           )}
//         </div>
        
//         {/* User info */}
//         <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
//           {isCollapsed ? (
//             <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
//               {user?.avatar ? (
//                 <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
//               ) : (
//                 <span className="text-lg font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                   {user?.avatar ? (
//                     <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
//                   ) : (
//                     <span className="text-xl font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-800 dark:text-white">{user?.username || 'User'}</h3>
//                   <div className="text-sm text-gray-500 dark:text-gray-400">Level {user?.level || 1}</div>
//                 </div>
//               </div>
              
//               {/* XP Progress bar */}
//               <div className="mt-3">
//                 <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
//                   <span>XP: {currentXP}/{requiredXP}</span>
//                   <span>{progressPercentage}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded">
//                   <div 
//                     className="bg-blue-500 h-2 rounded" 
//                     style={{ width: `${progressPercentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
        
//         {/* Navigation */}
//         <nav className="px-2 py-4">
//           <ul className="space-y-1">
//             <li>
//               <NavLink
//                 to="/dashboard"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-2.5 text-sm font-medium rounded-md
//                   ${isActive 
//                     ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
//                     : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
//                   ${isCollapsed ? 'justify-center' : ''}
//                 `}
//                 title="Dashboard"
//               >
//                 <FaHome className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
//                 {!isCollapsed && "Dashboard"}
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/community"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-2.5 text-sm font-medium rounded-md
//                   ${isActive 
//                     ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
//                     : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
//                   ${isCollapsed ? 'justify-center' : ''}
//                 `}
//                 title="Community"
//               >
//                 <FaUsers className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
//                 {!isCollapsed && "Community"}
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/profile"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-2.5 text-sm font-medium rounded-md
//                   ${isActive 
//                     ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
//                     : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
//                   ${isCollapsed ? 'justify-center' : ''}
//                 `}
//                 title="Profile"
//               >
//                 <FaUser className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
//                 {!isCollapsed && "Profile"}
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/settings"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-2.5 text-sm font-medium rounded-md
//                   ${isActive 
//                     ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
//                     : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
//                   ${isCollapsed ? 'justify-center' : ''}
//                 `}
//                 title="Settings"
//               >
//                 <FaCog className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
//                 {!isCollapsed && "Settings"}
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
        
//         <div className="py-4 flex-1">
  
//           <RewardsMenu />
//         </div>
        
//         {/* Footer */}
//         <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
//           {!isCollapsed && (
//             <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
//               Gamified Habit Tracker v1.0
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;



import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Add useDispatch
import { 
  FaHome, 
  FaPlus, 
  FaUser, 
  FaTrophy, 
  FaUsers, 
  FaBell, 
  FaCog,
  FaTimes,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import RewardsMenu from './RewardsMenu';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch(); // Add this line
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate progress to next level
  const currentXP = user?.experience || 0;
  const requiredXP = (user?.level || 1) * 100;
  const progressPercentage = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  
  // Add this useEffect to force re-render when the component mounts
  useEffect(() => {
    // This will force the sidebar to re-evaluate the user state
    const refreshTimer = setInterval(() => {
      // This is a harmless state update that will cause React to check for changes
      setIsCollapsed(prev => prev);
    }, 1000); // Check every second
    
    return () => clearInterval(refreshTimer);
  }, []);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-30 transition-all duration-300 transform 
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Close button at the top */}
        <div className="absolute top-2 right-2 lg:hidden">
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Collapse toggle button */}
        <div className="absolute top-2 right-2 hidden lg:block">
          <button 
            onClick={toggleCollapse} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Sidebar header with logo */}
        <div className="flex justify-center items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {isCollapsed ? (
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">HQ</h2>
          ) : (
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">HabitQuest</h2>
          )}
        </div>
        
        {/* User info */}
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-lg font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
                  ) : (
                    <span className="text-xl font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{user?.username || 'User'}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Level {user?.level || 1}</div>
                </div>
              </div>
              
              {/* XP Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <span>XP: {currentXP}/{requiredXP}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded">
                  <div 
                    className="bg-blue-500 h-2 rounded" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title="Dashboard"
              >
                <FaHome className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && "Dashboard"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title="Community"
              >
                <FaUsers className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && "Community"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title="Profile"
              >
                <FaUser className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && "Profile"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title="Settings"
              >
                <FaCog className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && "Settings"}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="py-4 flex-1">
          {/* Pass isCollapsed state to RewardsMenu */}
          <RewardsMenu isCollapsed={isCollapsed} />
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Gamified Habit Tracker v1.0
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;