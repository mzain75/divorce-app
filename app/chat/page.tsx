'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage, Conversation } from '@/types';
import { ChatMessage as ChatMessageComponent } from '@/components/ui/ChatMessage';
import { ChatInput } from '@/components/ui/ChatInput';
import { ChatWelcome } from '@/components/ui/ChatWelcome';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ArrowLeft, RotateCcw, AlertCircle, LogOut, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAnimatingMessage, setIsAnimatingMessage] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const loadConversation = useCallback(async () => {
    try {
      setIsLoadingConversation(true);
      setError(null);
      
      const response = await fetch('/api/chat/conversation');
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          router.push('/login');
          return;
        }
        throw new Error('Failed to load conversation');
      }

      const conversationData: Conversation = await response.json();
      setConversation(conversationData);
      setMessages(conversationData.messages || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation. Please try again.');
    } finally {
      setIsLoadingConversation(false);
    }
  }, [logout, router]);

  // Load conversation on mount
  useEffect(() => {
    if (user && !authLoading) {
      loadConversation();
    }
  }, [user, authLoading, loadConversation]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const sendMessage = async (messageContent: string) => {
    if (!conversation || !messageContent.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsAnimatingMessage(true);

    try {
      // Add user message immediately to UI
      const tempUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: 'USER',
        content: messageContent,
        createdAt: new Date(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageContent }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          router.push('/login');
          return;
        }
        throw new Error('Failed to send message');
      }

      const { userMessage, assistantMessage } = await response.json();

      // Replace temp message with real messages
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.id.startsWith('temp-'));
        return [...filtered, userMessage, assistantMessage];
      });

      // Update conversation title if it's the first message
      if (messages.length === 0 && conversation.title === 'New Chat') {
        setConversation(prev => prev ? {
          ...prev,
          title: messageContent.substring(0, 50) + (messageContent.length > 50 ? '...' : '')
        } : null);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove temp user message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimatingMessage(false), 300);
    }
  };

  const handleClearChatClick = () => {
    setShowClearDialog(true);
  };

  const clearChat = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/chat/conversation', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear chat');
      }

      const newConversation: Conversation = await response.json();
      setConversation(newConversation);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError('Failed to clear chat. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--background))] to-[rgb(var(--muted))]/20 flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[rgb(var(--primary))]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}} />
      </div>

      {/* Enhanced Header */}
      <header className="glass border-b border-[rgb(var(--border))]/50 backdrop-blur-xl px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            
            <div className="h-4 w-px bg-[rgb(var(--border))]" />
            
            <h1 className="text-lg font-semibold">
              {conversation?.title || 'Family Law Chat'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChatClick}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Chat
              </Button>
            )}
            
            <ThemeToggle />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Error Banner */}
        {error && (
          <div className="bg-[rgb(var(--destructive))] text-[rgb(var(--destructive-foreground))] px-6 py-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto text-[rgb(var(--destructive-foreground))] hover:bg-transparent"
            >
              ×
            </Button>
          </div>
        )}

        {/* Enhanced Messages Area */}
        <div className="flex-1 overflow-y-auto relative">
          {isLoadingConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-slide-in-up">
                <LoadingDots />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <ChatWelcome 
              onSendMessage={sendMessage} 
              isLoading={isLoading}
            />
          ) : (
            <div className="max-w-5xl mx-auto relative z-10">
              {messages.map((message, index) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  isAnimating={index === messages.length - 1 && isAnimatingMessage}
                />
              ))}
              
              {/* Enhanced Loading indicator for assistant response */}
              {isLoading && (
                <div className="flex gap-4 p-6 group animate-bubble-in">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg flex items-center justify-center animate-glow">
                    <div className="h-5 w-5 rounded-full bg-white/20 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))] mb-2">
                      <Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" />
                      <span className="font-medium">Family Law Assistant</span>
                    </div>
                    <div className="glass border border-[rgb(var(--border))]/50 rounded-2xl rounded-bl-md px-5 py-4 w-fit mr-4 shadow-sm">
                      <LoadingDots />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-[rgb(var(--border))]/50 glass backdrop-blur-xl px-6 py-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <ChatInput
              onSendMessage={sendMessage}
              isLoading={isLoading}
              disabled={isLoadingConversation}
            />
          </div>
        </div>
      </div>

      {/* Confirm Clear Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={clearChat}
        title="Clear Chat History"
        message="Are you sure you want to clear all chat messages? This action cannot be undone and will permanently delete your conversation history."
        confirmText="Yes, Clear Chat"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
}