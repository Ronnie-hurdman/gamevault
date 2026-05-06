import { GoogleGenAI } from "@google/genai";
import { Game, Recommendation } from "../types";

function getGeminiApiKey(): string | undefined {
  const processEnvKey = process.env.GEMINI_API_KEY;
  const viteEnvKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  return processEnvKey || viteEnvKey;
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
    console.warn("Gemini API key not found. Set GEMINI_API_KEY or VITE_GEMINI_API_KEY.");
    return [];
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
    console.error("Gemini recommendation error:", error);
    return [];
  }
}
