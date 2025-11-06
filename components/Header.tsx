
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200 p-4 shadow-md border-b border-base-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
          AI Image Generation Studio
        </h1>
        {/* FIX: Updated the branding to correctly reflect the model being used. */}
        <p className="text-sm text-gray-400 mt-1">Powered by Google Gemini</p>
      </div>
    </header>
  );
};
