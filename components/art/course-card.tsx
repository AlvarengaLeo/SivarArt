import Link from "next/link";
import Image from "next/image";
import { Clock, PlayCircle } from "lucide-react";
import type { Course } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/academy/curso/${course.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-surface shadow-e1 transition-shadow hover:shadow-e2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        <Image
          src={course.cover}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-standard group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3">
          <Badge>{course.level}</Badge>
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          por {course.artistName}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.summary}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="flex items-center gap-3 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="size-4" /> {course.lessons}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" /> {Math.round(course.durationMin / 60)}h
            </span>
          </span>
          <span className="font-medium">{formatUSD(course.priceCents)}</span>
        </div>
      </div>
    </Link>
  );
}
