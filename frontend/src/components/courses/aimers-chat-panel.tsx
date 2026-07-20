"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AimersChatPanelProps = {
  courseId: string;
  courseTitle: string;
  open: boolean;
  onClose: () => void;
};

type SupportResponse = {
  success: boolean;
  provider: "openai" | "gemini" | "offline";
  message?: string;
  data: { reply: string };
};

export const AIMERS_GREETING =
  "Hello I'm Aimers. I'm your support assistant. How can I help you?";

const fieldClass =
  "flex-1 rounded-[var(--aimers-radius)] border border-aimers-border px-3 py-2 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black";

export function AimersChatPanel({
  courseId,
  courseTitle,
  open,
  onClose,
}: AimersChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !started) {
      setMessages([{ role: "assistant", content: AIMERS_GREETING }]);
      setStarted(true);
      setError("");
      setInput("");
    }
  }, [open, started]);

  useEffect(() => {
    if (!open) {
      setStarted(false);
      setMessages([]);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const history = messages.filter(
        (msg) => msg.role === "user" || msg.role === "assistant"
      );
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
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not reach Aimers right now.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close chat"
        className="absolute inset-0 bg-aimers-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative flex h-[min(32rem,calc(100vh-6rem))] w-full max-w-md flex-col overflow-hidden rounded-[var(--aimers-radius)] border border-aimers-border bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-aimers-border bg-aimers-surface px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aimers-gold/15 text-aimers-gold">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-aimers-black">
                Aimers
              </p>
              <p className="text-xs text-aimers-muted">{courseTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--aimers-radius)] p-2 text-aimers-muted transition hover:bg-white hover:text-aimers-black"
            aria-label="Close Aimers chat"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-aimers-surface/40 p-4"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "max-w-[88%] rounded-[var(--aimers-radius)] px-3 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "ml-auto bg-aimers-black text-white"
                  : "border border-aimers-border bg-white text-aimers-black"
              )}
            >
              {message.role === "assistant" && index === 0 ? (
                <span className="font-semibold text-aimers-gold">Aimers: </span>
              ) : null}
              {message.content}
            </div>
          ))}
          {loading ? (
            <p className="text-sm text-aimers-muted">Aimers is typing…</p>
          ) : null}
        </div>

        <form
          className="border-t border-aimers-border bg-white p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage(input);
          }}
        >
          {error ? (
            <p className="mb-2 text-xs text-red-600">{error}</p>
          ) : null}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Describe your problem or question…"
              className={fieldClass}
              disabled={loading}
              maxLength={2000}
            />
            <Button type="submit" size="sm" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
