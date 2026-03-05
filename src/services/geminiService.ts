import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const translateText = async (text: string, targetLang: string) => {
  if (!process.env.GEMINI_API_KEY) return text;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Translate the following text to ${targetLang}. Only return the translated text: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const getFAQResponse = async (question: string, lang: string) => {
  if (!process.env.GEMINI_API_KEY) return "API Key가 설정되지 않았습니다.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an AI assistant for "C-Korea Connect", a platform for Korean small businesses in Vietnam. 
      Answer the following question in ${lang}: "${question}"
      Context: The platform provides shop promotion, real-time translated chat, and location info. It's free for shop owners.`,
    });
    return response.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error("FAQ AI error:", error);
    return "Error processing request.";
  }
};

export const analyzeMedicalImage = async (base64Image: string, mimeType: string, lang: string) => {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        {
          text: `Analyze this medical image (CT/MRI/X-ray). 
          Provide two explanations in ${lang}:
          1. "normal": A simple explanation for a non-medical person.
          2. "medical": A technical explanation for a medical professional.
          Format the response as JSON with keys "normal" and "medical".`
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Medical AI error:", error);
    return {
      normal: "분석 중 오류가 발생했습니다.",
      medical: "Error during medical analysis."
    };
  }
};

export const restorePhotoAI = async (base64Image: string, mimeType: string) => {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    // For restoration, we'll simulate it by describing the photo and returning a "restored" version (placeholder)
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        {
          text: "Describe this photo in detail. What is in it? What is the mood?"
        }
      ]
    });
    
    return {
      description: response.text,
      // In a real app, this would be the URL from the Python server
      restoredImageUrl: `data:${mimeType};base64,${base64Image}`, 
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" // Placeholder video
    };
  } catch (error) {
    console.error("Photo AI error:", error);
    return null;
  }
};
