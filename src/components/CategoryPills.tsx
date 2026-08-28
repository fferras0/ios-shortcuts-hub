'use client';

import React from 'react';
import { CATEGORIES } from '@/data/initial-shortcuts';
import { ShortcutCategory } from '@/types/shortcut';
import { GlassIcon } from './GlassIcon';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 pt-1 no-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max px-1">
        {/* All Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'liquid-btn-primary text-white scale-[1.02]'
              : 'liquid-btn-secondary text-slate-300 hover:text-white'
          }`}
        >
          <GlassIcon
            name="Grid"
            size="sm"
            accentColor={selectedCategory === 'all' ? '#FFFFFF' : '#94A3B8'}
            className="!w-6 !h-6 !rounded-md"
          />
          <span>جميع الاختصارات</span>
          <span className="font-number text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
            {categoryCounts['all'] || 0}
          </span>
        </button>

        {/* Dynamic Categories */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isSelected
                  ? 'text-white border scale-[1.02]'
                  : 'liquid-btn-secondary text-slate-300 hover:text-white'
              }`}
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${cat.accent_color}cc 0%, #011F65 100%)`
                  : undefined,
                borderColor: isSelected ? cat.accent_color : undefined,
                boxShadow: isSelected ? `0 8px 24px -4px ${cat.glow_color}` : undefined,
              }}
            >
              <GlassIcon
                name={cat.icon}
                size="sm"
                accentColor={isSelected ? '#FFFFFF' : cat.accent_color}
                glowColor={cat.glow_color}
                className="!w-6 !h-6 !rounded-md"
              />
              <span>{cat.name_ar}</span>
              <span className="font-number text-xs px-2 py-0.5 rounded-full bg-white/15 text-white font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
