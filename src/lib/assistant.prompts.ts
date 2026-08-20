export const BASE_SYSTEM =
  "You are the AI Workplace Productivity Assistant, a professional workplace productivity tool. " +
  "Write clear, concise, workplace-appropriate content. Use markdown with the exact section headings requested. " +
  "Never invent confidential facts; if information is missing, note reasonable assumptions.";

export type EmailInput = {
  audience: string;
  tone: string;
  purpose: string;
  context: string;
  outcome: string;
};

export function emailPrompt(i: EmailInput) {
  return `Write a workplace email.

Audience: ${i.audience}
Tone: ${i.tone}
Purpose: ${i.purpose}
Key information / context: ${i.context || "not provided"}
Desired outcome: ${i.outcome || "not provided"}

Respond in markdown with exactly these sections:

## Subject
(one line subject)

## Email Body
(the complete email, including greeting and sign-off placeholder [Your Name])`;
}

export function meetingPrompt(notes: string) {
  return `Summarize the following meeting notes.

NOTES:
"""
${notes}
"""

Respond in markdown with exactly these sections:

## Meeting Summary
## Key Discussion Points
## Decisions Made
## Action Items
(a markdown table with columns: Action Item | Responsible Person | Deadline. Use "Unassigned" or "Not specified" where the notes do not say.)`;
}

export type PlannerTask = {
  name: string;
  description: string;
  deadline: string;
  priority: string;
};

export function plannerPrompt(tasks: PlannerTask[]) {
  const list = tasks
    .map(
      (t, n) =>
        `${n + 1}. Task: ${t.name} | Description: ${t.description || "-"} | Deadline: ${
          t.deadline || "-"
        } | Priority: ${t.priority}`,
    )
    .join("\n");

  return `Organize and plan the following tasks using the Eisenhower matrix.

TASKS:
${list}

Respond in markdown with exactly these sections:

## Urgent and Important
## Important but Not Urgent
## Urgent but Less Important
## Low Priority
## Suggested Daily Schedule
(a markdown table with columns: Time Block | Focus | Why)`;
}

export function researchPrompt(topic: string, level: string) {
  return `Research the following workplace topic or question at a "${level}" level of depth.

TOPIC: ${topic}

Respond in markdown with exactly these sections:

## Overview
## Key Insights
## Important Points
## Recommendations
## Questions for Further Research`;
}

export const CHAT_SYSTEM =
  BASE_SYSTEM +
  " You are in chat mode: answer workplace productivity questions helpfully and briefly (under 300 words unless asked for more). Use markdown lists where useful.";

export function chatPrompt(messages: { role: string; content: string }[]) {
  return (
    messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n") +
    "\n\nAssistant:"
  );
}
