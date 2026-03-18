import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { chatAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

const EMOTION_COLORS = {
  joyful: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  happy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  calm: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  neutral: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
  concerned: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  sad: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  anxious: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  distressed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm your MindWell AI counselor. I'm here to listen, support, and help you explore your feelings. Whatever you're going through, this is a safe and judgment-free space.\n\nHow are you feeling today?",
      emotion: 'calm',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStrategies, setShowStrategies] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date().toISOString()
    }]);

    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage);
      const data = response.data.data;

      setMessages(prev => [...prev, {
        type: 'ai',
        text: data.aiResponse,
        emotion: data.emotion,
        strategies: data.strategies,
        crisisResources: data.crisisResources,
        timestamp: data.timestamp
      }]);
    } catch (error) {
      const fallbackResponses = [
        "I hear you, and I want you to know that your feelings are valid. Would you like to tell me more about what you're experiencing?",
        "Thank you for sharing that with me. It takes courage to open up. What would feel most helpful for you right now — talking things through, or exploring a coping strategy?",
        "I'm here for you. Whatever you're going through, you don't have to face it alone. Would you like to explore some techniques that might help?",
        "Your well-being matters, and I appreciate you trusting me with your thoughts. Let's work through this together.",
      ];

      setMessages(prev => [...prev, {
        type: 'ai',
        text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        emotion: 'calm',
        strategies: [
          { title: 'Deep Breathing', description: 'Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.' },
          { title: 'Grounding Exercise', description: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.' }
        ],
        timestamp: new Date().toISOString()
      }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <Sidebar active="/chat" />

      <main className="ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="px-6 py-4 border-b border-warm-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="font-semibold text-warm-900">AI Counselor</h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-warm-500">Online — Confidential — Judgment-free</span>
                </div>
              </div>
            </div>
            <Link to="/crisis" className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Crisis Help
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-warm-50">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%]`}>
                  {/* Message bubble */}
                  <div className={msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Emotion badge for AI messages */}
                  {msg.type === 'ai' && msg.emotion && (
                    <div className="flex items-center gap-2 mt-2 ml-2">
                      <span className={`badge ${EMOTION_COLORS[msg.emotion]?.bg || 'bg-gray-50'} ${EMOTION_COLORS[msg.emotion]?.text || 'text-gray-600'} ${EMOTION_COLORS[msg.emotion]?.border || 'border-gray-200'} border`}>
                        {msg.emotion}
                      </span>
                      {msg.strategies && (
                        <button
                          onClick={() => setShowStrategies(showStrategies === i ? null : i)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {showStrategies === i ? 'Hide' : 'View'} coping strategies
                        </button>
                      )}
                    </div>
                  )}

                  {/* Coping Strategies */}
                  {msg.type === 'ai' && showStrategies === i && msg.strategies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-2 ml-2"
                    >
                      {msg.strategies.map((s, si) => (
                        <div key={si} className="bg-primary-50 rounded-lg p-3 border border-primary-100">
                          <h4 className="text-sm font-medium text-primary-800 mb-1">{s.title}</h4>
                          <p className="text-xs text-warm-600">{s.description}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Crisis Resources */}
                  {msg.crisisResources && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4 ml-2"
                    >
                      <div>
                        <p className="text-red-800 font-medium text-sm mb-2">
                          {msg.crisisResources.message}
                        </p>
                        {msg.crisisResources.resources.map((r, ri) => (
                          <div key={ri} className="text-xs text-red-700 mb-1">
                            <strong>{r.name}</strong>: {r.contact} ({r.available})
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Timestamp */}
                  <div className={`text-xs text-warm-400 mt-1 ${msg.type === 'user' ? 'text-right mr-2' : 'ml-2'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="chat-bubble-ai">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
                <p className="text-xs text-warm-400 mt-1">MindWell is thinking...</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-warm-200 bg-white">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="input-field resize-none min-h-[48px] max-h-32 pr-4"
                rows={1}
              />
            </div>
            <button
              id="chat-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="gradient-btn py-3 px-6 rounded-lg disabled:opacity-30 flex items-center gap-2"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-warm-400 mt-2 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            This conversation is confidential. If you're in crisis, please use the{' '}
            <Link to="/crisis" className="text-red-600 hover:text-red-700 font-medium">Crisis Help</Link> resources.
          </p>
        </div>
      </main>
    </div>
  );
}
