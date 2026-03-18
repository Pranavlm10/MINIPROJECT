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
    <div className="min-h-screen bg-warm-50">
      <Sidebar active="/profile" />

      <main className="ml-64 p-8 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-primary-700">Profile & Settings</span>
          </h1>
          <p className="text-warm-500">Manage your account and preferences.</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-warm-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl font-bold text-warm-900 shadow-lg shadow-primary-500/20">
                {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentUser?.displayName || 'MindWell User'}</h3>
                <p className="text-warm-500 text-sm">{currentUser?.email || 'demo@mindwell.app'}</p>
                {isDemoMode && (
                  <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/30 mt-2">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-warm-500 mb-1 block">Display Name</label>
                <input
                  type="text"
                  defaultValue={currentUser?.displayName || ''}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm text-warm-500 mb-1 block">Email</label>
                <input
                  type="email"
                  defaultValue={currentUser?.email || ''}
                  className="input-field opacity-50"
                  disabled
                />
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-warm-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {notificationItems.map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-warm-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <h3 className="text-sm font-medium text-warm-900">{item.title}</h3>
                      <p className="text-xs text-warm-400">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                      notifications[item.key] ? 'bg-primary-500' : 'bg-surface-700'
                    }`}
                  >
                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                      notifications[item.key] ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privacy & Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-warm-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Privacy & Data</h2>
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="font-medium text-emerald-300">Your Data is Protected</h3>
                </div>
                <ul className="text-sm text-warm-500 space-y-1.5 ml-7">
                  <li>&bull; All conversations are confidential and encrypted</li>
                  <li>&bull; Journal entries are private — only you can see them</li>
                  <li>&bull; Community posts are anonymous — your identity is never revealed</li>
                  <li>&bull; We never sell or share your personal data</li>
                  <li>&bull; You can delete your data at any time</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="text-sm text-warm-500 hover:text-warm-900 bg-warm-50 hover:bg-warm-100 px-4 py-2 rounded-lg transition-all border border-warm-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export My Data
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all border border-red-500/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete All Data
                </button>
              </div>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-warm-200 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Account</h2>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-all border border-red-500/20 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* App Info */}
          <div className="text-center py-4">
            <p className="text-warm-400 text-xs">
              MindWell v1.0.0 · SDG 3: Good Health & Well-Being
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
