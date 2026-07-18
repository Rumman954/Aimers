"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-aimers-black py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6 lg:px-8">
        <SectionHeading
          title="Stay in the loop"
          subtitle="Get course launches, learning tips, and exclusive offers — no spam, just useful updates."
          className="[&_h2]:text-aimers-white [&_p]:text-aimers-white/70"
        />
        {submitted ? (
          <p className="rounded-[var(--aimers-radius)] border border-aimers-gold/30 bg-aimers-gold/10 px-6 py-4 text-sm text-aimers-gold">
            Thanks for subscribing! We&apos;ll send updates to{" "}
            <span className="font-semibold">{email}</span>.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-[var(--aimers-radius)] border border-aimers-white/20 bg-aimers-white/10 px-4 py-3 text-sm text-aimers-white placeholder:text-aimers-white/50 focus:border-aimers-gold focus:outline-none focus:ring-1 focus:ring-aimers-gold"
            />
            <Button type="submit" variant="gold" size="lg" className="shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
