"use client";

import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="Contact us"
        subtitle="Questions about courses, partnerships, or your account? We typically respond within one business day."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[var(--aimers-radius)] border border-aimers-border p-6 md:p-8"
        >
          {submitted ? (
            <p className="text-sm text-aimers-black">
              Thank you for reaching out. We&apos;ll get back to you soon.
            </p>
          ) : (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-aimers-black"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-aimers-black"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-aimers-black"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-1.5 w-full resize-y rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
                />
              </div>
              <Button type="submit" size="lg">
                Send message
              </Button>
            </>
          )}
        </form>

        <div className="space-y-6">
          <div className="rounded-[var(--aimers-radius)] border border-aimers-border p-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-aimers-gold" />
              <div>
                <h3 className="font-semibold text-aimers-black">Email</h3>
                <a
                  href="mailto:hello@aimers.learn"
                  className="mt-1 block text-sm text-aimers-muted hover:text-aimers-black"
                >
                  hello@aimers.learn
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-[var(--aimers-radius)] border border-aimers-border p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-aimers-gold" />
              <div>
                <h3 className="font-semibold text-aimers-black">Office</h3>
                <p className="mt-1 text-sm text-aimers-muted">
                  Remote-first team serving learners worldwide.
                  <br />
                  Headquarters: Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
