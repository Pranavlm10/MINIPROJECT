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
  const { signup, googleSignIn, enterDemoMode } = useAuth();
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
      // If demo mode, go directly to dashboard
      // Otherwise show email confirmation page
      if (email === 'demo@mindwell.app') {
        navigate('/dashboard');
      } else {
        navigate('/confirm-email', { state: { email } });
      }
    } catch (err) {
      setError(err.message || 'Failed to create account');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await googleSignIn();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 hidden" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 hidden" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center ">
            <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-primary-700">MindWell</span>
        </Link>

        <div className="bg-white border border-warm-200 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Join MindWell</h2>
          <p className="text-warm-500 text-center mb-6">Start your mental wellness journey today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-warm-500 mb-1 block">Display Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-warm-500 mb-1 block">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-warm-500 mb-1 block">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="text-sm text-warm-500 mb-1 block">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-warm-100" />
            <span className="text-warm-400 text-sm">or</span>
            <div className="flex-1 h-px bg-warm-100" />
          </div>

          <button
            onClick={handleDemo}
            className="w-full bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-600 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try Demo Mode
          </button>

          <p className="text-center text-warm-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-warm-400 text-xs mt-4 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your data is encrypted and never shared. We respect your privacy.
        </p>
      </motion.div>
    </div>
  );
}
