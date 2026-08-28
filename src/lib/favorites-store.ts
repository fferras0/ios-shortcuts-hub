'use client';

import { FavoriteBackup } from '@/types/shortcut';

const STORAGE_KEY = 'ios_shortcuts_favorites_v1';
const LISTENERS: Array<() => void> = [];

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load favorites from localStorage', e);
    return [];
  }
}

export function isFavorite(id: string): boolean {
  const favs = getFavorites();
  return favs.includes(id);
}

export function toggleFavorite(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favs = getFavorites();
    let newFavs: string[];
    let isNowFav = false;

    if (favs.includes(id)) {
      newFavs = favs.filter(item => item !== id);
      isNowFav = false;
    } else {
      newFavs = [id, ...favs];
      isNowFav = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    notifyListeners();
    return isNowFav;
  } catch (e) {
    console.error('Failed to update favorites', e);
    return false;
  }
}

export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners();
}

export function exportFavoritesBackup(): void {
  const favs = getFavorites();
  const backup: FavoriteBackup = {
    version: '1.0.0',
    exported_at: new Date().toISOString(),
    favorites: favs
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shortcuts-favorites-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFavoritesBackup(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.favorites)) {
      return { success: false, count: 0, error: 'الملف غير صالح أو لا يحتوي على بنية النسخة الاحتياطية المطلوبة.' };
    }

    const current = getFavorites();
    const merged = Array.from(new Set([...data.favorites, ...current]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    notifyListeners();
    return { success: true, count: merged.length };
  } catch (e: any) {
    return { success: false, count: 0, error: e?.message || 'فشل في قراءة ملف JSON' };
  }
}

export function subscribeFavorites(callback: () => void): () => void {
  LISTENERS.push(callback);
  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx > -1) LISTENERS.splice(idx, 1);
  };
}

function notifyListeners() {
  LISTENERS.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error(e);
    }
  });
}
