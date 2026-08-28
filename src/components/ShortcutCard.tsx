'use client';

import React, { useState } from 'react';
import { ShortcutItem } from '@/types/shortcut';
import { CATEGORIES } from '@/data/initial-shortcuts';
import { GlassIcon } from './GlassIcon';
import { isFavorite, toggleFavorite } from '@/lib/favorites-store';
import { generateShortcutXmlPlist, downloadShortcutFile } from '@/lib/plist-builder';

interface ShortcutCardProps {
  shortcut: ShortcutItem;
  onOpenDetails: (shortcut: ShortcutItem) => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({
  shortcut,
  onOpenDetails,
  onToast,
}) => {
  const [favorited, setFavorited] = useState<boolean>(() => isFavorite(shortcut.id));
  const [isHeartBursting, setIsHeartBursting] = useState(false);

  const categoryMeta = CATEGORIES.find((c) => c.id === shortcut.category) || CATEGORIES[0];

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleFavorite(shortcut.id);
    setFavorited(nextState);
    if (nextState) {
      setIsHeartBursting(true);
      setTimeout(() => setIsHeartBursting(false), 600);
      onToast(`تمت إضافة "${shortcut.title}" إلى المفضلة`);
    } else {
      onToast(`تمت إزالة "${shortcut.title}" من المفضلة`, 'info');
    }
  };

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Try shortcuts protocol or open iCloud url
    window.open(shortcut.icloud_url, '_blank');
    onToast(`جاري فتح رابط تثبيت "${shortcut.title}"`);
  };

  const handleDownloadPlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const xml = generateShortcutXmlPlist({
      name: shortcut.title,
      actions: [
        {
          WFWorkflowActionIdentifier: 'is.workflow.actions.url',
          WFWorkflowActionParameters: {
            WFURLActionURL: shortcut.icloud_url,
          },
        },
        {
          WFWorkflowActionIdentifier: 'is.workflow.actions.openurl',
          WFWorkflowActionParameters: {
            Show_WFInput: true,
          },
        },
      ],
    });
    downloadShortcutFile(shortcut.slug, xml);
    onToast(`تم تنزيل ملف .shortcut لاختصار "${shortcut.title}"`);
  };

  return (
    <div
      onClick={() => onOpenDetails(shortcut)}
      className="group relative flex flex-col justify-between p-5 rounded-3xl liquid-glass liquid-glass-interactive cursor-pointer border border-night-600/30 transition-all duration-300"
      style={{
        boxShadow: `0 10px 30px -10px rgba(0, 5, 33, 0.6), 0 0 15px -5px ${categoryMeta.glow_color}`,
      }}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <GlassIcon
              name={shortcut.icon}
              size="md"
              accentColor={categoryMeta.accent_color}
              glowColor={categoryMeta.glow_color}
            />
            <div>
              <span
                className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-1"
                style={{
                  color: categoryMeta.accent_color,
                  borderColor: `${categoryMeta.accent_color}50`,
                  background: `${categoryMeta.accent_color}15`,
                }}
              >
                {categoryMeta.name_ar}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-night-300 transition-colors line-clamp-1">
                {shortcut.title}
              </h3>
            </div>
          </div>

          {/* Heart Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label="إضافة للمفضلة"
            className="relative p-2 rounded-xl liquid-capsule text-slate-400 hover:text-accent-rose hover:scale-110 active:scale-95 transition-all"
          >
            <GlassIcon
              name="Heart"
              size="sm"
              accentColor={favorited ? '#E11D48' : '#94A3B8'}
              className={`!w-7 !h-7 !rounded-lg ${favorited ? '!border-accent-rose/60' : ''} ${
                isHeartBursting ? 'scale-125 transition-transform' : ''
              }`}
            />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
          {shortcut.short_description}
        </p>
      </div>

      {/* Bottom Info & Action Row */}
      <div className="pt-3 border-t border-night-600/30 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-number flex items-center gap-1">
            <GlassIcon name="Download" size="sm" accentColor="#60A9F6" className="!w-4 !h-4 !rounded" />
            <span className="font-semibold text-slate-200">
              {shortcut.install_count.toLocaleString('en-US')}
            </span>
          </span>
          <span className="font-number text-[11px] px-2 py-0.5 rounded-md bg-night-800/80 text-night-300 border border-night-700/60">
            {shortcut.ios_compatibility}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white liquid-btn-primary"
          >
            <GlassIcon name="ExternalLink" size="sm" accentColor="#FFFFFF" className="!w-4 !h-4 !rounded" />
            <span>تثبيت مباشر</span>
          </button>

          <button
            onClick={handleDownloadPlist}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 liquid-btn-secondary hover:text-white"
          >
            <GlassIcon name="FileDown" size="sm" accentColor="#93C5FD" className="!w-4 !h-4 !rounded" />
            <span className="font-number">.shortcut</span>
          </button>
        </div>
      </div>
    </div>
  );
};
