"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-aimers-gold">
        Error
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-aimers-black">
        Something went wrong
      </h1>
      <p className="mt-3 text-aimers-muted">
        An unexpected error occurred while loading this page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button href="/" variant="secondary">
          Back home
        </Button>
      </div>
    </main>
  );
}
