import React from 'react';

import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">HabitQuest</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Build habits, earn rewards, transform your life
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Terms of Service
            </Link>
            <Link to="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Support
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <a href="https://github.com/yourname/habitquest" target="_blank" rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/habitquest" target="_blank" rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {currentYear} HabitQuest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;