
import React from 'react';

export const LoadingSpinner: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <div className="relative flex justify-center items-center h-20 w-20">
      <div className="absolute h-full w-full border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
      <div className="absolute">
        {icon}
      </div>
    </div>
  );
};
