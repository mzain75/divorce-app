'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || disabled) {
      return;
    }

    const messageToSend = message.trim();
    setMessage('');
    setIsTyping(false);
    
    // Auto-resize textarea back to single line
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    try {
      await onSendMessage(messageToSend);
    } catch {
      // Reset message if sending failed
      setMessage(messageToSend);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
    
    // Typing indicator
    setIsTyping(value.length > 0);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Typing Indicator */}
      <div className={`
        absolute -top-8 left-4 flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]
        transition-all duration-300 transform
        ${isTyping && !isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}>
        <Sparkles className="h-3 w-3 animate-pulse" />
        <span>AI is thinking...</span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {/* Enhanced Input Container */}
        <div className={`
          relative flex items-end gap-3 p-3 rounded-2xl border-2
          bg-[rgb(var(--card))] backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isFocused 
            ? 'border-[rgb(var(--primary))] shadow-lg shadow-[rgb(var(--primary))]/20 scale-[1.02]' 
            : 'border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50'
          }
          ${isLoading ? 'border-[rgb(var(--primary))] shadow-lg shadow-[rgb(var(--primary))]/30' : ''}
        `}>
          
          {/* Magic Gradient Border Effect */}
          <div className={`
            absolute inset-0 rounded-2xl bg-gradient-to-r from-[rgb(var(--primary))] via-purple-500 to-[rgb(var(--primary))]
            transition-opacity duration-500 -z-10
            ${isFocused || isLoading ? 'opacity-20 animate-pulse' : 'opacity-0'}
          `} />
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask me anything about Australian family law..."
              disabled={isLoading || disabled}
              className={`
                w-full min-h-[48px] max-h-32 px-4 py-3 pr-16
                bg-transparent border-0 resize-none
                text-[rgb(var(--card-foreground))] text-base
                placeholder:text-[rgb(var(--muted-foreground))]
                focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              `}
              rows={1}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(var(--border)) transparent',
              }}
            />
            
            {/* Character Count */}
            <div className={`
              absolute bottom-1 right-20 text-xs text-[rgb(var(--muted-foreground))]
              transition-opacity duration-200
              ${message.length > 100 ? 'opacity-100' : 'opacity-0'}
            `}>
              {message.length}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end">
            {/* Enhanced Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className={`
                w-12 h-12 p-0 rounded-full relative overflow-hidden
                bg-gradient-to-r from-[rgb(var(--primary))] to-purple-600
                hover:from-[rgb(var(--primary))]/90 hover:to-purple-600/90
                disabled:from-gray-400 disabled:to-gray-500
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-out
                ${!message.trim() || disabled 
                  ? 'scale-90 opacity-50' 
                  : 'scale-100 hover:scale-110 opacity-100'
                }
                ${isLoading ? 'animate-pulse' : ''}
              `}
            >
              {/* Shimmer Effect */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                translate-x-[-100%] skew-x-12
                transition-transform duration-1000
                ${!disabled && message.trim() && !isLoading ? 'animate-shimmer' : ''}
              `} />
              
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Square className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center justify-center transform transition-transform duration-200 group-hover:scale-110">
                  <Send className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`
          flex items-center gap-2 mt-3 px-1
          transition-all duration-300
          ${isFocused || message.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}>
          <div className="text-xs text-[rgb(var(--muted-foreground))]">
            💡 Tip: Press Shift+Enter for new line, Enter to send
          </div>
        </div>
      </form>
    </div>
  );
}