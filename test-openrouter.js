// Quick test script to check OpenRouter API key
const OpenAI = require('openai').default;
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('✅ API Key found:', apiKey.substring(0, 15) + '...');
console.log('🔍 Testing OpenRouter connection...\n');

const client = new OpenAI({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
});

client.chat.completions.create({
  model: 'openai/gpt-4o-mini',
  messages: [{ role: 'user', content: 'Say "hello"' }],
  max_tokens: 10,
})
.then(response => {
  console.log('✅ SUCCESS! OpenRouter is working!');
  console.log('Response:', response.choices[0].message.content);
  console.log('\n💡 Your API key is valid and has credits!');
  console.log('   You can now use the app at http://localhost:3000/generate');
})
.catch(error => {
  console.error('❌ ERROR:', error.message);
  console.error('\nStatus:', error.status);
  
  if (error.status === 401) {
    console.error('\n🔑 Invalid API key! Check your .env.local file');
    console.error('   Get a new key at: https://openrouter.ai/keys');
  } else if (error.status === 429) {
    console.error('\n💳 Out of credits! Add credits at: https://openrouter.ai/credits');
    console.error('   Even $1 gives you thousands of requests!');
  } else if (error.status === 402) {
    console.error('\n💳 No credits! Add credits at: https://openrouter.ai/credits');
  }
});
