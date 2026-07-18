import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[60vh] max-h-[65vh] w-full flex-col items-center justify-center overflow-hidden">
      <Image
        src="/aimers-hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-aimers-white/75 backdrop-blur-[1px]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Image
          src="/aimers-logo.png"
          alt="Aimers"
          width={410}
          height={302}
          className="animate-aimers-fade-up h-auto w-[220px] md:w-[320px]"
          priority
        />
        <p className="animate-aimers-fade-up-delay mt-6 max-w-md text-base text-aimers-black/80 md:text-lg">
          Aim higher. Learn smarter.
        </p>
        <div className="animate-aimers-fade-up-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/courses" size="lg">
            Explore courses
          </Button>
          <Button href="/about" variant="secondary" size="lg">
            Why Aimers
          </Button>
        </div>
      </div>
    </section>
  );
}
