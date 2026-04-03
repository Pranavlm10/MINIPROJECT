import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      if (email === 'demo@reclaim.app') {
        navigate('/dashboard');
      } else {
        navigate('/confirm-email', { state: { email } });
      }
    } catch (err) {
      setError(err.message || 'Failed to create account');
    }
    setLoading(false);
  };

  const handleDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fdfcff] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-grid-pattern opacity-5" />
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary-100/40 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-violet-100/40 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
        className="w-full max-w-xl"
      >
        {/* Logo Section */}
        <Link to="/" className="flex flex-col items-center gap-6 mb-12 group">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center shadow-[0_15px_40px_rgba(124,58,237,0.3)] transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">RECLAIM</h1>
        </Link>

        {/* Premium Signup Card */}
        <div className="premium-card p-12 bg-white/60 backdrop-blur-3xl relative overflow-hidden">
          {/* Subtle line at top */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500/50 via-violet-500/50 to-indigo-500/50" />
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-bold text-sm">Join the student sanctuary for mental wellness</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50/50 border border-red-100 text-red-600 p-5 rounded-2xl mb-8 flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="font-black text-[11px] uppercase tracking-widest leading-relaxed">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium py-4 px-6 text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium py-4 px-6 text-sm"
                  placeholder="name@uni.edu"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium py-4 px-6 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-premium py-4 px-6 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-6 rounded-[1.5rem] shadow-[0_15px_30px_rgba(124,58,237,0.2)] text-[11px] tracking-[0.3em] font-black uppercase hover:shadow-[0_20px_40px_rgba(124,58,237,0.3)] transition-all mt-4"
            >
              {loading ? 'CREATING ACCOUNT...' : 'GET STARTED NOW'}
            </button>
          </form>

          {/* Quick Access Split */}
          <div className="flex items-center gap-6 my-10">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em] px-2 whitespace-nowrap">quick access</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-4 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all active:scale-98 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Explore in Demo Mode</span>
          </button>

          <p className="mt-12 text-center text-slate-400 font-bold text-xs">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-indigo-600 underline underline-offset-4 decoration-2">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Floating Session Info */}
        <div className="mt-10 flex items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            SSL Secure
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">
            Anonymous Data
          </div>
        </div>
      </motion.div>
    </div>
  );
}

