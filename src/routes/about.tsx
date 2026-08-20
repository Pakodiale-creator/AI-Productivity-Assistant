import { createFileRoute } from "@tanstack/react-router";
import { EyeOff, Info, ScanEye, ShieldCheck, UserCheck } from "lucide-react";

import { PageIntro } from "@/components/app/PageIntro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOOL_ITEMS } from "@/lib/nav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Responsible AI — Workplace AI" },
      {
        name: "description",
        content:
          "How the AI Workplace Productivity Assistant works and how to use AI-generated content responsibly at work.",
      },
      { property: "og:title", content: "About & Responsible AI" },
      {
        property: "og:description",
        content: "Responsible AI guidance: review outputs, verify facts, protect sensitive data.",
      },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    icon: ScanEye,
    title: "AI can be inaccurate",
    body: "AI may occasionally produce incorrect, outdated or incomplete information, including confident-sounding mistakes.",
  },
  {
    icon: UserCheck,
    title: "Verify important information",
    body: "Check facts, figures, names, dates and policy references against trusted internal or official sources before acting.",
  },
  {
    icon: ShieldCheck,
    title: "Always review before use",
    body: "Do not rely on AI-generated content without review. Edit tone, accuracy and completeness so the output reflects your intent.",
  },
  {
    icon: EyeOff,
    title: "Protect sensitive information",
    body: "Avoid entering unnecessary confidential, personal or sensitive information into any AI tool, including this one.",
  },
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="About & Responsible AI"
        description="The AI Workplace Productivity Assistant is a prototype that helps professionals automate common workplace tasks. It is a demonstration tool, not a replacement for professional judgement."
      />

      <div className="flex items-start gap-3 rounded-xl border border-warning/50 bg-warning/10 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
        <p className="text-sm font-semibold text-warning-foreground">
          AI-generated content may require human review.
        </p>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-base">What this assistant does</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {TOOL_ITEMS.map((tool) => (
              <li key={tool.to} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <tool.icon className="size-4" />
                </span>
                <span className="text-sm">
                  <strong className="font-semibold">{tool.label}</strong>
                  <span className="block text-muted-foreground">{tool.blurb}</span>
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.title} className="shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <p.icon className="size-5" />
              </span>
              <CardTitle className="text-base">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-base">Responsible use in practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Treat every output as a first draft. Add the context only you have, remove anything that
            is inaccurate, and keep accountability for the final version with a person.
          </p>
          <p>
            Follow your organisation's data protection and acceptable-use policies when working with
            AI tools. Conversations in this prototype exist only for the current browser session and
            are not stored on a server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
