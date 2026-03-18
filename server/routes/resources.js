const express = require('express');
const router = express.Router();

/**
 * Curated self-help resources, coping strategies, and crisis information.
 */
const RESOURCES = {
  categories: [
    {
      id: 'stress',
      name: 'Stress Management',
      icon: '🧘',
      resources: [
        {
          title: 'Progressive Muscle Relaxation',
          description: 'Systematically tense and release muscle groups to reduce physical tension and anxiety. Start from your toes and work up to your head.',
          type: 'exercise',
          duration: '10-15 minutes'
        },
        {
          title: '4-7-8 Breathing Technique',
          description: 'Inhale through your nose for 4 seconds, hold for 7 seconds, exhale through your mouth for 8 seconds. Repeat 4 times. This activates your parasympathetic nervous system.',
          type: 'breathing',
          duration: '5 minutes'
        },
        {
          title: 'Time Blocking for Students',
          description: 'Divide your day into focused study blocks (25-50 minutes) with breaks. Use the Pomodoro technique to maintain focus without burnout.',
          type: 'article',
          duration: '5 min read'
        },
        {
          title: 'Body Scan Meditation',
          description: 'Lie comfortably and bring attention to each part of your body from head to toe. Notice sensations without judgment. This practice helps identify where you hold stress.',
          type: 'meditation',
          duration: '15-20 minutes'
        }
      ]
    },
    {
      id: 'anxiety',
      name: 'Anxiety Relief',
      icon: '🌊',
      resources: [
        {
          title: '5-4-3-2-1 Grounding Exercise',
          description: 'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This anchors you to the present moment.',
          type: 'exercise',
          duration: '5 minutes'
        },
        {
          title: 'Cognitive Restructuring',
          description: 'Identify anxious thoughts, examine the evidence for and against them, then create a more balanced perspective. Ask yourself: "Is this thought based on facts or feelings?"',
          type: 'technique',
          duration: '10-15 minutes'
        },
        {
          title: 'Box Breathing',
          description: 'Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat. Used by Navy SEALs for stress management.',
          type: 'breathing',
          duration: '5 minutes'
        },
        {
          title: 'Worry Journaling',
          description: 'Set aside 15 minutes to write down all your worries. For each, rate the likelihood (1-10) and write one thing you can do about it. This externalizes anxiety and builds agency.',
          type: 'journaling',
          duration: '15 minutes'
        }
      ]
    },
    {
      id: 'depression',
      name: 'Mood Improvement',
      icon: '🌻',
      resources: [
        {
          title: 'Behavioral Activation',
          description: 'When feeling low, schedule one small enjoyable activity (a walk, favorite song, calling a friend). Action often precedes motivation, not the other way around.',
          type: 'technique',
          duration: '15-30 minutes'
        },
        {
          title: 'Gratitude Practice',
          description: 'Each evening, write 3 specific things you are grateful for. Research shows this can significantly improve mood over 2-3 weeks of consistent practice.',
          type: 'journaling',
          duration: '5 minutes'
        },
        {
          title: 'Sunlight & Movement',
          description: 'Spend at least 15 minutes outdoors in natural light. Even a short walk triggers endorphin release and helps regulate your circadian rhythm.',
          type: 'lifestyle',
          duration: '15-30 minutes'
        },
        {
          title: 'Self-Compassion Meditation',
          description: 'Place your hands on your heart and repeat: "May I be kind to myself. May I accept myself as I am. This is a moment of difficulty, and difficulty is part of life."',
          type: 'meditation',
          duration: '10 minutes'
        }
      ]
    },
    {
      id: 'academic',
      name: 'Academic Wellness',
      icon: '📚',
      resources: [
        {
          title: 'Exam Anxiety Management',
          description: 'Prepare study material in advance, practice with timed tests, use visualization to imagine success, and arrive early to exams. Remember: anxiety is energy you can redirect.',
          type: 'article',
          duration: '7 min read'
        },
        {
          title: 'Healthy Study Habits',
          description: 'Study in focused 45-minute blocks, review notes within 24 hours, teach concepts to others, and prioritize sleep over late-night cramming.',
          type: 'article',
          duration: '5 min read'
        },
        {
          title: 'Perfectionism & Academic Pressure',
          description: 'Set realistic goals, celebrate progress over perfection, separate self-worth from grades, and remember that mistakes are essential for learning.',
          type: 'article',
          duration: '8 min read'
        }
      ]
    },
    {
      id: 'sleep',
      name: 'Better Sleep',
      icon: '🌙',
      resources: [
        {
          title: 'Sleep Hygiene Checklist',
          description: 'Keep consistent sleep/wake times, avoid screens 1 hour before bed, keep your room cool and dark, limit caffeine after 2pm, and use your bed only for sleep.',
          type: 'checklist',
          duration: '5 min read'
        },
        {
          title: 'Progressive Relaxation for Sleep',
          description: 'Lying in bed, tense each muscle group for 5 seconds then release for 10 seconds. Start with your feet and work upward. This signals your body to relax.',
          type: 'exercise',
          duration: '15 minutes'
        },
        {
          title: 'Sleep Story: Peaceful Night',
          description: 'Imagine yourself in a calm meadow on a warm evening. The grass is soft beneath you. Stars appear one by one. Your breathing slows naturally as you listen to distant crickets...',
          type: 'visualization',
          duration: '10-15 minutes'
        }
      ]
    },
    {
      id: 'social',
      name: 'Social Well-being',
      icon: '🤝',
      resources: [
        {
          title: 'Building Meaningful Connections',
          description: 'Quality matters more than quantity. Focus on deepening 2-3 relationships rather than maintaining many surface-level ones. Practice active listening and vulnerability.',
          type: 'article',
          duration: '6 min read'
        },
        {
          title: 'Setting Boundaries',
          description: 'Healthy boundaries protect your energy. Practice saying "I need some time to think about that" instead of immediate yes/no. Your needs matter too.',
          type: 'technique',
          duration: '5 min read'
        },
        {
          title: 'Dealing with Loneliness',
          description: 'Loneliness is common, especially for students. Join a club or study group, volunteer, or visit campus community spaces. Start with small interactions and build from there.',
          type: 'article',
          duration: '7 min read'
        }
      ]
    }
  ],
  crisisResources: [
    { name: '988 Suicide & Crisis Lifeline (USA)', contact: 'Call or text 988', available: '24/7', type: 'phone' },
    { name: 'Crisis Text Line (USA)', contact: 'Text HOME to 741741', available: '24/7', type: 'text' },
    { name: 'AASRA (India)', contact: 'Call 9820466726', available: '24/7', type: 'phone' },
    { name: 'iCall (India)', contact: 'Call 9152987821', available: 'Mon-Sat 8am-10pm', type: 'phone' },
    { name: 'Vandrevala Foundation (India)', contact: 'Call 1860-2662-345', available: '24/7', type: 'phone' },
    { name: 'Befrienders Worldwide', contact: 'https://befrienders.org', available: 'Directory', type: 'web' },
    { name: 'International Association for Suicide Prevention', contact: 'https://www.iasp.info/resources/Crisis_Centres/', available: 'Directory', type: 'web' }
  ]
};

/**
 * GET /api/resources
 * Returns all self-help resources.
 * Query: ?category=stress
 */
router.get('/', (req, res) => {
  try {
    const category = req.query.category;

    if (category) {
      const found = RESOURCES.categories.find(c => c.id === category);
      if (!found) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json({
        success: true,
        data: {
          category: found,
          crisisResources: RESOURCES.crisisResources
        }
      });
    }

    res.json({
      success: true,
      data: RESOURCES
    });
  } catch (error) {
    console.error('Resources error:', error);
    res.status(500).json({ error: 'Failed to retrieve resources' });
  }
});

/**
 * GET /api/resources/crisis
 * Returns crisis/emergency resources only.
 */
router.get('/crisis', (req, res) => {
  res.json({
    success: true,
    data: RESOURCES.crisisResources
  });
});

module.exports = router;
