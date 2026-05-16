import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { senderName, originalMessage, tone, language } = await req.json();

    const prompt = `You are Ibrahim Ezzeldin, a Full Stack Developer & Digital Artisan from Hurghada, Egypt.

Write a professional reply to this message:
- From: ${senderName}
- Their message: ${originalMessage}
- Reply tone: ${tone}
- Language: ${language}

Return ONLY raw JSON:
{
  "subject": "email subject line",
  "greeting": "personalized greeting",
  "body": "full reply body — professional, warm, specific to their message",
  "closing": "closing line + signature",
  "full_email": "complete formatted email ready to send"
}`;

    const replyData = await callGemini(prompt);
    return NextResponse.json(replyData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
