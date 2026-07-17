// File: api/auth.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { action, email, password } = req.body;
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;

  if (!SUPA_URL || !SUPA_KEY) {
    return res.status(500).json({ error: "System Error: Missing Database Keys" });
  }

  // 1. Basic Format & Length Validation
  if (!email || !email.includes('@') || !email.includes('.') || password.length < 6) {
    return res.status(400).json({ error: "Invalid email format or password too short." });
  }

  // 2. NEW: Block Dummy/Fake Emails (Smart Blocker)
  const emailLower = email.toLowerCase();
  const fakeKeywords = ['test', 'dummy', 'fake', 'abc', 'admin'];
  const fakeDomains = ['test.com', 'example.com', 'dummy.com'];
  const domain = emailLower.split('@')[1];

  if (action === 'signup') {
    if (fakeKeywords.some(kw => emailLower.includes(kw)) || fakeDomains.includes(domain)) {
      return res.status(400).json({ error: "Please use a real personal or work email address. Dummy emails are blocked." });
    }
  }

  try {
    let endpoint = '';
    
    // 3. Route based on Login or Signup
    if (action === 'signup') {
      endpoint = `${SUPA_URL}/auth/v1/signup`;
    } else if (action === 'login') {
      // Supabase ka strict login check
      endpoint = `${SUPA_URL}/auth/v1/token?grant_type=password`;
    } else {
      return res.status(400).json({ error: "Invalid action." });
    }

    // 4. Asking Supabase to verify
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // 5. Agar Supabase ne entry DENY kar di
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

    // 6. SUCCESS - Entry Granted
    res.status(200).json({ success: true, user: data.user });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
