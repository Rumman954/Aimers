"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { LEVELS } from "@/lib/courses";

type CourseContent = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tags: string[];
  modules: Array<{ title: string; summary: string; lessons: string[] }>;
  learningOutcomes: string[];
};

type GenerateResponse = {
  success: boolean;
  provider: "openai" | "gemini" | "offline";
  offline?: boolean;
  message?: string;
  data: CourseContent;
};

const TONES = [
  "clear and motivating",
  "professional",
  "friendly",
  "academic",
];

const fieldClass =
  "mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black";

export default function AiGeneratePage() {
  return (
    <ProtectedRoute>
      <CourseWriter />
    </ProtectedRoute>
  );
}

function CourseWriter() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginner learners");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Beginner"
  );
  const [moduleCount, setModuleCount] = useState(5);
  const [tone, setTone] = useState(TONES[0]);
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [result, setResult] = useState<CourseContent | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = topic.trim().length >= 3;

  const payload = useMemo(
    () => ({
      topic: topic.trim(),
      audience: audience.trim(),
      level,
      moduleCount,
      tone,
      length,
    }),
    [topic, audience, level, moduleCount, tone, length]
  );

  async function generate(regenerate = false) {
    if (!canGenerate) {
      setError("Enter a topic with at least 3 characters.");
      return;
    }
    setError("");
    setInfo("");
    setCopied(false);
    setLoading(true);
    try {
      const res = await api<GenerateResponse>("/ai/course-content", {
        method: "POST",
        body: { ...payload, regenerate },
      });
      setResult(res.data);
      setInfo(res.message || `Generated with ${res.provider}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not generate course content."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    const text = [
      result.title,
      "",
      result.shortDescription,
      "",
      result.fullDescription,
      "",
      "Modules:",
      ...result.modules.map(
        (m, i) => `${i + 1}. ${m.title} — ${m.summary}`
      ),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleApply() {
    if (!result) return;
    sessionStorage.setItem(
      "aimers_ai_course_draft",
      JSON.stringify({
        title: result.title,
        shortDescription: result.shortDescription,
        fullDescription: result.fullDescription,
        category: result.category,
        level: result.level,
        duration: result.duration,
      })
    );
    router.push("/items/add?from=ai");
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        align="left"
        title="Aimers Course Writer"
        subtitle="Generate structured course outlines and descriptions from your topic, audience, and preferred length — then apply them to Add Course."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form
          className="space-y-4 rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void generate(false);
          }}
        >
          <div>
            <label className="text-sm font-medium" htmlFor="topic">
              Topic
            </label>
            <input
              id="topic"
              className={fieldClass}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. TypeScript for web developers"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="audience">
              Audience
            </label>
            <input
              id="audience"
              className={fieldClass}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Who is this course for?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                className={fieldClass}
                value={level}
                onChange={(e) =>
                  setLevel(
                    e.target.value as "Beginner" | "Intermediate" | "Advanced"
                  )
                }
              >
                {LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="modules">
                Modules
              </label>
              <input
                id="modules"
                type="number"
                min={3}
                max={12}
                className={fieldClass}
                value={moduleCount}
                onChange={(e) => setModuleCount(Number(e.target.value) || 5)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="tone">
                Tone
              </label>
              <select
                id="tone"
                className={fieldClass}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {TONES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="length">
                Output length
              </label>
              <select
                id="length"
                className={fieldClass}
                value={length}
                onChange={(e) =>
                  setLength(e.target.value as "short" | "medium" | "long")
                }
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          {error ? (
            <p className="rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {info ? (
            <p className="rounded-[var(--aimers-radius)] bg-aimers-surface px-3 py-2 text-sm text-aimers-muted">
              {info}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" size="lg" disabled={loading || !canGenerate}>
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              disabled={loading || !result}
              onClick={() => void generate(true)}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </form>

        <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
          {!result && !loading ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center text-center text-aimers-muted">
              <Wand2 className="mb-3 h-8 w-8 text-aimers-gold" />
              <p className="max-w-sm text-sm">
                Fill the form and generate a course outline with modules,
                outcomes, and ready-to-use descriptions.
              </p>
            </div>
          ) : null}

          {loading ? (
            <p className="text-sm text-aimers-muted">
              Aimers Course Writer is thinking…
            </p>
          ) : null}

          {result ? (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button type="button" size="sm" onClick={handleApply}>
                  Apply to Add Course
                </Button>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-aimers-gold">
                  {result.category} · {result.level} · {result.duration}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
                  {result.title}
                </h2>
                <p className="mt-3 text-sm text-aimers-muted">
                  {result.shortDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Full description</h3>
                <p className="mt-2 text-sm leading-relaxed text-aimers-muted">
                  {result.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Learning outcomes</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-aimers-muted">
                  {result.learningOutcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Modules</h3>
                <div className="mt-3 space-y-3">
                  {result.modules.map((module, index) => (
                    <article
                      key={`${module.title}-${index}`}
                      className="rounded-[var(--aimers-radius)] border border-aimers-border p-4"
                    >
                      <h4 className="font-semibold text-aimers-black">
                        {index + 1}. {module.title}
                      </h4>
                      <p className="mt-1 text-sm text-aimers-muted">
                        {module.summary}
                      </p>
                      {module.lessons?.length ? (
                        <ul className="mt-2 list-disc pl-5 text-xs text-aimers-muted">
                          {module.lessons.map((lesson) => (
                            <li key={lesson}>{lesson}</li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>

              {result.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[var(--aimers-radius)] bg-aimers-surface px-2.5 py-1 text-xs text-aimers-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
