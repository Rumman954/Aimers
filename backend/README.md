# Aimers Backend

Express + TypeScript API for the Aimers education platform.

## Setup

```bash
cp .env.example .env
npm install
# Start MongoDB locally, then:
npm run seed
npm run dev
```

API base: `http://localhost:5000`

## Endpoints

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register` — `{ name, email, password, role? }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/google` — `{ credential }` (requires `GOOGLE_CLIENT_ID`)
- `GET /api/auth/me` — Bearer token
- `GET /api/auth/demo` — demo email/password

### Courses
- `GET /api/courses` — query: `search`, `category`, `level`, `minPrice`, `maxPrice`, `minRating`, `sort`, `page`, `limit`
- `GET /api/courses/:id` — by slug or Mongo id
- `GET /api/courses/:id/related`
- `GET /api/courses/:id/reviews`
- `GET /api/courses/mine/list` — auth
- `POST /api/courses` — instructor/admin
- `PATCH /api/courses/:id` — owner
- `DELETE /api/courses/:id` — owner
- `POST /api/courses/:id/reviews` — auth

### Dashboard
- `GET /api/dashboard/stats` — auth
- `GET /api/dashboard/enrollments` — auth
- `POST /api/dashboard/enroll/:id` — auth

### AI
- `POST /api/ai/course-content` — auth  
  Body: `{ topic, audience, level, moduleCount, tone, length, regenerate? }`  
  Uses OpenAI/Gemini when keys are set; otherwise offline template mode.
- `POST /api/ai/recommend` — auth  
  Body: `{ interests?, skills?, level?, maxBudget?, preferredDuration?, category? }`
- `POST /api/ai/recommend/feedback` — auth  
  Body: `{ courseId, action: "like" | "dislike" }`

## Demo credentials

- Student: `demo@aimers.com` / `Demo@1234`
- Instructor: `instructor@aimers.com` / `Instructor@1234`
