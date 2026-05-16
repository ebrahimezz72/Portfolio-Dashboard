import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { message, history, currentPath, language } = await req.json();

    const historyText = Array.isArray(history) 
      ? history.map((h: any) => `${h.role}: ${h.content}`).join('\n')
      : '';

    const prompt = `You are "Artisan Assistant", a helpful and intelligent AI for Ibrahim Ezzeldin's portfolio dashboard.

Current User Location: ${currentPath}
User Language Preference: ${language}

Role:
- Help Ibrahim manage his portfolio.
- Answer questions about the dashboard features (SEO, Projects, Bio, Skills).
- Act as a creative partner for digital artisan work.
- Be friendly, professional, and slightly tech-savvy.

Conversation History:
${historyText}

User: ${message}

Return ONLY raw JSON:
{
  "response": "Your helpful response here",
  "suggested_actions": [
    { "label": "Go to SEO", "link": "/seo-generator" },
    { "label": "Manage Projects", "link": "/projects" }
  ],
  "voice_hint": "Short version for text-to-speech"
}`;

    const chatData = await callGemini(prompt);
    return new Response(JSON.stringify(chatData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('CHAT API ERROR:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
