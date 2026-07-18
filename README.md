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

- Email: `demo@aimers.com`
- Password: `Demo@1234`

## Roadmap status

| Phase | Focus | Status |
|-------|--------|--------|
| 0 | Setup, logo, brand, scaffolding | Done |
| 1 | Auth + course APIs + seed | Pending |
| 2 | Landing (7+ sections) + shell | Done |
| 3 | Explore, details, auth UI, add/manage | Pending |
| 4 | Dashboard + Recharts | Pending |
| 5 | AI Course Writer | Pending |
| 6 | AI Pathfinder recommendations | Pending |
| 7 | Polish + security | Pending |
| 8 | Deploy + submit | Pending |

## License

MIT
