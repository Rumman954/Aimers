import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/landing";
import { SectionHeading } from "@/components/ui/section-heading";

export function Categories() {
  return (
    <section className="bg-aimers-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Browse by category"
          subtitle="Find courses aligned with your goals — from code and data to design, business, and exam prep."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/courses?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white p-5 transition hover:border-aimers-black hover:shadow-sm"
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-aimers-black">
                {category.name}
              </h3>
              <p className="mt-1 flex-1 text-sm text-aimers-muted">
                {category.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-aimers-muted">
                <span>{category.courseCount} courses</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-aimers-black" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
