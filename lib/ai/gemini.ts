import { GoogleGenerativeAI } from "@google/generative-ai";
import type { QueryResponse } from "./query-cache";

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateDraftMessage(prompt: string): Promise<string> {
  if (!isGeminiConfigured()) {
    return "Hi — wanted to check in on your athlete's training. Let's get them back on schedule this week!";
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().slice(0, 320);
}

export async function queryWithGemini(
  query: string
): Promise<QueryResponse | null> {
  if (!isGeminiConfigured()) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(
    `You are Legacy Command AI. Answer this staff query concisely in markdown (2-3 paragraphs max): ${query}`
  );
  return { type: "narrative", markdown: result.response.text() };
}
