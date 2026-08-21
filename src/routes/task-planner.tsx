import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AiResult } from "@/components/app/AiResult";
import { PageIntro, ReviewNotice } from "@/components/app/PageIntro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { generatePlan } from "@/lib/assistant.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Enter your tasks with deadlines and priorities to get a prioritised plan and a suggested daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritise your workload with the Eisenhower matrix and a daily schedule.",
      },
    ],
  }),
  component: TaskPlannerPage,
});

const PRIORITIES = ["High", "Medium", "Low"];

type Task = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: string;
};

const newTask = (): Task => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  description: "",
  deadline: "",
  priority: "Medium",
});

function TaskPlannerPage() {
  const run = useServerFn(generatePlan);
  const [tasks, setTasks] = useState<Task[]>([newTask()]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function plan() {
    const filled = tasks.filter((t) => t.name.trim());
    if (filled.length === 0) {
      setError("Add at least one task with a name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({
        data: {
          tasks: filled.map(({ name, description, deadline, priority }) => ({
            name,
            description,
            deadline,
            priority,
          })),
        },
      });
      setResult(res.text);
      logActivity("AI Task Planner", `${filled.length} task(s) planned`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        title="AI Task Planner"
        description="List what's on your plate. The assistant sorts your work by urgency and importance and proposes a daily schedule."
      >
        <ReviewNotice />
      </PageIntro>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="size-4 text-primary" /> Your tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {tasks.map((task, index) => (
            <div key={task.id} className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Task {index + 1}
                </span>
                {tasks.length > 1 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                    aria-label={`Remove task ${index + 1}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                ) : null}
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`name-${task.id}`}>Task name</Label>
                  <Input
                    id={`name-${task.id}`}
                    placeholder="e.g. Prepare board presentation"
                    value={task.name}
                    onChange={(e) => update(task.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc-${task.id}`}>Description</Label>
                  <Textarea
                    id={`desc-${task.id}`}
                    rows={2}
                    placeholder="What does this task involve?"
                    value={task.description}
                    onChange={(e) => update(task.id, { description: e.target.value })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`deadline-${task.id}`}>Deadline</Label>
                    <Input
                      id={`deadline-${task.id}`}
                      type="date"
                      value={task.deadline}
                      onChange={(e) => update(task.id, { deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={task.priority}
                      onValueChange={(value) => update(task.id, { priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setTasks((prev) => [...prev, newTask()])}>
              <Plus className="mr-1.5 size-4" /> Add task
            </Button>
            <Button onClick={plan} disabled={loading}>
              {loading ? "Building plan…" : "Generate Plan"}
            </Button>
            <Button
              variant="ghost"
              disabled={loading}
              onClick={() => {
                setTasks([newTask()]);
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
        title="Prioritised plan"
        result={result}
        loading={loading}
        error={error}
        emptyTitle="No plan yet"
        emptyHint="Add your tasks above and select Generate Plan."
        onRegenerate={plan}
      />
    </div>
  );
}
