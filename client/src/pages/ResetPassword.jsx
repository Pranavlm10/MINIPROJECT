import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid recovery session from the email link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });

    // Listen for PASSWORD_RECOVERY event (when user clicks email link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      if (updateError) throw updateError;
      setSuccess(true);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-warm-500">Verifying reset link...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-primary-700">MindWell</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-warm-200 rounded-xl shadow-sm p-8">
          {success ? (
            /* Success */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-warm-900 mb-2">Password Reset</h2>
              <p className="text-warm-500 mb-4">
                Your password has been successfully updated. Redirecting to your dashboard...
              </p>
              <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Go to Dashboard →
              </Link>
            </div>
          ) : !isValidSession ? (
            /* Invalid/Expired link */
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-warm-900 mb-2">Invalid Reset Link</h2>
              <p className="text-warm-500 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password" className="gradient-btn inline-block py-3 px-6 rounded-xl">
                Request New Link
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-warm-900 mb-2">Set New Password</h2>
                <p className="text-warm-500 text-sm">
                  Choose a strong password for your MindWell account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-warm-500 mb-1 block">New Password</label>
                  <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    minLength={6}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-warm-400 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="text-sm text-warm-500 mb-1 block">Confirm New Password</label>
                  <input
                    id="reset-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  id="reset-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-btn py-3 rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
