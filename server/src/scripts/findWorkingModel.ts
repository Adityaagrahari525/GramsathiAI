import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function run() {
  const models = ['gemini-2.5-pro', 'gemini-pro-latest', 'gemma-4-31b-it'];
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
    console.log(`Checking ${m}...`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`>>> ${m} WORKS! Response:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
        return;
      } else {
        console.log(`>>> ${m} Error:`, data.error?.message || data);
      }
    } catch (err: any) {
      console.log(`>>> ${m} Network error:`, err.message);
    }
  }
}

run();
