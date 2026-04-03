# RECLAIM — Full Technology Stack

> **Version:** 1.0.0
> **Theme:** Lavender Light UI
> **Purpose:** AI-Powered Mental Health & Well-Being Platform for Students (SDG 3)
> **Architecture:** Monorepo — `/frontend` (React SPA) + `/server` (Node.js REST API)

---

## 🖥️ FRONTEND

### Core Framework
| Package | Version | Role |
|---|---|---|
| `react` | ^19.2.4 | Core UI library (concurrent rendering) |
| `react-dom` | ^19.2.4 | DOM renderer for React |
| `react-router-dom` | ^7.13.1 | Client-side routing & navigation |

### Build & Tooling
| Package | Version | Role |
|---|---|---|
| `vite` | ^8.0.0 | Build tool & dev server (HMR) |
| `@vitejs/plugin-react` | ^6.0.0 | Vite plugin for React/JSX support |
| `eslint` | ^9.39.4 | JavaScript linting |
| `eslint-plugin-react-hooks` | ^7.0.1 | Rules of Hooks enforcement |
| `eslint-plugin-react-refresh` | ^0.5.2 | Fast Refresh compatibility checks |
| `@eslint/js` | ^9.39.4 | ESLint base config |
| `globals` | ^17.4.0 | Global variable definitions for ESLint |

### Styling
| Package | Version | Role |
|---|---|---|
| `tailwindcss` | ^3.4.19 | Utility-first CSS framework |
| `postcss` | ^8.5.8 | CSS transformation pipeline |
| `autoprefixer` | ^10.4.27 | Adds vendor prefixes automatically |

#### Tailwind Color Palette (Custom)
| Token | Value | Usage |
|---|---|---|
| `primary-600` | `#7c3aed` | Lavender — primary actions, buttons, active states |
| `primary-50` | `#f5f3ff` | Lavender tint — card backgrounds, pill fills |
| `accent-*` | Fuchsia scale | Secondary accent / highlights |
| `warm-50` | `#f8fafc` | Page background (near-white) |
| `warm-900` | `#0f172a` | Dark text, deprecated dark backgrounds |

#### Typography
- **Font Family:** `Inter` (via system-ui fallback) — configured in `tailwind.config.js`

### Networking & Auth
| Package | Version | Role |
|---|---|---|
| `axios` | ^1.13.6 | HTTP client for all API calls |
| `@supabase/supabase-js` | ^2.49.0 | Auth session management & DB client |

### UI & Animation
| Package | Version | Role |
|---|---|---|
| `framer-motion` | ^12.37.0 | Page transitions, micro-animations, motion |
| `react-icons` | ^5.6.0 | Icon library |
| `recharts` | ^3.8.0 | Declarative chart components for mood graphs |

### Type Support (Dev)
| Package | Version | Role |
|---|---|---|
| `@types/react` | ^19.2.14 | TypeScript types for React |
| `@types/react-dom` | ^19.2.3 | TypeScript types for React DOM |

---

## ⚙️ BACKEND (Server)

### Runtime & Framework
| Package | Version | Role |
|---|---|---|
| `node.js` | (system) | JavaScript runtime |
| `express` | ^4.21.0 | HTTP server & REST API framework |

### Security & Middleware
| Package | Version | Role |
|---|---|---|
| `helmet` | ^7.1.0 | Sets secure HTTP headers |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing control |
| `dotenv` | ^16.4.5 | Environment variable loader from `.env` |

### Auth & Database
| Package | Version | Role |
|---|---|---|
| `@supabase/supabase-js` | ^2.49.0 | JWT verification + Supabase DB client |

### AI / NLP
| Package | Version | Role |
|---|---|---|
| `sentiment` | ^5.0.2 | AFINN-based sentiment analysis & scoring |

> ⚠️ **Note:** The AI Counsellor does NOT use Ollama or any external LLM.
> All intelligence is powered by `sentiment` (NLP) + a custom rule-based
> response engine in `server/services/sentiment.js`.

---

## 📡 API STRUCTURE

