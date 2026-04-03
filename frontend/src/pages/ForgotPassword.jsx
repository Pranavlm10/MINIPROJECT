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
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-4 mb-10 group">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-200 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <span className="text-4xl font-black text-warm-900 tracking-tighter uppercase">Lavender</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-warm-100 rounded-[3rem] shadow-2xl shadow-warm-200/50 p-10">
          {sent ? (
            /* Success State */
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-warm-900 mb-4 tracking-tight">Check Your Inbox</h2>
              <p className="text-warm-600 font-medium mb-8 leading-relaxed">
                We've sent a recovery link to <strong className="text-primary-600 underline underline-offset-4 decoration-primary-200">{email}</strong>. 
                Please click the link in the email to set a new password.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full bg-warm-50 hover:bg-warm-100 text-warm-900 font-black py-4 rounded-2xl transition-all border border-warm-100 uppercase tracking-widest text-xs"
                >
                  Try Different Email
                </button>
                <Link to="/login" className="block text-center text-primary-600 hover:text-primary-700 font-black text-xs uppercase tracking-[0.2em]">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600 shadow-inner">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-warm-900 mb-3 tracking-tight">Restoration</h2>
                <p className="text-warm-500 font-medium">
                  Enter your email and we'll help you reclaim your account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[11px] font-black text-warm-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-warm-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl px-6 py-4 text-warm-900 font-medium transition-all"
                    placeholder="your@email.com"
                    required
                    autoFocus
                  />
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-[0.2em] text-xs"
                >
                  {loading ? 'Processing...' : 'Send Magic Link'}
                </button>
              </form>

              <p className="text-center text-warm-500 font-medium mt-10 text-sm">
                Found your key?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-black">
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

