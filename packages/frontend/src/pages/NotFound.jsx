import React from 'react';

import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaHome className="mr-2" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;