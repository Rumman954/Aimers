# Deploy Aimers (Phase 8)

Recommended free stack:

| Piece | Host |
|-------|------|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (M0 free) |
| Backend API | [Render](https://render.com) Web Service |
| Frontend | [Vercel](https://vercel.com) |

Deploy in this order: **Atlas → Render → Vercel → reconnect CORS/Google**.

---

## 1. MongoDB Atlas

1. Create a free **M0** cluster.
2. Database Access → create a user with a strong password.
3. Network Access → allow `0.0.0.0/0` (or restrict to your host IPs later).
4. Connect → Drivers → copy the SRV URI, e.g.

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/aimers?retryWrites=true&w=majority
```

5. Seed once (from your machine, with the Atlas URI in `backend/.env`):

```bash
cd backend
# set MONGODB_URI to the Atlas URI in .env
npm run seed
```

---

## 2. Backend on Render

1. New → **Web Service** → connect the `Aimers` GitHub repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm run render-build`
   - **Start Command:** `npm start`
3. Environment variables:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas SRV URI |
| `JWT_SECRET` | long random string (16+ chars) |
| `CLIENT_URL` | your Vercel URL (update after frontend deploy; no trailing slash) |
| `JWT_EXPIRES_IN` | `7d` (optional) |
| `GOOGLE_CLIENT_ID` | same as frontend (optional) |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` | optional |

4. Deploy and open `https://YOUR-API.onrender.com/api/health` — should return healthy JSON.

> Free Render services sleep when idle; the first request after sleep can take ~30–60s.

Optional: use the repo `render.yaml` blueprint and fill secrets in the Render dashboard.

---

## 3. Frontend on Vercel

1. New Project → import the same GitHub repo.
2. **Important:** click **Edit** next to Root Directory → select **`frontend`** (not repo root).
3. Framework: Next.js (auto-detected).
4. Do **not** deploy Express `backend` on Vercel — that stays on Render.
5. Environment variables:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-APP.vercel.app` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | optional (Google Sign-In) |

6. Deploy.
7. Copy the Vercel URL → set Render `CLIENT_URL` to that exact origin (no trailing slash) → **redeploy** the API.

If the site shows **404: NOT_FOUND**: Root Directory is wrong.  
Go to **Project → Settings → General → Root Directory → `frontend` → Save → Redeploy**.

---

## 4. Google OAuth (optional)

In [Google Cloud Console](https://console.cloud.google.com/) → Credentials → your OAuth client:

**Authorized JavaScript origins**
- `http://localhost:3000`
- `https://YOUR-APP.vercel.app`

Keep `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in sync.

---

## 5. Smoke test checklist

- [ ] `GET /api/health` on Render returns success
- [ ] Landing page loads on Vercel
- [ ] Course explore loads courses from the API
- [ ] Register / login works
- [ ] Demo student login: `demo@aimers.com` / `Demo@1234` (if seeded)
- [ ] Enroll + dashboard charts load
- [ ] AI Tools (Course Writer / Pathfinder) open when signed in
- [ ] Browser console has no CORS errors

---

## Local production build check

```bash
# Backend
cd backend
npm run build
npm start

# Frontend (separate terminal)
cd frontend
npm run build
npm start
```

---

## Submit notes

When submitting your assignment, include:

1. Live frontend URL (Vercel)
2. Live API health URL (Render `/api/health`)
3. GitHub repo: `https://github.com/Rumman954/Aimers`
4. Demo credentials (student + instructor)
5. Short note: AI works offline without keys; add OpenAI/Gemini for live LLM output
