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
    <div className="min-h-screen bg-warm-50">
      <Sidebar active="/community" />

      <main className="ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="text-primary-700">Peer Community</span>
            </h1>
            <p className="text-warm-500">A safe, anonymous space to share and support each other.</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="gradient-btn text-sm py-2 px-5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Share Something
          </button>
        </motion.div>

        {/* Privacy notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-sm text-emerald-300/80">
            All posts are anonymous. Your identity is never revealed. Be kind, supportive, and respectful.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30'
                  : 'text-warm-500 hover:bg-warm-50 border border-transparent'
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-white border border-warm-200 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-3">Share with the community</h3>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? Remember, this is anonymous..."
                  className="input-field resize-none h-28 mb-3"
                  maxLength={2000}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-warm-500">Category:</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="bg-warm-50 border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-900 focus:outline-none"
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id} className="bg-white">{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowNewPost(false)} className="text-warm-500 hover:text-warm-900 text-sm px-4 py-2">
                      Cancel
                    </button>
                    <button onClick={handleNewPost} disabled={!newPostContent.trim()} className="gradient-btn text-sm py-2 px-5 disabled:opacity-30">
                      Post Anonymously
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-12 h-12 text-warm-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-warm-600 mb-2">No posts yet</h3>
              <p className="text-warm-400 mb-4">Be the first to share in this category.</p>
              <button onClick={() => setShowNewPost(true)} className="gradient-btn text-sm py-2 px-6">
                Write a Post
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {filteredPosts.map((post, pi) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pi * 0.05 }}
                  className="bg-white border border-warm-200 rounded-xl shadow-sm p-5"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-xs font-bold text-primary-700">
                        {post.authorAlias?.[0]}
                      </div>
                      <span className="text-sm font-medium text-primary-700">{post.authorAlias}</span>
                      <span className="text-xs text-warm-400">&bull;</span>
                      <span className="text-xs text-warm-400">{formatTime(post.timestamp)}</span>
                    </div>
                    <span className="badge bg-warm-50 text-warm-500 border border-warm-200 text-xs">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-surface-200 leading-relaxed mb-4">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => handleSupport(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-all ${
                        supportedPosts.has(post.id)
                          ? 'text-pink-400'
                          : 'text-warm-400 hover:text-pink-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={supportedPosts.has(post.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.supportCount} support
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-sm text-warm-400 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                  </div>

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="ml-6 border-l-2 border-warm-200 pl-4 space-y-3 mb-3">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="bg-white/3 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-medium text-primary-700">{reply.authorAlias}</span>
                            <span className="text-xs text-warm-400">&bull; {formatTime(reply.timestamp)}</span>
                          </div>
                          <p className="text-sm text-warm-600">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === post.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 mt-2"
                    >
                      <input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a supportive reply..."
                        className="input-field text-sm py-2"
                        onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                      />
                      <button
                        onClick={() => handleReply(post.id)}
                        disabled={!replyContent.trim()}
                        className="gradient-btn text-sm py-2 px-4 disabled:opacity-30 whitespace-nowrap"
                      >
                        Reply
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
