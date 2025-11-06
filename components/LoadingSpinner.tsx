
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border-4 border-base-100 border-t-brand-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-400">Generating your masterpiece...</p>
    </div>
  );
};
