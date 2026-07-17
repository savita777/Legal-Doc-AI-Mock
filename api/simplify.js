// File: api/simplify.js
// Vercel Serverless Function - Hidden Backend (Keys yahan 100% safe hain!)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
  const { text } = req.body;
  
  // Vercel Environment Variables se keys utha rahe hain
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  try {
    // 1. Gemini API Call
    const prompt = `Act as an expert lawyer. Summarize the following complex legal document into 3-4 very simple, easy-to-understand bullet points for a layman. Avoid heavy jargon. Document: ${text}`;
    
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const geminiData = await geminiRes.json();
    const aiSummary = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiSummary) throw new Error("AI failed to generate summary");

    // 2. Supabase Save (REST API - No client needed in frontend)
    await fetch(`${SUPA_URL}/rest/v1/documents`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ original_text: text, summary: aiSummary })
    });

    // 3. Send Success back to Frontend
    res.status(200).json({ summary: aiSummary });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

