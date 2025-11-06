
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory } from './components/ChatHistory';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ImageEditor } from './components/ImageEditor';
import { generateImage } from './services/geminiService';
import type { ChatMessage, AspectRatio } from './types';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  const handleOpenEditor = (url: string) => setEditingImage(url);
  const handleCloseEditor = () => setEditingImage(null);

  const handleGenerateImage = useCallback(async (
    prompt: string,
    aspectRatio: AspectRatio,
    quality: string,
    numImages: number,
    seed: string,
    image?: { data: string; mimeType: string }
  ) => {
    setIsGenerating(true);
    const basePrompt = `${prompt.trim()}, ${quality} quality`;
    const seedValue = seed ? parseInt(seed, 10) : undefined;

    const newMessages: ChatMessage[] = Array.from({ length: numImages }).map(() => ({
      id: uuidv4(),
      prompt: basePrompt,
      inputImageUrl: image?.data,
      imageUrl: null,
      isLoading: true,
      error: null,
    }));
    setChatHistory(prev => [...prev, ...newMessages]);

    const imagePromises = newMessages.map((msg, index) =>
      generateImage(
        basePrompt,
        aspectRatio,
        image,
        seedValue ? seedValue + index : undefined
      )
      .then(imageUrl => ({ id: msg.id, imageUrl }))
      .catch(error => ({ id: msg.id, error }))
    );

    const results = await Promise.allSettled(imagePromises);
    
    const updates = new Map<string, Partial<ChatMessage>>();
    results.forEach(result => {
        // FIX: Use type guarding to safely access properties on the union type.
        if (result.status === 'fulfilled') {
            const value = result.value;
            if ('imageUrl' in value) {
                updates.set(value.id, { imageUrl: value.imageUrl, isLoading: false, error: null });
            } else {
                const errorMessage = value.error instanceof Error ? value.error.message : 'An unknown error occurred';
                updates.set(value.id, { error: errorMessage, isLoading: false, imageUrl: null });
            }
        }
    });

    setChatHistory(prev =>
        prev.map(msg => {
            if (updates.has(msg.id)) {
                return { ...msg, ...updates.get(msg.id)! };
            }
            return msg;
        })
    );

    setIsGenerating(false);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-base-100 text-content font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <ChatHistory messages={chatHistory} onEdit={handleOpenEditor} />
      </main>
      <footer className="bg-base-100/80 backdrop-blur-sm border-t border-base-300 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <PromptInput onGenerate={handleGenerateImage} isGenerating={isGenerating} />
        </div>
      </footer>
      {editingImage && (
        <ImageEditor 
          imageUrl={editingImage} 
          onClose={handleCloseEditor} 
          generateImage={generateImage}
        />
      )}
    </div>
  );
};

export default App;
