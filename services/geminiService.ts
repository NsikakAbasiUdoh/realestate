import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generatePropertyDescription = async (
  title: string,
  type: string,
  location: string,
  features: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // We use gemini-3-flash-preview for fast, creative text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling, professional, and attractive real estate description (max 80 words) for a property with the following details:
      Title: ${title}
      Type: ${type}
      Location: ${location}
      Key Features: ${features}
      
      The tone should be persuasive and invite potential buyers or renters.
      `,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Failed to generate description using AI. Please try again.";
  }
};
