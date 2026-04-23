import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaUserCircle, FaBell, FaTrophy, FaSignOutAlt, FaCog, FaSun, FaMoon, FaDesktop, FaRobot } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import HabitRoulette from './HabitRoulette';
import DeadlineCalendar from './DeadlineCalendar';
import HabitStats from './HabitStats';
import DailyQuote from './DailyQuote';
import PomodoroTimer from './PomodoroTimer';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications || { notifications: [] });
  
  const { theme, changeTheme, isDarkMode } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const unreadNotifications = notifications?.filter(notification => !notification.isRead).length || 0;
  
  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setShowThemeMenu(false);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none lg:hidden"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">HabitQuest</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme Dropdown - Always visible */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)} 
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Theme settings"
              >
                {isDarkMode ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
              </button>
              
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      theme === 'light' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FaSun className="mr-2" /> Light Mode
                    {theme === 'light' && <span className="ml-auto">✓</span>}
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      theme === 'dark' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FaMoon className="mr-2" /> Dark Mode
                    {theme === 'dark' && <span className="ml-auto">✓</span>}
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                      theme === 'system' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FaDesktop className="mr-2" /> System Default
                    {theme === 'system' && <span className="ml-auto">✓</span>}
                  </button>
                </div>
              )}
            </div>
            
            {user && (
              <>
                {/* AI Chat - New button */}
                <Link 
                  to="/ai-chat" 
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none flex items-center"
                  aria-label="AI Chat"
                >
                  <FaRobot className="w-5 h-5 mr-1" />
                  <span className="hidden md:inline text-sm">AI Chat</span>
                </Link>
                
                {/* Achievements */}
                <Link 
                  to="/achievements" 
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="Achievements"
                >
                  <FaTrophy className="w-5 h-5" />
                </Link>
                
                {/* Notifications */}
                <Link 
                  to="/notifications" 
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative"
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>
                
                {/* Deadline Calendar */}
                <DeadlineCalendar />
                
                {/* HabitRoulette */}
                <HabitRoulette />

                {/* Habit Stats */}
                <HabitStats />
                
                {/* Daily Quote */}
                <DailyQuote />
                
                {/* Pomodoro Timer */}
                <PomodoroTimer />
                
                {/* User Profile Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-expanded={showProfileMenu}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                      ) : (
                        <FaUserCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user.username}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Level {user.level || 1}
                      </div>
                    </div>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FaUserCircle className="mr-2" />
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <FaCog className="mr-2" />
                        Settings
                      </Link>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }} 
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;