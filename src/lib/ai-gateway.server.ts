import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

export const CHAT_MODEL = "google/gemini-3.7-flash";

export async function runPrompt(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");

  const { streamText } = await import("ai");
  const gateway = createLovableAiGatewayProvider(key);

  const result = streamText({
    model: gateway(CHAT_MODEL),
    system,
    prompt,
  });

  return await result.text;
}
