# 🧠 RECLAIM — Digital Well-Being & Mental Health Support Platform

> Aligned with **SDG 3: Good Health & Well-Being**

An AI-powered platform that supports student mental well-being through emotional support, mood tracking, peer engagement, self-help resources, and crisis intervention.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Counselor** | Chat with an empathetic AI that detects emotions via sentiment analysis and provides evidence-based support |
| 📊 **Mood Tracking** | Daily mood check-ins with emoji selector, personal journal, and trend visualization |
| 🧘 **Self-Help Resources** | Curated library of breathing exercises, meditation guides, and coping strategies |
| 👥 **Peer Community** | Anonymous forum for students to share, support, and connect |
| 🆘 **Crisis Support** | Immediate access to crisis hotlines and emergency resources (global) |
| 🔒 **Privacy First** | Encrypted data, anonymous community, no data sharing |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS (Vite) |
| Backend | Node.js + Express.js |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| AI / NLP | Sentiment Analysis (`sentiment` npm package) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Supabase (Optional)

Create a Supabase project at [supabase.com](https://supabase.com):

**Backend** — Edit `server/.env`:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Frontend** — Create `frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Note:** The app works in **Demo Mode** without Supabase configured!

### 3. Run the App

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
├── frontend/            # React + Tailwind frontend
│   ├── src/
│   │   ├── components/  # Sidebar, Navbar
│   │   ├── pages/       # Landing, Login, Dashboard, Chat, Journal, etc.
│   │   ├── context/     # AuthContext (Supabase auth)
│   │   └── services/    # Supabase config, API client
│   └── ...
│
├── server/              # Node.js + Express backend
│   ├── config/          # Supabase server client
│   ├── middleware/       # Auth token verification
│   ├── routes/          # API endpoints (chat, mood, community, resources)
│   └── services/        # Sentiment analysis engine
│
└── README.md
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message to AI counselor |
| GET | `/api/chat/history` | Get chat history |
| POST | `/api/mood` | Log a mood entry |
| GET | `/api/mood` | Get mood history |
| GET | `/api/mood/today` | Check today's mood status |
| POST | `/api/community` | Create anonymous post |
| GET | `/api/community` | List community posts |
| POST | `/api/community/:id/reply` | Reply to a post |
| POST | `/api/community/:id/support` | Support a post |
| GET | `/api/resources` | Get self-help resources |
| GET | `/api/resources/crisis` | Get crisis hotlines |

---

## 💙 About

This project addresses the mental health crisis among students by providing an accessible, AI-powered first point of contact for emotional support. It complements professional counseling by offering immediate, 24/7 assistance through evidence-based therapeutic frameworks.

**Key principles:**
- 🛡️ Privacy & ethical data use
- 🌍 Inclusivity & cultural sensitivity
- 🤝 Complementing (not replacing) human counselors
- 📱 Accessible from any device

---

*Made with 💙 for SDG 3: Good Health & Well-Being*
