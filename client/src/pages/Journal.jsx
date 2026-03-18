import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moodAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const MOODS = [
  { type: 'amazing', label: 'Amazing', color: 'bg-yellow-500/20', border: 'border-yellow-500/30', textColor: 'text-yellow-400' },
  { type: 'happy', label: 'Happy', color: 'bg-green-500/20', border: 'border-green-500/30', textColor: 'text-green-600' },
  { type: 'calm', label: 'Calm', color: 'bg-teal-500/20', border: 'border-teal-500/30', textColor: 'text-teal-400' },
  { type: 'neutral', label: 'Neutral', color: 'bg-slate-500/20', border: 'border-slate-500/30', textColor: 'text-slate-400' },
  { type: 'anxious', label: 'Anxious', color: 'bg-amber-500/20', border: 'border-amber-500/30', textColor: 'text-amber-400' },
  { type: 'sad', label: 'Sad', color: 'bg-blue-500/20', border: 'border-blue-500/30', textColor: 'text-blue-400' },
  { type: 'angry', label: 'Angry', color: 'bg-red-100', border: 'border-red-200', textColor: 'text-red-600' },
  { type: 'distressed', label: 'Distressed', color: 'bg-purple-500/20', border: 'border-purple-500/30', textColor: 'text-purple-400' },
];

const MOOD_BAR_COLORS = {
  amazing: 'bg-yellow-400',
  happy: 'bg-green-400',
  calm: 'bg-teal-400',
  neutral: 'bg-slate-400',
  anxious: 'bg-amber-400',
  sad: 'bg-blue-400',
  angry: 'bg-red-400',
  distressed: 'bg-purple-400',
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
    } catch (e) {
      // Demo mode — continue without backend
    }

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
    <div className="min-h-screen bg-warm-50">
      <Sidebar active="/journal" />

      <main className="ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-primary-700">Mood Journal</span>
          </h1>
          <p className="text-warm-500">Track your emotions, notice patterns, and grow your self-awareness.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('write')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              view === 'write' ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30' : 'text-warm-500 hover:bg-warm-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            New Entry
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              view === 'history' ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30' : 'text-warm-500 hover:bg-warm-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            History ({entries.length})
          </button>
        </div>

        {view === 'write' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Journal Entry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white border border-warm-200 rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">How are you feeling right now?</h2>

              {/* Mood Selector */}
              <div className="flex flex-wrap gap-3 mb-6">
                {MOODS.map((mood) => (
                  <button
                    key={mood.type}
                    onClick={() => setSelectedMood(mood.type)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 min-w-[70px] ${
                      selectedMood === mood.type
                        ? `${mood.color} ${mood.border} border ring-2 ring-white/20 scale-110`
                        : 'hover:bg-warm-50 border border-transparent'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selectedMood === mood.type ? 'text-warm-900' : mood.textColor}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Journal Text */}
              <div className="mb-4">
                <label className="text-sm text-warm-500 mb-2 block">
                  What's on your mind? Write freely — this is your private space.
                </label>
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Today I'm feeling..."
                  className="input-field resize-none h-40 text-base leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-warm-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your journal entries are private and encrypted.
                </p>
                <button
                  onClick={handleSave}
                  disabled={!selectedMood}
                  className="gradient-btn text-sm py-2 px-6 disabled:opacity-30"
                >
                  Save Entry
                </button>
              </div>
            </motion.div>

            {/* Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="bg-white border border-warm-200 rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-medium text-primary-600 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
                  </svg>
                  Journal Prompts
                </h3>
                <div className="space-y-2">
                  {[
                    "What am I grateful for today?",
                    "What challenged me, and how did I handle it?",
                    "What made me smile today?",
                    "What do I need to let go of?",
                    "What would make tomorrow great?",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setJournalText(prev => prev + (prev ? '\n\n' : '') + prompt + '\n')}
                      className="w-full text-left text-sm text-warm-500 hover:text-warm-900 p-2 rounded-lg hover:bg-warm-50 transition-all"
                    >
                      &bull; {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-warm-200 rounded-xl shadow-sm p-5 ">
                <h3 className="text-sm font-medium text-warm-500 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Why Journal?
                </h3>
                <p className="text-xs text-warm-500 leading-relaxed">
                  Regular journaling can reduce anxiety by 30%, improve emotional
                  processing, and help identify patterns in your mental health.
                  Even 5 minutes a day makes a difference.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mood Distribution */}
            {entries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-warm-200 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
                <div className="space-y-3">
                  {getMoodDistribution().map((mood) => (
                    <div key={mood.type} className="flex items-center gap-3">
                      <span className={`text-sm w-20 font-medium ${mood.textColor}`}>{mood.label}</span>
                      <div className="flex-1 bg-warm-50 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mood.percentage}%` }}
                          className={`h-full rounded-full ${MOOD_BAR_COLORS[mood.type]}`}
                        />
                      </div>
                      <span className="text-sm text-warm-500 w-12 text-right">{mood.count}x</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Entries */}
            {entries.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-12 h-12 text-warm-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-semibold text-warm-600 mb-2">No entries yet</h3>
                <p className="text-warm-400 mb-4">Start tracking your moods to see patterns here.</p>
                <button onClick={() => setView('write')} className="gradient-btn text-sm py-2 px-6">
                  Write First Entry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {entries.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white border border-warm-200 rounded-xl shadow-sm p-5 ${entry.moodData?.color} ${entry.moodData?.border} border`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${entry.moodData?.textColor}`}>{entry.moodData?.label}</span>
                        </div>
                        <span className="text-xs text-warm-400">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {entry.text && (
                        <p className="text-warm-600 text-sm leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                      )}
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
