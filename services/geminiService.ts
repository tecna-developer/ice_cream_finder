
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function findNearbyIceCream(latitude: number, longitude: number): Promise<{ text: string; groundingChunks: GroundingChunk[] }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What are some good ice cream shops near me? Give me a friendly and brief summary.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude,
              longitude,
            },
          },
        },
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch data from Gemini API.");
  }
}
