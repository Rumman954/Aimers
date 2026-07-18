"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  label?: string;
  error?: string;
};

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete = "current-password",
  label = "Password",
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-aimers-black">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 pr-11 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black"
        />
        <button
          type="button"
          onClick={() => setShowPassword((open) => !open)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-aimers-muted transition hover:text-aimers-black"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
