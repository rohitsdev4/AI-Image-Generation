
import React from 'react';
import type { ChatMessage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { DownloadIcon } from './icons/DownloadIcon';
import { EditIcon } from './icons/EditIcon';

interface ImageCardProps {
  message: ChatMessage;
  onEdit: (id: string, url: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ message, onEdit }) => {
  const { prompt, imageUrl, isLoading, error, inputImageUrl } = message;

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-image-${message.id.slice(0, 8)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-base-200 rounded-xl shadow-lg p-4 md:p-6 border border-base-300 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-brand-primary rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white">
          U
        </div>
        <div className="flex-1">
          <p className="font-semibold text-content">{prompt}</p>
          {inputImageUrl && (
            <div className="mt-2">
              <img src={inputImageUrl} alt="Input for prompt" className="w-24 h-24 rounded-lg object-cover border border-base-300" />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pl-14">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex-shrink-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1 mt-1 min-w-0">
            {isLoading && (
              <div className="aspect-square bg-base-300 rounded-lg flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
            {error && (
              <div className="aspect-square bg-red-900/20 border border-red-500 text-red-300 rounded-lg p-4 flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold">Generation Failed</p>
                <p className="text-xs text-center mt-1">{error}</p>
              </div>
            )}
            {imageUrl && (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-auto rounded-lg shadow-md object-contain"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                   <button
                    onClick={() => onEdit(message.id, imageUrl)}
                    className="bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Edit image"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Download image"
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
