'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface GlassIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: string;
  glowColor?: string;
  className?: string;
}

const sizeMap = {
  sm: {
    container: 'w-8 h-8 rounded-lg',
    iconSize: 16,
  },
  md: {
    container: 'w-11 h-11 rounded-xl',
    iconSize: 20,
  },
  lg: {
    container: 'w-14 h-14 rounded-2xl',
    iconSize: 26,
  },
  xl: {
    container: 'w-18 h-18 rounded-3xl',
    iconSize: 34,
  },
};

export const GlassIcon: React.FC<GlassIconProps> = ({
  name,
  size = 'md',
  accentColor = '#2078CF',
  glowColor,
  className = '',
}) => {
  const sizeConfig = sizeMap[size] || sizeMap.md;
  const resolvedGlow = glowColor || `${accentColor}40`;

  // Dynamically resolve icon from Lucide
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Sparkles;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${sizeConfig.container} ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 100%)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid rgba(255, 255, 255, 0.25)`,
        boxShadow: `0 4px 16px 0 rgba(0, 5, 33, 0.4), 0 0 16px 0 ${resolvedGlow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.3)`,
      }}
    >
      {/* Specular Highlight Arc */}
      <div
        className="absolute top-0.5 left-[15%] right-[15%] h-[35%] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 100%)',
        }}
      />

      {/* SVG Vector Icon */}
      <IconComponent
        size={sizeConfig.iconSize}
        style={{ color: accentColor }}
        className="relative z-10 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};
