import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border pt-28",
        className,
      )}
    >
      <div className="blueprint-grid blueprint-grid-fade absolute inset-0 -z-10 opacity-60" />
      <div className="container pb-12">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
