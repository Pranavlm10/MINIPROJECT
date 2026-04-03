import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(email, password, name.trim());
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    }
    setLoading(false);
  };

  const handleDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-8 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle,rgba(157,134,225,0.14) 0%,transparent 68%)', animation: 'blobDrift 14s ease-in-out infinite alternate' }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[40vw] h-[40vw] rounded-full pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle,rgba(220,225,255,0.22) 0%,transparent 68%)', animation: 'blobDrift 18s ease-in-out infinite alternate-reverse' }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center gap-4 mb-10 group">
          <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            style={{ background: 'linear-gradient(135deg,#6750a7,#9D86E1)', boxShadow: '0 12px 32px rgba(103,80,167,0.28)' }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight" style={{ color: '#303238' }}>RECLAIM</h1>
        </Link>

        {/* Card */}
        <div className="premium-card p-10 relative overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1"
            style={{ background: 'linear-gradient(90deg,#6750a7,#9D86E1,#dce1ff)' }} />

          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#303238' }}>Welcome Back</h2>
            <p className="text-sm font-medium" style={{ color: '#5d5f65' }}>Continue your journey to mental clarity</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl mb-6 flex items-center gap-3"
              style={{ background: 'rgba(168,54,75,0.06)', border: '1px solid rgba(168,54,75,0.15)', color: '#a8364b' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(168,54,75,0.1)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: '#797a81' }}>Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="input-premium" placeholder="e.g. George" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: '#797a81' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-premium" placeholder="name@university.edu" required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#797a81' }}>Password</label>
                <Link to="/forgot-password" className="text-[10px] font-bold hover:text-primary-600 transition-colors" style={{ color: '#9D86E1' }}>
                  Reset Password?
                </Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input-premium" placeholder="••••••••••••" required />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="gradient-btn w-full py-4 text-[11px]">
                {loading ? 'Authenticating...' : 'Sign In Securely'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ background: 'rgba(177,177,185,0.3)' }} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#b1b1b9' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(177,177,185,0.3)' }} />
          </div>

          {/* Demo Mode */}
          <button onClick={handleDemo}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-[1.25rem] transition-all group"
            style={{ background: '#f4f3f8', border: '1px solid rgba(177,177,185,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eeedf3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f4f3f8'; }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: '#ffffff', boxShadow: '0 2px 10px rgba(48,50,56,0.06)' }}>
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#5d5f65' }}>Explore in Demo Mode</span>
          </button>

          <p className="mt-8 text-center text-xs font-medium" style={{ color: '#797a81' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4">
              Create one now
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-50">
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest" style={{ color: '#5d5f65' }}>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />SSL Secure
          </div>
          <div className="w-1 h-1 rounded-full" style={{ background: '#b1b1b9' }} />
          <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#5d5f65' }}>Private Session</div>
        </div>
      </motion.div>
    </div>
  );
}
