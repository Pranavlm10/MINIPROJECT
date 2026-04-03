import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmailConfirmation() {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-screen bg-warm-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-primary-400">RECLAIM</span>
        </Link>

        {/* Card */}
        <div className="bg-warm-800/60 border border-warm-700/50 rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-warm-100 mb-3">Verify Your Email</h2>
          
          <p className="text-warm-600 mb-2">
            We've sent a confirmation link to
          </p>
          <p className="text-primary-400 font-semibold text-lg mb-4">
            {email}
          </p>
          <p className="text-warm-500 text-sm mb-6 leading-relaxed">
            Please check your inbox and click the verification link to activate your RECLAIM account. 
            The link will expire in 24 hours.
          </p>

          <div className="bg-warm-900 border border-warm-700/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-warm-700 mb-2">Didn't receive the email?</h3>
            <ul className="text-xs text-warm-500 space-y-1 text-left">
              <li className="flex items-start gap-2">
                <span className="text-warm-400 mt-0.5">•</span>
                Check your spam or junk folder
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warm-400 mt-0.5">•</span>
                Make sure you entered the correct email address
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warm-400 mt-0.5">•</span>
                Wait a few minutes for the email to arrive
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/login" className="block w-full gradient-btn py-3 rounded-xl text-center">
              Go to Sign In
            </Link>
            <Link to="/signup" className="block text-center text-primary-400 hover:text-primary-400 font-medium text-sm">
              Try a different email
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
