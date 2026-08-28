'use client';

import React, { useState } from 'react';
import { AdminView } from '@/components/AdminView';
import { Toast } from '@/components/Toast';

export default function AdminPage() {
  const [toastInfo, setToastInfo] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 3500);
  };

  return (
    <div className="w-full">
      <AdminView onToast={showToast} />
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
