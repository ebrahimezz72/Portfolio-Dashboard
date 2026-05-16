import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, language } = await req.json();

    const prompt = `You are an assistant for Ibrahim Ezzeldin's portfolio inbox.

Analyze this contact form message and return ONLY raw JSON:

Message:
- From: ${name} (${email})
- Phone: ${phone || 'Not provided'}
- Message: ${message}

Return:
{
  "category": "job_offer | freelance_project | collaboration | general_inquiry | spam",
  "priority": "high | medium | low",
  "summary": "2-sentence summary of what they want",
  "sentiment": "positive | neutral | negative",
  "key_info": {
    "budget_mentioned": true/false,
    "deadline_mentioned": true/false,
    "company_mentioned": true/false,
    "tech_mentioned": ["tech1", "tech2"]
  },
  "suggested_reply": "A professional reply email in ${language} from Ibrahim Ezzeldin",
  "action_items": ["action 1", "action 2"],
  "response_urgency": "reply within 24h | reply within 3 days | no rush"
}`;

    const analysisData = await callGemini(prompt);
    return NextResponse.json(analysisData);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
