import { z } from "zod";
import { env } from "../config/env.js";

export const courseContentSchema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(20),
  fullDescription: z.string().min(40),
  category: z.string().min(2),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(2),
  tags: z.array(z.string()).default([]),
  modules: z
    .array(
      z.object({
        title: z.string(),
        summary: z.string(),
        lessons: z.array(z.string()).default([]),
      })
    )
    .min(1),
  learningOutcomes: z.array(z.string()).default([]),
});

export type CourseContent = z.infer<typeof courseContentSchema>;

export type GenerateCourseInput = {
  topic: string;
  audience: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  moduleCount: number;
  tone: string;
  length: "short" | "medium" | "long";
  regenerate?: boolean;
  variationSeed?: number;
};

const LENGTH_GUIDE = {
  short: "Keep descriptions concise (shortDescription ~40 words, fullDescription ~80 words).",
  medium: "Use balanced detail (shortDescription ~60 words, fullDescription ~140 words).",
  long: "Be thorough (shortDescription ~80 words, fullDescription ~220 words).",
} as const;

function buildSystemPrompt() {
  return `You are Aimers Course Writer, an expert curriculum designer for an online education platform.
Return ONLY valid JSON (no markdown fences) matching this shape:
{
  "title": string,
  "shortDescription": string,
  "fullDescription": string,
  "category": string,
  "level": "Beginner" | "Intermediate" | "Advanced",
  "duration": string,
  "tags": string[],
  "modules": [{ "title": string, "summary": string, "lessons": string[] }],
  "learningOutcomes": string[]
}
Reason step-by-step internally: (1) outline the course, (2) define modules, (3) write marketing-ready descriptions.
Do not invent payment or fake reviews.`;
}

