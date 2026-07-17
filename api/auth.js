// File: api/auth.js
// Secure Serverless Auth - NO KEYS EXPOSED IN CODE

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
  const { action, email, password } = req.body;
  
  // Vercel Environment Variables (Safe & Hidden)
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  if (!SUPA_URL || !SUPA_KEY) {
    return res.status(500).json({ error: 'Server database keys missing' });
  }

  try {
    let endpoint = '';
    
    // Supabase Auth REST API Endpoints
    if (action === 'signup') {
      endpoint = `${SUPA_URL}/auth/v1/signup`;
    } else if (action === 'login') {
      endpoint = `${SUPA_URL}/auth/v1/token?grant_type=password`;
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Direct fetch to Supabase Database
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || data.msg || 'Authentication failed');
    }

    res.status(200).json({ 
      success: true, 
      message: action === 'signup' ? 'Account created successfully!' : 'Logged in securely!' 
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

