import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo user for when Supabase isn't configured
  const demoUser = {
    id: 'demo-user-001',
    email: 'demo@mindwell.app',
    displayName: 'Demo User',
    photoURL: null
  };

  // Map Supabase user to our app's user shape
  function mapUser(supaUser) {
    if (!supaUser) return null;
    return {
      uid: supaUser.id,
      id: supaUser.id,
      email: supaUser.email,
      displayName: supaUser.user_metadata?.display_name || supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0],
      photoURL: supaUser.user_metadata?.avatar_url || null
    };
  }

  async function signup(email, password, displayName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      });
      if (error) throw error;
      const mapped = mapUser(data.user);
      setCurrentUser(mapped);
      return { user: mapped };
    } catch (error) {
      if (error.message?.includes('Invalid API key') || error.message?.includes('fetch')) {
        // Supabase not configured, use demo mode
        setIsDemoMode(true);
        setCurrentUser({ ...demoUser, displayName, email });
        return { user: { ...demoUser, displayName, email } };
      }
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      const mapped = mapUser(data.user);
      setCurrentUser(mapped);
      return { user: mapped };
    } catch (error) {
      if (error.message?.includes('Invalid API key') || error.message?.includes('fetch')) {
        setIsDemoMode(true);
        setCurrentUser({ ...demoUser, email });
        return { user: { ...demoUser, email } };
      }
      throw error;
    }
  }

  async function googleSignIn() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message?.includes('Invalid API key') || error.message?.includes('fetch')) {
        setIsDemoMode(true);
        setCurrentUser(demoUser);
        return { user: demoUser };
      }
      throw error;
    }
  }

  async function logout() {
    if (isDemoMode) {
      setCurrentUser(null);
      setIsDemoMode(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error);
    setCurrentUser(null);
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  function enterDemoMode() {
    setIsDemoMode(true);
    setCurrentUser(demoUser);
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session ? mapUser(session.user) : null);
      setLoading(false);
    }).catch(() => {
      console.warn('Supabase auth not available, using demo mode');
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session ? mapUser(session.user) : null);
      }
    );

    // Safety timeout in case auth never resolves
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    currentUser,
    isDemoMode,
    signup,
    login,
    googleSignIn,
    logout,
    enterDemoMode,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
