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

export default function RegisterPage() {
  const { register, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Name must be at least 2 characters";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (password.length < 8) {
      next.password = "Password must be at least 8 characters";
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      next.password = "Password must include a letter and a number";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to create account"
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
        title="Create an account"
        subtitle="Join Aimers as a student or instructor and start learning or teaching."
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
          <label htmlFor="name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
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
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            I want to join as
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "student" | "instructor")
            }
            className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <div className="relative py-1 text-center text-xs text-aimers-muted">
          <span className="relative z-10 bg-aimers-white px-2">or</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-aimers-border" />
        </div>

        <GoogleSignInButton
          onCredential={handleGoogle}
          onError={(message) => setError(message)}
        />
      </form>

      <p className="mt-6 text-center text-sm text-aimers-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-aimers-black underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