function buildUserPrompt(input: GenerateCourseInput) {
  const variation = input.regenerate
    ? `Create a fresh alternative version with different module titles, outcomes, and wording. Variation seed: ${input.variationSeed ?? Date.now()}. Do not repeat the previous structure verbatim.`
    : "Create the strongest first version.";

  return `Design a course with these inputs:
- Topic: ${input.topic}
- Audience: ${input.audience}
- Level: ${input.level}
- Module count: ${input.moduleCount}
- Tone: ${input.tone}
- Length: ${input.length}. ${LENGTH_GUIDE[input.length]}
- ${variation}

Ensure module count is exactly ${input.moduleCount}.`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("AI response did not contain JSON");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

async function callOpenAI(
  system: string,
  user: string,
  temperature = 0.7
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content || "";
}

async function callGemini(
  system: string,
  user: string,
  temperature = 0.7
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
      generationConfig: {
        temperature,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function pickFrom<T>(items: T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

/** Offline structured generator when no API key is configured */
export function generateOfflineCourseContent(
  input: GenerateCourseInput
): CourseContent {
  const variation = input.variationSeed ?? (input.regenerate ? Date.now() : 0);
  const trackNames = [
    "Core",
    "Practical",
    "Applied",
    "Accelerated",
    "Project-Based",
    "Career-Ready",
  ];
  const moduleVerbs = [
    "Master",
    "Explore",
    "Apply",
    "Build",
    "Practice",
    "Refine",
  ];
  const moduleFocus = [
    "foundations",
    "core skills",
    "real projects",
    "advanced patterns",
    "workflow mastery",
    "capstone build",
  ];
  const track = input.regenerate
    ? pickFrom(trackNames, variation)
    : trackNames[0];

  const modules = Array.from({ length: input.moduleCount }, (_, i) => {
    const n = i + 1;
    const verb = pickFrom(moduleVerbs, variation, i);
    const focus =
      n === 1
        ? "foundations"
        : n === input.moduleCount
          ? "capstone project"
          : pickFrom(moduleFocus, variation, i + 2);
    return {
      title: `${verb} ${input.topic}: ${focus}`,
      summary: `A ${input.tone.toLowerCase()} module for ${input.audience} focused on ${focus} at ${input.level} level.`,
      lessons: [
        `${verb} key concepts for module ${n}`,
        `Guided lab: ${input.topic}`,
        `Review and checkpoint ${n}`,
      ],
    };
  });

  const shortBase = input.regenerate
    ? `A refreshed ${input.tone.toLowerCase()} path on ${input.topic} for ${input.audience}, with new module angles and exercises.`
    : `Learn ${input.topic} with a ${input.tone.toLowerCase()} path designed for ${input.audience}.`;
  const fullBase = input.regenerate
    ? `This regenerated Aimers course gives ${input.audience} a new route through ${input.topic} at ${input.level} level. Expect alternate module sequencing, updated project ideas, and clearer milestones across ${input.moduleCount} guided sections.`
    : `This Aimers course helps ${input.audience} master ${input.topic} at ${input.level} level. You will progress through ${input.moduleCount} guided modules, build portfolio-ready work, and finish with clear next steps for continued growth.`;

  const content: CourseContent = {
    title: `${input.topic}: ${input.level} ${track} Track`,
    shortDescription:
      input.length === "short"
        ? shortBase
        : input.length === "long"
          ? `${shortBase} Build confidence with structured lessons, feedback checkpoints, and applied projects that mirror real learning goals.`
          : `${shortBase} Follow structured modules with clear outcomes and practical exercises.`,
    fullDescription:
      input.length === "short"
        ? fullBase
        : input.length === "long"
          ? `${fullBase} Expect weekly milestones, revision prompts, and instructor-style guidance so you can measure progress and stay accountable from the first lesson to the final project.`
          : `${fullBase} Each module includes lessons, practice, and a checkpoint so you stay on track.`,
    category: guessCategory(input.topic),
    level: input.level,
    duration: `${Math.max(4, input.moduleCount + 2)} weeks`,
    tags: [
      input.topic.toLowerCase().slice(0, 24),
      input.level.toLowerCase(),
      input.tone.toLowerCase().slice(0, 16),
    ],
    modules,
    learningOutcomes: input.regenerate
      ? [
          `Compare and apply refreshed ${input.topic} concepts in new scenarios`,
          `Complete alternate guided projects tailored for ${input.audience}`,
          `Demonstrate stronger ${input.level.toLowerCase()}-level confidence with updated exercises`,
        ]
      : [
          `Explain core concepts of ${input.topic}`,
          `Apply ${input.topic} skills in guided projects`,
          `Build a portfolio artifact suitable for ${input.audience}`,
        ],
  };

  return courseContentSchema.parse(content);
}

function guessCategory(topic: string): string {
  const t = topic.toLowerCase();
  if (/(design|ui|ux|figma|brand)/.test(t)) return "Design";
  if (/(data|python|sql|machine|ml|ai)/.test(t)) return "Data Science";
  if (/(market|business|finance|product|speak)/.test(t)) return "Business";
  if (/(ielts|toefl|sat|exam)/.test(t)) return "Exam Prep";
  return "Programming";
}

export async function generateCourseContent(input: GenerateCourseInput): Promise<{
  content: CourseContent;
  provider: "openai" | "gemini" | "offline";
}> {
  const hasOpenAI = Boolean(env.OPENAI_API_KEY);
  const hasGemini = Boolean(env.GEMINI_API_KEY);

  const system = buildSystemPrompt();
  const user = buildUserPrompt(input);
  const temperature = input.regenerate ? 0.95 : 0.7;

  if (env.AI_PROVIDER === "openai" && hasOpenAI) {
    const text = await callOpenAI(system, user, temperature);
    const parsed = courseContentSchema.parse(extractJson(text));
    return { content: parsed, provider: "openai" };
  }

  if ((env.AI_PROVIDER === "gemini" || !hasOpenAI) && hasGemini) {
    const text = await callGemini(system, user, temperature);
    const parsed = courseContentSchema.parse(extractJson(text));
    return { content: parsed, provider: "gemini" };
  }

  if (hasOpenAI) {
    const text = await callOpenAI(system, user, temperature);
    const parsed = courseContentSchema.parse(extractJson(text));
    return { content: parsed, provider: "openai" };
  }

  return {
    content: generateOfflineCourseContent(input),
    provider: "offline",
  };
}

export const recommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        courseId: z.string(),
        reason: z.string().min(10),
        matchScore: z.number().min(0).max(100),
      })
    )
    .default([]),
  learningPathTitle: z.string().optional(),
  summary: z.string().optional(),
});

