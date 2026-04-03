import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const CATEGORIES = [
  { id: 'all', label: 'All Posts' },
  { id: 'general', label: 'General' },
  { id: 'academic', label: 'Academic Stress' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'gratitude', label: 'Gratitude' },
  { id: 'wins', label: 'Small Wins' },
];

const SAMPLE_POSTS = [
  {
    id: '1', authorAlias: 'BraveSunrise42', content: 'Just finished my first therapy session. I was so nervous but the counselor was incredibly kind. If you\'re thinking about it, take the leap!', category: 'motivation', replies: [
      { id: 'r1', authorAlias: 'CalmLotus88', content: 'So proud of you! That first step is the hardest.', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ], supportCount: 12, timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '2', authorAlias: 'GentleRiver77', content: 'Finals week is really challenging. I haven\'t slept properly in 3 days. Does anyone have tips for managing exam anxiety?', category: 'academic', replies: [
      { id: 'r2', authorAlias: 'WiseStar55', content: 'Try the Pomodoro technique — 25 min study, 5 min break. And please get some sleep, it actually helps you retain more!', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 'r3', authorAlias: 'PeacefulCloud22', content: 'Box breathing really helped me during exams. Breathe in 4s, hold 4s, out 4s, hold 4s. You\'ve got this!', timestamp: new Date(Date.now() - 900000).toISOString() }
    ], supportCount: 8, timestamp: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: '3', authorAlias: 'HopefulButterfly33', content: 'I went for a 20-minute walk today instead of staying in bed. Small win, but it felt huge.', category: 'wins', replies: [], supportCount: 24, timestamp: new Date(Date.now() - 28800000).toISOString()
  },
  {
    id: '4', authorAlias: 'ResilientPhoenix91', content: 'Grateful for: my dog, the warm tea I\'m drinking, and the fact that I got through another day. What are you grateful for today?', category: 'gratitude', replies: [
      { id: 'r4', authorAlias: 'KindPanda66', content: 'Grateful for this community. Knowing others understand makes everything a little easier.', timestamp: new Date(Date.now() - 5000000).toISOString() }
    ], supportCount: 15, timestamp: new Date(Date.now() - 36000000).toISOString()
  },
];

export default function Community() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [supportedPosts, setSupportedPosts] = useState(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await communityAPI.getPosts(1, activeCategory);
        if (response.data?.data?.posts?.length > 0) {
          setPosts(response.data.data.posts);
        }
      } catch (e) {
        // Use sample posts on error
      }
    };
    fetchPosts();
  }, [activeCategory]);

  const handleNewPost = async () => {
    if (!newPostContent.trim()) return;

    const post = {
      id: Date.now().toString(),
      authorAlias: `Anon${Math.floor(Math.random() * 999)}`,
      content: newPostContent.trim(),
      category: newPostCategory,
      replies: [],
      supportCount: 0,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await communityAPI.createPost(newPostContent, newPostCategory);
      if (response.data?.data) {
        post.authorAlias = response.data.data.authorAlias;
      }
    } catch (e) {
      // Use local post
    }

    setPosts(prev => [post, ...prev]);
    setNewPostContent('');
    setShowNewPost(false);
  };

  const handleReply = async (postId) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Date.now().toString(),
      authorAlias: `Anon${Math.floor(Math.random() * 999)}`,
      content: replyContent.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await communityAPI.replyToPost(postId, replyContent);
      if (response.data?.data) {
        reply.authorAlias = response.data.data.authorAlias;
      }
    } catch (e) {}

    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
    ));
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleSupport = async (postId) => {
    if (supportedPosts.has(postId)) return;

    try {
      await communityAPI.supportPost(postId);
    } catch (e) {}

    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, supportCount: p.supportCount + 1 } : p
    ));
    setSupportedPosts(prev => new Set([...prev, postId]));
  };

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const formatTime = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };
  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar active="/community" />

      <main className="ml-64 p-10 flex-1">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-warm-900 tracking-tighter mb-2">
              Peer Community
            </h1>
            <p className="text-lg text-warm-500 font-medium">A safe, anonymous space to share and support each other.</p>
          </motion.div>
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Share Something
          </button>
        </header>

        {/* Privacy notice */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-sm text-emerald-800 font-bold leading-relaxed">
            All posts are anonymous. Your identity is never revealed. Be kind, supportive, and respectful.
          </p>
        </div>

        {/* Categories */}
        <div className="flex bg-white p-1 rounded-[1.5rem] shadow-sm border border-warm-100 mb-10 w-fit">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-100'
                  : 'text-warm-400 hover:text-warm-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* New Post Form */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10"
            >
              <div className="bg-white border-2 border-primary-100 rounded-[2.5rem] shadow-2xl shadow-primary-50 p-10">
                <h3 className="text-2xl font-black text-warm-900 mb-6 tracking-tight">Share with the community</h3>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? This space is your anonymous stage..."
                  className="w-full bg-warm-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-[2rem] px-8 py-6 text-warm-900 placeholder-warm-400 focus:outline-none transition-all resize-none h-40 font-medium mb-6"
                  maxLength={2000}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="text-[11px] font-black text-warm-400 uppercase tracking-widest">Post Category:</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="bg-warm-50 border border-warm-100 rounded-xl px-4 py-2 text-sm font-bold text-warm-700 focus:outline-none appearance-none cursor-pointer"
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setShowNewPost(false)} className="text-warm-400 hover:text-warm-900 font-bold text-sm px-6 py-2">
                      Discard
                    </button>
                    <button onClick={handleNewPost} disabled={!newPostContent.trim()} className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-10 rounded-[1.5rem] shadow-xl shadow-primary-100 transition-all disabled:opacity-30">
                      Post Anonymously
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        <div className="grid grid-cols-1 gap-8">
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-warm-100 rounded-[2.5rem] p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-warm-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-warm-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-warm-900 mb-2">The room is currently quiet</h3>
              <p className="text-warm-500 font-medium mb-10">Be the first to spark a conversation in this category.</p>
              <button onClick={() => setShowNewPost(true)} className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-12 rounded-[2rem] shadow-xl shadow-primary-200 transition-all">
                Write a Post
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {filteredPosts.map((post, pi) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: pi * 0.05 }}
                  className="bg-white border border-warm-100 rounded-[2.5rem] shadow-xl shadow-warm-100/50 p-10 hover:shadow-2xl transition-all"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-lg font-black text-primary-600 shadow-inner">
                        {post.authorAlias?.[0]}
                      </div>
                      <div>
                        <span className="text-lg font-black text-warm-900 mb-0.5 block">{post.authorAlias}</span>
                        <span className="text-[11px] font-bold text-warm-400 uppercase tracking-widest">{formatTime(post.timestamp)}</span>
                      </div>
                    </div>
                    <span className="px-5 py-2 bg-warm-50 text-warm-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-warm-100">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-10 text-warm-800 text-xl font-medium leading-[1.6]">
                    "{post.content}"
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-8 border-t border-warm-50">
                    <button
                      onClick={() => handleSupport(post.id)}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        supportedPosts.has(post.id)
                          ? 'bg-pink-50 text-pink-600 border border-pink-100'
                          : 'bg-warm-50 text-warm-500 border border-transparent hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={supportedPosts.has(post.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.supportCount} Support
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm bg-warm-50 text-warm-500 hover:bg-primary-50 hover:text-primary-600 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.replies.length} Support Threads
                    </button>
                  </div>

                  {/* Replies Section */}
                  {post.replies.length > 0 && (
                    <div className="mt-8 space-y-4 ml-10 border-l-4 border-warm-50 pl-10">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="bg-warm-50/50 rounded-[1.5rem] p-6 border border-warm-50">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{reply.authorAlias}</span>
                            <span className="text-[10px] font-bold text-warm-300 uppercase letter-spacing-wider">{formatTime(reply.timestamp)}</span>
                          </div>
                          <p className="text-warm-700 font-medium leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Form */}
                  {replyingTo === post.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 ml-10 flex gap-4">
                      <input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a supportive reply..."
                        className="flex-1 bg-warm-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-[1.2rem] px-6 py-4 font-medium transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                      />
                      <button
                        onClick={() => handleReply(post.id)}
                        disabled={!replyContent.trim()}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-black px-8 py-4 rounded-[1.2rem] disabled:opacity-30 shadow-lg shadow-primary-100 transition-all"
                      >
                        Send Reply
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
