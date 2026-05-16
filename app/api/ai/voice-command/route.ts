import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { transcript, currentPath, language } = await req.json();

    const prompt = `You are a voice control system for the "Artisan Admin" dashboard of Ibrahim Ezzeldin.

User said: "${transcript}"
Current page: "${currentPath}"
User language: "${language}"

Decide the best action and return ONLY raw JSON:
{
  "action": "navigate | create_project | search | toggle_theme | logout | show_help | unknown",
  "target": "/path or specific action detail",
  "speech_response": "What the AI should say back to the user (short, concise, professional)",
  "confidence": 0.0 to 1.0
}

Routes available:
- /dashboard
- /projects
- /experience
- /certificates
- /messages
- /seo-generator
- /project-generator
- /bio-generator
- /settings

Examples:
- "Go to my projects" -> { "action": "navigate", "target": "/projects", "speech_response": "Opening projects page." }
- "Show me messages" -> { "action": "navigate", "target": "/messages", "speech_response": "Heading to your inbox." }
- "Switch to dark mode" -> { "action": "toggle_theme", "target": "dark", "speech_response": "Switching to dark mode." }`;

    const commandData = await callGemini(prompt);
    return NextResponse.json(commandData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
