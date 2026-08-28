'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GlassIcon } from './GlassIcon';
import {
  buildWhatsAppDirectShortcut,
  buildTelegramDirectShortcut,
  buildWebAppLauncherShortcut,
  downloadShortcutFile,
} from '@/lib/plist-builder';

interface ShortcutBuilderViewProps {
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShortcutBuilderView: React.FC<ShortcutBuilderViewProps> = ({ onToast }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'messaging' | 'webapp'>('ai');

  // AI Generator States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    shortcutName: string;
    xmlPlist: string;
    summary: string;
    actionsCount: number;
    isFallback?: boolean;
  } | null>(null);

  // Messaging States
  const [platform, setPlatform] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [phoneOrUser, setPhoneOrUser] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');

  // Web App States
  const [webTitle, setWebTitle] = useState('');
  const [webUrl, setWebUrl] = useState('');

  // Quick Prompt Examples
  const promptExamples = [
    { title: 'تلخيص النصوص', prompt: 'اختصار لقراءة النص المحدد وتلخيصه بنقاط وعرض النتيجة بإشعار' },
    { title: 'ترجمة سريعة', prompt: 'اختصار لأخذ النص المنسوخ في الحافظة وترجمته إلى العربية فورياً' },
    { title: 'توفير فائق للطاقة', prompt: 'اختصار لتفعيل نمط البطارية المنخفض وخفض السطوع وإيقاف البلوتوث' },
    { title: 'بحث سريع في جوجل', prompt: 'اختصار للبحث المباشر في محرك بحث جوجل عن أي كلمة منسوخة' },
  ];

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      onToast('يرجى كتابة فكرة أو وصف للاختصار المطلوب.', 'info');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      let data: any = null;
      try {
        const res = await fetch('/api/generate-ai-shortcut', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: aiPrompt,
            title: aiTitle,
          }),
        });

        if (res.ok) {
          data = await res.json();
        }
      } catch (networkErr) {
        // Fallback to client-side deterministic engine if static
      }

      if (!data || !data.success) {
        // Run client-side deterministic RAG engine
        const { generateDeterministicShortcut } = await import('@/lib/shortcuts-knowledge');
        const generated = generateDeterministicShortcut(aiPrompt, aiTitle);
        data = {
          success: true,
          shortcutName: generated.shortcutName,
          xmlPlist: generated.xmlPlist,
          fileName: `${generated.shortcutName.replace(/[/\\?%*:|"<>]/g, '-')}.shortcut`,
          summary: generated.summary,
          actionsCount: generated.actionsCount,
          isFallback: true,
        };
      }

      setGeneratedResult(data);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onToast('تم توليد الاختصار بنجاح!');
    } catch (err: any) {
      onToast(err?.message || 'حدث خطأ أثناء الاتصال بالخادم', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAI = () => {
    if (!generatedResult) return;
    downloadShortcutFile(generatedResult.shortcutName, generatedResult.xmlPlist);
    onToast(`تم تنزيل ملف "${generatedResult.shortcutName}.shortcut" بنجاح!`);
  };

  const handleGenerateMessaging = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrUser.trim()) {
      onToast('يرجى إدخال رقم الهاتف أو اسم المستخدم.', 'info');
      return;
    }

    let xml = '';
    const cleanName = platform === 'whatsapp' ? `WhatsApp Direct` : `Telegram Direct`;

    if (platform === 'whatsapp') {
      xml = buildWhatsAppDirectShortcut(phoneOrUser, messageTemplate);
    } else {
      xml = buildTelegramDirectShortcut(phoneOrUser, messageTemplate);
    }

    downloadShortcutFile(cleanName, xml);
    confetti({ particleCount: 50, spread: 60 });
    onToast(`تم توليد وتنزيل اختصار ${platform === 'whatsapp' ? 'واتساب' : 'تليجرام'} بنجاح!`);
  };

  const handleGenerateWebApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webUrl.trim()) {
      onToast('يرجى إدخال رابط الموقع (URL).', 'info');
      return;
    }

    const title = webTitle.trim() || 'Web App Launcher';
    const xml = buildWebAppLauncherShortcut(title, webUrl);
    downloadShortcutFile(title, xml);
    confetti({ particleCount: 50, spread: 60 });
    onToast(`تم توليد وتنزيل اختصار تطبيق الويب "${title}" بنجاح!`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-capsule mb-4 border border-night-500/30">
          <GlassIcon name="Wand2" size="sm" accentColor="#3894E8" className="!w-5 !h-5 !rounded-full" />
          <span className="text-xs sm:text-sm font-semibold text-slate-200">
            مولّد ومحرر اختصارات <span className="text-night-400 font-number">.shortcut</span>
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          أنشئ اختصارك المخصص في ثوانٍ
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          اختر الأداة المناسبة لتوليد ملف اختصار آبل حقيقي جاهز للعمل على هاتفك أو جهاز Mac مباشرة.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl liquid-glass max-w-lg mx-auto mb-8 border border-night-600/30">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex-1 justify-center ${
            activeTab === 'ai'
              ? 'liquid-btn-primary text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GlassIcon name="Sparkles" size="sm" accentColor={activeTab === 'ai' ? '#FFFFFF' : '#94A3B8'} className="!w-5 !h-5 !rounded" />
          <span>مولد الذكاء الاصطناعي</span>
        </button>

        <button
          onClick={() => setActiveTab('messaging')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex-1 justify-center ${
            activeTab === 'messaging'
              ? 'liquid-btn-primary text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GlassIcon name="MessageSquare" size="sm" accentColor={activeTab === 'messaging' ? '#FFFFFF' : '#94A3B8'} className="!w-5 !h-5 !rounded" />
          <span>المراسلة السريعة</span>
        </button>

        <button
          onClick={() => setActiveTab('webapp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex-1 justify-center ${
            activeTab === 'webapp'
              ? 'liquid-btn-primary text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GlassIcon name="Globe" size="sm" accentColor={activeTab === 'webapp' ? '#FFFFFF' : '#94A3B8'} className="!w-5 !h-5 !rounded" />
          <span>مشغل تطبيقات الويب</span>
        </button>
      </div>

      {/* Tab 1: AI Generator */}
      {activeTab === 'ai' && (
        <div className="p-6 md:p-8 rounded-3xl liquid-glass border border-night-500/40 shadow-2xl">
          <form onSubmit={handleGenerateAI} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                اسم الاختصار (اختياري)
              </label>
              <input
                type="text"
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                placeholder="مثال: المساعد المالي السريع"
                className="w-full px-4 py-3 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-night-400 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-200">
                  صف ما تريده من الاختصار بدقة
                </label>
                <span className="text-xs text-night-400 font-medium">مدعوم بقاعدة معرفة iOS RAG</span>
              </div>
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="مثال: أريد اختصاراً يقرأ النص المنسوخ ويقوم بتلخيصه وإرسال تنبيه صوتي..."
                className="w-full px-4 py-3 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-night-400 transition-colors resize-none"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">أفكار سريعة:</span>
              <div className="flex flex-wrap gap-2">
                {promptExamples.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAiPrompt(item.prompt);
                      setAiTitle(item.title);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg liquid-btn-secondary text-slate-300 hover:text-white border border-night-600/40 transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-bold text-white liquid-btn-primary disabled:opacity-50 shadow-xl"
            >
              <GlassIcon
                name={isGenerating ? 'Loader2' : 'Sparkles'}
                size="sm"
                accentColor="#FFFFFF"
                className={`!w-5 !h-5 !rounded ${isGenerating ? 'animate-spin' : ''}`}
              />
              <span>{isGenerating ? 'جاري بناء وتحليل الاختصار...' : 'توليد ملف الاختصار .shortcut'}</span>
            </button>
          </form>

          {/* Generated Result Output */}
          {generatedResult && (
            <div className="mt-8 p-6 rounded-2xl bg-night-900/80 border border-night-500/50 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GlassIcon name="CheckCircle2" size="md" accentColor="#10B981" />
                  <div>
                    <h3 className="text-base font-bold text-white">{generatedResult.shortcutName}</h3>
                    <p className="text-xs text-slate-400">{generatedResult.summary}</p>
                  </div>
                </div>
                <span className="font-number text-xs px-2.5 py-1 rounded-md bg-night-800 text-night-300 border border-night-700">
                  {generatedResult.actionsCount} إجراءات (Actions)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-night-950/80 text-xs font-mono text-slate-400 max-h-32 overflow-y-auto border border-night-800 dir-ltr text-left">
                {generatedResult.xmlPlist.substring(0, 400)}...
              </div>

              <button
                onClick={handleDownloadAI}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white liquid-btn-primary shadow-lg"
              >
                <GlassIcon name="Download" size="sm" accentColor="#FFFFFF" className="!w-4 !h-4 !rounded" />
                <span>تنزيل الملف المولد (.shortcut)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Messaging Generator */}
      {activeTab === 'messaging' && (
        <div className="p-6 md:p-8 rounded-3xl liquid-glass border border-night-500/40 shadow-2xl">
          <form onSubmit={handleGenerateMessaging} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                اختر تطبيق المراسلة
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform('whatsapp')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                    platform === 'whatsapp'
                      ? 'border-accent-emerald bg-accent-emerald/20 text-white shadow-lg'
                      : 'border-night-700 bg-night-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <GlassIcon name="MessageCircle" size="sm" accentColor="#10B981" />
                  <span>واتساب (WhatsApp)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('telegram')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                    platform === 'telegram'
                      ? 'border-night-400 bg-night-600/30 text-white shadow-lg'
                      : 'border-night-700 bg-night-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <GlassIcon name="Send" size="sm" accentColor="#3894E8" />
                  <span>تليجرام (Telegram)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                {platform === 'whatsapp' ? 'رقم الهاتف مع رمز الدولة (مثال: 966500000000)' : 'اسم المستخدم أو المعرف (مثال: username)'}
              </label>
              <input
                type="text"
                value={phoneOrUser}
                onChange={(e) => setPhoneOrUser(e.target.value)}
                placeholder={platform === 'whatsapp' ? '966500000000' : 'telegram_user'}
                className="w-full px-4 py-3 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-night-400 transition-colors dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                قالب الرسالة الافتراضية (اختياري)
              </label>
              <textarea
                rows={3}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="مرحباً، أود الاستفسار بخصوص..."
                className="w-full px-4 py-3 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-night-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-bold text-white liquid-btn-primary shadow-xl"
            >
              <GlassIcon name="Download" size="sm" accentColor="#FFFFFF" className="!w-5 !h-5 !rounded" />
              <span>توليد وتنزيل اختصار المراسلة (.shortcut)</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Web App Launcher */}
      {activeTab === 'webapp' && (
        <div className="p-6 md:p-8 rounded-3xl liquid-glass border border-night-500/40 shadow-2xl">
          <form onSubmit={handleGenerateWebApp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                اسم تطبيق الويب
              </label>
              <input
                type="text"
                value={webTitle}
                onChange={(e) => setWebTitle(e.target.value)}
                placeholder="مثال: بوابة الخدمات الإلكترونية"
                className="w-full px-4 py-3 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-night-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                رابط الموقع (URL)
              </label>
              <input
                type="url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-night-900/60 border border-night-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-night-400 transition-colors dir-ltr text-right"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-bold text-white liquid-btn-primary shadow-xl"
            >
              <GlassIcon name="Download" size="sm" accentColor="#FFFFFF" className="!w-5 !h-5 !rounded" />
              <span>توليد وتنزيل اختصار مشغل الويب (.shortcut)</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
