import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function testGeneration() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Answer in one word: What is the capital of Maharashtra?' }] }],
    }),
  });
  const data = await res.json();
  if (res.ok) {
    console.log('Direct REST generation SUCCESS:');
    console.log(data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
  } else {
    console.log('Error:', data);
  }
}

testGeneration();
