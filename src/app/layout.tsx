import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileTabBar } from '@/components/MobileTabBar';
import { GlassIcon } from '@/components/GlassIcon';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'منصة اختصارات الآيفون | iOS Shortcuts Hub & Builder',
  description: 'أكبر دليل ومكتبة عربية لاختصارات نظام iOS مع إمكانية التثبيت الفوري بنقرة واحدة، ومولد اختصارات الذكاء الاصطناعي وتطبيقات الويب بدون تسجيل.',
  keywords: ['اختصارات ايفون', 'iOS shortcuts', 'shortcuts hub', 'أتمتة ايفون', 'سيري شورت كت', 'ذكاء اصطناعي'],
  authors: [{ name: 'iOS Shortcuts Hub Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-night-600 selection:text-white pb-20 md:pb-8">
        <Navbar />

        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <footer className="w-full border-t border-night-700/40 bg-night-950/80 backdrop-blur-xl mt-16 py-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 text-center md:text-right">
            <div className="flex items-center gap-3">
              <GlassIcon name="Zap" size="sm" accentColor="#3894E8" className="!w-7 !h-7 !rounded-lg" />
              <span className="font-bold text-white text-sm">
                اختصارات <span className="text-night-500 font-number">iOS</span>
              </span>
              <span>— منصة الأتمتة وصانع الاختصارات العربي</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/" className="hover:text-white transition-colors">
                دليل الاختصارات
              </Link>
              <Link href="/favorites" className="hover:text-white transition-colors">
                المفضلة المحلية
              </Link>
              <Link href="/builder" className="hover:text-white transition-colors">
                منشئ الاختصارات
              </Link>
              <Link href="/admin" className="hover:text-white transition-colors">
                لوحة الإدارة
              </Link>
            </div>

            <p className="font-number text-slate-500">
              © {new Date().getFullYear()} iOS Shortcuts Hub. All rights reserved.
            </p>
          </div>
        </footer>

        {/* Floating Mobile Tab Bar */}
        <MobileTabBar />
      </body>
    </html>
  );
}
