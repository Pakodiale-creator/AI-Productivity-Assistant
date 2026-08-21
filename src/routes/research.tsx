import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { useState } from "react";

import { AiResult } from "@/components/app/AiResult";
import { PageIntro, ReviewNotice } from "@/components/app/PageIntro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logActivity } from "@/lib/activity";
import { runResearch } from "@/lib/assistant.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Ask a workplace research question and receive an overview, key insights, recommendations and follow-up questions.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured briefings on any workplace topic, at the depth you choose.",
      },
    ],
  }),
  component: ResearchPage,
});

const LEVELS = ["Simple", "Intermediate", "Detailed"];

function ResearchPage() {
  const run = useServerFn(runResearch);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function research() {
    if (topic.trim().length < 3) {
      setError("Please enter a research topic or question.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { topic, level } });
      setResult(res.text);
      logActivity("AI Research Assistant", topic);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        title="AI Research Assistant"
        description="Explore a topic or question and get a structured briefing you can use in reports, proposals or meetings."
      >
        <ReviewNotice />
      </PageIntro>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="size-4 text-primary" /> Research request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic / question</Label>
            <Textarea
              id="topic"
              rows={4}
              placeholder="e.g. How can small teams improve onboarding for new graduates?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:max-w-xs">
            <Label>Desired level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={research} disabled={loading}>
              {loading ? "Researching…" : "Research"}
            </Button>
            <Button
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setTopic("");
                setResult(null);
                setError(null);
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <AiResult
        title="Research briefing"
        result={result}
        loading={loading}
        error={error}
        emptyTitle="No research yet"
        emptyHint="Enter a topic above and select Research."
        onRegenerate={research}
      />
    </div>
  );
}
