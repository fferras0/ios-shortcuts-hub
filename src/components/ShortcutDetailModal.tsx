'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShortcutItem } from '@/types/shortcut';
import { CATEGORIES } from '@/data/initial-shortcuts';
import { GlassIcon } from './GlassIcon';
import { isFavorite, toggleFavorite } from '@/lib/favorites-store';
import { generateShortcutXmlPlist, downloadShortcutFile } from '@/lib/plist-builder';

interface ShortcutDetailModalProps {
  shortcut: ShortcutItem | null;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShortcutDetailModal: React.FC<ShortcutDetailModalProps> = ({
  shortcut,
  onClose,
  onToast,
}) => {
  if (!shortcut) return null;

  const [favorited, setFavorited] = useState<boolean>(() => isFavorite(shortcut.id));
  const categoryMeta = CATEGORIES.find((c) => c.id === shortcut.category) || CATEGORIES[0];

  const handleToggleFavorite = () => {
    const nextState = toggleFavorite(shortcut.id);
    setFavorited(nextState);
    if (nextState) {
      onToast(`تمت إضافة "${shortcut.title}" إلى المفضلة`);
    } else {
      onToast(`تمت إزالة "${shortcut.title}" من المفضلة`, 'info');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortcut.icloud_url);
    onToast('تم نسخ رابط التثبيت إلى الحافظة بنجاح!');
  };

  const handleDownloadFile = () => {
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
    onToast(`تم تنزيل ملف "${shortcut.title}.shortcut"`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl my-8 p-6 md:p-8 rounded-3xl liquid-glass border border-night-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{
          boxShadow: `0 24px 60px -12px rgba(0, 5, 33, 0.85), 0 0 35px -5px ${categoryMeta.glow_color}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl liquid-capsule text-slate-400 hover:text-white transition-colors"
        >
          <GlassIcon name="X" size="sm" accentColor="#CBD5E1" className="!w-6 !h-6 !rounded-lg" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-2">
          <GlassIcon
            name={shortcut.icon}
            size="lg"
            accentColor={categoryMeta.accent_color}
            glowColor={categoryMeta.glow_color}
          />
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  color: categoryMeta.accent_color,
                  borderColor: `${categoryMeta.accent_color}50`,
                  background: `${categoryMeta.accent_color}15`,
                }}
              >
                {categoryMeta.name_ar}
              </span>
              <span className="font-number text-xs px-2 py-0.5 rounded bg-night-800 text-night-300 border border-night-700">
                الإصدار {shortcut.version}
              </span>
              <span className="font-number text-xs px-2 py-0.5 rounded bg-night-800 text-accent-emerald border border-night-700">
                {shortcut.ios_compatibility}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {shortcut.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 text-sm">
          {/* Descriptions */}
          <div className="p-4 rounded-2xl bg-night-900/60 border border-night-700/40 text-slate-200 leading-relaxed">
            <p className="mb-2 font-medium">{shortcut.short_description}</p>
            {shortcut.long_description && (
              <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-night-800">
                {shortcut.long_description}
              </p>
            )}
          </div>

          {/* Legal / Disclaimer Notice if present */}
          {shortcut.disclaimer && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <GlassIcon name="AlertTriangle" size="sm" accentColor="#F59E0B" className="!w-6 !h-6 !rounded" />
              <p className="leading-relaxed">{shortcut.disclaimer}</p>
            </div>
          )}

          {/* QR Code & Direct Scan Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl liquid-glass border border-night-600/30 items-center">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/95 text-night-950 shadow-lg">
              <QRCodeSVG
                value={shortcut.icloud_url}
                size={140}
                level="M"
                includeMargin={false}
              />
              <span className="text-[11px] font-bold text-slate-800 mt-2">
                امسح بكاميرا الآيفون للتثبيت المباشر
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-night-300 uppercase tracking-wider">
                طرق التثبيت المتاحة
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. يمكنك مسح رمز الـ QR مباشرة من كاميرا هاتفك. <br />
                2. أو الضغط على زر &quot;تثبيت في تطبيق الاختصارات&quot;. <br />
                3. أو تنزيل ملف الـ <span className="font-number">.shortcut</span> وفتحه في تطبيق الملفات.
              </p>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 liquid-btn-secondary hover:text-white"
              >
                <GlassIcon name="Copy" size="sm" accentColor="#60A9F6" className="!w-4 !h-4 !rounded" />
                <span>نسخ رابط الاختصار</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-6 pt-4 border-t border-night-600/30 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={handleToggleFavorite}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-capsule text-sm font-semibold text-slate-200 hover:text-accent-rose transition-all"
          >
            <GlassIcon
              name="Heart"
              size="sm"
              accentColor={favorited ? '#E11D48' : '#94A3B8'}
              className="!w-5 !h-5 !rounded-md"
            />
            <span>{favorited ? 'في المفضلة' : 'حفظ في المفضلة'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 liquid-btn-secondary hover:text-white"
            >
              <GlassIcon name="FileDown" size="sm" accentColor="#93C5FD" className="!w-5 !h-5 !rounded-md" />
              <span className="font-number">تنزيل .shortcut</span>
            </button>

            <a
              href={shortcut.icloud_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white liquid-btn-primary"
            >
              <GlassIcon name="ExternalLink" size="sm" accentColor="#FFFFFF" className="!w-5 !h-5 !rounded-md" />
              <span>تثبيت في Shortcuts</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
