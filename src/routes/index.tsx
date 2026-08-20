import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Lightbulb, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";

import { PageIntro, ReviewNotice } from "@/components/app/PageIntro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivity, type Activity } from "@/lib/activity";
import { TOOL_ITEMS } from "@/lib/nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate everyday workplace tasks: draft emails, summarize meetings, plan tasks, research topics and chat with an AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Five AI tools that help professionals work faster: email, meetings, tasks, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const TIPS = [
  "Batch similar tasks together to reduce context switching and finish faster.",
  "Start your day by naming your single most important task — then do it first.",
  "Keep meetings short by sharing an agenda and a desired outcome beforehand.",
  "Give the AI context and a clear goal; specific prompts produce usable drafts.",
  "Always review AI output for accuracy, tone and confidentiality before sending.",
];

function Dashboard() {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const sync = () => setActivity(getActivity());
    sync();
    window.addEventListener("awpa:activity", sync);
    return () => window.removeEventListener("awpa:activity", sync);
  }, []);

  return (
    <div className="space-y-8">
      <PageIntro
        title="Welcome back 👋"
        description="Your AI Workplace Productivity Assistant helps employees, graduates, administrators and managers automate everyday tasks — writing emails, summarizing meetings, planning work, researching topics and answering workplace questions."
      >
        <ReviewNotice />
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/email">
              <Sparkle className="mr-1.5 size-4" /> Draft an email
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/meeting-notes">Summarize notes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/task-planner">Plan my day</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Ask the chatbot</Link>
          </Button>
        </div>
      </PageIntro>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Productivity tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_ITEMS.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card className="h-full shadow-[var(--shadow-card)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-elevated)]">
                <CardHeader className="space-y-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <tool.icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{tool.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tool.blurb}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Open tool <ArrowRight className="ml-1 size-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" /> Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                No activity yet. Generate something with one of the tools and it will appear here.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.tool}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(a.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="size-4 text-primary" /> Productivity tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
