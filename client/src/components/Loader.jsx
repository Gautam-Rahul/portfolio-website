import React from 'react';

const Loader = ({ size = 'medium' }) => {
  let sizeClass = '';
  
  switch(size) {
    case 'small':
      sizeClass = 'w-6 h-6 border-2';
      break;
    case 'large':
      sizeClass = 'w-16 h-16 border-4';
      break;
    case 'medium':
    default:
      sizeClass = 'w-10 h-10 border-3';
  }
  
  return (
    <div className="flex justify-center items-center py-10">
      <div className={`${sizeClass} rounded-full border-blue-500 border-t-transparent animate-spin`}></div>
    </div>
  );
};

export default Loader; 