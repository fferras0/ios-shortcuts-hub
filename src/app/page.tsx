'use client';

import React, { useState, useMemo } from 'react';
import { INITIAL_SHORTCUTS, CATEGORIES } from '@/data/initial-shortcuts';
import { ShortcutItem } from '@/types/shortcut';
import { HeroSection } from '@/components/HeroSection';
import { CategoryPills } from '@/components/CategoryPills';
import { ShortcutCard } from '@/components/ShortcutCard';
import { ShortcutDetailModal } from '@/components/ShortcutDetailModal';
import { GlassIcon } from '@/components/GlassIcon';
import { Toast } from '@/components/Toast';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShortcut, setSelectedShortcut] = useState<ShortcutItem | null>(null);
  const [toastInfo, setToastInfo] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 3500);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INITIAL_SHORTCUTS.length };
    CATEGORIES.forEach((c) => {
      counts[c.id] = INITIAL_SHORTCUTS.filter((s) => s.category === c.id).length;
    });
    return counts;
  }, []);

  // Filter shortcuts
  const filteredShortcuts = useMemo(() => {
    return INITIAL_SHORTCUTS.filter((s) => {
      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        s.short_description.toLowerCase().includes(query) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(query)));
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Featured shortcuts
  const featuredShortcuts = useMemo(() => {
    return INITIAL_SHORTCUTS.filter((s) => s.featured);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalShortcutsCount={INITIAL_SHORTCUTS.length}
      />

      <div className="w-full max-w-7xl px-4 py-4 space-y-12">
        {/* Featured Section if not searching */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="w-full">
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2.5">
                <GlassIcon name="Star" size="sm" accentColor="#F59E0B" glowColor="rgba(245, 158, 11, 0.4)" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  أبرز الاختصارات المختارة
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                الأكثر شعبية وتثبيتاً هذا الأسبوع
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredShortcuts.slice(0, 3).map((shortcut) => (
                <ShortcutCard
                  key={shortcut.id}
                  shortcut={shortcut}
                  onOpenDetails={setSelectedShortcut}
                  onToast={showToast}
                />
              ))}
            </div>
          </section>
        )}

        {/* Directory Section with Category Pills */}
        <section className="w-full pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
            <div className="flex items-center gap-2.5">
              <GlassIcon name="Layers" size="sm" accentColor="#3894E8" glowColor="rgba(56, 148, 232, 0.4)" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                دليل وتصنيفات الاختصارات
              </h2>
            </div>

            {searchQuery && (
              <span className="text-xs text-night-300 font-semibold px-3 py-1 rounded-full bg-night-800 border border-night-700">
                نتائج البحث عن: &quot;{searchQuery}&quot; ({filteredShortcuts.length})
              </span>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="mb-8">
            <CategoryPills
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Shortcuts Grid */}
          {filteredShortcuts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-3xl liquid-glass text-center border border-night-600/20 my-8 shadow-xl">
              <GlassIcon name="SearchX" size="lg" accentColor="#94A3B8" className="mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">لم نجد أي اختصارات مطابقة</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                جرّب البحث بكلمة أخرى أو تغيير الفئة المحددة لاستعراض المزيد من الاختصارات.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white liquid-btn-primary"
              >
                إعادة ضبط الفلترة
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredShortcuts.map((shortcut) => (
                <ShortcutCard
                  key={shortcut.id}
                  shortcut={shortcut}
                  onOpenDetails={setSelectedShortcut}
                  onToast={showToast}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {selectedShortcut && (
        <ShortcutDetailModal
          shortcut={selectedShortcut}
          onClose={() => setSelectedShortcut(null)}
          onToast={showToast}
        />
      )}

      {/* Toast Notification */}
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
