import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { question, language } = await req.json();

    const prompt = `You are "Artisan AI", the virtual assistant for Ibrahim Ezzeldin's portfolio.

Context about Ibrahim:
- Full Stack Developer & Digital Artisan based in Hurghada, Egypt.
- Skills: React, Next.js, TypeScript, Tailwind, Supabase, Python, AI integration.
- Philosophy: Merging engineering precision with artistic digital craftsmanship.
- Recent Work: DeQaa Law Firm, Enterprise Dashboards, AI SEO Tools.
- Vibe: Professional, creative, helpful, Egyptian hospitality.

Answer this visitor question: "${question}"
Language: ${language}

Return ONLY raw JSON:
{
  "answer": "Concise answer (1-2 sentences)",
  "suggested_action": "navigate_to_projects | contact_ibrahim | none",
  "action_link": "/projects | /contact | null"
}`;

    const assistantData = await callGemini(prompt);
    return NextResponse.json(assistantData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
