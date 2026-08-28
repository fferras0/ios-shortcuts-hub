import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { generateDeterministicShortcut } from '@/lib/shortcuts-knowledge';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `تم تجاوز حد الاستخدام المجاني. يرجى المحاولة بعد ${rateCheck.resetInMinutes} دقيقة.`,
          success: false
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt, title, triggerMode } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'يرجى كتابة وصف للاختصار المطلوب توليده.', success: false },
        { status: 400 }
      );
    }

    const cleanPrompt = prompt.trim();
    const cleanTitle = (title && typeof title === 'string' && title.trim().length > 0)
      ? title.trim()
      : (cleanPrompt.length > 30 ? cleanPrompt.substring(0, 30) + '...' : cleanPrompt);

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    // If no external API key is configured or fallback requested, use high-reliability deterministic generator
    if (!apiKey) {
      const generated = generateDeterministicShortcut(cleanPrompt, cleanTitle);
      return NextResponse.json({
        success: true,
        shortcutName: generated.shortcutName,
        xmlPlist: generated.xmlPlist,
        fileName: `${generated.shortcutName.replace(/[/\\?%*:|"<>]/g, '-')}.shortcut`,
        summary: generated.summary,
        actionsCount: generated.actionsCount,
        isFallback: true
      });
    }

    // Optional external AI model generation route if key is present
    try {
      // If Gemini Key
      if (process.env.GEMINI_API_KEY) {
        const systemPrompt = `You are an expert iOS Shortcuts engineer. Generate a high quality description and confirm the action chain for an Apple Shortcuts Plist for prompt: "${cleanPrompt}". Return a concise summary in Arabic.`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const deterministic = generateDeterministicShortcut(cleanPrompt, cleanTitle);
          return NextResponse.json({
            success: true,
            shortcutName: deterministic.shortcutName,
            xmlPlist: deterministic.xmlPlist,
            fileName: `${deterministic.shortcutName.replace(/[/\\?%*:|"<>]/g, '-')}.shortcut`,
            summary: aiText.substring(0, 150) || deterministic.summary,
            actionsCount: deterministic.actionsCount,
            isFallback: false
          });
        }
      }
    } catch (e) {
      console.warn('AI call error, reverting to deterministic generator', e);
    }

    // Default fallback
    const generated = generateDeterministicShortcut(cleanPrompt, cleanTitle);
    return NextResponse.json({
      success: true,
      shortcutName: generated.shortcutName,
      xmlPlist: generated.xmlPlist,
      fileName: `${generated.shortcutName.replace(/[/\\?%*:|"<>]/g, '-')}.shortcut`,
      summary: generated.summary,
      actionsCount: generated.actionsCount,
      isFallback: true
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'حدث خطأ أثناء توليد الاختصار', success: false },
      { status: 500 }
    );
  }
}
