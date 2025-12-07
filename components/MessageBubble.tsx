import React from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot, User, Cpu } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-orange-600' // Orange for a "Logic Pro" vibe
        }`}>
          {isUser ? <User size={16} className="text-white" /> : <Cpu size={16} className="text-white" />}
        </div>

        {/* Content */}
        <div className={`px-5 py-4 rounded-2xl shadow-md ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-sm'
        }`}>
          {/* Render Image if present */}
          {message.image && (
            <div className="mb-3">
              <img 
                src={message.image} 
                alt="Uploaded content" 
                className="max-w-full rounded-lg border border-white/20 max-h-60 object-contain"
              />
            </div>
          )}

          {isUser ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          
          <div className={`text-[10px] mt-2 opacity-60 ${isUser ? 'text-right text-blue-100' : 'text-left text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;