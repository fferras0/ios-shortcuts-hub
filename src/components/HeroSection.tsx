'use client';

import React from 'react';
import Link from 'next/link';
import { GlassIcon } from './GlassIcon';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalShortcutsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  totalShortcutsCount,
}) => {
  return (
    <section className="relative w-full pt-6 pb-8 md:pt-12 md:pb-14 px-4 overflow-hidden text-center">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[600px] h-[320px] md:h-[300px] bg-night-600/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-[15%] w-48 h-48 bg-accent-sky/20 rounded-full blur-[70px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top iOS Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-capsule mb-6 border border-night-500/30">
          <GlassIcon name="Sparkles" size="sm" accentColor="#3894E8" className="!w-5 !h-5 !rounded-full" />
          <span className="text-xs md:text-sm font-medium text-slate-200">
            أكبر منصة عربية لاختصارات <span className="text-night-400 font-bold font-number">iOS 18 / 17</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight sm:leading-snug">
          قوّة الأتمتة على جهازك <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-night-400 via-night-300 to-sky-200">
            تثبيت فوري بدون تسجيل
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          اكتشف مكتبة مختارة بعناية لأقوى وأشهر اختصارات الآيفون باللغة العربية، أو استخدم المنشئ الذكي لتوليد اختصارك الخاص وتنزيله مباشرة بصيغة <code className="font-number text-xs px-2 py-0.5 rounded bg-night-800 text-night-300 border border-night-600/50">.shortcut</code>
        </p>

        {/* Live Search Input with Glass Styling */}
        <div className="w-full max-w-2xl relative mb-10 group">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
            <GlassIcon name="Search" size="sm" accentColor="#60A9F6" className="!w-6 !h-6 !rounded-md" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم أو الوظيفة (مثال: بطارية، تلخيص، واتساب، PDF)..."
            className="w-full pr-13 pl-12 py-3.5 sm:py-4 rounded-2xl liquid-glass text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-night-400/80 focus:ring-2 focus:ring-night-500/30 transition-all duration-300 shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <GlassIcon name="X" size="sm" accentColor="#94A3B8" className="!w-6 !h-6 !rounded-md" />
            </button>
          )}
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl">
          <div className="p-3 sm:p-4 rounded-2xl liquid-glass border border-night-600/20 text-center">
            <span className="font-number block text-xl sm:text-2xl font-black text-night-300">{totalShortcutsCount}+</span>
            <span className="text-xs text-slate-400 font-medium">اختصار جاهز</span>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl liquid-glass border border-night-600/20 text-center">
            <span className="font-number block text-xl sm:text-2xl font-black text-accent-emerald">100K+</span>
            <span className="text-xs text-slate-400 font-medium">عملية تثبيت</span>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl liquid-glass border border-night-600/20 text-center">
            <span className="font-number block text-xl sm:text-2xl font-black text-accent-amber">iOS 18</span>
            <span className="text-xs text-slate-400 font-medium">توافق تام</span>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl liquid-glass border border-night-600/20 text-center">
            <span className="font-number block text-xl sm:text-2xl font-black text-accent-cyan">100%</span>
            <span className="text-xs text-slate-400 font-medium">حفظ محلي مجاني</span>
          </div>
        </div>
      </div>
    </section>
  );
};
