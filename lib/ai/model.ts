import { createGoogleGenerativeAI } from "@ai-sdk/google";

/** Vercel AI SDK expects GOOGLE_GENERATIVE_AI_API_KEY; we also accept GEMINI_API_KEY. */
export function getGoogleApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

export function isAiConfigured() {
  return Boolean(getGoogleApiKey());
}

export function getModel() {
  const modelId = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  const apiKey = getGoogleApiKey();
  const google = createGoogleGenerativeAI(apiKey ? { apiKey } : undefined);
  return google(modelId);
}
