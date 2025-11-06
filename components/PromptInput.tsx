
import React, { useState, useRef } from 'react';
import { IMAGE_STYLES, IMAGE_MOODS, ASPECT_RATIOS, IMAGE_QUALITIES } from '../constants';
import type { AspectRatio } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CloseIcon } from './icons/CloseIcon';
import { RandomIcon } from './icons/RandomIcon';

interface PromptInputProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio, quality: string, numImages: number, seed: string, image?: { data: string; mimeType: string }) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>(IMAGE_STYLES[0]);
  const [mood, setMood] = useState<string>(IMAGE_MOODS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0].value);
  const [quality, setQuality] = useState<string>(IMAGE_QUALITIES[0]);
  const [numImages, setNumImages] = useState<number>(1);
  const [seed, setSeed] = useState<string>('');
  const [image, setImage] = useState<{ file: File, dataUrl: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, dataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const randomizeSeed = () => {
    setSeed(String(Math.floor(Math.random() * 1000000)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      const enhancedPrompt = `${prompt.trim()}, ${style} style, ${mood} mood`;
      const imageData = image ? { data: image.dataUrl, mimeType: image.file.type } : undefined;
      onGenerate(enhancedPrompt, aspectRatio, quality, numImages, seed, imageData);
    }
  };

  const SelectControl: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: readonly string[] | readonly { label: string; value: string }[];
  }> = ({ label, value, onChange, options }) => (
    <div className="flex-1 min-w-[120px]">
      <label htmlFor={label} className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="w-full bg-base-200 border border-base-300 rounded-md shadow-sm p-2 text-sm text-content focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
        disabled={isGenerating}
      >
        {options.map((opt, index) =>
          typeof opt === 'string' ? (
            <option key={index} value={opt}>{opt}</option>
          ) : (
            <option key={index} value={opt.value}>{opt.label}</option>
          )
        )}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SelectControl label="Style" value={style} onChange={(e) => setStyle(e.target.value)} options={IMAGE_STYLES} />
        <SelectControl label="Mood" value={mood} onChange={(e) => setMood(e.target.value)} options={IMAGE_MOODS} />
        <SelectControl
          label="Aspect Ratio"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          options={ASPECT_RATIOS}
        />
        <SelectControl label="Quality" value={quality} onChange={(e) => setQuality(e.target.value)} options={IMAGE_QUALITIES} />
      </div>

      <div className="flex flex-wrap gap-2">
         <div className="flex-1 min-w-[120px]">
            <label htmlFor="num-images" className="block text-xs font-medium text-gray-400 mb-1">
                Images
            </label>
            <input
                type="number"
                id="num-images"
                value={numImages}
                onChange={(e) => setNumImages(Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1)))}
                min="1"
                max="4"
                className="w-full bg-base-200 border border-base-300 rounded-md shadow-sm p-2 text-sm text-content focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                disabled={isGenerating}
            />
        </div>
        <div className="flex-1 min-w-[150px]">
            <label htmlFor="seed" className="block text-xs font-medium text-gray-400 mb-1">
                Seed (Optional)
            </label>
            <div className="flex items-center gap-1">
                <input
                    type="text"
                    id="seed"
                    pattern="\d*"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g., 12345"
                    className="w-full bg-base-200 border border-base-300 rounded-md shadow-sm p-2 text-sm text-content focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                    disabled={isGenerating}
                />
                <button
                    type="button"
                    onClick={randomizeSeed}
                    disabled={isGenerating}
                    className="p-2 bg-base-200 text-content border border-base-300 rounded-lg hover:bg-base-300 disabled:opacity-50"
                    aria-label="Randomize seed"
                >
                    <RandomIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      {image && (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-base-300">
          <img src={image.dataUrl} alt="Upload preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 rounded-full p-1 text-white transition-colors"
            aria-label="Remove image"
            disabled={isGenerating}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-start sm:items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={isGenerating}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isGenerating}
          className="p-3 bg-base-200 text-content border border-base-300 font-semibold rounded-lg shadow-sm hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary disabled:bg-base-300 disabled:cursor-not-allowed transition-colors self-stretch"
          aria-label="Upload an image"
        >
          <UploadIcon className="w-5 h-5" />
        </button>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image prompt here..."
          className="w-full p-3 bg-base-200 border border-base-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition resize-none"
          rows={2}
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-secondary disabled:bg-base-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out self-stretch flex items-center gap-2"
        >
          <SparklesIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Generate</span>
        </button>
      </div>
    </form>
  );
};
