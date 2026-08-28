'use client';

import React, { useState } from 'react';
import { ShortcutItem, ShortcutCategory } from '@/types/shortcut';
import { INITIAL_SHORTCUTS, CATEGORIES } from '@/data/initial-shortcuts';
import { GlassIcon } from './GlassIcon';

interface AdminViewProps {
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onToast }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(INITIAL_SHORTCUTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    category: 'ai' as ShortcutCategory,
    icon: 'Sparkles',
    icloud_url: '',
    version: '1.0.0',
    ios_compatibility: 'iOS 16, 17, 18+',
    featured: false,
    authorName: 'المشرف',
  });

  const filteredShortcuts = shortcuts.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalInstalls = shortcuts.reduce((acc, curr) => acc + curr.install_count, 0);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      short_description: '',
      category: 'ai',
      icon: 'Sparkles',
      icloud_url: '',
      version: '1.0.0',
      ios_compatibility: 'iOS 16, 17, 18+',
      featured: false,
      authorName: 'المشرف',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ShortcutItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      short_description: item.short_description,
      category: item.category,
      icon: item.icon,
      icloud_url: item.icloud_url,
      version: item.version,
      ios_compatibility: item.ios_compatibility,
      featured: !!item.featured,
      authorName: item.author.name,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختصار من القائمة؟')) {
      setShortcuts((prev) => prev.filter((s) => s.id !== id));
      onToast('تم حذف الاختصار بنجاح.');
    }
  };

  const handleToggleFeatured = (id: string) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s))
    );
    onToast('تم تحديث حالة التمييز (Featured).');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.icloud_url) {
      onToast('يرجى ملء الحقول الإجبارية (الاسم ورابط التثبيت).', 'error');
      return;
    }

    if (editingId) {
      setShortcuts((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                title: formData.title,
                short_description: formData.short_description,
                category: formData.category,
                icon: formData.icon,
                icloud_url: formData.icloud_url,
                version: formData.version,
                ios_compatibility: formData.ios_compatibility,
                featured: formData.featured,
                author: { name: formData.authorName },
              }
            : s
        )
      );
      onToast('تم تحديث الاختصار بنجاح!');
    } else {
      const newSlug = formData.title.toLowerCase().replace(/\s+/g, '-');
      const newShortcut: ShortcutItem = {
        id: `custom-${Date.now()}`,
        title: formData.title,
        slug: newSlug,
        short_description: formData.short_description,
        category: formData.category,
        icon: formData.icon,
        icloud_url: formData.icloud_url,
        version: formData.version,
        ios_compatibility: formData.ios_compatibility,
        install_count: 1,
        featured: formData.featured,
        author: { name: formData.authorName },
        created_at: new Date().toISOString(),
      };
      setShortcuts((prev) => [newShortcut, ...prev]);
      onToast('تمت إضافة الاختصار الجديد بنجاح!');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl liquid-glass border border-night-500/30 mb-8 shadow-xl">
        <div className="flex items-center gap-4">
          <GlassIcon name="ShieldCheck" size="lg" accentColor="#3894E8" glowColor="rgba(56, 148, 232, 0.4)" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">لوحة إدارة المحتوى (Admin CMS)</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              إدارة الاختصارات، تعديل الروابط، وإضافة عناصر جديدة إلى المنصة.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 py-2.5 px-5 rounded-2xl text-sm font-bold text-white liquid-btn-primary shadow-lg self-start md:self-auto"
        >
          <GlassIcon name="Plus" size="sm" accentColor="#FFFFFF" className="!w-5 !h-5 !rounded-md" />
          <span>إضافة اختصار جديد</span>
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl liquid-glass border border-night-600/30">
          <span className="text-xs text-slate-400 font-medium block mb-1">إجمالي الاختصارات</span>
          <span className="font-number text-2xl font-bold text-white">{shortcuts.length}</span>
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-night-600/30">
          <span className="text-xs text-slate-400 font-medium block mb-1">إجمالي التثبيتات</span>
          <span className="font-number text-2xl font-bold text-accent-emerald">{totalInstalls.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-night-600/30">
          <span className="text-xs text-slate-400 font-medium block mb-1">المميزة (Featured)</span>
          <span className="font-number text-2xl font-bold text-accent-amber">{shortcuts.filter(s => s.featured).length}</span>
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-night-600/30">
          <span className="text-xs text-slate-400 font-medium block mb-1">الفئات النشطة</span>
          <span className="font-number text-2xl font-bold text-night-400">5 فئات</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl liquid-glass border border-night-600/30 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في لوحة التحكم..."
          className="w-full sm:w-72 px-4 py-2 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-night-400"
        />

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              selectedCategory === 'all' ? 'bg-night-600 text-white' : 'bg-night-800/80 text-slate-300'
            }`}
          >
            الكل
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                selectedCategory === c.id ? 'bg-night-600 text-white' : 'bg-night-800/80 text-slate-300'
              }`}
            >
              {c.name_ar}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto rounded-3xl liquid-glass border border-night-600/30 shadow-2xl">
        <table className="w-full text-right text-xs sm:text-sm text-slate-300">
          <thead className="bg-night-900/80 text-slate-400 text-xs uppercase border-b border-night-700">
            <tr>
              <th className="py-4 px-4">الاختصار</th>
              <th className="py-4 px-4">الفئة</th>
              <th className="py-4 px-4">التوافق</th>
              <th className="py-4 px-4">التثبيتات</th>
              <th className="py-4 px-4">مميز</th>
              <th className="py-4 px-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-night-800/60">
            {filteredShortcuts.map((item) => {
              const cat = CATEGORIES.find((c) => c.id === item.category);
              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-3">
                    <GlassIcon name={item.icon} size="sm" accentColor={cat?.accent_color || '#3894E8'} />
                    <div>
                      <div className="line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-slate-400 font-normal line-clamp-1">{item.short_description}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-night-800 border border-night-700 text-slate-300">
                      {cat?.name_ar}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-number text-xs text-night-300">
                    {item.ios_compatibility}
                  </td>
                  <td className="py-3.5 px-4 font-number font-bold text-slate-200">
                    {item.install_count.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        item.featured
                          ? 'border-accent-amber/60 bg-accent-amber/20 text-accent-amber'
                          : 'border-night-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <GlassIcon name="Star" size="sm" accentColor={item.featured ? '#F59E0B' : '#64748B'} className="!w-4 !h-4 !rounded" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg liquid-btn-secondary text-slate-200 hover:text-white"
                        title="تعديل"
                      >
                        <GlassIcon name="Edit" size="sm" accentColor="#60A9F6" className="!w-4 !h-4 !rounded" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-accent-rose/10 hover:bg-accent-rose/20 border border-accent-rose/30 text-accent-rose"
                        title="حذف"
                      >
                        <GlassIcon name="Trash2" size="sm" accentColor="#E11D48" className="!w-4 !h-4 !rounded" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl p-6 rounded-3xl liquid-glass border border-night-500/40 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-xl liquid-capsule text-slate-400 hover:text-white"
            >
              <GlassIcon name="X" size="sm" accentColor="#CBD5E1" className="!w-5 !h-5 !rounded" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'تعديل الاختصار' : 'إضافة اختصار جديد'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-200 mb-1">اسم الاختصار *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 focus:outline-none focus:border-night-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 focus:outline-none focus:border-night-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">الفئة</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ShortcutCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white focus:outline-none focus:border-night-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">أيقونة SVG (اسم الأيقونة)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Sparkles, Zap, Film, ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 focus:outline-none focus:border-night-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">رابط iCloud للتثبيت *</label>
                <input
                  type="url"
                  required
                  value={formData.icloud_url}
                  onChange={(e) => setFormData({ ...formData, icloud_url: e.target.value })}
                  placeholder="https://www.icloud.com/shortcuts/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 focus:outline-none focus:border-night-400 dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">توافق نظام iOS</label>
                  <input
                    type="text"
                    value={formData.ios_compatibility}
                    onChange={(e) => setFormData({ ...formData, ios_compatibility: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white focus:outline-none focus:border-night-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">اسم المطور / الناشر</label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-night-900/60 border border-night-700 text-white focus:outline-none focus:border-night-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-night-900 border-night-700 text-night-600 focus:ring-0"
                />
                <label htmlFor="featured-check" className="font-bold text-slate-200">
                  تمييز هذا الاختصار في الصفحة الرئيسية (Featured)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white liquid-btn-primary shadow-lg"
                >
                  {editingId ? 'حفظ التعديلات' : 'إضافة الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
