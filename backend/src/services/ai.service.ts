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
    ? "Create a fresh alternative version with different module titles and wording."
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

async function callOpenAI(system: string, user: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
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

async function callGemini(system: string, user: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
      generationConfig: {
        temperature: 0.7,
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

/** Offline structured generator when no API key is configured */
export function generateOfflineCourseContent(
  input: GenerateCourseInput
): CourseContent {
  const seed = input.regenerate ? "Alt" : "Core";
  const modules = Array.from({ length: input.moduleCount }, (_, i) => {
    const n = i + 1;
    return {
      title: `${seed} Module ${n}: ${input.topic} fundamentals ${n === 1 ? "foundations" : n === input.moduleCount ? "capstone" : `deep dive ${n}`}`,
      summary: `A ${input.tone.toLowerCase()} module for ${input.audience} covering practical ${input.topic} skills at ${input.level} level.`,
      lessons: [
        `Introduction to module ${n}`,
        `Hands-on practice: ${input.topic}`,
        `Checkpoint quiz ${n}`,
      ],
    };
  });

  const shortBase = `Learn ${input.topic} with a ${input.tone.toLowerCase()} path designed for ${input.audience}.`;
  const fullBase = `This Aimers course helps ${input.audience} master ${input.topic} at ${input.level} level. You will progress through ${input.moduleCount} guided modules, build portfolio-ready work, and finish with clear next steps for continued growth.`;

  const content: CourseContent = {
    title: `${input.topic}: ${input.level} ${seed} Track`,
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
    learningOutcomes: [
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

  if (env.AI_PROVIDER === "openai" && hasOpenAI) {
    const text = await callOpenAI(system, user);
    const parsed = courseContentSchema.parse(extractJson(text));
    return { content: parsed, provider: "openai" };
  }

  if ((env.AI_PROVIDER === "gemini" || !hasOpenAI) && hasGemini) {
    const text = await callGemini(system, user);
    const parsed = courseContentSchema.parse(extractJson(text));
    return { content: parsed, provider: "gemini" };
  }

  if (hasOpenAI) {
    const text = await callOpenAI(system, user);
    const parsed = courseContentSchema.parse(extractJson(text));
    return { content: parsed, provider: "openai" };
  }

  return {
    content: generateOfflineCourseContent(input),
    provider: "offline",
  };
}
