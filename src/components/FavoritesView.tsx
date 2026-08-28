'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShortcutItem } from '@/types/shortcut';
import { INITIAL_SHORTCUTS } from '@/data/initial-shortcuts';
import { GlassIcon } from './GlassIcon';
import { ShortcutCard } from './ShortcutCard';
import { ShortcutDetailModal } from './ShortcutDetailModal';
import {
  getFavorites,
  subscribeFavorites,
  exportFavoritesBackup,
  importFavoritesBackup,
  clearFavorites,
} from '@/lib/favorites-store';

interface FavoritesViewProps {
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onToast }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedShortcut, setSelectedShortcut] = useState<ShortcutItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFavoriteIds(getFavorites());
    const unsubscribe = subscribeFavorites(() => {
      setFavoriteIds(getFavorites());
    });
    return () => unsubscribe();
  }, []);

  const favoriteShortcuts = INITIAL_SHORTCUTS.filter((s) => favoriteIds.includes(s.id));

  const handleExport = () => {
    if (favoriteIds.length === 0) {
      onToast('لا توجد اختصارات مفضلة لتصديرها حالياً.', 'info');
      return;
    }
    exportFavoritesBackup();
    onToast('تم تصدير النسخة الاحتياطية بنجاح!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importFavoritesBackup(content);
        if (result.success) {
          onToast(`تمت استعادة ${result.count} اختصاراً بنجاح!`);
        } else {
          onToast(result.error || 'فشل استيراد الملف.', 'error');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    if (favoriteIds.length === 0) return;
    if (confirm('هل أنت متأكد من رغبتك في حذف جميع الاختصارات من المفضلة المحلية؟')) {
      clearFavorites();
      onToast('تم مسح المفضلة بنجاح.', 'info');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl liquid-glass border border-night-500/30 mb-8 shadow-xl">
        <div className="flex items-center gap-4">
          <GlassIcon name="Heart" size="lg" accentColor="#E11D48" glowColor="rgba(225, 29, 72, 0.4)" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              المفضلة المحفوظة محلياً
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              جميع الاختصارات التي قمت بحفظها مخزنة بأمان على متصفح جهازك بدون الحاجة لتسجيل حساب.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 liquid-btn-secondary hover:text-white"
          >
            <GlassIcon name="Upload" size="sm" accentColor="#60A9F6" className="!w-4 !h-4 !rounded" />
            <span>استيراد JSON</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 liquid-btn-secondary hover:text-white"
          >
            <GlassIcon name="Download" size="sm" accentColor="#3894E8" className="!w-4 !h-4 !rounded" />
            <span>تصدير نسخة احتياطية</span>
          </button>

          {favoriteShortcuts.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-accent-rose bg-accent-rose/10 hover:bg-accent-rose/20 border border-accent-rose/30 transition-colors"
            >
              <GlassIcon name="Trash2" size="sm" accentColor="#E11D48" className="!w-4 !h-4 !rounded" />
              <span>مسح الكل</span>
            </button>
          )}
        </div>
      </div>

      {/* Favorites List or Empty State */}
      {favoriteShortcuts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 md:p-16 rounded-3xl liquid-glass border border-night-600/20 text-center max-w-xl mx-auto my-12 shadow-2xl">
          <div className="p-4 rounded-3xl bg-night-800/60 border border-night-700/50 mb-4">
            <GlassIcon name="BookmarkPlus" size="xl" accentColor="#60A9F6" glowColor="rgba(96, 169, 246, 0.4)" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد اختصارات محفوظة بعد</h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            يمكنك تصفح دليل الاختصارات والضغط على زر القلب لحفظ أي اختصار مفضل لديك على هاتفك للرجوع إليه وتثبيته في أي وقت.
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white liquid-btn-primary shadow-xl"
          >
            <GlassIcon name="Compass" size="sm" accentColor="#FFFFFF" className="!w-5 !h-5 !rounded-md" />
            <span>استكشف دليل الاختصارات الآن</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteShortcuts.map((shortcut) => (
            <ShortcutCard
              key={shortcut.id}
              shortcut={shortcut}
              onOpenDetails={setSelectedShortcut}
              onToast={onToast}
            />
          ))}
        </div>
      )}

      {/* Modal View */}
      {selectedShortcut && (
        <ShortcutDetailModal
          shortcut={selectedShortcut}
          onClose={() => setSelectedShortcut(null)}
          onToast={onToast}
        />
      )}
    </div>
  );
};
