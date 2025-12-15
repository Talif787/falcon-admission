// src/scripts/testGeminiPro.ts
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`
    const ai = new GoogleGenAI({});
    
    console.log("🔍 Testing Gemini API...\n");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello!",
    });
    
    console.log("Success!");
    console.log("Response:", response.text);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes('429')) {
      console.log("\n⏳ Rate limit hit. Wait a minute and try again.");
      console.log("Check usage: https://ai.dev/usage?tab=rate-limit");
    }
  }
}

main();