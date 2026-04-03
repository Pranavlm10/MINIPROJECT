// ─── Client-side AI Counselor (no backend needed) ───────────────────────────

const CRISIS_KEYWORDS = [
  'suicide','suicidal','kill myself','end my life','want to die',
  'self-harm','self harm','cutting myself','hurt myself',
  'no reason to live','better off dead',"can't go on",
  'not worth living','hopeless','give up on life','ending it all','overdose'
];

const POSITIVE_WORDS = ['good','great','happy','joy','love','excited','wonderful','amazing','fantastic','grateful','awesome','positive','calm','peaceful','relaxed','content'];
const NEGATIVE_WORDS = ['bad','sad','depressed','anxious','stressed','worried','tired','exhausted','angry','frustrated','lonely','scared','afraid','hopeless','worthless','overwhelmed','fail','failed','hate','awful','terrible','horrible'];

function analyzeText(text) {
  const lower = text.toLowerCase();
  let score = 0;
  POSITIVE_WORDS.forEach(w => { if (lower.includes(w)) score += 1; });
  NEGATIVE_WORDS.forEach(w => { if (lower.includes(w)) score -= 1; });
  const words = text.split(/\s+/).length || 1;
  const comparative = score / words;
  const isCrisis = CRISIS_KEYWORDS.some(k => lower.includes(k));
  let emotion = 'neutral';
  if (isCrisis) emotion = 'distressed';
  else if (comparative >= 0.5) emotion = 'joyful';
  else if (comparative >= 0.2) emotion = 'happy';
  else if (comparative >= 0.05) emotion = 'calm';
  else if (comparative >= -0.05) emotion = 'neutral';
  else if (comparative >= -0.2) emotion = 'concerned';
  else if (comparative >= -0.4) emotion = 'sad';
  else if (comparative >= -0.6) emotion = 'anxious';
  else emotion = 'distressed';
  return { score, comparative, emotion, isCrisis };
}

const RESPONSES = {
  joyful: ["It's wonderful to hear you're feeling positive! 🌟 What's been bringing you joy today?","That's great to hear! 😊 Positive emotions are worth savoring. Reflect on this moment.","I love the positive energy! 🎉 What made today special?"],
  happy: ["I'm glad you're in a good space! 😊 What's contributing to this feeling?","That sounds really positive! Would you like to talk about what's been going well?","It's great that you're feeling good! 🌱 Keep nurturing these positive moments."],
  calm: ["It sounds like you're in a balanced state. 🧘 Anything on your mind you'd like to explore?","A calm mind is a gift. Would you like to reflect, journal, or just chat?","You seem at peace right now. 🍃 A great time to set intentions."],
  neutral: ["Thanks for sharing. I'm here to listen. How are you really feeling today?","I hear you. Would you like to explore your feelings a bit deeper?","I'm here for you. Would you like to talk, explore a coping strategy, or just chat?"],
  concerned: ["I sense something might be weighing on you. 💙 Would you like to talk about it?","It sounds like things are a bit challenging. It's okay not to be okay — I'm here.","Your feelings are valid. 🤝 Would it help to talk through what's been going on?"],
  sad: ["I'm sorry you're going through a difficult time. 💙 Your feelings are completely valid.","It takes courage to acknowledge sadness. I'm right here with you. 🤗","You don't have to carry this alone. What would feel most helpful right now?"],
  anxious: ["Anxiety can feel overwhelming, but you've taken a brave step by reaching out. 💙 Try this: name 5 things you can see right now.","Let's try 4-7-8 breathing: breathe in for 4 counts, hold for 7, exhale for 8. 🫁","What's triggering your anxiety? Sometimes naming it takes away some of its power."],
  distressed: ["I can tell you're going through something really tough. I want you to know you are not alone. 💙","Your pain is valid. Your safety is the most important thing right now. Please reach out to a professional.","What you're feeling sounds really heavy. Let's talk about getting you some support. 💙"]
};

const STRATEGIES = {
  joyful: [{ title: 'Gratitude Journaling', description: 'Write 3 things you\'re grateful for to amplify positive feelings.' }, { title: 'Share the Joy', description: 'Tell a friend about your positive experience.' }],
  happy: [{ title: 'Mindful Savoring', description: 'Pause and fully immerse yourself in this positive moment.' }, { title: 'Create a Joy List', description: 'Start a list of things that bring you happiness.' }],
  calm: [{ title: 'Meditation', description: 'Try a 5-minute meditation to deepen your calm.' }, { title: 'Reflective Writing', description: 'Write about what\'s helped you feel balanced today.' }],
  neutral: [{ title: 'Body Scan', description: 'Do a quick body scan to check in with how you\'re physically feeling.' }, { title: 'Goal Setting', description: 'Use this balanced moment to set a small, achievable goal.' }],
  concerned: [{ title: 'Progressive Muscle Relaxation', description: 'Tense and release each muscle group for 5 seconds.' }, { title: 'Thought Reframing', description: 'Write your worry, then write a more balanced perspective next to it.' }],
  sad: [{ title: 'Self-Compassion Break', description: 'Place your hand on your heart and say: "This is difficult. May I be kind to myself."' }, { title: 'Gentle Movement', description: 'Take a short walk or do some gentle stretching to shift your energy.' }],
  anxious: [{ title: '5-4-3-2-1 Grounding', description: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.' }, { title: '4-7-8 Breathing', description: 'Inhale 4 counts, hold 7, exhale 8. Repeat 3 times.' }],
  distressed: [{ title: 'Immediate Grounding', description: 'Splash cold water on your face or press your feet firmly on the ground.' }, { title: 'Reach Out Now', description: 'iCall India: 9152987821 | Vandrevala: 1860-2662-345 | International: text HOME to 741741.' }]
};

export function generateCounselorResponse(message) {
  const analysis = analyzeText(message);
  const { emotion, isCrisis } = analysis;
  const pool = RESPONSES[emotion] || RESPONSES.neutral;
  const text = pool[Math.floor(Math.random() * pool.length)];
  const strategies = STRATEGIES[emotion] || STRATEGIES.neutral;
  const result = { aiResponse: text, emotion, strategies, timestamp: new Date().toISOString() };
  if (isCrisis) {
    result.crisisResources = {
      message: '🚨 I\'m concerned about your safety. Please reach out immediately:',
      resources: [
        { name: 'iCall (India)', contact: '9152987821', available: 'Mon-Sat 8am-10pm' },
        { name: 'Vandrevala Foundation', contact: '1860-2662-345', available: '24/7' },
        { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' },
        { name: '988 Lifeline (US)', contact: 'Call/text 988', available: '24/7' }
      ]
    };
  }
  return result;
}
