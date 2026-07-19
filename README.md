# Aimers

Online education platform — courses, instructor tools, and agentic AI (Course Writer + Pathfinder).

## Structure

```
Aimers/
  frontend/   # Next.js + TypeScript + Tailwind + TanStack Query + Recharts
  backend/    # Express + TypeScript + MongoDB
  assets/     # Brand assets (logo)
```

## Brand

- Logo: `@` mark + **AIMERS**
- Colors: black `#0A0A0A`, white `#FFFFFF`, gold `#D4A017`
- Fonts: Outfit (UI) · Space Grotesk (display)
- Hero background: `frontend/public/aimers-hero-bg.jpg`

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Runs at `http://localhost:3000`

## Demo credentials (Phase 1+)

- Student: `demo@aimers.com` / `Demo@1234`
- Instructor: `instructor@aimers.com` / `Instructor@1234`

## Auth setup (what you need to do)

### Works now without Google
1. Start MongoDB
2. `cd backend` → `npm run seed` → `npm run dev`
3. `cd frontend` → `npm run dev`
4. Open http://localhost:3000/login
5. Click **Demo login** (or register a new account)

### Enable Google login (required for full rubric)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services** → **Credentials**
3. Create **OAuth client ID** → Application type: **Web application**
4. Authorized JavaScript origins:
   - `http://localhost:3000`
5. Authorized redirect URIs (optional for GIS button):
   - `http://localhost:3000`
6. Copy the **Client ID**
7. Paste it in both env files (same value):

**`frontend/.env.local`**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

**`backend/.env`**
```
GOOGLE_CLIENT_ID=your_client_id_here
```

8. Restart frontend and backend
9. Open `/login` — the Google button appears and works

Without the Client ID, email/password + Demo login still work; Google shows a setup note instead of the button.

## AI Course Writer (Phase 5)

1. Login (any account)
2. Open `/ai-tools` → **Course Writer** (or `/ai/generate`)
3. Enter topic, audience, level, modules, tone, length → **Generate** / **Regenerate**
4. **Apply to Add Course** (instructors) to prefill `/items/add`

Optional live LLM (otherwise offline template mode works):

```env
# backend/.env
AI_PROVIDER=openai   # or gemini
OPENAI_API_KEY=sk-...
# or
GEMINI_API_KEY=...
```

## Roadmap status

| Phase | Focus | Status |
|-------|--------|--------|
| 0 | Setup, logo, brand, scaffolding | Done |
| 1 | Auth + course APIs + seed | Done |
| 2 | Landing (7+ sections) + shell | Done |
| 3 | Explore, details, auth UI, add/manage | Done |
| 4 | Dashboard + Recharts | Done |
| 5 | AI Course Writer | Done |
| 6 | AI Pathfinder recommendations | Pending |
| 7 | Polish + security | Pending |
| 8 | Deploy + submit | Pending |

## License

MIT
