export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { action, email, password } = req.body;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  if (!SUPA_URL || !SUPA_KEY) {
    return res.status(500).json({ error: "System Error: Missing Database Keys" });
  }

  try {
    let endpoint = '';
    
    // Supabase Auth Endpoints
    if (action === 'signup') {
      endpoint = `${SUPA_URL}/auth/v1/signup`;
    } else if (action === 'login') {
      endpoint = `${SUPA_URL}/auth/v1/token?grant_type=password`;
    } else {
      throw new Error("Invalid Action");
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // Agar Supabase ne error diya (jaise: Invalid login credentials, ya User already registered)
    if (!response.ok) {
      // Supabase alag-alag field mein error bhejta hai, hum best wala uthayenge
      const errorMessage = data.error_description || data.msg || data.message || "Authentication Failed";
      throw new Error(errorMessage);
    }

    // Success!
    res.status(200).json({ success: true, user: data.user });

  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(400).json({ error: error.message });
  }
}
