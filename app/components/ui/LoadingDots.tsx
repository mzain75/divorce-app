'use client';

import { Sparkles } from 'lucide-react';

export function LoadingDots() {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Animated Sparkle */}
      <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
      
      {/* Enhanced Typing Animation */}
      <div className="flex gap-1 items-center">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-typing-dots" />
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-typing-dots" />
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-typing-dots" />
      </div>
      
      {/* Thinking Text */}
      <span className="text-sm text-[rgb(var(--muted-foreground))] animate-pulse">
        AI is thinking...
      </span>
    </div>
  );
}