import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col text-aimers-black">
      <Image
        src="/aimers-hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-aimers-white/70 backdrop-blur-[2px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" aria-label="Aimers home">
          <Image
            src="/aimers-logo.png"
            alt="Aimers"
            width={88}
            height={65}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <Link
          href="/courses"
          className="text-sm font-medium text-aimers-black/80 transition hover:text-aimers-black"
        >
          Courses
        </Link>
      </header>

      <main className="relative z-10 flex flex-[1_1_auto] min-h-[60vh] max-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <Image
          src="/aimers-logo.png"
          alt="Aimers"
          width={410}
          height={302}
          className="h-auto w-[220px] md:w-[320px]"
          priority
        />
        <h1 className="mt-8 max-w-xl text-lg font-medium text-aimers-black/80 md:text-xl">
          Aim higher. Learn smarter.
        </h1>
        <p className="mt-3 max-w-md text-sm text-aimers-muted md:text-base">
          Online learning built for focused students — courses, guidance, and
          AI tools that help you move forward with clarity.
        </p>
        <div className="mt-8">
          <Link
            href="/courses"
            className="inline-flex rounded-[var(--aimers-radius)] bg-aimers-black px-7 py-3 text-sm font-semibold text-aimers-white transition hover:bg-aimers-black/90"
          >
            Explore courses
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-aimers-black/10 px-6 py-6 text-center text-xs text-aimers-muted">
        © {new Date().getFullYear()} Aimers. All rights reserved.
      </footer>
    </div>
  );
}
