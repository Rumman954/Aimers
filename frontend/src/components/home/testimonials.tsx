import Image from "next/image";
import { testimonials } from "@/data/landing";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials() {
  return (
    <section className="bg-aimers-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="What learners say"
          subtitle="Real stories from students who used Aimers to advance their careers and reach their goals."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="flex flex-col rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-aimers-black/80">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6 flex items-center gap-3 border-t border-aimers-border pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[var(--aimers-radius)]">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <cite className="not-italic font-semibold text-aimers-black">
                    {testimonial.name}
                  </cite>
                  <p className="text-xs text-aimers-muted">{testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
