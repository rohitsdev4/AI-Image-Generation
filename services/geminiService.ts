
import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio } from '../types';

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we throw an error to make it clear the key is missing.
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  image?: { data: string; mimeType: string },
  seed?: number
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    // The parts that will be sent to the API
    const parts: ({ text: string } | { inlineData: { data: string; mimeType: string }})[] = [];

    if (image) {
      // The Gemini API expects the base64 string without the data URL prefix
      const base64Data = image.data.split(',')[1];
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: image.mimeType,
        },
      });
    }

    // The gemini-2.5-flash-image model does not have an aspectRatio config field,
    // so we append it to the text prompt.
    const fullPrompt = `${prompt}, aspect ratio ${aspectRatio}`;
    parts.push({ text: fullPrompt });
    
    const config: { responseModalities: Modality[], seed?: number } = {
        responseModalities: [Modality.IMAGE],
    };

    if (seed && Number.isInteger(seed)) {
        config.seed = seed;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: config,
    });

    // Find the image part in the response
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("No images were generated or found in the response.");

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
