'use client';

import { ChatMessage as ChatMessageType } from '@/types';
import { User, Bot, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
  isAnimating?: boolean;
}

export function ChatMessage({ message, isAnimating = false }: ChatMessageProps) {
  const { user } = useAuth();
  const isUser = message.role === 'USER';
  const [isVisible, setIsVisible] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    const avatarTimer = setTimeout(() => setShowAvatar(true), 200);
    return () => {
      clearTimeout(timer);
      clearTimeout(avatarTimer);
    };
  }, []);

  return (
    <div
      className={`
        flex gap-4 p-6 group transition-all duration-500 ease-out
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isAnimating ? 'animate-bubble-in' : ''}
        hover:bg-[rgb(var(--muted))]/30 rounded-xl
      `}
    >
      {/* Enhanced Avatar */}
      <div
        className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center relative
          transition-all duration-300 ease-out
          ${showAvatar ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          ${isUser
            ? 'bg-gradient-to-br from-[rgb(var(--primary))] to-purple-600 text-white shadow-lg'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
          }
          ${!isUser ? 'animate-glow' : ''}
          group-hover:scale-110
        `}
      >
        {/* Avatar Glow Effect */}
        <div className={`
          absolute inset-0 rounded-full opacity-30 blur-sm
          ${isUser
            ? 'bg-gradient-to-br from-[rgb(var(--primary))] to-purple-600'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
          }
        `} />
        
        {isUser ? (
          <User className="h-5 w-5 relative z-10" />
        ) : (
          <div className="flex items-center justify-center relative z-10">
            <Bot className="h-5 w-5" />
            <Sparkles className="h-2 w-2 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </div>

      {/* Enhanced Message Content */}
      <div
        className={`max-w-[85%] flex-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}
      >
        {/* Enhanced Sender Name */}
        <div className={`
          flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))] mb-2
          transition-all duration-300
          ${isUser ? 'justify-end' : 'justify-start'}
        `}>
          {!isUser && <Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" />}
          <span className="font-medium">
            {isUser ? `${user?.firstName} ${user?.lastName}` : 'Family Law Assistant'}
          </span>
          {isUser && <User className="h-3 w-3" />}
        </div>

        {/* Enhanced Message Bubble */}
        <div
          className={`
            relative rounded-2xl px-5 py-4 break-words shadow-sm
            transition-all duration-300 ease-out group-hover:shadow-md
            ${isUser
              ? `
                bg-gradient-to-br from-[rgb(var(--primary))] to-purple-600 
                text-white rounded-br-md ml-4
                shadow-lg shadow-[rgb(var(--primary))]/20
                hover:shadow-xl hover:shadow-[rgb(var(--primary))]/30
              `
              : `
                glass border border-[rgb(var(--border))]/50 rounded-bl-md mr-4
                text-[rgb(var(--card-foreground))]
                hover:border-[rgb(var(--border))]
              `
            }
          `}
        >
          {/* Message Tail */}
          <div className={`
            absolute w-3 h-3 transform rotate-45
            ${isUser 
              ? 'bg-gradient-to-br from-[rgb(var(--primary))] to-purple-600 -right-1 bottom-3'
              : 'glass border-l border-b border-[rgb(var(--border))]/50 -left-1 bottom-3'
            }
          `} />
          
          {isUser ? (
            // Enhanced User messages
            <div className="whitespace-pre-wrap leading-relaxed font-medium relative z-10">
              {message.content}
            </div>
          ) : (
            // Enhanced AI messages with markdown rendering
            <div className="prose prose-sm max-w-none
                prose-headings:text-[rgb(var(--card-foreground))]
                prose-p:text-[rgb(var(--card-foreground))] prose-p:leading-relaxed prose-p:mb-3
                prose-strong:text-[rgb(var(--card-foreground))] prose-strong:font-semibold
                prose-em:text-[rgb(var(--card-foreground))] prose-em:italic
                prose-ul:text-[rgb(var(--card-foreground))] prose-ul:mb-3
                prose-ol:text-[rgb(var(--card-foreground))] prose-ol:mb-3
                prose-li:text-[rgb(var(--card-foreground))] prose-li:mb-1
                prose-code:text-[rgb(var(--primary))] prose-code:bg-[rgb(var(--muted))] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                prose-pre:bg-[rgb(var(--muted))] prose-pre:border prose-pre:border-[rgb(var(--border))] prose-pre:rounded-lg
                prose-blockquote:border-[rgb(var(--border))] prose-blockquote:bg-[rgb(var(--muted))] prose-blockquote:text-[rgb(var(--muted-foreground))]
                prose-table:text-[rgb(var(--card-foreground))]
                prose-th:bg-[rgb(var(--muted))] prose-th:text-[rgb(var(--card-foreground))] prose-th:font-medium
                prose-td:border-[rgb(var(--border))]
                prose-a:text-[rgb(var(--primary))] prose-a:no-underline hover:prose-a:underline
                prose-h1:text-lg prose-h1:font-semibold prose-h1:mb-3 prose-h1:mt-4
                prose-h2:text-base prose-h2:font-semibold prose-h2:mb-2 prose-h2:mt-3
                prose-h3:text-sm prose-h3:font-medium prose-h3:mb-2 prose-h3:mt-2
                prose-h4:text-sm prose-h4:font-medium prose-h4:mb-1 prose-h4:mt-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styling for specific elements
                  h1: ({...props}) => <h1 className="text-lg font-semibold mb-3 mt-4 text-[rgb(var(--card-foreground))]" {...props} />,
                  h2: ({...props}) => <h2 className="text-base font-semibold mb-2 mt-3 text-[rgb(var(--card-foreground))]" {...props} />,
                  h3: ({...props}) => <h3 className="text-sm font-medium mb-2 mt-2 text-[rgb(var(--card-foreground))]" {...props} />,
                  ul: ({...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                  li: ({...props}) => <li className="text-[rgb(var(--card-foreground))]" {...props} />,
                  p: ({...props}) => <p className="mb-3 leading-relaxed text-[rgb(var(--card-foreground))]" {...props} />,
                  strong: ({...props}) => <strong className="font-semibold text-[rgb(var(--card-foreground))]" {...props} />,
                  em: ({...props}) => <em className="italic text-[rgb(var(--card-foreground))]" {...props} />,
                  code: ({...props}) => <code className="bg-[rgb(var(--muted))] text-[rgb(var(--primary))] px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                  pre: ({...props}) => <pre className="bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-lg p-3 overflow-x-auto" {...props} />,
                  table: ({...props}) => <table className="w-full border-collapse border border-[rgb(var(--border))] mb-3" {...props} />,
                  th: ({...props}) => <th className="bg-[rgb(var(--muted))] border border-[rgb(var(--border))] px-3 py-2 text-left font-medium" {...props} />,
                  td: ({...props}) => <td className="border border-[rgb(var(--border))] px-3 py-2" {...props} />,
                  blockquote: ({...props}) => <blockquote className="border-l-4 border-[rgb(var(--border))] bg-[rgb(var(--muted))] pl-4 py-2 mb-3 text-[rgb(var(--muted-foreground))] italic" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Enhanced Timestamp */}
        <div className={`
          flex items-center gap-1 text-xs text-[rgb(var(--muted-foreground))] mt-2
          transition-opacity duration-300 opacity-0 group-hover:opacity-100
          ${isUser ? 'justify-end' : 'justify-start'}
        `}>
          <Clock className="h-3 w-3" />
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}