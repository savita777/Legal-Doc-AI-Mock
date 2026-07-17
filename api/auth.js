// File: api/auth.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { action, email, password } = req.body;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  if (!SUPA_URL || !SUPA_KEY) {
    return res.status(500).json({ error: "System Error: Missing Database Keys" });
  }

  // 1. Backend Strict Validation (Koi fake request na bhej paye)
  if (!email || !email.includes('@') || !email.includes('.') || password.length < 6) {
    return res.status(400).json({ error: "Invalid email format or password too short." });
  }

  try {
    let endpoint = '';
    
    // 2. Route based on Login or Signup
    if (action === 'signup') {
      endpoint = `${SUPA_URL}/auth/v1/signup`;
    } else if (action === 'login') {
      // Supabase ka strict login check
      endpoint = `${SUPA_URL}/auth/v1/token?grant_type=password`;
    } else {
      return res.status(400).json({ error: "Invalid action." });
    }

    // 3. Asking Supabase to verify
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // 4. Agar Supabase ne entry DENY kar di
    if (!response.ok) {
      const errorMsg = data.error_description || data.msg || data.message || "Authentication Failed";
      
      // Production level custom error messages
      if (errorMsg.includes("Invalid login credentials")) {
         throw new Error("Account not found or wrong password. Please sign up first.");
      }
      if (errorMsg.includes("User already registered")) {
         throw new Error("This email is already registered. Please log in.");
      }
      throw new Error(errorMsg); // Catch all other errors
    }

    // 5. SUCCESS - Entry Granted
    res.status(200).json({ success: true, user: data.user });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
