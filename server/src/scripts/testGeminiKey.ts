import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key present:', !!apiKey, 'Length:', apiKey?.length);

const ai = new GoogleGenAI({ apiKey });

async function check() {
  const models = ['gemini-2.5-flash', 'gemini-3.8-flash'];
  for (const m of models) {
    try {
      console.log(`Testing model: ${m}...`);
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Say Hello in one word',
      });
      console.log(`[${m}] SUCCESS:`, res.text);
      break;
    } catch (e: any) {
      console.log(`[${m}] ERROR:`, e.message || e);
    }
  }
  process.exit(0);
}

check();
