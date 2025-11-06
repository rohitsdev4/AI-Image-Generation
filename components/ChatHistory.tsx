
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { ImageCard } from './ImageCard';

interface ChatHistoryProps {
  messages: ChatMessage[];
  onEdit: (id: string, url: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, onEdit }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scrolls only for the last message to avoid weird scrolling behavior on multi-image generation
    if (messages.length > 0) {
       const lastMessageElement = document.getElementById(messages[messages.length-1].id);
       if(lastMessageElement) {
          endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
       }
    }
  }, [messages]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-400">Welcome!</h2>
          <p className="text-gray-500 mt-2">Enter a prompt below to generate your first image.</p>
        </div>
      ) : (
        messages.map(message => <ImageCard key={message.id} message={message} onEdit={onEdit} />)
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
