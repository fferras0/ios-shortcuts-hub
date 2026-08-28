# منصة اختصارات الآيفون | iOS Shortcuts Hub & Builder 🚀

منصة ويب عصرية وتفاعلية تجمع وتنظم أشهر وأقوى اختصارات نظام iOS باللغة العربية، مع إمكانية التثبيت الفوري بنقرة واحدة وتوليد اختصارات مخصصة بصيغة `.shortcut` مباشرة من المتصفح بدون الحاجة لإنشاء حساب.

---

## 🌟 الميزات الرئيسية (Key Features)

- ⚡ **دليل وتصنيفات الاختصارات:** أكثر من 35+ اختصاراً جاهزاً وموثقاً عبر 5 فئات (الذكاء الاصطناعي، الإنتاجية، الوسائط، المطورين، النظام والبطارية).
- 🔗 **تثبيت مباشر ورمز QR:** تثبيت بنقرة واحدة عبر بروتوكول `shortcuts://` ومسح الـ QR Code مباشرة من كاميرا الهاتف.
- ❤️ **المفضلة المحلية (Local Storage):** حفظ واستعراض الاختصارات المفضلة بدون تسجيل دخول، مع دعم التصدير والاستيراد لملفات JSON.
- 🛠️ **منشئ الاختصارات (3-in-1 Online Builder):**
  - **مولد الذكاء الاصطناعي (AI Prompt Assistant):** توليد ملفات `.shortcut` حقيقية بالاعتماد على قواعد Apple Actions RAG ومسار احتياطي موثوق.
  - **صانع اختصار المراسلة السريعة:** إرسال رسائل WhatsApp و Telegram بدون حفظ جهات الاتصال.
  - **مشغل تطبيقات الويب (Web App Launcher):** تحويل المواقع إلى اختصارات وتطبيقات ويب سريعة.
- 🛡️ **لوحة تحكم المشرف (Admin CMS):** إدارة المحتوى، الإحصائيات، والتحكم في إبراز الاختصارات المميزة.
- 💎 **نظام التصميم Liquid Glass:** تصميم زجاجي سائل ثلاثي الأبعاد مع طبقات ضوئية وانعكاسات متوهجة بدون أي إيموجي (SVG Icons حصراً).

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend Framework:** Next.js 14 (App Router) + React 18
- **Styling:** Tailwind CSS + Custom Liquid Glass Design Layer
- **Icons & Animation:** Lucide React (SVG Only) + Framer Motion + Canvas Confetti
- **QR Code:** Qrcode.react
- **Shortcuts Engine:** Apple Plist XML Engine (`application/x-apple-aspen-shortcut`)
- **Typography:** Tajawal (العربية) + Plus Jakarta Sans (الأرقام والإنجليزية)

---

## 🚀 التشغيل المحلي (Getting Started)

1. **تثبيت الحزم:**
```bash
npm install
```

2. **تشغيل خادم التطوير:**
```bash
npm run dev
```

3. **فتح الموقع في المتصفح:**
```
http://localhost:3000
```

---

## 📄 الترخيص (License)
MIT License.
