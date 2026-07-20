import { Button } from "@/components/ui/button";
import { AimersLogo } from "@/components/brand/aimers-logo";

export function Hero() {
  return (
    <section className="relative flex min-h-[60vh] max-h-[65vh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-aimers-surface via-aimers-white to-aimers-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #D4A01733 0%, transparent 45%), radial-gradient(circle at 80% 10%, #0A0A0A0D 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <AimersLogo variant="hero" priority className="animate-aimers-fade-up" />
        <p className="animate-aimers-fade-up-delay mt-6 max-w-md text-base text-aimers-black/80 md:text-lg">
          Aim higher. Learn smarter.
        </p>
        <div className="animate-aimers-fade-up-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/courses" size="lg">
            Explore courses
          </Button>
          <Button href="/register" variant="secondary" size="lg">
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
}
