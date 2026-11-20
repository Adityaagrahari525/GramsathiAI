import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log('Key length:', key?.length, 'Starts with:', key?.slice(0, 6));

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) {
      console.log('HTTP Status:', res.status);
      console.log('Error payload:', JSON.stringify(json, null, 2));
    } else {
      console.log('Key is VALID! Available models:');
      const names = (json.models || []).map((m: any) => m.name.replace('models/', ''));
      console.log(names.slice(0, 15).join(', '));
    }
  } catch (err: any) {
    console.error('Network/fetch error:', err.message);
  }
}

run();
