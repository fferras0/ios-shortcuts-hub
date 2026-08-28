'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlassIcon } from './GlassIcon';
import { getFavorites, subscribeFavorites } from '@/lib/favorites-store';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    setFavoritesCount(getFavorites().length);
    const unsubscribe = subscribeFavorites(() => {
      setFavoritesCount(getFavorites().length);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: '/', label: 'دليل الاختصارات', icon: 'Layers' },
    { href: '/favorites', label: 'المفضلة', icon: 'Heart', badge: favoritesCount },
    { href: '/builder', label: 'منشئ الاختصارات', icon: 'Wand2' },
    { href: '/admin', label: 'لوحة التحكم', icon: 'ShieldCheck' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 md:pt-4 md:pb-3 max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 rounded-2xl liquid-glass border border-night-500/20 backdrop-blur-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <GlassIcon name="Zap" size="md" accentColor="#3894E8" glowColor="rgba(56, 148, 232, 0.6)" />
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold tracking-tight text-white group-hover:text-night-300 transition-colors">
              اختصارات <span className="text-night-500 font-extrabold">iOS</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">
              دليل ومنشئ الاختصارات العربي
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-night-600/30 border border-night-500/40 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <GlassIcon name={link.icon} size="sm" accentColor={isActive ? '#3894E8' : '#94A3B8'} />
                <span>{link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span className="font-number flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-accent-rose rounded-full shadow-md animate-pulse-slow">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/builder"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white liquid-btn-primary"
          >
            <GlassIcon name="Sparkles" size="sm" accentColor="#FFFFFF" className="!w-6 !h-6 !rounded-md" />
            <span>أنشئ اختصاراً</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
