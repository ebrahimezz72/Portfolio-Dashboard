import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pageType, title, description, audience, language, tone } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const prompt = `You are an expert SEO specialist. Generate complete SEO meta tags for Ibrahim Ezzeldin's portfolio page.

Developer profile:
- Name: Ibrahim Ezzeldin
- Role: Full Stack Developer & Digital Artisan
- Location: Hurghada, Egypt
- Stack: React, Next.js, TypeScript, Tailwind CSS, Supabase
- Website: ibrahimezzeldin.com

Page info:
- Page type: ${pageType}
- Page/Project title: ${title}
- Details/Tech stack: ${description || 'Not provided'}
- Target audience: ${audience}
- Language: ${language}
- Tone: ${tone}

Return ONLY a raw JSON object — no markdown, no backticks, no explanation. Exact keys:
{
  "title": "50-60 chars, include Ibrahim Ezzeldin",
  "description": "150-160 chars max, compelling, keyword-rich",
  "keywords": "8-10 comma-separated keywords",
  "og_title": "engaging Open Graph title",
  "og_description": "engaging OG description under 200 chars",
  "twitter_title": "twitter card title",
  "twitter_description": "twitter card description",
  "slug": "url-friendly-slug",
  "seo_scores": {
    "title_length": 0-100,
    "desc_length": 0-100,
    "keywords_relevance": 0-100,
    "overall": 0-100
  }
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate SEO content' }, { status: response.status });
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;

    // Clean markdown backticks if Gemini includes them despite instructions
    text = text.replace(/```json|```/g, '').trim();

    try {
      const seoData = JSON.parse(text);
      return NextResponse.json(seoData);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
