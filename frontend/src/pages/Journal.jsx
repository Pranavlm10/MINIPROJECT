import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moodAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const MOODS = [
  { type: 'amazing', label: 'Amazing', color: 'bg-yellow-50', border: 'border-yellow-100', textColor: 'text-yellow-700' },
  { type: 'happy', label: 'Happy', color: 'bg-green-50', border: 'border-green-100', textColor: 'text-green-700' },
  { type: 'calm', label: 'Calm', color: 'bg-teal-50', border: 'border-teal-100', textColor: 'text-teal-700' },
  { type: 'neutral', label: 'Neutral', color: 'bg-slate-50', border: 'border-slate-100', textColor: 'text-slate-700' },
  { type: 'anxious', label: 'Anxious', color: 'bg-amber-50', border: 'border-amber-100', textColor: 'text-amber-700' },
  { type: 'sad', label: 'Sad', color: 'bg-blue-50', border: 'border-blue-100', textColor: 'text-blue-700' },
  { type: 'angry', label: 'Angry', color: 'bg-red-50', border: 'border-red-100', textColor: 'text-red-700' },
  { type: 'distressed', label: 'Distressed', color: 'bg-primary-50', border: 'border-primary-100', textColor: 'text-primary-700' },
];

const MOOD_BAR_COLORS = {
  amazing: 'bg-yellow-400',
  happy: 'bg-green-400',
  calm: 'bg-teal-400',
  neutral: 'bg-slate-400',
  anxious: 'bg-amber-400',
  sad: 'bg-blue-400',
  angry: 'bg-red-400',
  distressed: 'bg-primary-400',
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [view, setView] = useState('write'); // 'write' | 'history'

  const handleSave = async () => {
    if (!selectedMood) return;

    const entry = {
      id: Date.now().toString(),
      mood: selectedMood,
      text: journalText,
      date: new Date().toISOString(),
      moodData: MOODS.find(m => m.type === selectedMood),
    };

    try {
      await moodAPI.logMood(selectedMood, journalText);
    } catch (e) {}

    setEntries(prev => [entry, ...prev]);
    setSelectedMood(null);
    setJournalText('');
  };

  const getMoodDistribution = () => {
    const dist = {};
    MOODS.forEach(m => dist[m.type] = 0);
    entries.forEach(e => dist[e.mood] = (dist[e.mood] || 0) + 1);
    const total = entries.length || 1;
    return MOODS.map(m => ({
      ...m,
      count: dist[m.type],
      percentage: Math.round((dist[m.type] / total) * 100)
    })).filter(m => m.count > 0);
  };

  return (
    <div className="min-h-screen bg-warm-50 flex">
      <Sidebar active="/journal" />

      <main className="ml-64 p-10 flex-1">
        {/* Header */}
        <header className="mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-warm-900 tracking-tighter mb-2">
              Mood Journal
            </h1>
            <p className="text-lg text-warm-500 font-medium">Track your emotions, notice patterns, and find your center.</p>
          </motion.div>
        </header>

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-warm-100">
            <button
              onClick={() => setView('write')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                view === 'write' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-warm-500 hover:text-warm-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              New Entry
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                view === 'history' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-warm-500 hover:text-warm-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              History ({entries.length})
            </button>
          </div>
        </div>

        {view === 'write' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Journal Entry */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-white border border-warm-100 rounded-[2.5rem] shadow-xl shadow-warm-200/50 p-10"
            >
              <h2 className="text-2xl font-black text-warm-900 mb-8 tracking-tight">How's your heart today?</h2>

              {/* Mood Selector */}
              <div className="grid grid-cols-4 gap-4 mb-10">
                {MOODS.map((mood) => (
                  <button
                    key={mood.type}
                    onClick={() => setSelectedMood(mood.type)}
                    className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-300 border-2 ${
                      selectedMood === mood.type
                        ? `bg-primary-600 border-primary-600 shadow-xl shadow-primary-100 scale-105`
                        : `bg-warm-50 border-transparent hover:bg-white hover:border-warm-200`
                    }`}
                  >
                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedMood === mood.type ? 'text-white' : mood.textColor}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Journal Text */}
              <div className="mb-8 group">
                <label className="text-[11px] font-black text-warm-400 uppercase tracking-widest mb-3 ml-1 block">
                  Your Private Reflection
                </label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="w-full bg-warm-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-3xl px-8 py-6 text-warm-900 placeholder-warm-400 focus:outline-none transition-all resize-none h-64 text-lg font-medium shadow-none focus:shadow-xl focus:shadow-primary-100/30"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-warm-50">
                <div className="flex items-center gap-3 text-[10px] font-bold text-warm-300 uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Fully Encrypted Space
                </div>
                <button
                  onClick={handleSave}
                  disabled={!selectedMood}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-12 rounded-[2rem] disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-100"
                >
                  Save to Vault
                </button>
              </div>
            </motion.div>

            {/* Prompts & Context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-white border border-warm-100 rounded-[2rem] shadow-lg shadow-warm-100/50 p-8">
                <h3 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
                  </svg>
                  Curated Prompts
                </h3>
                <div className="space-y-4">
                  {[
                    "What am I grateful for today?",
                    "What challenged me today?",
                    "What would make tomorrow great?",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setJournalText(prev => prev + (prev ? '\n\n' : '') + prompt + '\n')}
                      className="w-full text-left text-sm font-bold text-warm-600 hover:text-primary-600 group transition-all"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 mr-2">→</span>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-primary-600 text-white rounded-[2rem] shadow-xl shadow-primary-200 p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-black mb-3 italic">Did you know?</h3>
                  <p className="text-sm font-medium leading-relaxed opacity-90">
                    Journaling for just 5 minutes a day has been shown to reduce cortisol levels and improve cognitive function over time.
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Mood Distribution */}
            {entries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-warm-100 rounded-[2.5rem] shadow-xl p-10"
              >
                <h3 className="text-2xl font-black text-warm-900 mb-8 tracking-tight">Emotional Landscape</h3>
                <div className="space-y-6">
                  {getMoodDistribution().map((mood) => (
                    <div key={mood.type} className="flex items-center gap-6">
                      <span className={`text-[11px] w-24 font-black uppercase tracking-widest ${mood.textColor}`}>{mood.label}</span>
                      <div className="flex-1 bg-warm-50 rounded-full h-5 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mood.percentage}%` }}
                          className={`h-full rounded-full ${MOOD_BAR_COLORS[mood.type]} shadow-lg transition-all duration-1000`}
                        />
                      </div>
                      <span className="text-sm font-black text-warm-900 w-12 text-right">{mood.percentage}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Entries History */}
            {entries.length === 0 ? (
              <div className="bg-white border border-warm-100 rounded-[2.5rem] p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-warm-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-warm-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-warm-900 mb-2">No memories yet</h3>
                <p className="text-warm-500 font-medium mb-10">Your growth history will appear here once you start writing.</p>
                <button onClick={() => setView('write')} className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-12 rounded-[2rem] shadow-xl shadow-primary-200 transition-all">
                  Start Your First Entry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {entries.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-warm-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full ${MOOD_BAR_COLORS[entry.mood]}`} />
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${entry.moodData?.color} ${entry.moodData?.textColor}`}>
                          {entry.moodData?.label}
                        </span>
                        <span className="text-[10px] font-bold text-warm-300 uppercase letter-spacing-wider">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric'
                          })} — {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-warm-800 text-base font-medium leading-relaxed italic whitespace-pre-wrap">
                        "{entry.text}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

