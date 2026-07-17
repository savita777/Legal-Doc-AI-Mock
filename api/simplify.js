// File: api/simplify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
  const { text } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  try {
    // 1. Gemini API Call
    const prompt = `Act as an expert lawyer. Summarize the following complex legal document into 3-4 simple bullet points. Document: ${text}`;
    
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    // DEBUG: Agar Google se error aaya toh log dikhega
    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const aiSummary = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiSummary) throw new Error("AI response was empty");

    // 2. Supabase Save - Using 'document' table as you specified
    await fetch(`${SUPA_URL}/rest/v1/document`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ 
        email: "guest@clarum.ai", 
        title: text.substring(0, 20) + "...", 
        content_html: aiSummary 
      })
    });

    res.status(200).json({ summary: aiSummary });

  } catch (error) {
    console.error("Simplify API Crash:", error); // Yeh Vercel logs mein dikhega
    res.status(500).json({ error: error.message });
  }
}
