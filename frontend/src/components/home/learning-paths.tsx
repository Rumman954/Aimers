import { BookOpen } from "lucide-react";
import { learningPaths } from "@/data/landing";
import { SectionHeading } from "@/components/ui/section-heading";

export function LearningPaths() {
  return (
    <section className="bg-aimers-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Learning paths"
          subtitle="Not sure where to start? Follow a curated path that connects courses into a coherent skill journey."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <article
              key={path.title}
              className="flex flex-col rounded-[var(--aimers-radius)] border border-aimers-border p-6"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--aimers-radius)] bg-aimers-gold/15 text-aimers-gold">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-aimers-black">
                {path.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-aimers-muted">
                {path.description}
              </p>
              <div className="mt-4 space-y-1 text-xs text-aimers-muted">
                <p>
                  <span className="font-medium text-aimers-black">Duration:</span>{" "}
                  {path.duration}
                </p>
                <p>
                  <span className="font-medium text-aimers-black">Level:</span>{" "}
                  {path.level}
                </p>
              </div>
              <ul className="mt-4 space-y-1 border-t border-aimers-border pt-4">
                {path.courses.map((course) => (
                  <li
                    key={course}
                    className="text-sm text-aimers-black/80 before:mr-2 before:text-aimers-gold before:content-['•']"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
