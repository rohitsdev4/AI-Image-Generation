
import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { DownloadIcon } from './icons/DownloadIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  generateImage: (
    prompt: string,
    aspectRatio: AspectRatio,
    image?: { data: string; mimeType: string },
    seed?: number
  ) => Promise<string>;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onClose, generateImage: generateImageService }) => {
  const [currentImage, setCurrentImage] = useState<string>(imageUrl);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
        const ratio = img.width / img.height;
        if (Math.abs(ratio - 16/9) < 0.1) setAspectRatio("16:9");
        else if (Math.abs(ratio - 9/16) < 0.1) setAspectRatio("9:16");
        else if (Math.abs(ratio - 4/3) < 0.1) setAspectRatio("4:3");
        else if (Math.abs(ratio - 3/4) < 0.1) setAspectRatio("3:4");
        else setAspectRatio("1:1");
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleGenerateEdit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);

    // Convert data URL to blob to get mime type
    const response = await fetch(currentImage);
    const blob = await response.blob();
    
    const image = {
      data: currentImage,
      mimeType: blob.type || 'image/jpeg',
    };
    
    try {
      const newImageUrl = await generateImageService(prompt, aspectRatio, image);
      setCurrentImage(newImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `edited-ai-image.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-base-200 rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col p-4 md:p-6 border border-base-300">
        <header className="flex items-center justify-between pb-4 border-b border-base-300">
          <h2 className="text-xl font-bold text-content">Image Editor</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="p-2 hover:bg-base-300 rounded-full" aria-label="Download">
                <DownloadIcon className="w-6 h-6"/>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-base-300 rounded-full" aria-label="Close">
                <CloseIcon className="w-6 h-6"/>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row gap-4 mt-4 overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-base-100 rounded-lg overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <LoadingSpinner/>
              </div>
            )}
            <img src={currentImage} alt="Editing preview" className="max-w-full max-h-full object-contain" />
          </div>

          <aside className="w-full md:w-72 flex flex-col gap-4">
            <h3 className="font-semibold">Edit with Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., add sunglasses, change background to a beach..."
              className="w-full p-3 bg-base-100 border border-base-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition resize-none flex-1"
              rows={5}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={handleGenerateEdit}
              disabled={isLoading || !prompt.trim()}
              className="w-full px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5"/>
              Generate Edit
            </button>
          </aside>
        </main>
      </div>
    </div>
  );
};
