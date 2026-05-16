import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { projectName, techStack, projectType, audience, notes, language, style } = await req.json();

    if (!projectName) {
      return NextResponse.json({ error: 'Project Name is required' }, { status: 400 });
    }

    const prompt = `You are a professional copywriter specializing in developer portfolios.

Developer: Ibrahim Ezzeldin, Full Stack Developer & Digital Artisan, Hurghada Egypt.
Writing style reference: "A production-ready law firm website built with Next.js 16 App Router, React 19, TypeScript, and Supabase. Features dynamic pages for lawyers, legal specializations, a blog system, and a public consultation request form — with full SEO setup including metadata, sitemap, Open Graph, and JSON-LD structured data."

Generate a project description for:
- Project name: ${projectName}
- Tech stack: ${techStack}
- Project type: ${projectType}
- Notes: ${notes || 'None'}
- Language: ${language}
- Style: ${style}

Return ONLY raw JSON:
{
  "short_description": "1 sentence, max 100 chars — for cards/previews",
  "full_description": "2-3 sentences, professional, highlights features and tech — for project page",
  "highlight_points": ["point 1", "point 2", "point 3"],
  "suggested_tags": ["tag1", "tag2", "tag3", "tag4"],
  "case_study_intro": "First paragraph of a case study — 3-4 sentences"
}`;

    const projectData = await callGemini(prompt);
    return NextResponse.json(projectData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
