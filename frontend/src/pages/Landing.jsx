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

  return (
    <div className="min-h-screen bg-transparent font-sans text-[#303238] antialiased overflow-x-hidden">

      {/* ── Background Blobs ── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#b29af7]/30 rounded-full" style={{ filter: 'blur(80px)' }} />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-[#dce1ff]/40 rounded-full" style={{ filter: 'blur(80px)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-[#e8def8]/20 rounded-full" style={{ filter: 'blur(80px)' }} />
      </div>

      {/* ── Top Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 w-[90%] md:w-full rounded-full mt-4 mx-auto max-w-5xl shadow-[0px_20px_40px_rgba(48,50,56,0.04)]"
        style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(48px)', WebkitBackdropFilter: 'blur(48px)' }}>
        <div className="text-2xl font-black text-[#6750a7] italic" style={{ fontFamily: 'Manrope, sans-serif' }}>RECLAIM</div>
        <nav className="hidden md:flex gap-8 items-center">
          <a href="#" className="text-[#6750a7] font-bold border-b-2 border-[#6750a7] tracking-tight text-lg hover:scale-105 transition-all" style={{ fontFamily: 'Manrope, sans-serif' }}>Benefits</a>
          <Link to="/journal" className="text-[#303238]/70 tracking-tight text-lg hover:opacity-100 hover:scale-105 transition-all" style={{ fontFamily: 'Manrope, sans-serif' }}>Journal</Link>
          <Link to="/breathwork" className="text-[#303238]/70 tracking-tight text-lg hover:opacity-100 hover:scale-105 transition-all" style={{ fontFamily: 'Manrope, sans-serif' }}>Breathwork</Link>
          <Link to="/community" className="text-[#303238]/70 tracking-tight text-lg hover:opacity-100 hover:scale-105 transition-all" style={{ fontFamily: 'Manrope, sans-serif' }}>Community</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={handleDemo} className="hidden lg:block text-[#6750a7] font-bold py-2 px-4 hover:scale-105 transition-all active:scale-95" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Explore Demo
          </button>
          <Link to="/signup" className="text-white font-bold py-2.5 px-6 rounded-full shadow-lg hover:scale-105 transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #6750a7, #b29af7)', fontFamily: 'Manrope, sans-serif' }}>
            Start Journey
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative pt-32">

        {/* ── Hero Section ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center">

            {/* Badge */}
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full text-[#6750a7] font-bold text-sm tracking-widest uppercase" style={{ background: 'rgba(103,80,167,0.05)', border: '1px solid rgba(103,80,167,0.1)' }}>
              Mental Wellness for Academia
            </div>

            {/* Headline */}
            <h1 className="font-black text-5xl md:text-8xl text-[#303238] leading-[1.1] mb-8 tracking-tighter max-w-4xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Healing the <span className="text-[#6750a7] italic">Student</span> Mind
            </h1>

            {/* Subtext */}
            <p className="text-[#5d5f65] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              A digital sanctuary designed specifically for the unique pressures of university life. Find clarity, peace, and community in a space built for your serenity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup" className="text-white text-lg font-bold px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #6750a7, #b29af7)' }}>
                Start Your Free Journey
              </Link>
              <button onClick={handleDemo} className="text-[#303238] text-lg font-semibold px-10 py-5 rounded-full hover:bg-[#e2e2ea] transition-all active:scale-95" style={{ background: 'rgba(226,226,234,0.5)', backdropFilter: 'blur(12px)' }}>
                Explore Demo Mode
              </button>
            </div>

            {/* ── Mood Orb ── */}
            <div className="mt-24 relative">
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center shadow-[0px_40px_80px_rgba(103,80,167,0.3)]"
                style={{ background: 'linear-gradient(135deg, #b29af7, #a48de9)' }}>
                <div className="text-white text-center">
                  {/* Air / Breathe icon */}
                  <svg className="w-14 h-14 mx-auto mb-2 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.5 10h-2a1 1 0 0 1 0-2h2a4.5 4.5 0 1 0 0-9H6a1 1 0 0 1 0-2h.5a6.5 6.5 0 0 1 0 13zM19 14h-2.5a6.5 6.5 0 0 1 0-13H17a1 1 0 0 1 0 2h-.5a4.5 4.5 0 1 0 0 9H19a1 1 0 0 1 0 2zM4 20a1 1 0 0 1 0-2h10.5a4.5 4.5 0 1 0 0-9H14a1 1 0 0 1 0-2h.5a6.5 6.5 0 0 1 0 13H4z"/>
                  </svg>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Breathe</p>
                </div>
              </motion.div>

              {/* Floating chips */}
              <div className="absolute -top-10 -right-20 p-4 rounded-xl shadow-sm hidden md:block" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)' }}>
                <p className="text-sm font-semibold text-[#6750a7]">Daily Mood: Peaceful</p>
              </div>
              <div className="absolute bottom-0 -left-20 p-4 rounded-xl shadow-sm hidden md:block" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)' }}>
                <p className="text-sm font-semibold text-[#495c9b]">Focus Score: 88%</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Stats Section ── */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="bg-[#f4f3f8] rounded-2xl py-12 px-8 md:px-16 flex flex-wrap justify-between items-center gap-8">
            {[
              { value: '24/7', label: 'Global Support' },
              { value: '100%', label: 'Private & Secure' },
              { value: 'SDG 3', label: 'Health & Wellbeing' },
              { value: '50k+', label: 'Students Enrolled' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <span className="text-3xl font-black text-[#6750a7]" style={{ fontFamily: 'Manrope, sans-serif' }}>{s.value}</span>
                <span className="text-[#5d5f65] font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature Bento Grid ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Large Feature Card — Community */}
            <div className="md:col-span-8 rounded-2xl overflow-hidden shadow-sm relative min-h-[500px] flex flex-col justify-end p-12 group transition-all duration-500 hover:shadow-xl" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)' }}>
              <div className="absolute inset-0 z-0">
                <img alt="Student Community"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiGZLX8nWwJNx8JnA2FENSN4MvGfsYtHI_QVqFS92hm361cfavGF1lBeIOv7oPbnO__GyqBBcoQjuuIVx33rKoy5q-MDrW0uKcQ95Ty8GkhffsfhFHxWUW70CJxpgf7A0o84hhgAtOrfeIcdUDPCmpSXxmi36hWglniKywyyp8_prRRMh5PgDGCm5B6SqQBX-MhiY4GLcqDY7PGknC7vwPdbyfhSMdU6UnhysEtzxUH40gvIP86s47fmzXxWRrBnYsFJAgwXl9t4M5"
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #faf9fc, transparent)' }} />
              </div>
              <div className="relative z-10 max-w-xl">
                <svg className="w-10 h-10 text-[#6750a7] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-4xl font-black mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Secure Community</h3>
                <p className="text-lg text-[#5d5f65] mb-6 leading-relaxed">Connect with peers in an anonymous, moderated space. Share your journey, find study partners, and realize you are never alone in this sanctuary.</p>
                <Link to="/community" className="inline-flex items-center text-[#6750a7] font-bold hover:underline gap-2">
                  Join the conversation
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* AI Counseling Card */}
            <div className="md:col-span-4 bg-[#6750a7] text-white rounded-2xl p-12 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all">
              <div>
                <svg className="w-12 h-12 text-[#b29af7] mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>AI Counseling</h3>
                <p className="opacity-80 text-lg leading-relaxed">Empathetic, data-driven support available instantly. Our AI understands student stressors from finals to finances.</p>
              </div>
              <Link to="/chat" className="mt-8 inline-block text-center bg-white text-[#6750a7] font-bold py-3 px-6 rounded-full hover:scale-105 transition-all">
                Learn More
              </Link>
            </div>

            {/* Mood Tracking Card */}
            <div className="md:col-span-6 rounded-2xl p-12 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 items-center" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)' }}>
              <div className="w-full md:w-1/2">
                <img alt="Mood Tracking"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANZilY2OVyNo3WDOTs405-u0lMp-fGc2W9-KogUyOWBLRk3fnfmwGVewU0AJBqhEFCJozs9iHHgm1egpq6fX0wLKNenZ_CXcAkAvjRHGXuBDTtyksKYE_WyztSXoYjzzhgBVKXk079djGuaH-4Y_9hBjIHLyYzpZXWE0VQ8zuRfelZCkwQoppHu_8wIBCX3njBbPL5Y0TbuFPSjhNZRS1B9CWG-QXFLnSIeBSnoFrST_-IAIyhUMbTr0mWR07FtF-2MLbpHZsoGnrE"
                  className="w-full aspect-square object-cover rounded-xl shadow-inner" />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Mood Tracking</h3>
                <p className="text-[#5d5f65] mb-4">Identify patterns in your emotional health with beautiful, clinical-grade visual reports.</p>
                <svg className="w-8 h-8 text-[#6750a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="md:col-span-6 bg-[#e8e7ee] rounded-2xl p-12 shadow-sm hover:shadow-xl transition-all flex flex-col justify-center">
              <div className="max-w-md">
                <div className="flex gap-4 mb-6">
                  {[
                    <path key="1" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                    <path key="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                    <path key="3" strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
                  ].map((path, i) => (
                    <svg key={i} className="w-7 h-7 text-[#495c9b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{path}</svg>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Institutional Grade Privacy</h3>
                <p className="text-[#5d5f65]">Your data is yours. We use zero-knowledge encryption to ensure your journals and chats stay strictly confidential between you and the platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="rounded-2xl p-12 md:p-24 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3c508e, #6750a7)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full" style={{ filter: 'blur(100px)' }} />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>Ready to reclaim your peace?</h2>
              <p className="text-xl opacity-90 mb-12">Join 50,000+ students who have found their sanctuary. Start your 14-day free trial today.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/signup" className="bg-white text-[#3c508e] px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl">
                  Get Started Now
                </Link>
                <button onClick={handleDemo} className="border-2 border-white/30 backdrop-blur-sm px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#f4f3f8] pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 w-full max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <div className="text-xl font-bold text-[#303238] mb-2">RECLAIM Sanctuary</div>
            <p className="text-sm tracking-wide text-[#303238]/60">Designed for student serenity.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Student Resources', to: '/resources' },
              { label: 'Contact Support', to: '/crisis' },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="text-[#303238]/60 text-sm tracking-wide hover:text-[#6750a7] transition-colors opacity-80 hover:opacity-100">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-[#6750a7] cursor-pointer hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <svg className="w-6 h-6 text-[#6750a7] cursor-pointer hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 mt-12 pt-8 border-t border-[#b1b1b9]/10 text-center">
          <p className="text-xs tracking-wide text-[#303238]/40">© 2024 RECLAIM Sanctuary. Empowering students through digital mental health.</p>
        </div>
      </footer>
    </div>
  );
}
