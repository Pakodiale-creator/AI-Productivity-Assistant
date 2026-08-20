import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { logActivity } from "@/lib/activity";
import { generateEmail } from "@/lib/assistant.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails by choosing an audience, tone, purpose and desired outcome.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft clear, professional emails in seconds with AI.",
      },
    ],
  }),
  component: EmailPage,
});

const AUDIENCES = ["Client", "Manager", "Team", "Colleague", "Other"];
const TONES = ["Formal", "Professional", "Friendly", "Persuasive"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [audience, setAudience] = useState("Manager");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [outcome, setOutcome] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!purpose.trim()) {
      setError("Please describe the purpose of the email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { audience, tone, purpose, context, outcome } });
      setResult(res.text);
      logActivity("Smart Email Generator", purpose);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        title="Smart Email Generator"
        description="Describe what you need to say and the assistant will draft a complete, professional email."
      >
        <ReviewNotice />
      </PageIntro>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="size-4 text-primary" /> Email details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g. Request an extension on the quarterly report"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Key information / context</Label>
            <Textarea
              id="context"
              rows={4}
              placeholder="Background details the email should include…"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Desired outcome</Label>
            <Input
              id="outcome"
              placeholder="e.g. Approval for a two-day extension"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            />
          </div>

          <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </CardContent>
      </Card>

      <AiResult
        title="Generated email"
        result={result}
        loading={loading}
        error={error}
        emptyTitle="No email generated yet"
        emptyHint="Fill in the details above and select Generate Email."
        onRegenerate={generate}
      />
    </div>
  );
}
