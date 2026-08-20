import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runPrompt } from "./ai-gateway.server";
import {
  BASE_SYSTEM,
  CHAT_SYSTEM,
  chatPrompt,
  emailPrompt,
  meetingPrompt,
  plannerPrompt,
  researchPrompt,
} from "./assistant.prompts";

const emailSchema = z.object({
  audience: z.string().min(1),
  tone: z.string().min(1),
  purpose: z.string().min(1),
  context: z.string().default(""),
  outcome: z.string().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => emailSchema.parse(d))
  .handler(async ({ data }) => ({ text: await runPrompt(BASE_SYSTEM, emailPrompt(data)) }));

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ notes: z.string().min(20) }).parse(d))
  .handler(async ({ data }) => ({ text: await runPrompt(BASE_SYSTEM, meetingPrompt(data.notes)) }));

const plannerSchema = z.object({
  tasks: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().default(""),
        deadline: z.string().default(""),
        priority: z.string().default("Medium"),
      }),
    )
    .min(1),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => plannerSchema.parse(d))
  .handler(async ({ data }) => ({ text: await runPrompt(BASE_SYSTEM, plannerPrompt(data.tasks)) }));

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ topic: z.string().min(3), level: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => ({
    text: await runPrompt(BASE_SYSTEM, researchPrompt(data.topic, data.level)),
  }));

export const sendChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        messages: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => ({ text: await runPrompt(CHAT_SYSTEM, chatPrompt(data.messages)) }));
