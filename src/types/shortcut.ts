export type ShortcutCategory = 'ai' | 'productivity' | 'media' | 'dev' | 'system';

export interface ShortcutAuthor {
  name: string;
  link?: string;
  avatar?: string;
}

export interface ShortcutItem {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description?: string;
  category: ShortcutCategory;
  icon: string; // Lucide icon identifier (NO emojis)
  icloud_url: string;
  direct_url?: string;
  version: string;
  ios_compatibility: string;
  install_count: number;
  featured?: boolean;
  author: ShortcutAuthor;
  created_at: string;
  tags?: string[];
  requirements?: string[];
  steps?: string[];
  disclaimer?: string;
}

export interface CategoryInfo {
  id: ShortcutCategory;
  name_ar: string;
  name_en: string;
  description: string;
  icon: string;
  accent_color: string;
  glow_color: string;
}

export interface FavoriteItem {
  id: string;
  saved_at: string;
}

export interface FavoriteBackup {
  version: string;
  exported_at: string;
  favorites: string[];
}

export interface CustomShortcutBuilderState {
  title: string;
  category: string;
  description: string;
  type: 'ai' | 'messaging' | 'webapp';
  // Messaging fields
  platform?: 'whatsapp' | 'telegram';
  phone_number?: string;
  message_template?: string;
  // Web App fields
  web_url?: string;
  open_in_safari?: boolean;
  // AI fields
  ai_prompt?: string;
  ai_model?: string;
  trigger_mode?: 'share_sheet' | 'clipboard' | 'manual_prompt';
}

export interface AIActionSchema {
  actionId: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface GeneratedShortcutResponse {
  success: boolean;
  shortcutName: string;
  xmlPlist: string;
  fileName: string;
  summary: string;
  actionsCount: number;
  error?: string;
  isFallback?: boolean;
}
