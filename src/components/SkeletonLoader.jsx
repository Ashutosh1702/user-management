import React from 'react';

/**
 * SkeletonLoader Component - Displays a skeleton loading state
 * @param {number} count - Number of skeleton rows to display
 */
const SkeletonLoader = ({ count = 5 }) => {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border-b border-gray-200">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
