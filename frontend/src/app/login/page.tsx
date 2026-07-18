"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, password);
    router.push("/");
  }

  function handleDemoLogin() {
    setEmail("demo@aimers.learn");
    setPassword("demo1234");
  }

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 md:px-6">
      <SectionHeading
        align="left"
        title="Welcome back"
        subtitle="Sign in to access your dashboard, enrolled courses, and AI study tools."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-[var(--aimers-radius)] border border-aimers-border p-6 md:p-8"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-aimers-black"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-aimers-black"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sign in
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleDemoLogin}
        >
          Demo login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-aimers-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-aimers-black underline-offset-2 hover:underline"
        >
          Register
        </Link>
      </p>
    </main>
  );
}
