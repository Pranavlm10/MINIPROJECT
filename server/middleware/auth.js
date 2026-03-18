const { createClient } = require('@supabase/supabase-js');

/**
 * Middleware to verify Supabase JWT tokens.
 * Extracts the token from the Authorization header (Bearer <token>).
 * In demo mode (no Supabase configured), allows requests with a demo user.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Allow demo mode for development without Supabase
    if (process.env.NODE_ENV !== 'production') {
      req.user = {
        uid: 'demo-user-001',
        email: 'demo@mindwell.app',
        name: 'Demo User'
      };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Create a Supabase client with the user's JWT to verify it
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured, fall back to demo mode in dev
      if (process.env.NODE_ENV !== 'production') {
        req.user = {
          uid: 'demo-user-001',
          email: 'demo@mindwell.app',
          name: 'Demo User'
        };
        return next();
      }
      throw new Error('Supabase not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error(error?.message || 'Invalid token');
    }

    req.user = {
      uid: user.id,
      email: user.email,
      name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email
    };
    next();
  } catch (error) {
    // In dev mode, allow demo access if token verification fails
    if (process.env.NODE_ENV !== 'production') {
      req.user = {
        uid: 'demo-user-001',
        email: 'demo@mindwell.app',
        name: 'Demo User'
      };
      return next();
    }
    console.error('Token verification failed:', error.message);
    res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = { verifyToken };
