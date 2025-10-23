#!/bin/bash

# Load API key from .env.local
if [ -f .env.local ]; then
  export $(cat .env.local | grep OPENROUTER_API_KEY | xargs)
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
  echo "❌ OPENROUTER_API_KEY not found in .env.local"
  echo ""
  echo "Please:"
  echo "1. Make sure .env.local exists"
  echo "2. Add your API key: OPENROUTER_API_KEY=sk-or-v1-..."
  exit 1
fi

echo "✅ API Key found: ${OPENROUTER_API_KEY:0:20}..."
echo ""
echo "🔍 Testing OpenRouter API..."
echo ""

# Test API call
RESPONSE=$(curl -s -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 10
  }')

# Check for errors
if echo "$RESPONSE" | grep -q "error"; then
  echo "❌ API Error:"
  echo "$RESPONSE" | jq .
  echo ""
  ERROR_CODE=$(echo "$RESPONSE" | jq -r '.error.code // empty')
  
  if [ "$ERROR_CODE" = "401" ]; then
    echo "🔑 Invalid API key!"
    echo "   Get a new key at: https://openrouter.ai/keys"
  elif [ "$ERROR_CODE" = "429" ] || [ "$ERROR_CODE" = "402" ]; then
    echo "💳 Out of credits!"
    echo "   Add credits at: https://openrouter.ai/credits"
    echo "   Even \$1 gives you thousands of requests!"
  fi
else
  echo "✅ SUCCESS! Your API is working!"
  echo ""
  echo "Response:"
  echo "$RESPONSE" | jq -r '.choices[0].message.content'
  echo ""
  echo "💡 Your API key is valid and has credits!"
  echo "   Restart your dev server and try again"
  echo "   HOSTNAME=localhost npm run dev"
fi
