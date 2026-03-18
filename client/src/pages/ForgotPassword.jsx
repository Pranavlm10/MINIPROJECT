import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    }

    setLoading(false);
  };

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
          {sent ? (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-warm-900 mb-2">Check Your Email</h2>
              <p className="text-warm-500 mb-6">
                We've sent a password reset link to <strong className="text-warm-700">{email}</strong>. 
                Please check your inbox and click the link to reset your password.
              </p>
              <p className="text-warm-400 text-sm mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full gradient-btn-outline py-3 rounded-xl"
                >
                  Try Different Email
                </button>
                <Link to="/login" className="block text-center text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-warm-900 mb-2">Forgot Password?</h2>
                <p className="text-warm-500 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-warm-500 mb-1 block">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                    required
                    autoFocus
                  />
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-btn py-3 rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-warm-500 text-sm mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
