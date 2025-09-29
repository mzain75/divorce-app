import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: React.ReactNode;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, onChange, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <div className="relative flex items-center">
            <input
              id={checkboxId}
              type="checkbox"
              className="sr-only peer"
              ref={ref}
              onChange={onChange}
              {...props}
            />
            <label 
              htmlFor={checkboxId}
              className={cn(
                'h-4 w-4 rounded-sm border border-[rgb(var(--border))] bg-[rgb(var(--background))] flex items-center justify-center peer-checked:bg-[rgb(var(--primary))] peer-checked:border-[rgb(var(--primary))] transition-colors cursor-pointer',
                error && 'border-[rgb(var(--destructive))]',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-[rgb(var(--ring))] peer-focus-visible:ring-offset-2',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                className
              )}
            >
              <Check className="h-3 w-3 text-[rgb(var(--primary-foreground))] opacity-0 peer-checked:opacity-100 transition-opacity" />
            </label>
          </div>
          {label && (
            <label 
              htmlFor={checkboxId}
              className="text-sm font-medium text-[rgb(var(--foreground))] cursor-pointer flex-1"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-[rgb(var(--destructive))]">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';