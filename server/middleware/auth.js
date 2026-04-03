const { createClient } = require('@supabase/supabase-js');

/**
 * Middleware to verify Supabase JWT tokens.
 * Extracts the token from the Authorization header (Bearer <token>).
 * Falls back to demo user if no token provided or verification fails.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token — allow as demo user
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      uid: 'demo-user-001',
      email: 'demo@reclaim.app',
      name: 'Demo User'
    };
    return next();
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      req.user = {
        uid: 'demo-user-001',
        email: 'demo@reclaim.app',
        name: 'Demo User'
      };
      return next();
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
    // Token verification failed — fall back to demo user
    console.warn('Token verification failed, using demo user:', error.message);
    req.user = {
      uid: 'demo-user-001',
      email: 'demo@reclaim.app',
      name: 'Demo User'
    };
    return next();
  }
};

module.exports = { verifyToken };
