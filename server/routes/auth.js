const express = require('express');
const router = express.Router();

// Simple profile/auth status route
router.get('/profile', (req, res) => {
  // In a real app, this would use verifyToken middleware
  res.json({
    success: true,
    user: {
      uid: 'demo-user-001',
      email: 'demo@mindwell.app',
      displayName: 'Demo User',
      createdAt: new Date().toISOString()
    }
  });
});

module.exports = router;
