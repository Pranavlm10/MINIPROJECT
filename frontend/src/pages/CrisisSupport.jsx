import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CRISIS_RESOURCES = [
  {
    region: 'United States',
    resources: [
      { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', type: 'phone', available: '24/7', description: 'Free, confidential support for people in distress' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', type: 'text', available: '24/7', description: 'Free crisis counseling via text message' },
      { name: 'SAMHSA National Helpline', contact: '1-800-662-4357', type: 'phone', available: '24/7', description: 'Treatment referral service for mental health and substance abuse' },
    ]
  },
  {
    region: 'India',
    resources: [
      { name: 'AASRA', contact: '9820466726', type: 'phone', available: '24/7', description: 'Crisis support and suicide prevention' },
      { name: 'iCall', contact: '9152987821', type: 'phone', available: 'Mon-Sat 8am-10pm', description: 'Professional counseling service by TISS' },
      { name: 'Vandrevala Foundation', contact: '1860-2662-345', type: 'phone', available: '24/7', description: 'Mental health support in multiple languages' },
      { name: 'NIMHANS', contact: '080-46110007', type: 'phone', available: 'Mon-Sat 9:30am-5pm', description: 'National Institute of Mental Health helpline' },
    ]
  },
  {
    region: 'United Kingdom',
    resources: [
      { name: 'Samaritans', contact: '116 123', type: 'phone', available: '24/7', description: 'Emotional support for anyone in distress' },
      { name: 'SHOUT Crisis Text Line', contact: 'Text SHOUT to 85258', type: 'text', available: '24/7', description: 'Free text-based crisis support' },
    ]
  },
  {
    region: 'International',
    resources: [
      { name: 'Befrienders Worldwide', contact: 'befrienders.org', type: 'web', available: 'Directory', description: 'Find a helpline in your country' },
      { name: 'IASP Crisis Centres', contact: 'iasp.info/resources/Crisis_Centres', type: 'web', available: 'Directory', description: 'International directory of crisis centers' },
    ]
  }
];

