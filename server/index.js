require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const chatRoutes = require('./routes/chat');
const moodRoutes = require('./routes/mood');
const communityRoutes = require('./routes/community');
const resourcesRoutes = require('./routes/resources');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/resources', resourcesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RECLAIM API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`✨ RECLAIM server running on http://localhost:${PORT}`);
});
