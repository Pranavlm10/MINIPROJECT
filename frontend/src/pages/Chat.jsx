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
  distressed: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm your RECLAIM AI counselor. I'm here to listen, support, and help you explore your feelings. Whatever you're going through, this is a safe and judgment-free space.\n\nHow are you feeling today?",
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

      if (data && data.aiResponse) {
        setMessages(prev => [...prev, {
          type: 'ai',
          text: data.aiResponse,
          emotion: data.emotion,
          strategies: data.strategies,
          crisisResources: data.crisisResources,
          timestamp: data.timestamp
        }]);
      } else {
        throw new Error('Empty AI response');
      }
    } catch (error) {
      const errorMessage = error.code === 'ECONNABORTED' 
        ? "I'm taking longer than usual to respond. The AI is processing your message — please try again in a moment."
        : "I'm having trouble connecting right now. Let me try a different approach.";

      setMessages(prev => [...prev, {
        type: 'ai',
        text: errorMessage + "\n\nIn the meantime, remember: your feelings are valid.",
        emotion: 'calm',
        strategies: [
          { title: 'Deep Breathing', description: 'Try 4-7-8 breathing: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 3 times.' },
          { title: 'Grounding Exercise', description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.' }
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
    <div className="min-h-screen bg-[#fdfcff] flex">
      <Sidebar active="/chat" />

      <main className="flex-1 ml-[18rem] mr-8 my-6 flex flex-col h-[calc(100vh-3rem)] bg-white/40 border border-white/60 rounded-[3.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.02)] backdrop-blur-3xl overflow-hidden relative">
        {/* Header */}
        <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-inner ring-1 ring-primary-200/50">
              <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Counselor</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Safe Session • Active</span>
              </div>
            </div>
          </div>
          
          <Link to="/crisis" className="group flex items-center gap-3 bg-red-50 hover:bg-red-500 hover:text-white transition-all duration-300 px-6 py-3 rounded-2xl border border-red-100 font-black text-xs uppercase tracking-widest text-red-600 shadow-sm hover:shadow-red-200">
            <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Need Help?
          </Link>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 custom-scrollbar relative">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[80%] flex flex-col group">
                  <div className={`${
                    msg.type === 'user' 
                    ? 'bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-[2.5rem] rounded-tr-[0.5rem] shadow-2xl shadow-primary-200/50' 
                    : 'premium-card text-slate-800 rounded-[2.5rem] rounded-tl-[0.5rem]'
                  } px-8 py-6 relative transform transition-transform group-hover:scale-[1.02]`}>
                    <p className="leading-relaxed text-[16px] font-bold tracking-tight whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Timestamp */}
                    <div className={`absolute bottom-2 ${msg.type === 'user' ? 'right-6' : 'left-6'} opacity-0 group-hover:opacity-40 transition-opacity`}>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Emotion & Tools */}
                  <div className={`mt-4 flex flex-col gap-4 ${msg.type === 'user' ? 'items-end pr-4' : 'pl-4'}`}>
                    {msg.type === 'ai' && (
                      <div className="flex items-center gap-3">
                        {msg.emotion && (
                          <div className="glass-pill bg-slate-100/50 border-slate-200/50 text-slate-500 uppercase tracking-[0.2em] px-3">
                            {msg.emotion}
                          </div>
                        )}
                        {msg.strategies && (
                          <button
                            onClick={() => setShowStrategies(showStrategies === i ? null : i)}
                            className="glass-pill bg-primary-50 border-primary-100 text-primary-600 font-black hover:bg-primary-600 hover:text-white transition-all"
                          >
                            {showStrategies === i ? 'HIDE COPING TOOLS' : 'VIEW COPING TOOLS +'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Coping Tools Dropdown */}
                  {msg.type === 'ai' && showStrategies === i && msg.strategies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4"
                    >
                      {msg.strategies.map((s, si) => (
                        <div key={si} className="premium-card p-6 bg-white/80 hover:bg-primary-50 transition-colors border-primary-50">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 tracking-tight">{s.title}</h4>
                          </div>
                          <p className="text-xs font-bold text-slate-500 leading-relaxed">{s.description}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start pl-4">
              <div className="premium-card px-8 py-5 border-transparent bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Assistant is reflecting...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="px-10 py-8 bg-white/70 backdrop-blur-2xl border-t border-slate-100 z-20">
          <div className="flex items-center gap-5 max-w-5xl mx-auto w-full relative group">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your heart... (Enter to send)"
                className="input-premium h-16 min-h-[4rem] max-h-40 pr-32 pt-5 resize-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-slate-100/50"
                rows={1}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300 font-black text-[9px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full pointer-events-none transition-opacity group-focus-within:opacity-100 opacity-40">
                ENTER TO SEND
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="gradient-btn h-16 px-12 uppercase tracking-widest text-xs font-black disabled:opacity-20"
            >
              SEND
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              End-to-end Encrypted
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">
              Confidential Space
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

