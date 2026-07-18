import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-aimers-black text-aimers-white">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <Image
            src="/aimers-logo.png"
            alt="Aimers"
            width={40}
            height={40}
            className="rounded-sm"
            priority
          />
          <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-wide">
            AIMERS
          </span>
        </div>
        <p className="hidden text-xs tracking-[0.2em] text-zinc-400 sm:block">
          IIT-JEE · NEET · FOUNDATION
        </p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <Image
          src="/aimers-logo.png"
          alt="Aimers logo"
          width={280}
          height={280}
          className="mb-10"
          priority
        />
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tracking-tight md:text-5xl">
          Aim higher. Learn smarter.
        </h1>
        <p className="mt-4 max-w-lg text-base text-zinc-400 md:text-lg">
          Phase 0 complete — Aimers foundation is ready. Full landing, courses,
          auth, and AI tools land in the next phases.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/courses"
            className="rounded-[var(--aimers-radius)] bg-aimers-gold px-6 py-3 text-sm font-semibold text-aimers-black transition hover:brightness-110"
          >
            Explore courses
          </Link>
          <span className="rounded-[var(--aimers-radius)] border border-zinc-700 px-6 py-3 text-sm text-zinc-300">
            Stack: Next.js · Express · MongoDB · AI
          </span>
        </div>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Aimers. IIT-JEE | NEET | FOUNDATION
      </footer>
    </div>
  );
}
