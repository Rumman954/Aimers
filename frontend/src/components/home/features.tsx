import {
  Brain,
  ChartColumn,
  Clock,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { features } from "@/data/landing";
import { SectionHeading } from "@/components/ui/section-heading";

const iconMap = {
  target: Target,
  brain: Brain,
  users: Users,
  chart: ChartColumn,
  clock: Clock,
  shield: Shield,
};

export function Features() {
  return (
    <section className="bg-aimers-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Why learn with Aimers"
          subtitle="Structured paths, expert guidance, and AI support — everything you need to stay focused and finish what you start."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.title}
                className="rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-surface/50 p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--aimers-radius)] bg-aimers-black text-aimers-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-aimers-black">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-aimers-muted">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
