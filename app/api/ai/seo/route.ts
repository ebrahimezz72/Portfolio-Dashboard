import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { pageType, title, description, audience, language, tone } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const prompt = `You are an expert SEO specialist for a developer portfolio.

Developer: Ibrahim Ezzeldin, Full Stack Developer & Digital Artisan, Hurghada Egypt, ibrahimezzeldin.com

Page info:
- Type: ${pageType}
- Title: ${title}
- Details: ${description || 'Not provided'}
- Audience: ${audience}
- Language: ${language}
- Tone: ${tone}

Return ONLY raw JSON (no markdown, no backticks):
{
  "title": "50-60 chars including Ibrahim Ezzeldin",
  "description": "150-160 chars, keyword-rich, compelling",
  "keywords": "8-10 comma-separated keywords",
  "og_title": "engaging Open Graph title",
  "og_description": "OG description under 200 chars",
  "twitter_title": "Twitter card title",
  "twitter_description": "Twitter card description",
  "slug": "url-friendly-slug",
  "seo_scores": {
    "title_length": 0-100,
    "desc_length": 0-100,
    "keywords_relevance": 0-100,
    "overall": 0-100
  }
}`;

    const seoData = await callGemini(prompt);
    return NextResponse.json(seoData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
