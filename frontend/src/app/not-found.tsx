import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-aimers-gold">
        404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-aimers-black md:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-aimers-muted">
        That route does not exist — or the course may have been removed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Back home</Button>
        <Button href="/courses" variant="secondary">
          Explore courses
        </Button>
      </div>
      <p className="mt-6 text-sm text-aimers-muted">
        Need help?{" "}
        <Link href="/contact" className="font-medium underline">
          Contact us
        </Link>
      </p>
    </main>
  );
}
