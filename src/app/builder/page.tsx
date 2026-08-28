'use client';

import React, { useState } from 'react';
import { ShortcutBuilderView } from '@/components/ShortcutBuilderView';
import { Toast } from '@/components/Toast';

export default function BuilderPage() {
  const [toastInfo, setToastInfo] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 3500);
  };

  return (
    <div className="w-full">
      <ShortcutBuilderView onToast={showToast} />
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
