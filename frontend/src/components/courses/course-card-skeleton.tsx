import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CourseCardSkeletonProps = {
  className?: string;
};

export function CourseCardSkeleton({ className }: CourseCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white",
        className
      )}
    >
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-3/4" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-full" />
        <div className="mt-4 flex items-center gap-3 border-t border-aimers-border pt-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mt-4 h-10 w-full" />
      </div>
    </div>
  );
}
