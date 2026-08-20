import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, Bot, Send, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { PageIntro, ReviewNotice } from "@/components/app/PageIntro";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { logActivity } from "@/lib/activity";
import { sendChat } from "@/lib/assistant.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI assistant about meetings, emails, prioritising tasks and managing your workload.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "Ask workplace questions and get practical, professional answers.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prepare for a meeting.",
  "Write a professional email to my manager.",
  "Help me prioritize my tasks.",
  "Summarize this information.",
  "Give me tips for managing my workload.",
];

function ChatPage() {
  const run = useServerFn(sendChat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
      logActivity("AI Workplace Chatbot", content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        title="AI Workplace Chatbot"
        description="Ask questions about your work — meetings, emails, priorities or workload management."
      >
        <ReviewNotice />
      </PageIntro>

      <Card className="flex h-[62vh] min-h-[26rem] flex-col overflow-hidden shadow-[var(--shadow-card)]">
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Bot className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium">Start a conversation</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try one of these to get going:
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Bot className="size-4" />
                  </span>
                ) : null}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "ai-prose max-w-[85%]"
                  }
                >
                  {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
                </div>
                {m.role === "user" ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <UserRound className="size-4" />
                  </span>
                ) : null}
              </div>
            ))
          )}

          {loading ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Bot className="size-4" />
              </span>
              <span className="animate-pulse">Thinking…</span>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <div ref={endRef} />
        </CardContent>

        <div className="border-t border-border bg-surface p-3 sm:p-4">
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask a workplace question…"
              className="max-h-32 min-h-11 resize-none"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
