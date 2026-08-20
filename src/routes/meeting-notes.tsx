import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen } from "lucide-react";
import { useState } from "react";

import { AiResult } from "@/components/app/AiResult";
import { PageIntro, ReviewNotice } from "@/components/app/PageIntro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logActivity } from "@/lib/activity";
import { summarizeMeeting } from "@/lib/assistant.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a summary, key discussion points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into clear decisions and action items.",
      },
    ],
  }),
  component: MeetingNotesPage,
});

function MeetingNotesPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function summarize() {
    if (notes.trim().length < 20) {
      setError("Please paste at least a few lines of meeting notes.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { notes } });
      setResult(res.text);
      logActivity("Meeting Notes Summarizer", notes.trim().split("\n")[0] ?? "Meeting notes");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        title="Meeting Notes Summarizer"
        description="Paste your raw notes or transcript. The assistant extracts a summary, decisions, action items, owners and deadlines."
      >
        <ReviewNotice />
      </PageIntro>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <NotebookPen className="size-4 text-primary" /> Meeting notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Paste notes</Label>
            <Textarea
              id="notes"
              rows={14}
              placeholder="Paste your meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{notes.trim().length} characters</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={summarize} disabled={loading}>
              {loading ? "Summarizing…" : "Summarize Meeting"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setNotes("");
                setResult(null);
                setError(null);
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <AiResult
        title="Meeting summary"
        result={result}
        loading={loading}
        error={error}
        emptyTitle="No summary yet"
        emptyHint="Paste your notes above and select Summarize Meeting."
        onRegenerate={summarize}
      />
    </div>
  );
}
