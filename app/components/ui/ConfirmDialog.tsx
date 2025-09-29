'use client';

import { Button } from './Button';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  confirmVariant = 'destructive'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgb(var(--destructive))]/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[rgb(var(--destructive))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))]">
                  {title}
                </h3>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message */}
          <p className="text-[rgb(var(--muted-foreground))] mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}