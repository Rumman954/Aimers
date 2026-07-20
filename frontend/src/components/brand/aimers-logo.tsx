import Image from "next/image";
import { cn } from "@/lib/utils";

type AimersLogoProps = {
  className?: string;
  variant?: "nav" | "hero";
  priority?: boolean;
};

const sizes = {
  nav: { width: 88, height: 60, className: "h-10 w-auto" },
  hero: { width: 320, height: 220, className: "h-auto w-[240px] md:w-[320px]" },
};

export function AimersLogo({
  className,
  variant = "nav",
  priority = false,
}: AimersLogoProps) {
  const size = sizes[variant];

  return (
    <Image
      src="/aimers-logo.svg"
      alt="Aimers"
      width={size.width}
      height={size.height}
      priority={priority}
      className={cn(size.className, className)}
    />
  );
}
