import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();
  const { enterDemoMode } = useAuth();

  const handleDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'AI Counselor',
      description: 'Chat with an empathetic AI that understands your emotions and provides evidence-based support.',
      bg: 'bg-primary-50',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Mood Tracking',
      description: 'Track your emotional patterns over time. Understand your triggers and celebrate your progress.',
      bg: 'bg-teal-50',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      ),
      title: 'Self-Help Resources',
      description: 'Access curated breathing exercises, meditation guides, and coping strategies anytime.',
      bg: 'bg-green-50',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-violet-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Peer Community',
      description: 'Connect anonymously with other students. Share experiences, support each other, and know you\'re not alone.',
      bg: 'bg-violet-50',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Privacy First',
      description: 'Your data is encrypted and private. We never share your information. Your well-being journey is yours.',
      bg: 'bg-emerald-50',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Crisis Support',
      description: 'Immediate access to crisis hotlines and emergency resources whenever you need them.',
      bg: 'bg-red-50',
    }
  ];

  const stats = [
    { value: '1B+', label: 'People affected by mental health disorders globally' },
    { value: '75%', label: 'Of mental illnesses begin before age 24' },
    { value: '60%', label: 'Of students report significant anxiety' },
    { value: '24/7', label: 'Support available through MindWell' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <header className="relative bg-warm-50">
        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-warm-900">MindWell</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/crisis" className="text-warm-500 hover:text-red-600 transition-colors text-sm font-medium">
              Crisis Help
            </Link>
            <Link to="/login" className="gradient-btn-outline text-sm py-2 px-4">
              Sign In
            </Link>
            <Link to="/signup" className="gradient-btn text-sm py-2 px-4">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-sm text-primary-700 font-medium">SDG 3 — Good Health & Well-Being</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-warm-900">
              Your Mental Health{' '}
              <span className="text-primary-600">Matters</span>
            </h1>

            <p className="text-lg md:text-xl text-warm-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              An AI-powered sanctuary for students. Get emotional support, track your moods,
              access coping strategies, and connect with peers — all in a safe, private space.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="gradient-btn text-lg px-8 py-4 rounded-xl">
                Start Your Journey
              </Link>
              <button
                onClick={handleDemo}
                className="gradient-btn-outline text-lg px-8 py-4 rounded-xl"
              >
                Try Demo Mode
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 border-y border-warm-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-700 mb-2">{stat.value}</div>
                <div className="text-sm text-warm-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-warm-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-warm-900">
              Everything You Need for{' '}
              <span className="text-primary-600">Mental Wellness</span>
            </h2>
            <p className="text-warm-500 text-lg max-w-2xl mx-auto">
              Comprehensive tools designed specifically for students, backed by evidence-based
              psychological frameworks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-warm-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-warm-900 mb-2">{feature.title}</h3>
                <p className="text-warm-500 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-t border-warm-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
              How <span className="text-primary-600">MindWell</span> Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01', title: 'Check In', desc: 'Start with a quick mood check-in. Our AI gently assesses how you\'re feeling.',
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                step: '02', title: 'Get Support', desc: 'Chat with our AI counselor, explore coping strategies, or connect with peers.',
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              },
              {
                step: '03', title: 'Grow Stronger', desc: 'Track your progress, build emotional resilience, and celebrate small wins.',
                icon: (
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-semibold text-primary-600 mb-2 uppercase tracking-wide">Step {item.step}</div>
                <h3 className="text-xl font-semibold text-warm-900 mb-2">{item.title}</h3>
                <p className="text-warm-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-warm-50">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-warm-200 rounded-2xl p-12 shadow-sm"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
              You Don't Have to Face It Alone
            </h2>
            <p className="text-warm-500 text-lg mb-8 max-w-xl mx-auto">
              Take the first step towards better mental well-being today. It's free, confidential, and available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="gradient-btn text-lg px-8 py-4 rounded-xl">
                Get Started Free
              </Link>
              <button
                onClick={handleDemo}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                or try demo mode →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
            <span className="font-semibold text-warm-900">MindWell</span>
            <span className="text-warm-400 text-sm">— SDG 3: Good Health & Well-Being</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-warm-500">
            <Link to="/crisis" className="hover:text-red-600 transition-colors">Crisis Help</Link>
            <span>Privacy First</span>
            <span>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
