type AimersMarkProps = {
  className?: string;
  size?: number;
};

/** Transparent @ mark — no background color */
export function AimersMark({ className = "", size = 28 }: AimersMarkProps) {
  return (
    <span
      className={`inline-block font-bold leading-none text-aimers-black ${className}`.trim()}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      @
    </span>
  );
}
