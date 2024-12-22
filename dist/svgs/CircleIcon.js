import React from 'react';

const CircleIcon = ({ className = '', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"  // Adjusted size for better visibility
      height="24" // Adjusted size for better visibility
      viewBox="0 0 24 24"
      fill="currentColor" // Change from 'none' to 'currentColor' for fill handling
      className={`lucide lucide-dot ${className}`}
      {...props}
    >
      {/* Adjusted circle attributes for a better visual and interaction */}
      <circle cx="12" cy="12" r="5" fill="currentColor" className="text-gray-400 hover:text-white transition-colors duration-200"/>
    </svg>
  );
};

export default CircleIcon;
