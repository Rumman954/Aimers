"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Send } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { AIMERS_GREETING } from "@/components/courses/aimers-chat-panel";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type CourseSupportChatProps = {
  courseId: string;
  courseTitle: string;
};

type EnrollmentsResponse = {
  success: boolean;
  data: Array<{ course: { id: string } }>;
};

type SupportResponse = {
  success: boolean;
  provider: "openai" | "gemini" | "offline";
  offline?: boolean;
  message?: string;
  data: { reply: string };
};

const STARTER_PROMPTS = [
  "What is this course about?",
  "How long does it take?",
  "How should I get started?",
];

const fieldClass =
  "flex-1 rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black";

export function CourseSupportChat({
  courseId,
  courseTitle,
}: CourseSupportChatProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: AIMERS_GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkEnrollment = useCallback(async () => {
    if (!isAuthenticated) {
      setEnrolled(false);
      setCheckingEnrollment(false);
      return;
    }

    setCheckingEnrollment(true);
    try {
      const res = await api<EnrollmentsResponse>("/dashboard/enrollments");
      setEnrolled(res.data.some((item) => item.course.id === courseId));
    } catch {
      setEnrolled(false);
    } finally {
      setCheckingEnrollment(false);
    }
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    void checkEnrollment();
  }, [checkEnrollment]);

  useEffect(() => {
    function handleEnrolled(event: Event) {
      const detail = (event as CustomEvent<{ courseId?: string }>).detail;
      if (detail?.courseId === courseId) {
        setEnrolled(true);
      }
    }

    window.addEventListener("aimers:enrolled", handleEnrolled);
    return () => window.removeEventListener("aimers:enrolled", handleEnrolled);
  }, [courseId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setInfo("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const history = messages.filter((msg) => msg.role === "user" || msg.role === "assistant");
      const res = await api<SupportResponse>("/ai/course-support", {
        method: "POST",
        body: {
          courseId,
          message: trimmed,
          history,
        },
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
      setInfo(res.message || `Answered with ${res.provider}`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not reach the course assistant.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading || checkingEnrollment) {
    return (
      <section className="mt-12 rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
        <p className="text-sm text-aimers-muted">Loading course assistant…</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mt-12 rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
        <div className="flex items-start gap-3">
          <Bot className="mt-1 h-6 w-6 shrink-0 text-aimers-gold" />
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
              Aimers Support
            </h2>
            <p className="mt-2 text-sm text-aimers-muted">
              Sign in and enroll to chat with an AI assistant about this course.
            </p>
            <Button href="/login" className="mt-4" size="sm">
              Sign in
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!enrolled) {
    return (
      <section className="mt-12 rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
        <div className="flex items-start gap-3">
          <Bot className="mt-1 h-6 w-6 shrink-0 text-aimers-gold" />
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
              Aimers Support
            </h2>
            <p className="mt-2 text-sm text-aimers-muted">
              Enroll in this course to unlock the support chatbot. It can answer
              questions about the syllabus, timeline, instructor, and study tips.
            </p>
            <p className="mt-3 text-sm text-aimers-muted">
              Already enrolled?{" "}
              <button
                type="button"
                onClick={() => void checkEnrollment()}
                className="font-medium text-aimers-black underline-offset-2 hover:underline"
              >
                Refresh access
              </button>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
      <div className="flex items-start gap-3">
        <Bot className="mt-1 h-6 w-6 shrink-0 text-aimers-gold" />
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            Aimers Support
          </h2>
          <p className="mt-2 text-sm text-aimers-muted">
            Ask course-related questions as you learn. Answers use this course&apos;s
            details and your enrollment context.
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-6 max-h-[28rem] space-y-3 overflow-y-auto rounded-[var(--aimers-radius)] bg-aimers-surface p-4"
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "max-w-[90%] rounded-[var(--aimers-radius)] px-4 py-3 text-sm leading-relaxed",
              message.role === "user"
                ? "ml-auto bg-aimers-black text-white"
                : "bg-white text-aimers-black border border-aimers-border"
            )}
          >
            {message.content}
          </div>
        ))}
        {loading ? (
          <p className="text-sm text-aimers-muted">Assistant is typing…</p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => void sendMessage(prompt)}
            className="rounded-[var(--aimers-radius)] border border-aimers-border px-3 py-1.5 text-xs font-medium text-aimers-muted transition hover:border-aimers-black hover:text-aimers-black disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe your problem or question…"
          className={fieldClass}
          disabled={loading}
          maxLength={2000}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>

      {error ? (
        <p className="mt-3 rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mt-3 rounded-[var(--aimers-radius)] bg-aimers-surface px-3 py-2 text-sm text-aimers-muted">
          {info}
        </p>
      ) : null}

      {user?.role === "student" ? (
        <p className="mt-4 text-xs text-aimers-muted">
          Need more AI tools? Visit{" "}
          <Link href="/ai-tools" className="font-medium underline">
            AI Tools
          </Link>{" "}
          for Course Writer and Pathfinder.
        </p>
      ) : null}
    </section>
  );
}
