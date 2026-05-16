import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { documentType, tone, language, yearsExp, skills, achievement, targetRole, context } = await req.json();

    const prompt = `You are a professional personal branding copywriter.

Developer profile:
- Name: Ibrahim Ezzeldin
- Role: Full Stack Developer & Digital Artisan
- Location: Hurghada, Egypt
- Experience: ${yearsExp} years
- Top Skills: ${skills}
- Recent Projects: DeQaa Law Firm (Next.js 16 + Supabase), AI Chat App (Python + FastAPI), Analytics Dashboard (React + D3)
- Certificates: Claude 101 (Anthropic), Front-End Professional Track (Blue Camp 2026), React JS (Mahara-Tech/ITI 2026)
- Latest Achievement: ${achievement}
- Target Role: ${targetRole}
- Extra context: ${context || 'None'}

Generate a ${documentType} in ${tone} tone, written in ${language}.

Return ONLY raw JSON:
{
  "bio": "the full generated bio/summary text",
  "char_count": number,
  "headline": "short punchy headline (for LinkedIn or CV header)",
  "tagline": "one-liner brand tagline",
  "improvement_tips": ["tip 1", "tip 2", "tip 3"]
}`;

    const bioData = await callGemini(prompt);
    return NextResponse.json(bioData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
