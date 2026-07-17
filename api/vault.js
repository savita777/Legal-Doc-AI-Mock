// File: api/vault.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
  const { action, email, title, content_html } = req.body;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  if (!SUPA_URL || !SUPA_KEY) return res.status(500).json({ error: 'DB keys missing' });

  try {
    if (action === 'save') {
      // Save the document to Database
      await fetch(`${SUPA_URL}/rest/v1/saved_docs`, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email, title, content_html })
      });
      return res.status(200).json({ success: true });
      
    } else if (action === 'fetch') {
      // Fetch documents from Database
      const response = await fetch(`${SUPA_URL}/rest/v1/saved_docs?email=eq.${encodeURIComponent(email)}&select=*&order=created_at.desc`, {
        headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` }
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

