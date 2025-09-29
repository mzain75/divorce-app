import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[rgb(var(--foreground))]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] px-3 py-2 text-sm ring-offset-[rgb(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[rgb(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[rgb(var(--destructive))]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-[rgb(var(--destructive))]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';