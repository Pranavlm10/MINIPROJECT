import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const { currentUser, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    dailyCheckIn: true,
    weeklyReport: true,
    communityReplies: true,
    crisisAlerts: true,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const notificationItems = [
    {
      key: 'dailyCheckIn',
      icon: (
        <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Daily Mood Check-In Reminder',
      desc: 'Get reminded to log your mood each day'
    },
    {
      key: 'weeklyReport',
      icon: (
        <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Weekly Wellness Report',
      desc: 'Receive a summary of your mood trends'
    },
    {
      key: 'communityReplies',
      icon: (
        <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Community Replies',
      desc: 'Notified when someone replies to your posts'
    },
    {
      key: 'crisisAlerts',
      icon: (
        <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: 'Crisis Alert System',
      desc: 'Always show crisis resources when needed (recommended)'
    },
  ];

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar active="/profile" />

      <main className="ml-64 p-10 flex-1 max-w-5xl">
        {/* Header */}
        <header className="mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-warm-900 tracking-tighter mb-2">
              Profile & Settings
            </h1>
            <p className="text-lg text-warm-500 font-medium">Manage your personal journey and application preferences.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-warm-100 rounded-[2.5rem] shadow-xl shadow-warm-200/50 p-10"
            >
              <h2 className="text-2xl font-black text-warm-900 mb-8 tracking-tight">Your Identity</h2>
              <div className="flex items-center gap-8 mb-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-primary-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary-200">
                    {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-sm" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-warm-900 mb-1">{currentUser?.displayName || 'RECLAIM User'}</h3>
                  <p className="text-warm-500 font-bold mb-4">{currentUser?.email || 'demo@reclaim.app'}</p>
                  {isDemoMode && (
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Demo Workspace
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-warm-400 uppercase tracking-widest mb-2 block ml-1">Display Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser?.displayName || ''}
                    className="w-full bg-warm-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl px-6 py-4 text-warm-900 font-medium transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-warm-400 uppercase tracking-widest mb-2 block ml-1">Account Email</label>
                  <input
                    type="email"
                    defaultValue={currentUser?.email || ''}
                    className="w-full bg-warm-50 border-2 border-warm-100/50 rounded-2xl px-6 py-4 text-warm-400 font-bold opacity-60"
                    disabled
                  />
                </div>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-warm-100 rounded-[2.5rem] shadow-xl shadow-warm-200/50 p-10"
            >
              <h2 className="text-2xl font-black text-warm-900 mb-8 tracking-tight">Notification System</h2>
              <div className="space-y-4">
                {notificationItems.map(item => (
                  <div key={item.key} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-warm-50 transition-all border border-transparent hover:border-warm-100">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-warm-600 shadow-sm border border-warm-50">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-warm-900 mb-0.5">{item.title}</h3>
                        <p className="text-sm text-warm-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`w-14 h-8 rounded-full transition-all duration-300 relative shadow-inner ${
                        notifications[item.key] ? 'bg-primary-600' : 'bg-warm-200'
                      }`}
                    >
                      <motion.span
                        animate={{ x: notifications[item.key] ? 24 : 4 }}
                        className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Privacy & Data */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-warm-100 rounded-[2.5rem] shadow-xl shadow-warm-200/50 p-8"
            >
              <h2 className="text-xl font-black text-warm-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Trust & Data
              </h2>
              <div className="space-y-6">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] p-6">
                  <h3 className="font-black text-emerald-800 text-sm mb-4 uppercase tracking-widest">Our Promise</h3>
                  <ul className="space-y-4">
                    {[
                      'Encryption for all chats',
                      'Private journal records',
                      'Anonymous interactions',
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-emerald-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-warm-50 hover:bg-warm-100 text-warm-900 font-bold py-4 rounded-[1.2rem] border border-warm-100 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export My Vault
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-[1.2rem] border border-red-100 transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Wipe All Data
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-warm-100 rounded-[2.5rem] shadow-xl shadow-warm-200/50 p-8"
            >
              <h2 className="text-xl font-black text-warm-900 mb-6">Account Services</h2>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-[1.2rem] shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Secure Sign Out
              </button>
            </motion.div>

            {/* App Info */}
            <div className="text-center py-4">
              <p className="text-[10px] font-black text-warm-300 uppercase tracking-[0.3em]">
                RECLAIM v1.0.0 · MENTAL HEALTH FIRST
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

