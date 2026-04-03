import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodLogged, setMoodLogged] = useState(false);

  const quotes = [
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
    { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
    { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const moods = [
    { type: 'Amazing', emoji: '🌟' }, { type: 'Happy', emoji: '😊' },
    { type: 'Calm', emoji: '😌' }, { type: 'Neutral', emoji: '😐' },
    { type: 'Anxious', emoji: '😰' }, { type: 'Sad', emoji: '😢' },
    { type: 'Angry', emoji: '😤' }, { type: 'Distressed', emoji: '😣' },
  ];

  const quickActions = [
    { title: 'AI Counselor', desc: 'Talk it out', path: '/chat', bg: '#eeedf3', icon: '🤖' },
    { title: 'Mood Journal', desc: 'Record your thoughts', path: '/journal', bg: '#e8def8', icon: '📓' },
    { title: 'Resources', desc: 'Crisis & support', path: '/resources', bg: '#dce1ff', icon: '📚' },
    { title: 'Community', desc: 'Anonymous space', path: '/community', bg: '#f4f3f8', icon: '💬' },
  ];

  const wellnessStats = [
    { label: 'Mental Energy', value: '84%', color: '#6750a7', bg: '#eeedf3' },
    { label: 'Sleep Quality', value: '7h 42m', color: '#495c9b', bg: '#dce1ff' },
    { label: 'Stress Level', value: 'Low', color: '#635c71', bg: '#e8def8' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const Sidebar = () => (
    <aside className="fixed left-5 top-5 bottom-5 w-64 flex flex-col z-50"
      style={{ background: 'rgba(250,249,252,0.72)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(177,177,185,0.18)', borderRadius: '2.5rem', boxShadow: '0 0 40px rgba(48,50,56,0.04)' }}>
      <div className="p-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6750a7,#9D86E1)', boxShadow: '0 6px 20px rgba(103,80,167,0.25)' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
            </svg>
          </div>
          <span className="font-display text-lg font-black tracking-tight" style={{ color: '#303238' }}>RECLAIM</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] ml-4 mb-4" style={{ color: '#b1b1b9' }}>Navigation</p>
        {[
          { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
          { path: '/chat', label: 'AI Counselor', icon: '🤖' },
          { path: '/journal', label: 'Mood Journal', icon: '📓' },
          { path: '/resources', label: 'Resources', icon: '📚' },
          { path: '/community', label: 'Community', icon: '💬' },
          { path: '/crisis', label: 'Crisis Support', icon: '🆘' },
          { path: '/profile', label: 'Settings', icon: '⚙️' },
        ].map(item => {
          const isActive = window.location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm"
              style={isActive
                ? { background: 'linear-gradient(135deg,#6750a7,#9D86E1)', color: '#fdf7ff', boxShadow: '0 6px 20px rgba(103,80,167,0.2)' }
                : { color: '#5d5f65' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(157,134,225,0.08)'; e.currentTarget.style.color = '#6750a7'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5d5f65'; } }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="p-4 rounded-2xl" style={{ background: '#f4f3f8' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs"
              style={{ background: 'linear-gradient(135deg,#6750a7,#9D86E1)', color: '#fdf7ff' }}>
              {(currentUser?.displayName || 'D')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate" style={{ color: '#303238' }}>{currentUser?.displayName || 'Demo User'}</p>
              <p className="text-[10px] truncate" style={{ color: '#797a81' }}>{currentUser?.email || 'demo@reclaim.app'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar />

      <main className="flex-1 ml-[18rem] mr-6 my-5 p-8 rounded-[2.5rem] relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(177,177,185,0.15)', boxShadow: '0 0 60px rgba(48,50,56,0.04)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-display text-3xl font-black mb-1" style={{ color: '#303238' }}>
              {greeting()},{' '}
              <span style={{ background: 'linear-gradient(135deg,#6750a7,#9D86E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {currentUser?.displayName || 'Champion'}
              </span>
            </h1>
            <p className="text-sm font-medium" style={{ color: '#797a81' }}>Your personal well-being sanctuary is ready.</p>
          </motion.div>
          <div className="flex gap-2">
            <span className="glass-pill" style={{ color: '#6750a7' }}>🔥 12-Day Streak</span>
            <span className="glass-pill" style={{ color: '#495c9b' }}>⭐ Level 4</span>
          </div>
        </div>

        {/* Wellness Stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {wellnessStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[1.75rem] h-36 flex flex-col justify-between"
              style={{ background: s.bg, border: '1px solid rgba(177,177,185,0.1)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#797a81' }}>{s.label}</p>
              <p className="font-display text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-7">
          {/* Left: Mood + Quick Actions */}
          <div className="col-span-8 space-y-7">

            {/* Mood Check-In */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-8 rounded-[2rem]"
              style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(177,177,185,0.12)', boxShadow: '0 0 30px rgba(48,50,56,0.03)' }}>
              <h2 className="font-display text-xl font-black mb-6 flex items-center gap-2" style={{ color: '#303238' }}>
                How are you feeling?
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              </h2>

              {moodLogged ? (
                <div className="text-center py-10 rounded-2xl" style={{ background: '#f4f3f8' }}>
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-display text-xl font-black mb-2" style={{ color: '#303238' }}>Mindset Saved</h3>
                  <p className="text-sm font-medium" style={{ color: '#797a81' }}>Your feelings are valid. Take a deep breath.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2.5">
                    {moods.map(m => (
                      <button key={m.type} onClick={() => setSelectedMood(m.type)}
                        className="px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
                        style={selectedMood === m.type
                          ? { background: 'linear-gradient(135deg,#6750a7,#9D86E1)', color: '#fdf7ff', boxShadow: '0 6px 20px rgba(103,80,167,0.2)', transform: 'scale(1.05)' }
                          : { background: '#f4f3f8', color: '#5d5f65' }}>
                        {m.emoji} {m.type}
                      </button>
                    ))}
                  </div>
                  {selectedMood && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <textarea placeholder="What's on your mind..."
                        value={moodNote} onChange={e => setMoodNote(e.target.value)}
                        className="input-premium h-28 resize-none" />
                      <button onClick={() => setMoodLogged(true)} className="gradient-btn w-full py-4 text-xs">
                        Log My Mood
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-5">
              {quickActions.map((a, i) => (
                <Link key={a.path} to={a.path}
                  className="p-7 rounded-[1.75rem] group transition-all duration-300 flex flex-col"
                  style={{ background: a.bg, border: '1px solid rgba(177,177,185,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(103,80,167,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                  <span className="text-3xl mb-5 block transition-transform duration-500 group-hover:scale-110">{a.icon}</span>
                  <h3 className="font-display text-lg font-black mb-1 group-hover:text-primary-600 transition-colors" style={{ color: '#303238' }}>{a.title}</h3>
                  <p className="text-xs font-medium" style={{ color: '#797a81' }}>{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Quote + Breathing */}
          <div className="col-span-4 space-y-5">
            {/* Quote card */}
            <div className="p-8 rounded-[2rem] h-fit"
              style={{ background: 'linear-gradient(135deg,#6750a7,#5a449a)', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute top-4 right-4 text-6xl opacity-10 font-display font-black">"</div>
              <p className="text-base font-bold italic mb-6 relative z-10 leading-relaxed" style={{ color: 'rgba(253,247,255,0.9)' }}>
                "{quote.text}"
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#b29af7' }}>— {quote.author}</p>
            </div>

            {/* Focus mode */}
            <div className="p-8 rounded-[2rem]"
              style={{ background: '#e8def8', border: '1px solid rgba(177,177,185,0.1)' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: '#635c71' }}>Focus Mode</p>
              <p className="font-display text-xl font-black mb-5 leading-tight" style={{ color: '#303238' }}>Ease your mind in 2 mins</p>
              <Link to="/resources" className="inline-block text-[10px] font-black uppercase tracking-widest py-2.5 px-6 rounded-2xl transition-all"
                style={{ background: '#ffffff', color: '#6750a7', boxShadow: '0 2px 12px rgba(103,80,167,0.12)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(103,80,167,0.2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(103,80,167,0.12)'}>
                Start Session →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
