import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { moodAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const MOODS = [
  { type: 'amazing', label: 'Amazing', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', activeBg: 'bg-amber-100' },
  { type: 'happy', label: 'Happy', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', activeBg: 'bg-green-100' },
  { type: 'calm', label: 'Calm', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', activeBg: 'bg-teal-100' },
  { type: 'neutral', label: 'Neutral', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', activeBg: 'bg-gray-100' },
  { type: 'anxious', label: 'Anxious', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', activeBg: 'bg-orange-100' },
  { type: 'sad', label: 'Sad', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', activeBg: 'bg-blue-100' },
  { type: 'angry', label: 'Angry', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', activeBg: 'bg-red-100' },
  { type: 'distressed', label: 'Distressed', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', activeBg: 'bg-purple-100' },
];

const QUOTES = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "You are not your illness. You have a name, a history, a personality. Staying yourself is part of the battle.", author: "Julian Seifter" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "It's okay to not be okay — as long as you are not giving up.", author: "Karen Salmansohn" },
  { text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown" },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodLogged, setMoodLogged] = useState(false);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const handleMoodLog = async () => {
    if (!selectedMood) return;
    try {
      await moodAPI.logMood(selectedMood, moodNote);
      setMoodLogged(true);
    } catch (error) {
      setMoodLogged(true);
    }
  };

  const quickActions = [
    {
      path: '/chat',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Talk to AI Counselor',
      desc: 'Get empathetic support',
      color: 'text-primary-700',
      borderColor: 'border-l-primary-500',
    },
    {
      path: '/journal',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Mood Journal',
      desc: 'Track your emotions',
      color: 'text-teal-700',
      borderColor: 'border-l-teal-500',
    },
    {
      path: '/resources',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      ),
      title: 'Self-Help Resources',
      desc: 'Coping strategies',
      color: 'text-green-700',
      borderColor: 'border-l-green-500',
    },
    {
      path: '/community',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Peer Community',
      desc: "You're not alone",
      color: 'text-violet-700',
      borderColor: 'border-l-violet-500',
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <Sidebar active="/dashboard" />

      <main className="ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-warm-900 mb-1">
            {greeting()}, <span className="text-primary-700">{currentUser?.displayName || 'there'}</span>
          </h1>
          <p className="text-warm-500">How are you feeling today? Let's check in.</p>
        </motion.div>

        {/* Crisis Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6"
        >
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-red-800 font-medium text-sm">Need immediate help?</p>
            <p className="text-red-600 text-xs">If you're in crisis, please reach out to a helpline immediately.</p>
          </div>
          <Link to="/crisis" className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors font-medium">
            Get Help Now
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Check-In */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-warm-200 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-warm-900 mb-4">
                Daily Mood Check-In
              </h2>

              {moodLogged ? (
                <div className="text-center py-6">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 ${MOODS.find(m => m.type === selectedMood)?.activeBg} ${MOODS.find(m => m.type === selectedMood)?.text}`}>
                    {MOODS.find(m => m.type === selectedMood)?.label}
                  </div>
                  <h3 className="text-base font-medium text-green-700 mb-1">Mood logged successfully</h3>
                  <p className="text-warm-500 text-sm">
                    You're feeling {MOODS.find(m => m.type === selectedMood)?.label.toLowerCase()}. Thank you for checking in today.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {MOODS.map((mood) => (
                      <button
                        key={mood.type}
                        onClick={() => setSelectedMood(mood.type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                          selectedMood === mood.type
                            ? `${mood.activeBg} ${mood.border} ${mood.text} ring-1 ring-offset-1 ${mood.border}`
                            : `bg-white ${mood.border} ${mood.text} hover:${mood.bg}`
                        }`}
                      >
                        {mood.label}
                      </button>
                    ))}
                  </div>

                  {selectedMood && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <textarea
                        value={moodNote}
                        onChange={(e) => setMoodNote(e.target.value)}
                        placeholder="Want to share what's on your mind? (optional)"
                        className="input-field resize-none h-20 text-sm"
                      />
                      <button onClick={handleMoodLog} className="gradient-btn text-sm py-2 px-6">
                        Log My Mood
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-warm-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    className={`bg-white border border-warm-200 border-l-4 ${action.borderColor} rounded-xl p-5 hover:shadow-md transition-all duration-200`}
                  >
                    <div className={`mb-3 ${action.color}`}>{action.icon}</div>
                    <h3 className="font-medium text-warm-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-warm-500">{action.desc}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quote of the Day */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-warm-200 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xs font-medium text-warm-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Quote of the Day
              </h3>
              <blockquote className="text-warm-800 text-base leading-relaxed italic mb-3">
                "{quote.text}"
              </blockquote>
              <cite className="text-warm-400 text-sm not-italic">— {quote.author}</cite>
            </motion.div>

            {/* Breathing Exercise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white border border-warm-200 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xs font-medium text-warm-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Quick Breathing Exercise
              </h3>
              <p className="text-warm-600 text-sm mb-4">
                Try 4-7-8 breathing: Inhale (4s), Hold (7s), Exhale (8s)
              </p>
              <Link to="/resources" className="text-primary-600 text-sm hover:text-primary-700 font-medium">
                Explore more exercises →
              </Link>
            </motion.div>

            {/* Well-being Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white border border-warm-200 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xs font-medium text-warm-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
                </svg>
                Today's Well-being Tip
              </h3>
              <p className="text-warm-600 text-sm leading-relaxed">
                Take a 5-minute break every hour. Step away from your screen,
                stretch, or look at something green. Small breaks significantly
                reduce anxiety and improve focus.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
