# Generic AI Hackathon Starter

A production-ready but lightweight Next.js starter for rapidly adapting an OpenAI-powered web app after a hackathon challenge is revealed. The core stays generic: authentication, database, AI agent, tool calling, streaming chat, logging, error handling, and deployment configuration are prepared in advance.

## Features

- Next.js App Router, TypeScript, React, Tailwind CSS
- Auth.js email/password authentication
- Protected dashboard and workspace routes
- Prisma ORM with PostgreSQL/Supabase-ready schema
- Persistent conversations, messages, and agent runs
- Server-side OpenAI integration
- Generic agent runner with configurable prompts
- Tool registry with safe demo tools
- Streaming chat response UX
- Health endpoint at `/api/health`
- Request IDs, structured logs, centralized errors
- Vercel-ready deployment shape

## Requirements

- Node.js
- npm
- Docker Desktop, for local Docker database mode
- PostgreSQL or Supabase PostgreSQL
- OpenAI API key

## Installation

```bash
git clone https://github.com/Taoiew/strAIght-Up-Bangkok-Hackathon-2026.git
cd strAIght-Up-Bangkok-Hackathon-2026
npm install
```

Then choose one database mode below.

## Fastest Local Start

This path runs PostgreSQL in Docker, applies migrations, creates the demo user, and starts Next.js.

```bash
npm run setup:local
npm run dev:docker
```

Open `http://localhost:3000/login`.

Demo login:

```text
Email: demo@example.com
Password: password123
```

Chat with OpenAI requires `OPENAI_API_KEY` in both `.env.local` and `.env`. Login, dashboard, database, and conversation history work without it.

## Mode A: Local Docker Database

Use this mode for local development and fast demos on your machine.

```bash
cp .env.local.example .env.local
cp .env.local.example .env
```

Fill these values in `.env.local`:

```bash
OPENAI_API_KEY=
AUTH_SECRET=
```

Keep `.env` in sync for Prisma CLI commands. Both files are ignored by Git.

Start PostgreSQL with Docker:

```bash
npm run db:local:up
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Useful local database commands:

```bash
npm run db:local:logs
npm run db:seed
npm run db:studio
npm run db:local:down
```

Local Docker database URL:

```bash
DATABASE_URL=postgresql://hackathon:hackathon@localhost:5432/hackathon_starter?schema=public
```

## Mode B: Production Supabase + Vercel

Use this mode for public hackathon deployment.

1. Create a Supabase project.
2. Copy the Supabase PostgreSQL connection string.
3. Push this repository to GitHub.
4. Import the repository into Vercel.
5. Add the production environment variables in Vercel.
6. Run production migrations with `npm run db:deploy`.
7. Deploy from Vercel.

Production database URL format:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
```

Do not use the local Docker database for production.

## Environment Variables

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
OPENAI_TEMPERATURE=0.2
OPENAI_MAX_OUTPUT_TOKENS=1200
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_AGENT_STEPS=8
```

Never commit `.env.local` or secrets.

## Database Setup

For local Docker mode:

```bash
npm run db:generate
npm run db:migrate
```

For production Supabase/Vercel mode:

```bash
npm run db:generate
npm run db:deploy
```

Do not reset or destroy production databases during deployment.

## Development

```bash
npm run db:local:up
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

## Testing

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add production environment variables in Vercel.
4. Configure the production PostgreSQL/Supabase database.
5. Run Prisma migrations using `npm run db:deploy`.
6. Deploy the Next.js app.
7. Verify login, database, chat, OpenAI response, tool call, history, and logout.

Local Docker is intentionally only for development. Production should use Supabase PostgreSQL or another managed PostgreSQL service.

## Manual Test Checklist

- [ ] App starts
- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Logout works
- [ ] Protected route redirects anonymous user
- [ ] Database connection works
- [ ] New conversation works
- [ ] User message saves
- [ ] OpenAI responds
- [ ] Streaming works
- [ ] Assistant message saves
- [ ] Tool calling works
- [ ] Tool result returns to agent
- [ ] Agent stops correctly
- [ ] Error states display correctly
- [ ] Refresh preserves session
- [ ] Previous conversations load
- [ ] Mobile UI works
- [ ] Production build succeeds
- [ ] Deployment works
- [ ] Production OpenAI request works

## Demo Prompts

- Demo login: `demo@example.com` / `password123`
- Tool call: `What is 23 * 47?`
- Direct answer: `Explain what an API is in one sentence.`

## Hackathon-Day Modification Guide

Start with these files:

- `lib/config/product.ts`
- `prompts/system.md`
- `prompts/guardrails.md`
- `lib/tools/*`
- `lib/agent/tool-registry.ts`
- `prisma/schema.prisma`
- `app/dashboard/page.tsx`
- `app/workspace/page.tsx`
- `components/chat/workspace-client.tsx`

Add challenge-specific business logic and UI only after the challenge is known.
