const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// In-memory storage for demo (replace with Firestore in production)
const moodEntries = new Map();

const MOOD_TYPES = ['amazing', 'happy', 'calm', 'neutral', 'anxious', 'sad', 'angry', 'distressed'];

/**
 * POST /api/mood
 * Log a new mood entry.
 * Body: { mood: string, notes?: string }
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const { mood, notes } = req.body;
    const userId = req.user.uid;

    if (!mood || !MOOD_TYPES.includes(mood)) {
      return res.status(400).json({
        error: `Invalid mood. Must be one of: ${MOOD_TYPES.join(', ')}`
      });
    }

    if (!moodEntries.has(userId)) {
      moodEntries.set(userId, []);
    }

    const entry = {
      id: Date.now().toString(),
      mood,
      notes: notes ? notes.trim() : '',
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    moodEntries.get(userId).push(entry);

    res.json({
      success: true,
      data: entry,
      message: 'Mood logged successfully! 🌟'
    });
  } catch (error) {
    console.error('Mood logging error:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

/**
 * GET /api/mood
 * Get mood history for the authenticated user.
 * Query: ?days=7 (default 30)
 */
router.get('/', verifyToken, (req, res) => {
  try {
    const userId = req.user.uid;
    const days = parseInt(req.query.days) || 30;
    const entries = moodEntries.get(userId) || [];

    // Filter by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = entries.filter(e => new Date(e.timestamp) >= cutoffDate);

    // Calculate mood distribution
    const distribution = {};
    MOOD_TYPES.forEach(m => { distribution[m] = 0; });
    filtered.forEach(e => {
      distribution[e.mood] = (distribution[e.mood] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        entries: filtered,
        distribution,
        totalEntries: filtered.length,
        dateRange: { from: cutoffDate.toISOString(), to: new Date().toISOString() }
      }
    });
  } catch (error) {
    console.error('Mood history error:', error);
    res.status(500).json({ error: 'Failed to retrieve mood history' });
  }
});

/**
 * GET /api/mood/today
 * Check if the user has logged a mood today.
 */
router.get('/today', verifyToken, (req, res) => {
  try {
    const userId = req.user.uid;
    const entries = moodEntries.get(userId) || [];
    const today = new Date().toISOString().split('T')[0];

    const todayEntry = entries.find(e => e.date === today);

    res.json({
      success: true,
      data: {
        hasLoggedToday: !!todayEntry,
        entry: todayEntry || null
      }
    });
  } catch (error) {
    console.error('Today mood check error:', error);
    res.status(500).json({ error: 'Failed to check today\'s mood' });
  }
});

module.exports = router;
