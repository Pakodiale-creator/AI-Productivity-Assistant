import { AlertCircle, Copy, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  title: string;
  result: string | null;
  loading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyHint: string;
  onRegenerate?: () => void;
};

export function AiResult({
  title,
  result,
  loading,
  error,
  emptyTitle,
  emptyHint,
  onRegenerate,
}: Props) {
  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy — please select and copy manually.");
    }
  }

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {result && !loading ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copy}>
              <Copy className="mr-1.5 size-3.5" /> Copy
            </Button>
            {onRegenerate ? (
              <Button size="sm" variant="secondary" onClick={onRegenerate}>
                <RefreshCw className="mr-1.5 size-3.5" /> Regenerate
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3" aria-live="polite">
            <p className="text-sm text-muted-foreground">Generating with AI…</p>
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div className="space-y-3 text-sm">
              <p className="font-medium text-destructive">Something went wrong</p>
              <p className="text-muted-foreground">{error}</p>
              {onRegenerate ? (
                <Button size="sm" variant="outline" onClick={onRegenerate}>
                  <RefreshCw className="mr-1.5 size-3.5" /> Try again
                </Button>
              ) : null}
            </div>
          </div>
        ) : result ? (
          <div className="ai-prose">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-8 text-center">
            <p className="text-sm font-medium">{emptyTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
