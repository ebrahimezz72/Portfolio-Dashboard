import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { currentSkills, targetRole, language } = await req.json();

    const prompt = `You are a career growth advisor for a Full Stack Developer.

Developer's current skills: ${currentSkills}
Target role: ${targetRole}

Analyze the gap and return ONLY raw JSON:
{
  "gap_score": 0 to 100,
  "missing_skills": ["skill 1", "skill 2"],
  "learning_roadmap": [
    { "phase": "Phase 1", "topic": "Topic Name", "resource_type": "Course/Project" },
    { "phase": "Phase 2", "topic": "Topic Name", "resource_type": "Course/Project" }
  ],
  "suggested_certificates": [
    { "title": "Cert Name", "provider": "Provider", "relevance": "high" }
  ],
  "advice": "1-2 sentences of career advice in ${language}"
}`;

    const analysisData = await callGemini(prompt);
    return NextResponse.json(analysisData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
