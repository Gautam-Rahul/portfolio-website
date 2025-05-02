import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="btn btn-primary px-6 py-3 rounded-full flex items-center justify-center gap-2"
          >
            <FaHome /> Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline px-6 py-3 rounded-full flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 