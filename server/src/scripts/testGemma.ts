import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function run() {
  const models = ['gemma-4-26b-a4b-it', 'gemini-flash-latest'];
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
    console.log(`Checking ${m}...`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Answer in one sentence: What is Maharashtra famous for?' }] }],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`>>> ${m} SUCCESS:`, data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
      } else {
        console.log(`>>> ${m} Error:`, data.error?.message || data);
      }
    } catch (err: any) {
      console.log(`>>> ${m} Network error:`, err.message);
    }
  }
}

run();