export default function CrisisSupport() {
  return (
    <div className="min-h-screen bg-transparent flex">
      {/* Full-width emergency banner */}
      <div className="bg-red-600 shadow-xl shadow-red-100 border-b border-red-700">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <svg className="w-8 h-8 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Crisis Support</h1>
              <p className="text-red-100 font-bold opacity-90">If you are in immediate danger, call your local emergency services (e.g., 911/112/100).</p>
            </div>
          </div>
          <Link to="/dashboard" className="bg-white/10 hover:bg-white/20 text-white font-black px-6 py-3 rounded-xl transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Safety
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Emergency Call */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-red-100 rounded-[3rem] p-12 text-center mb-12 shadow-2xl shadow-red-50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl animate-pulse" />
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-red-600 mb-6 tracking-tighter">You Are Not Alone</h2>
            <p className="text-xl text-warm-600 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
              If you're feeling overwhelmed or hopeless, please reach out now. 
              Counselors are standing by 24/7 to listen and support you without judgment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="tel:988"
                className="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-6 rounded-[2rem] text-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-200 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.442 1.411c-1.031-.226-2.062.247-2.618 1.154l-1.047 1.714c-.556.907-.378 2.067.436 2.766L15.39 8.16a1.442 1.442 0 0 1 .425 1.57c-.244.693-.761 1.258-1.42 1.545-2.065.897-4.004-.156-5.467-2.583-.434-.725-.386-1.638.121-2.31l1.764-2.333c.63-.834.423-2.035-.466-2.67l-1.847-1.32c-.889-.635-2.146-.42-2.83.48L3.13 4.2c-.896 1.171-.97 2.774-.183 4.026 3.12 4.965 8.358 12.352 14.12 12.352 2.033 0 3.737-1.332 4.318-3.328l.583-2.012c.287-.991-.252-2.043-1.253-2.454l-3.273-1.373z"/>
                  </svg>
                </div>
                Call 988 Now
              </a>
              <a
                href="sms:741741?body=HOME"
                className="bg-warm-100 hover:bg-warm-200 text-warm-900 font-black px-12 py-6 rounded-[2rem] text-2xl transition-all flex items-center gap-4 border-2 border-warm-200"
              >
                <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-warm-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Text HOME to 741741
              </a>
            </div>
          </div>
        </motion.div>

        {/* Safety Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-warm-100 rounded-[3rem] shadow-xl p-10 mb-12"
        >
          <h2 className="text-2xl font-black text-warm-900 mb-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            Universal Safety Protocol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01', title: 'Grounding', desc: 'Hold something cold or focus on 5 things you can see. Breath in for 4, out for 6.',
                color: 'bg-teal-50', iconColor: 'text-teal-600',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 017.072 0" />
              },
              {
                step: '02', title: 'Connecting', desc: 'Reach out to a trusted person or a hotline listed below. Do not try to carry this alone.',
                color: 'bg-blue-50', iconColor: 'text-blue-600',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              },
              {
                step: '03', title: 'Safeguarding', desc: 'Ensure you are in a safe physical environment. Remove anything that could be harmful.',
                color: 'bg-emerald-50', iconColor: 'text-emerald-600',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              },
            ].map((item, i) => (
              <div key={i} className={`${item.color} rounded-[2rem] p-8 border border-white transition-all hover:scale-[1.02]`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${item.iconColor} shadow-sm`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      {item.icon}
                    </svg>
                  </div>
                  <span className={`text-2xl font-black ${item.iconColor} opacity-20`}>{item.step}</span>
                </div>
                <h3 className="text-xl font-black text-warm-900 mb-3">{item.title}</h3>
                <p className="text-sm text-warm-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Crisis Resources by Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CRISIS_RESOURCES.map((region, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + ri * 0.1 }}
              className="bg-white border border-warm-200 rounded-[2.5rem] shadow-xl p-8"
            >
              <h2 className="text-xl font-black text-warm-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center text-warm-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </span>
                {region.region}
              </h2>
              <div className="space-y-4">
                {region.resources.map((resource, rri) => (
                  <div key={rri} className="bg-warm-50/50 rounded-2xl p-6 border border-warm-100 flex flex-col justify-between group hover:bg-white hover:border-primary-200 transition-all cursor-default">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-warm-900 text-lg uppercase tracking-tight">{resource.name}</h3>
                        <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">{resource.available}</span>
                      </div>
                      <p className="text-sm text-warm-500 font-medium leading-relaxed">{resource.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-warm-100/50">
                      <span className="text-2xl font-black text-primary-600 tracking-tighter">{resource.contact}</span>
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.442 1.411c-1.031-.226-2.062.247-2.618 1.154l-1.047 1.714c-.556.907-.378 2.067.436 2.766L15.39 8.16a1.442 1.442 0 0 1 .425 1.57c-.244.693-.761 1.258-1.42 1.545-2.065.897-4.004-.156-5.467-2.583-.434-.725-.386-1.638.121-2.31l1.764-2.333c.63-.834.423-2.035-.466-2.67l-1.847-1.32c-.889-.635-2.146-.42-2.83.48L3.13 4.2c-.896 1.171-.97 2.774-.183 4.026 3.12 4.965 8.358 12.352 14.12 12.352 2.033 0 3.737-1.332 4.318-3.328l.583-2.012c.287-.991-.252-2.043-1.253-2.454l-3.273-1.373z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 mb-12"
        >
          <p className="text-3xl font-black text-warm-900 tracking-tighter mb-4 italic">
            "Your story is not over yet."
          </p>
          <div className="w-16 h-1 bg-primary-300 mx-auto rounded-full mb-6" />
          <p className="text-lg text-warm-500 font-medium max-w-2xl mx-auto">
            Seeking help is the ultimate act of bravery. We are here to support your journey back to yourself.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