**Base URL:** `http://localhost:5000/api`
**Auth:** Supabase JWT via `Authorization: Bearer <token>` header
**Dev Fallback:** If no token present, auto-assigns demo user (`demo-user-001`)

### Endpoints

#### 🔐 Auth — `/api/auth`
| Method | Path | Description |
|---|---|---|
| GET | `/api/auth/me` | Get current authenticated user |

#### 🤖 AI Chat — `/api/chat`
| Method | Path | Description |
|---|---|---|
| POST | `/api/chat` | Send message → get AI response + coping strategies |
| GET | `/api/chat/history` | Get last 50 messages for current user |
| DELETE | `/api/chat/history` | Clear all conversation history |

**Chat Response Payload:**
```json
{
  "id": "timestamp",
  "userMessage": "string",
  "aiResponse": "string",
  "emotion": "calm | sad | anxious | distressed | ...",
  "analysis": { "score": 0, "comparative": 0, "isCrisis": false },
  "strategies": [{ "title": "string", "description": "string" }],
  "crisisResources": { ... },
  "timestamp": "ISO 8601"
}
```

#### 😊 Mood Journal — `/api/mood`
| Method | Path | Description |
|---|---|---|
| POST | `/api/mood` | Log mood entry (mood + optional notes) |
| GET | `/api/mood?days=30` | Get mood history (default: last 30 days) |
| GET | `/api/mood/today` | Check if mood logged today |

#### 🌐 Community — `/api/community`
| Method | Path | Description |
|---|---|---|
| POST | `/api/community` | Create anonymous post |
| GET | `/api/community?page=1&category=all` | Get paginated community feed |
| POST | `/api/community/:postId/reply` | Reply to a post |
| POST | `/api/community/:postId/support` | Upvote / support a post |

#### 📚 Resources — `/api/resources`
| Method | Path | Description |
|---|---|---|
| GET | `/api/resources` | Get all self-help resource categories |
| GET | `/api/resources?category=stress` | Filter by category |
| GET | `/api/resources/crisis` | Get emergency helplines & crisis info |

#### 🏥 Health Check — `/api/health`
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Returns `{ status: "ok" }` — server liveliness probe |

---

## 🗂️ PROJECT STRUCTURE

```
cursor/
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── pages/             # Route-level components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx       # AI Counsellor
│   │   │   ├── Journal.jsx    # Mood Journal
│   │   │   ├── Community.jsx  # Peer Support
│   │   │   ├── Resources.jsx  # Self-Help Library
│   │   │   ├── CrisisSupport.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── EmailConfirmation.jsx
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js         # Axios client + all API calls
│   │   │   └── supabase.js    # Supabase client init
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # App entry + router
│   ├── tailwind.config.js     # Custom Lavender palette
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js REST API
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js            # AI Counsellor route
│   │   ├── mood.js
│   │   ├── community.js
│   │   └── resources.js
│   ├── middleware/
│   │   └── auth.js            # JWT verification + demo fallback
│   ├── services/
│   │   └── sentiment.js       # NLP engine + response generator
│   ├── config/
│   ├── index.js               # Express server entry
│   ├── .env                   # Environment variables
│   └── package.json
│
└── TECH_STACK.md              # This file
```

---

## 🔒 ENVIRONMENT VARIABLES

### Backend (`server/.env`)
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🚀 DEV STARTUP

```bash
# Terminal 1 — Backend
cd server
npm start           # Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev         # Runs on http://localhost:5173 (or 3000 if in use)
```

---

## 🎨 DESIGN SYSTEM

| Token | Description |
|---|---|
| **Primary** | Lavender (#7c3aed) — all interactive elements |
| **Accent** | Fuchsia — secondary highlights |
| **Background** | `warm-50` (#f8fafc) — all page backgrounds |
| **Surface** | `white` — cards, modals, inputs |
| **Text** | `warm-900` (#0f172a) — headings; `warm-500` — body |
| **Font** | Inter (Google Fonts) |
| **Radius** | Rounded-2xl to rounded-[3rem] — pill/blob shapes |
| **Shadow** | `shadow-xl shadow-primary-200` — lavender depth |

---

*RECLAIM v1.0.0 — SDG 3: Good Health & Well-Being*
