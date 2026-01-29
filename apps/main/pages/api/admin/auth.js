/**
 * Admin Authentication API
 * Handles first-time password setup and subsequent logins
 */

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  const { action, password } = body;

  try {
    switch (action) {
      case 'check': {
        // Check if password has been set
        // In a real implementation, this would check a database or secure store
        // For now, we'll use an environment variable
        const hasPassword = !!process.env.ADMIN_PASSWORD_HASH;
        return res.status(200).json({ hasPassword });
      }

      case 'setup': {
        // First-time password setup
        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }

        // In a real implementation, hash the password and store it securely
        // For this demo, we'll just return success
        // NOTE: In production, you would:
        // 1. Hash the password using bcrypt
        // 2. Store the hash in Supabase or environment variable
        // 3. Never store plain text passwords

        console.log('Password setup (demo mode) - In production, hash and store securely');
        
        return res.status(200).json({ 
          success: true,
          message: 'Password set successfully (demo mode)',
        });
      }

      case 'login': {
        // Subsequent login verification
        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }

        // In a real implementation, verify password hash
        // For this demo with DEBUG_ADMIN, we'll accept any password
        const debugAdmin = process.env.DEBUG_ADMIN === 'true' || process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true';
        
        if (debugAdmin) {
          return res.status(200).json({ 
            success: true,
            token: 'demo-admin-token',
          });
        }

        // In production, verify the password hash
        return res.status(401).json({ error: 'Invalid password' });
      }

      case 'verify': {
        // Verify admin token
        const { token } = body;
        
        const debugAdmin = process.env.DEBUG_ADMIN === 'true' || process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true';
        
        if (debugAdmin && token === 'demo-admin-token') {
          return res.status(200).json({ valid: true });
        }

        return res.status(401).json({ valid: false });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
