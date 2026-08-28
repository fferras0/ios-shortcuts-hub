'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlassIcon } from './GlassIcon';
import { getFavorites, subscribeFavorites } from '@/lib/favorites-store';

export const MobileTabBar: React.FC = () => {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavorites().length);
    const unsubscribe = subscribeFavorites(() => {
      setFavCount(getFavorites().length);
    });
    return () => unsubscribe();
  }, []);

  const tabs = [
    { href: '/', label: 'الدليل', icon: 'Layers' },
    { href: '/favorites', label: 'المفضلة', icon: 'Heart', badge: favCount },
    { href: '/builder', label: 'المنشئ', icon: 'Wand2' },
    { href: '/admin', label: 'الإدارة', icon: 'ShieldCheck' },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-40">
      <nav className="flex items-center justify-around py-2 px-3 rounded-2xl ios-tab-bar">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive ? 'text-night-400 font-bold scale-105' : 'text-slate-400 font-medium'
              }`}
            >
              <div className="relative">
                <GlassIcon
                  name={tab.icon}
                  size="sm"
                  accentColor={isActive ? '#3894E8' : '#94A3B8'}
                  className={isActive ? '!border-night-400/60' : ''}
                />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="font-number absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-accent-rose rounded-full shadow-md">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