export type RecommendationResult = z.infer<typeof recommendationSchema>;

export type RecommendCandidate = {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  rating: number;
  tags: string[];
  students: number;
};

export type RecommendContext = {
  interests: string[];
  level?: string;
  maxBudget?: number;
  skills?: string[];
  preferredDuration?: string;
  likedCourseSlugs: string[];
  dislikedCourseSlugs: string[];
  recentViews: string[];
  enrolled: string[];
  candidates: RecommendCandidate[];
};

function rankOffline(ctx: RecommendContext): RecommendationResult {
  const scored = ctx.candidates.map((course) => {
    let score = course.rating * 12 + Math.min(course.students / 100, 20);
    const hay = `${course.title} ${course.category} ${course.tags.join(" ")} ${course.shortDescription}`.toLowerCase();

    for (const interest of ctx.interests) {
      if (interest && hay.includes(interest.toLowerCase())) score += 18;
    }
    for (const skill of ctx.skills || []) {
      if (skill && hay.includes(skill.toLowerCase())) score += 14;
    }
    if (ctx.level && course.level === ctx.level) score += 12;
    if (ctx.maxBudget != null && course.price <= ctx.maxBudget) score += 8;
    if (ctx.likedCourseSlugs.includes(course.id)) score += 10;
    if (ctx.dislikedCourseSlugs.includes(course.id)) score -= 40;
    if (ctx.enrolled.includes(course.id)) score -= 50;
    if (ctx.recentViews.includes(course.id)) score += 6;

    const reasons: string[] = [];
    if (ctx.level && course.level === ctx.level) {
      reasons.push(`matches your ${ctx.level} level`);
    }
    if (ctx.interests.some((i) => hay.includes(i.toLowerCase()))) {
      reasons.push("aligns with your stated interests");
    }
    if (ctx.maxBudget != null && course.price <= ctx.maxBudget) {
      reasons.push(`fits your budget (≤ $${ctx.maxBudget})`);
    }
    if (ctx.recentViews.includes(course.id)) {
      reasons.push("similar to courses you recently viewed");
    }
    if (!reasons.length) {
      reasons.push("strong learner ratings and catalog fit");
    }

    return {
      courseId: course.id,
      reason: `Recommended because it ${reasons.join(" and ")}.`,
      matchScore: Math.max(1, Math.min(99, Math.round(score))),
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  const top = scored.slice(0, 6);

  return {
    recommendations: top,
    learningPathTitle: "Your Aimers Pathfinder plan",
    summary:
      top.length > 0
        ? `Based on your activity and filters, start with “${ctx.candidates.find((c) => c.id === top[0].courseId)?.title}” and continue through the ranked list.`
        : "No strong matches yet. Broaden filters or explore more courses.",
  };
}

export async function generateRecommendations(
  ctx: RecommendContext
): Promise<{ result: RecommendationResult; provider: "openai" | "gemini" | "offline" }> {
  if (!ctx.candidates.length) {
    return {
      provider: "offline",
      result: {
        recommendations: [],
        learningPathTitle: "Your Aimers Pathfinder plan",
        summary: "No courses matched your filters. Try raising budget or clearing level.",
      },
    };
  }

  const system = `You are Aimers Pathfinder, a recommendation agent for an online education platform.
Return ONLY valid JSON:
{
  "recommendations": [{ "courseId": string, "reason": string, "matchScore": number }],
  "learningPathTitle": string,
  "summary": string
}
Rules:
- Only use courseId values from the provided candidate list.
- Rank best matches first (3 to 6 items).
- matchScore is 0-100.
- Reasons must be specific to user context (interests, level, budget, history).`;

  const user = `User context:
${JSON.stringify(
  {
    interests: ctx.interests,
    level: ctx.level,
    maxBudget: ctx.maxBudget,
    skills: ctx.skills,
    preferredDuration: ctx.preferredDuration,
    likedCourseSlugs: ctx.likedCourseSlugs,
    dislikedCourseSlugs: ctx.dislikedCourseSlugs,
    recentViews: ctx.recentViews,
    enrolled: ctx.enrolled,
  },
  null,
  2
)}

Candidates:
${JSON.stringify(ctx.candidates, null, 2)}`;

  const hasOpenAI = Boolean(env.OPENAI_API_KEY);
  const hasGemini = Boolean(env.GEMINI_API_KEY);

  try {
    if (env.AI_PROVIDER === "openai" && hasOpenAI) {
      const text = await callOpenAI(system, user);
      return {
        provider: "openai",
        result: recommendationSchema.parse(extractJson(text)),
      };
    }
    if ((env.AI_PROVIDER === "gemini" || !hasOpenAI) && hasGemini) {
      const text = await callGemini(system, user);
      return {
        provider: "gemini",
        result: recommendationSchema.parse(extractJson(text)),
      };
    }
    if (hasOpenAI) {
      const text = await callOpenAI(system, user);
      return {
        provider: "openai",
        result: recommendationSchema.parse(extractJson(text)),
      };
    }
  } catch {
    // fall through to offline ranking
  }

  return { provider: "offline", result: rankOffline(ctx) };
}

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type CourseSupportContext = {
  courseId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  instructorName: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  students: number;
  studentName: string;
  enrolled: boolean;
};

function buildCourseSupportSystemPrompt(ctx: CourseSupportContext) {
  return `You are Aimers, a friendly support assistant for enrolled students on an online education platform.
Your name is Aimers. Be warm, helpful, and practical when students describe problems, confusion, or questions.
Listen to what the student describes and respond directly to their situation with clear next steps.
Answer using this course context when relevant. If the student describes a learning problem, suggest concrete study actions tied to this course.
If asked about topics completely outside this course, politely redirect them back to course-related help.
Do not invent modules, lessons, or syllabus details that are not in the context.
If information is missing, say so and suggest what the student can check on the course page.

Course context:
- Title: ${ctx.title}
- Category: ${ctx.category}
- Level: ${ctx.level}
- Duration: ${ctx.duration}
- Price: $${ctx.price}
- Instructor: ${ctx.instructorName}
- Rating: ${ctx.rating} (${ctx.reviewCount} reviews)
- Tags: ${ctx.tags.join(", ") || "none"}
- Short description: ${ctx.shortDescription}
- Full description: ${ctx.fullDescription}
- Student: ${ctx.studentName}
- Enrolled: ${ctx.enrolled ? "yes" : "no"}`;
}

async function callOpenAIChat(
  system: string,
  history: ChatTurn[],
  temperature = 0.7
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature,
      messages: [
        { role: "system", content: system },
        ...history.map((turn) => ({ role: turn.role, content: turn.content })),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() || "";
}

async function callGeminiChat(
  system: string,
  history: ChatTurn[],
  temperature = 0.7
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const contents = history.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

export function generateOfflineCourseSupport(
  ctx: CourseSupportContext,
  message: string
): string {
  const q = message.toLowerCase();

  if (/hello|hi|hey|start/.test(q)) {
    return `Hello I'm Aimers. I'm your support assistant. How can I help you with "${ctx.title}" today?`;
  }
  if (/stuck|problem|issue|confused|don't understand|do not understand|hard|difficult|help me|struggling/.test(q)) {
    return `I hear you're having trouble with "${ctx.title}". Try this: (1) re-read the overview for ${ctx.category} basics, (2) break the topic into smaller steps, (3) practice one ${ctx.level.toLowerCase()}-level exercise at a time, and (4) ask me a specific part you're stuck on. What exactly feels unclear right now?`;
  }
  if (/about|what is|learn|cover|topic|overview/.test(q)) {
    return `"${ctx.title}" is a ${ctx.level.toLowerCase()} ${ctx.category} course. ${ctx.shortDescription} ${ctx.fullDescription}`;
  }
  if (/long|duration|week|time|how many/.test(q)) {
    return `This course runs for ${ctx.duration}. Plan steady weekly progress and use your dashboard to track completion.`;
  }
  if (/level|beginner|intermediate|advanced|difficult|prerequisite/.test(q)) {
    return `This course is labeled ${ctx.level}. If you're new to ${ctx.category}, start with the overview section and revisit fundamentals before moving to applied exercises.`;
  }
  if (/instructor|teacher|who teach/.test(q)) {
    return `${ctx.instructorName} is the instructor for "${ctx.title}". Focus on the course milestones and practice activities to get the most from their material.`;
  }
  if (/price|cost|pay|fee|worth/.test(q)) {
    return `"${ctx.title}" is priced at $${ctx.price}. You already have access as an enrolled student — use the dashboard to track progress and stay on schedule.`;
  }
  if (/rating|review|student/.test(q)) {
    return `Learners rate this course ${ctx.rating}/5 across ${ctx.reviewCount} reviews, with ${ctx.students.toLocaleString()} students enrolled. Check the reviews section for peer feedback.`;
  }
  if (/start|begin|first step|how do i/.test(q)) {
    return `To get started in "${ctx.title}": (1) review the course overview, (2) note the ${ctx.duration} timeline, (3) set a weekly study goal, and (4) track progress from your Aimers dashboard.`;
  }
  if (/tag|category|field/.test(q)) {
    return `This course sits in ${ctx.category}${ctx.tags.length ? ` with tags: ${ctx.tags.join(", ")}` : ""}.`;
  }

  return `I can help with "${ctx.title}" — try asking about the course overview, duration (${ctx.duration}), level (${ctx.level}), instructor (${ctx.instructorName}), or how to get started.`;
}

export async function generateCourseSupportReply(
  ctx: CourseSupportContext,
  message: string,
  history: ChatTurn[] = []
): Promise<{ reply: string; provider: "openai" | "gemini" | "offline" }> {
  const trimmedHistory = history.slice(-10);
  const turns: ChatTurn[] = [
    ...trimmedHistory,
    { role: "user", content: message },
  ];
  const system = buildCourseSupportSystemPrompt(ctx);
  const hasOpenAI = Boolean(env.OPENAI_API_KEY);
  const hasGemini = Boolean(env.GEMINI_API_KEY);

  try {
    if (env.AI_PROVIDER === "openai" && hasOpenAI) {
      const reply = await callOpenAIChat(system, turns);
      if (reply) return { reply, provider: "openai" };
    }
    if ((env.AI_PROVIDER === "gemini" || !hasOpenAI) && hasGemini) {
      const reply = await callGeminiChat(system, turns);
      if (reply) return { reply, provider: "gemini" };
    }
    if (hasOpenAI) {
      const reply = await callOpenAIChat(system, turns);
      if (reply) return { reply, provider: "openai" };
    }
    if (hasGemini) {
      const reply = await callGeminiChat(system, turns);
      if (reply) return { reply, provider: "gemini" };
    }
  } catch {
    // fall through to offline
  }

  return {
    reply: generateOfflineCourseSupport(ctx, message),
    provider: "offline",
  };
}
