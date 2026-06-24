"use client";

import { GraduationCap } from "lucide-react";
import type { Course } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export function EnrollButton({ course }: { course: Course }) {
  const { add } = useCart();

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      onClick={() =>
        add({
          id: `course-${course.slug}`,
          kind: "course",
          title: course.title,
          priceCents: course.priceCents,
          qty: 1,
          image: course.cover,
        })
      }
    >
      <GraduationCap className="size-4" />
      Inscribirme
    </Button>
  );
}
