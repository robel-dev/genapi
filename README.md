# GenAPI - Ephemeral AI Mock API

Generate temporary REST APIs from natural language prompts. Perfect for frontend prototyping, testing, and rapid development.

## Features

- 🚀 **Instant API Generation**: Describe your data needs in plain English
- ⏱️ **Automatic Expiry**: Endpoints auto-delete after configurable TTL (default 24h)
- 🤖 **AI-Powered**: Uses OpenRouter for access to 200+ LLM models
- 🔒 **Secure**: Cryptographically random tokens, optional private mode
- ⚡ **Fast**: Edge Runtime for sub-100ms response times
- 🌐 **CORS Enabled**: Use from any frontend application

## Tech Stack

- **Framework**: Next.js 15.1.8 (App Router)
- **Runtime**: Node.js 20.x LTS
- **Language**: TypeScript 5.9.2
- **Storage**: Upstash Redis (serverless, TTL support)
- **LLM**: OpenRouter (200+ models via OpenAI SDK)
- **Styling**: Tailwind CSS 3.4.0
- **Testing**: Vitest 3.2.4

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (or npm >= 10.0.0)
- OpenRouter API Key (sign up at https://openrouter.ai)
- Upstash Redis instance (free tier at https://upstash.com)

## Quick Start

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `OPENROUTER_API_KEY`: Get from https://openrouter.ai
- `UPSTASH_REDIS_REST_URL`: From your Upstash Redis dashboard
- `UPSTASH_REDIS_REST_TOKEN`: From your Upstash Redis dashboard

3. **Run development server:**

```bash
pnpm dev
```

Open http://localhost:3000 to see the app.

## Usage

### Generate an API

**POST** `/api/generate`

```json
{
  "prompt": "Create a list of 20 football players with name, team, goals, assists, nationality, age",
  "ttl_seconds": 86400,
  "path": "players",
  "items": 20,
  "private": false,
  "cors": "*"
}
```

Response:

```json
{
  "url": "https://api.example.com/temp/xt82f/players",
  "token": "xt82f",
  "expires_at": "2025-10-24T12:00:00Z",
  "preview": [{ "name": "...", "team": "..." }]
}
```

### Fetch Generated Data

**GET** `/temp/:token/:path*`

Returns the stored JSON payload with CORS headers.

## Project Structure

```
genapi/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── generate/      # POST endpoint for generation
│   │   └── temp/          # GET endpoints for data
│   ├── generate/          # UI for creating APIs
│   ├── dashboard/         # Dashboard for managing APIs
│   └── layout.tsx         # Root layout
├── lib/                   # Shared utilities
│   ├── store.ts           # Storage abstraction (Redis)
│   ├── llm.ts             # OpenRouter integration
│   └── rate-limit.ts      # Rate limiting logic
├── components/            # React components
└── tests/                 # Test files
```

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests with Vitest
pnpm test:ui      # Run tests with UI
pnpm type-check   # TypeScript type checking
pnpm format       # Format code with Prettier
```

## Environment Variables

See `.env.example` for all available configuration options.

### Required

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token

### Optional

- `BASE_URL`: Your deployment URL (default: http://localhost:3000)
- `MAX_TTL_SECONDS`: Maximum TTL in seconds (default: 604800 = 7 days)
- `DEFAULT_TTL_SECONDS`: Default TTL if not specified (default: 86400 = 24h)
- `OPENROUTER_SITE_URL`: Your site URL for OpenRouter rankings
- `OPENROUTER_SITE_NAME`: Your app name for OpenRouter
- `ADMIN_API_KEY`: API key for admin operations
- `JWT_SECRET`: Secret for JWT signing (private endpoints)
- `RATE_LIMIT_SECRET`: Secret for rate limiter

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Set up SSL/TLS
- Enable Edge Runtime for fast responses
- Configure serverless functions
- Provide automatic scaling

## Documentation

- [Product Requirements](./genapi-prd.md)
- [Tech Stack Details](./tech-stack.md)
- [Implementation Checklist](./genapi-todo.md)
- [Migration Guide](./MIGRATION-TO-OPENROUTER.md)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

