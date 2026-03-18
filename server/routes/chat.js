const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { analyzeText, generateResponse } = require('../services/sentiment');

// In-memory storage for demo (replace with Firestore in production)
const conversations = new Map();

/**
 * POST /api/chat
 * Send a message to the AI counselor.
 * Body: { message: string }
 * Returns: AI response with sentiment analysis, emotion, strategies
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.uid;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Analyze sentiment
    const analysis = analyzeText(message);

    // Generate adaptive response
    const aiResponse = generateResponse(analysis);

    // Store conversation
    if (!conversations.has(userId)) {
      conversations.set(userId, []);
    }

    const entry = {
      id: Date.now().toString(),
      userMessage: message.trim(),
      aiResponse: aiResponse.message,
      emotion: aiResponse.emotion,
      analysis: {
        score: analysis.score,
        comparative: analysis.comparative,
        isCrisis: analysis.isCrisis
      },
      strategies: aiResponse.strategies,
      timestamp: new Date().toISOString()
    };

    if (aiResponse.crisisResources) {
      entry.crisisResources = aiResponse.crisisResources;
    }

    conversations.get(userId).push(entry);

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * GET /api/chat/history
 * Retrieve chat history for the authenticated user.
 */
router.get('/history', verifyToken, (req, res) => {
  try {
    const userId = req.user.uid;
    const history = conversations.get(userId) || [];

    res.json({
      success: true,
      data: history.slice(-50) // Return last 50 messages
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

/**
 * DELETE /api/chat/history
 * Clear chat history for the authenticated user.
 */
router.delete('/history', verifyToken, (req, res) => {
  try {
    const userId = req.user.uid;
    conversations.delete(userId);

    res.json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;
