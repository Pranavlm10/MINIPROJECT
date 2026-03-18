const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// In-memory storage for demo (replace with Firestore in production)
const posts = [];
let postIdCounter = 1;

// Anonymous alias generator
const ADJECTIVES = ['Brave', 'Calm', 'Gentle', 'Kind', 'Serene', 'Warm', 'Wise', 'Strong', 'Hopeful', 'Peaceful', 'Resilient', 'Bright'];
const NOUNS = ['Phoenix', 'Panda', 'Dolphin', 'Butterfly', 'Sunrise', 'River', 'Star', 'Cloud', 'Moon', 'Garden', 'Sparrow', 'Lotus'];

function generateAlias() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
}

/**
 * POST /api/community
 * Create an anonymous forum post.
 * Body: { content: string, category?: string }
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const { content, category } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({ error: 'Content must be under 2000 characters' });
    }

    const post = {
      id: (postIdCounter++).toString(),
      authorAlias: generateAlias(),
      authorUid: req.user.uid, // stored but never exposed
      content: content.trim(),
      category: category || 'general',
      replies: [],
      supportCount: 0,
      supportedBy: [],
      timestamp: new Date().toISOString()
    };

    posts.unshift(post);

    // Return without authorUid for privacy
    const { authorUid, supportedBy, ...safePost } = post;
    res.json({ success: true, data: safePost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

/**
 * GET /api/community
 * List community posts (paginated).
 * Query: ?page=1&limit=20&category=general
 */
router.get('/', verifyToken, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;

    let filtered = posts;
    if (category && category !== 'all') {
      filtered = posts.filter(p => p.category === category);
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Strip private fields
    const safePosts = paginated.map(({ authorUid, supportedBy, ...rest }) => rest);

    res.json({
      success: true,
      data: {
        posts: safePosts,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

/**
 * POST /api/community/:id/reply
 * Reply to a community post anonymously.
 * Body: { content: string }
 */
router.post('/:id/reply', verifyToken, (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Reply content is required' });
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = {
      id: Date.now().toString(),
      authorAlias: generateAlias(),
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    post.replies.push(reply);

    res.json({ success: true, data: reply });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

/**
 * POST /api/community/:id/support
 * Send a "support" reaction to a post.
 */
router.post('/:id/support', verifyToken, (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.uid;

    const post = posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Prevent duplicate support
    if (post.supportedBy.includes(userId)) {
      return res.status(400).json({ error: 'You have already supported this post' });
    }

    post.supportedBy.push(userId);
    post.supportCount++;

    res.json({
      success: true,
      data: { supportCount: post.supportCount }
    });
  } catch (error) {
    console.error('Support error:', error);
    res.status(500).json({ error: 'Failed to support post' });
  }
});

module.exports = router;
