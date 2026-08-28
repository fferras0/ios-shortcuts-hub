'use client';

import React from 'react';
import { GlassIcon } from './GlassIcon';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const iconName = type === 'success' ? 'CheckCircle2' : type === 'error' ? 'AlertCircle' : 'Info';
  const accentColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#2078CF';

  return (
    <div className="fixed bottom-24 md:bottom-8 right-1/2 translate-x-1/2 z-50 animate-bounce-short">
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl liquid-glass border border-night-600/40 shadow-2xl backdrop-blur-xl"
        style={{
          boxShadow: `0 12px 32px rgba(0, 5, 33, 0.7), 0 0 24px ${accentColor}35`,
        }}
      >
        <GlassIcon name={iconName} size="sm" accentColor={accentColor} />
        <span className="text-sm font-medium text-slate-100">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="mr-2 text-slate-400 hover:text-white transition-colors"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};
