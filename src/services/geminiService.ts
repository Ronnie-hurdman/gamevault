import { GoogleGenAI } from "@google/genai";
import { Game, Recommendation } from "../types";

export class GeminiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiConfigError";
  }
}

function getGeminiApiKey(): string | undefined {
  const viteEnv = (import.meta as any).env;
  const viteEnvKey = viteEnv?.VITE_GEMINI_API_KEY as string | undefined;
  const processEnvKey = typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : undefined;
  const rawKey = viteEnvKey || processEnvKey;
  const apiKey = rawKey?.trim();

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return undefined;
  }

  return apiKey;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

export async function getGameRecommendations(playedGames: Game[], preferences: string): Promise<Recommendation[]> {
  const playedList = playedGames.map((g) => `${g.title} (${g.platform})`).join(", ");

  const prompt = `You are a video game expert. Based on the user's played history: [${playedList}] and their preferences: "${preferences}", suggest 4 games they should play next.
  For each recommendation, provide:
  1. Title
  2. Platform (Sony, Nintendo, or Steam)
  3. A short, compelling reason why they would like it.
  4. Estimated price in USD (e.g., "$59.99").

  Return the response as a JSON array of objects with keys: "title", "platform", "reason", "estimatedPrice".`;

  const genAI = getGeminiClient();
  if (!genAI) {
    throw new GeminiConfigError("Gemini is not configured. Add a valid VITE_GEMINI_API_KEY in your local env file.");
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("reported as leaked")) {
      throw new GeminiConfigError("Your Gemini API key has been revoked because it was reported as leaked. Replace it with a new key in your local env file.");
    }

    if (message.includes("PERMISSION_DENIED") || message.includes('"code":403')) {
      throw new GeminiConfigError("Gemini rejected the configured API key. Verify that VITE_GEMINI_API_KEY is valid and has access to the selected model.");
    }

    throw new Error("Unable to generate recommendations right now. Please try again in a moment.");
  }
}
