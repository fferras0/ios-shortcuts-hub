'use client';

import React, { useState } from 'react';
import { FavoritesView } from '@/components/FavoritesView';
import { Toast } from '@/components/Toast';

export default function FavoritesPage() {
  const [toastInfo, setToastInfo] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 3500);
  };

  return (
    <div className="w-full">
      <FavoritesView onToast={showToast} />
      {toastInfo && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
    </div>
  );
}
