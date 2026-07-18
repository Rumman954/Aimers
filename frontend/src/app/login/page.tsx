"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { PasswordInput } from "@/components/auth/password-input";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

const DEMO_EMAIL = "demo@aimers.com";
const DEMO_PASSWORD = "Demo@1234";

export default function LoginPage() {
  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setFieldErrors({});
    setError("");
    setLoading(true);
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Demo login failed. Is the backend running and seeded?"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleGoogle = useCallback(
    async (credential: string) => {
      setError("");
      await loginWithGoogle(credential);
      router.push("/dashboard");
    },
    [loginWithGoogle, router]
  );

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
        noValidate
      >
        {error ? (
          <p className="rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

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
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>
        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={fieldErrors.password}
        />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Demo login
        </Button>

        <div className="relative py-1 text-center text-xs text-aimers-muted">
          <span className="bg-aimers-white px-2 relative z-10">or</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-aimers-border" />
        </div>

        <GoogleSignInButton
          onCredential={handleGoogle}
          onError={(message) => setError(message)}
        />

        <p className="text-center text-xs text-aimers-muted">
          Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </p>
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
