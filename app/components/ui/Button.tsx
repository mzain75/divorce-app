import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--primary))]/90': 
            variant === 'primary',
          'bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] hover:bg-[rgb(var(--secondary))]/80': 
            variant === 'secondary',
          'border border-[rgb(var(--border))] bg-transparent hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--accent-foreground))]': 
            variant === 'outline',
          'hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--accent-foreground))]': 
            variant === 'ghost',
          'bg-[rgb(var(--destructive))] text-[rgb(var(--destructive-foreground))] hover:bg-[rgb(var(--destructive))]/90': 
            variant === 'destructive',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-12 px-8 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}