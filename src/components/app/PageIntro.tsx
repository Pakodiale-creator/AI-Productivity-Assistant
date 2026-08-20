import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function PageIntro({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function ReviewNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-3.5 py-2.5 text-xs text-warning-foreground ${className}`}
    >
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <span>
        <strong className="font-semibold">AI-generated content may require human review.</strong>{" "}
        Verify important details and avoid entering confidential information.
      </span>
    </div>
  );
}
