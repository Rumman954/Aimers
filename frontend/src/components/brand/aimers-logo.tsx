import { cn } from "@/lib/utils";

type AimersLogoProps = {
  className?: string;
  markSize?: "sm" | "md" | "lg";
  showWordmark?: boolean;
};

const markSizes = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl md:text-6xl",
};

const wordSizes = {
  sm: "text-sm tracking-[0.2em]",
  md: "text-lg tracking-[0.22em]",
  lg: "text-2xl tracking-[0.24em] md:text-3xl",
};

export function AimersLogo({
  className,
  markSize = "md",
  showWordmark = true,
}: AimersLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-col items-center leading-none text-aimers-black",
        className
      )}
      aria-label="Aimers"
    >
      <span
        className={cn(
          "font-bold text-aimers-gold",
          markSizes[markSize]
        )}
        aria-hidden
      >
        @
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "mt-1 font-[family-name:var(--font-space-grotesk)] font-bold",
            wordSizes[markSize]
          )}
        >
          AIMERS
        </span>
      ) : null}
    </span>
  );
}
