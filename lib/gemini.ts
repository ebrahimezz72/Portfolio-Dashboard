// lib/gemini.ts
export async function callGemini(prompt: string): Promise<any> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  console.log(`Calling Gemini 2.0 Flash...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API HTTP ${response.status}:`, errorText);
    throw new Error(`AI Service Error (${response.status}): ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  
  if (!text) {
    console.error('Empty response from Gemini:', data);
    throw new Error('AI returned an empty response');
  }

  // Clean markdown backticks and handle potential parsing errors
  const clean = text.replace(/```json|```/g, "").trim();
  
  try {
    return JSON.parse(clean);
  } catch (parseError) {
    console.error('JSON Parse Error. Raw text:', text);
    return { 
      response: text.length > 500 ? text.substring(0, 500) + "..." : text,
      error: "JSON_PARSE_FAILED" 
    };
  }
}
