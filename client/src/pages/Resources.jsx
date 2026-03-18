import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resourcesAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const CATEGORY_ICONS = {
  stress: (
    <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  anxiety: (
    <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  depression: (
    <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  academic: (
    <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  sleep: (
    <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  social: (
    <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const FALLBACK_RESOURCES = {
  categories: [
    {
      id: 'stress', name: 'Stress Management',
      resources: [
        { title: 'Progressive Muscle Relaxation', description: 'Systematically tense and release muscle groups to reduce physical tension. Start from your toes and work up to your head.', type: 'exercise', duration: '10-15 minutes' },
        { title: '4-7-8 Breathing Technique', description: 'Inhale through your nose for 4 seconds, hold for 7 seconds, exhale through your mouth for 8 seconds. Repeat 4 times.', type: 'breathing', duration: '5 minutes' },
        { title: 'Time Blocking for Students', description: 'Divide your day into focused study blocks (25-50 minutes) with breaks. Use the Pomodoro technique.', type: 'article', duration: '5 min read' },
        { title: 'Body Scan Meditation', description: 'Lie comfortably and bring attention to each part of your body from head to toe. Notice sensations without judgment.', type: 'meditation', duration: '15-20 minutes' }
      ]
    },
    {
      id: 'anxiety', name: 'Anxiety Relief',
      resources: [
        { title: '5-4-3-2-1 Grounding Exercise', description: 'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.', type: 'exercise', duration: '5 minutes' },
        { title: 'Cognitive Restructuring', description: 'Identify anxious thoughts, examine evidence for and against them, then create a more balanced perspective.', type: 'technique', duration: '10-15 minutes' },
        { title: 'Box Breathing', description: 'Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Used by Navy SEALs.', type: 'breathing', duration: '5 minutes' },
        { title: 'Worry Journaling', description: 'Set aside 15 minutes to write down all your worries. For each, rate the likelihood and write one action step.', type: 'journaling', duration: '15 minutes' }
      ]
    },
    {
      id: 'depression', name: 'Mood Improvement',
      resources: [
        { title: 'Behavioral Activation', description: 'When feeling low, schedule one small enjoyable activity. Action often precedes motivation.', type: 'technique', duration: '15-30 minutes' },
        { title: 'Gratitude Practice', description: 'Each evening, write 3 specific things you are grateful for. Proven to improve mood in 2-3 weeks.', type: 'journaling', duration: '5 minutes' },
        { title: 'Sunlight & Movement', description: 'Spend at least 15 minutes outdoors in natural light. Even a short walk triggers endorphin release.', type: 'lifestyle', duration: '15-30 minutes' },
        { title: 'Self-Compassion Meditation', description: 'Place your hands on your heart and repeat: "May I be kind to myself. May I accept myself as I am."', type: 'meditation', duration: '10 minutes' }
      ]
    },
    {
      id: 'academic', name: 'Academic Wellness',
      resources: [
        { title: 'Exam Anxiety Management', description: 'Prepare in advance, practice with timed tests, use visualization. Remember: anxiety is energy you can redirect.', type: 'article', duration: '7 min read' },
        { title: 'Healthy Study Habits', description: 'Study in 45-minute blocks, review notes within 24 hours, teach concepts to others, prioritize sleep.', type: 'article', duration: '5 min read' },
        { title: 'Perfectionism & Academic Pressure', description: 'Set realistic goals, celebrate progress over perfection, separate self-worth from grades.', type: 'article', duration: '8 min read' }
      ]
    },
    {
      id: 'sleep', name: 'Better Sleep',
      resources: [
        { title: 'Sleep Hygiene Checklist', description: 'Keep consistent sleep times, avoid screens 1hr before bed, keep your room cool and dark, limit caffeine after 2pm.', type: 'checklist', duration: '5 min read' },
        { title: 'Progressive Relaxation for Sleep', description: 'Lying in bed, tense each muscle group for 5 seconds then release for 10 seconds, from feet to head.', type: 'exercise', duration: '15 minutes' }
      ]
    },
    {
      id: 'social', name: 'Social Well-being',
      resources: [
        { title: 'Building Meaningful Connections', description: 'Focus on deepening 2-3 relationships rather than many surface-level ones. Practice active listening.', type: 'article', duration: '6 min read' },
        { title: 'Setting Boundaries', description: 'Practice saying "I need some time to think about that" instead of immediate yes/no. Your needs matter.', type: 'technique', duration: '5 min read' },
        { title: 'Dealing with Loneliness', description: 'Join a club or study group, volunteer, or visit campus community spaces. Start with small interactions.', type: 'article', duration: '7 min read' }
      ]
    }
  ]
};

const TYPE_BADGES = {
  exercise: { label: 'Exercise', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  breathing: { label: 'Breathing', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  article: { label: 'Article', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  meditation: { label: 'Meditation', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  technique: { label: 'Technique', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  journaling: { label: 'Journaling', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  lifestyle: { label: 'Lifestyle', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  checklist: { label: 'Checklist', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  visualization: { label: 'Visualization', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
};

export default function Resources() {
  const [resources, setResources] = useState(FALLBACK_RESOURCES);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await resourcesAPI.getAll();
        if (response.data?.data) {
          setResources(response.data.data);
        }
      } catch (e) {
        // Use fallback resources
      }
    };
    fetchResources();
  }, []);

  const displayCategories = activeCategory
    ? resources.categories.filter(c => c.id === activeCategory)
    : resources.categories;

  return (
    <div className="min-h-screen bg-warm-50">
      <Sidebar active="/resources" />

      <main className="ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-primary-700">Self-Help Resources</span>
          </h1>
          <p className="text-warm-500">Evidence-based coping strategies, exercises, and guides for your well-being.</p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !activeCategory ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30' : 'text-warm-500 hover:bg-warm-50 border border-transparent'
            }`}
          >
            All Categories
          </button>
          {resources.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30' : 'text-warm-500 hover:bg-warm-50 border border-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Resource Cards */}
        <div className="space-y-8">
          {displayCategories.map((category, ci) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                  {CATEGORY_ICONS[category.id] || CATEGORY_ICONS.stress}
                </span>
                {category.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.resources.map((resource, ri) => {
                  const badge = TYPE_BADGES[resource.type] || TYPE_BADGES.article;
                  const isExpanded = expandedCard === `${category.id}-${ri}`;

                  return (
                    <motion.div
                      key={ri}
                      layout
                      className="bg-white border border-warm-200 rounded-xl hover:shadow-md transition-all duration-200 p-5 cursor-pointer"
                      onClick={() => setExpandedCard(isExpanded ? null : `${category.id}-${ri}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-warm-900 pr-2">{resource.title}</h3>
                        <span className={`badge border text-xs whitespace-nowrap ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      <p className={`text-warm-500 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-warm-400 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {resource.duration}
                        </span>
                        <span className="text-xs text-primary-600">
                          {isExpanded ? 'Click to collapse' : 'Click to expand'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
}
