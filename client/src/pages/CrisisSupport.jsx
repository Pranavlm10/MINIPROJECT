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
    <div className="min-h-screen bg-warm-50">
      {/* Full-width emergency banner */}
      <div className="bg-gradient-to-r from-red-600/30 to-red-500/20 border-b border-red-200">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg className="w-8 h-8 text-red-600  flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-warm-900">Crisis Support</h1>
              <p className="text-red-200/80 text-sm">If you or someone you know is in immediate danger, please call your local emergency number.</p>
            </div>
          </div>
          <Link to="/dashboard" className="text-warm-600 hover:text-warm-900 transition-colors text-sm bg-warm-100 px-4 py-2 rounded-lg flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-8 py-8">
        {/* Emergency Call */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-500/40 rounded-2xl p-8 text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-red-700 mb-3">You Are Not Alone</h2>
          <p className="text-red-200/70 mb-6 max-w-2xl mx-auto leading-relaxed">
            If you're experiencing a mental health crisis, please reach out immediately.
            Trained counselors are available right now to help you. Your life matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:988"
              className="bg-red-500 hover:bg-red-400 text-warm-900 font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 988 Now
            </a>
            <a
              href="sms:741741?body=HOME"
              className="bg-warm-100 hover:bg-white/20 border border-red-200 text-warm-900 font-bold px-8 py-4 rounded-2xl text-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Text HOME to 741741
            </a>
          </div>
        </motion.div>

        {/* Safety Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-warm-200 rounded-xl shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Immediate Safety Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: '1', title: 'Ground Yourself', desc: 'Feel your feet on the floor. Hold something cold. Take 3 deep breaths.',
                icon: (
                  <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              {
                step: '2', title: 'Reach Out', desc: 'Call a trusted person, hotline, or go to the nearest emergency room.',
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )
              },
              {
                step: '3', title: 'Stay Safe', desc: 'Remove access to anything harmful. Stay in a safe place. You matter.',
                icon: (
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <div key={i} className="bg-warm-50 rounded-xl p-4 border border-warm-200">
                <div className="mb-2">{item.icon}</div>
                <div className="text-xs text-primary-600 font-bold mb-1">STEP {item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-warm-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Crisis Resources by Region */}
        <div className="space-y-6">
          {CRISIS_RESOURCES.map((region, ri) => (
            <motion.div
              key={ri}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + ri * 0.1 }}
              className="bg-white border border-warm-200 rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {region.region}
              </h2>
              <div className="space-y-3">
                {region.resources.map((resource, rri) => (
                  <div key={rri} className="bg-warm-50 rounded-xl p-4 flex items-center justify-between border border-warm-200 hover:border-warm-200 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-warm-900 mb-0.5">{resource.name}</h3>
                      <p className="text-xs text-warm-500">{resource.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-primary-700 text-sm">{resource.contact}</div>
                      <div className="text-xs text-warm-400">{resource.available}</div>
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
          className="text-center mt-12 mb-8"
        >
          <p className="text-xl text-warm-600 font-medium mb-2">
            You are stronger than you think.
          </p>
          <p className="text-warm-400">
            Taking the step to seek help is an act of courage, not weakness.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
