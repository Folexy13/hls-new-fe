import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
      // Animate in
      setTimeout(() => setIsVisible(true), 10);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className={cn(
          `relative w-full ${sizeClasses[size]} bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl transform ${
            isVisible ? 'translate-y-0 sm:scale-100 sm:translate-y-0' : 'translate-y-full sm:scale-95 sm:translate-y-0'
          } transition-all duration-500 ease-out sm:m-4 overflow-hidden flex flex-col`,
          className
        )}
      >
        {/* Drag Indicator for mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-[85vh] overscroll-contain no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;