import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 md:px-6">
      <SectionHeading
        align="left"
        title="Create an account"
        subtitle="Registration opens in Phase 1. For now, use Demo login on the sign-in page to explore the logged-in experience."
      />
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-[var(--aimers-radius)] bg-aimers-black px-7 py-3 text-sm font-semibold text-aimers-white transition hover:bg-aimers-black/90"
      >
        Go to login
      </Link>
    </main>
  );
}
