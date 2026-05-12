<div align="center">

# TenOpsy

### Turn Any Topic Into a Complete Video Course — in Minutes

**AI-generated slides · Natural narration · Auto-captions · Instant video**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## The Story

Picture this: you've just learned something genuinely useful — a framework, a concept, a skill — and you want to share it. You know the material. The ideas are all there.

But turning knowledge into a video course? That's a different beast entirely.

You'd need to write a script, design slides that don't look like they were made in 2009, record narration, sync the audio, add captions for accessibility, edit the whole thing together, and then do it again for every single chapter. By the time you're done, the motivation that sparked the whole thing is long gone.

Most people don't make courses because the *production* gets in the way of the *teaching*.

**TenOpsy was built to remove that barrier entirely.**

---

## The Problem

Creating educational video content today requires either:

- **Deep technical skills** — video editing, motion design, audio production
- **A lot of money** — hiring editors, voiceover artists, course designers
- **An enormous amount of time** — weeks or months to ship a single course

This means that the vast majority of valuable knowledge — from senior developers, domain experts, educators, and practitioners — never gets shared at scale. The tools exist to create, but the friction is too high.

---

## The Solution

TenOpsy takes a single input — a course topic — and handles everything else automatically.

You describe what you want to teach. The platform structures the course, writes the slides, generates a natural-sounding narration for each one, records the audio, adds word-level captions, and assembles it all into a playable video course — complete with animated reveals synced to the narration.

No recording setup. No design skills needed. No editing. Just your idea and a submit button.

---

## What It Does

```
You type a topic  →  TenOpsy builds a full video course
```

Here's what happens behind the scenes, every time:

1. **Course Planning** — AI reads your topic and structures it into chapters with learning objectives
2. **Slide Generation** — Each chapter becomes a set of polished, animated HTML slides (1280×720)
3. **Narration Writing** — A script is written for every slide, tailored to the content
4. **Voice Synthesis** — ElevenLabs converts each script into natural-sounding audio
5. **Caption Generation** — Whisper ASR transcribes the audio with word-level timestamps
6. **Video Assembly** — Remotion syncs everything — slides, audio, and animated reveals — into a playable course

---

## Features

- **One-input course creation** — describe your topic, get a full course
- **Animated slide reveals** — content appears in sync with the narration
- **Natural AI narration** — not robotic text-to-speech; multilingual, expressive voice synthesis
- **Auto-captions** — word-level captions for every slide, generated from the actual audio
- **Interactive video player** — scrub, pause, rewind — full playback controls
- **Chapter previews** — each chapter has its own preview player on the course page
- **Guest demo mode** — visitors can browse example courses without signing in
- **Free tier + paid plans** — 2 free courses, then upgrade for unlimited access
- **Rate limiting** — built-in protection on every API endpoint
- **Fully responsive** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend & Backend** | Next.js 16 (App Router) | Full-stack in one repo; API routes co-located with UI |
| **Language** | TypeScript | End-to-end type safety across DB, API, and UI |
| **Styling** | Tailwind CSS v4 | Utility-first, fast iteration, consistent design tokens |
| **UI Components** | shadcn/ui + Radix UI | Accessible, unstyled primitives — styled to fit the brand |
| **Authentication** | Clerk | Auth, billing, and user management without the boilerplate |
| **Database** | Neon (Serverless PostgreSQL) | Scales to zero; no idle cost for a bursty workload |
| **ORM** | Drizzle ORM | Lightweight, type-safe SQL queries that feel like TypeScript |
| **AI — Course Structure** | Azure OpenAI (GPT) | Structures topics into chapters with learning objectives |
| **AI — Slide Content** | Azure OpenAI (GPT) | Generates HTML slides, narration scripts, and reveal data |
| **Voice Synthesis** | ElevenLabs | Multilingual, human-quality narration from text |
| **Audio Storage** | Azure Blob Storage | Durable, publicly accessible URL for each audio file |
| **Captions** | Replicate (Whisper) | Fast, accurate word-level transcription from audio |
| **Video Rendering** | Remotion | React-powered video composition — runs in the browser |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
│                                                                 │
│   ┌──────────┐    types topic    ┌────────────────────────┐    │
│   │  Hero    │ ───────────────►  │  /api/generate-course  │    │
│   │  Form    │                   │       -layout          │    │
│   └──────────┘                   └──────────┬─────────────┘    │
│                                             │                   │
│                                    Azure OpenAI                 │
│                                    (course structure)           │
│                                             │                   │
│                                    Save to Neon DB              │
│                                             │                   │
│   ┌──────────────────┐  redirect  ┌─────────▼──────────────┐   │
│   │  Course Page     │ ◄───────── │  /course/[courseId]    │   │
│   │  (per chapter)   │            └─────────┬──────────────┘   │
│   └──────────────────┘                      │                   │
│                                             │  for each chapter │
│                                    ┌────────▼────────────────┐  │
│                                    │ /api/generate-video     │  │
│                                    │       -content          │  │
│                                    └────────┬────────────────┘  │
└─────────────────────────────────────────────┼───────────────────┘
                                              │
              ┌───────────────────────────────┼────────────────────┐
              │         Generation Pipeline   │                    │
              │                               │                    │
              │   Azure OpenAI  ◄─────────────┘                    │
              │   (slide HTML + narration scripts)                  │
              │         │                                           │
              │   ElevenLabs TTS                                    │
              │   (narration → MP3 audio)                           │
              │         │                                           │
              │   Azure Blob Storage                                │
              │   (store audio, return public URL)                  │
              │         │                                           │
              │   Replicate Whisper                                 │
              │   (audio → word-level captions)                     │
              │         │                                           │
              │   Neon PostgreSQL                                   │
              │   (save slides, audio URLs, captions)               │
              └─────────────────────────────────────────────────────┘
                                              │
              ┌───────────────────────────────▼────────────────────┐
              │              Remotion Player (browser)             │
              │                                                     │
              │   HTML Slides ──► iframe renderer                   │
              │   Audio Files ──► synced playback                   │
              │   Caption timestamps ──► animated reveals           │
              └─────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### HTML Slides, Not Images
Every slide is a self-contained HTML document rendered inside an `<iframe>`. This means slides can use Tailwind CSS, animations, and full web technology — no image generation, no rasterisation pipeline, no layout constraints. The AI writes real web pages, which Remotion captures in the browser exactly as a viewer would see them.

### Reveal Animations Tied to Audio
Each slide has elements marked with `data-reveal` attributes. The caption timestamps from Whisper tell the player exactly when each word is spoken — and the player fires reveal animations at those moments. Scrubbing backward or forward always works correctly because the player resets all reveals and re-applies only the ones that should be visible at the current timestamp on every frame.

### Per-Chapter Generation
Video content is generated chapter by chapter, not all at once. This keeps each API call fast, allows partial progress (the course page renders as chapters complete), and prevents a single timeout from failing the whole course.

### Serverless Database (Neon)
The app uses Neon's serverless PostgreSQL, which scales to zero between requests. For a course generation platform where usage is bursty and unpredictable, this avoids paying for an always-on database instance during quiet periods.

### Authentication + Billing in One (Clerk)
Clerk handles both login and the paid plan check. Rather than building a separate billing system, a single `auth().has({ plan: 'monthly' })` call determines whether the free tier limit applies. Billing, session management, and user identity are all handled in one place.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works)
- A [Clerk](https://clerk.com) account (free tier works)
- An [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) deployment
- An [ElevenLabs](https://elevenlabs.io) API key
- A [Replicate](https://replicate.com) API token
- An [Azure Storage](https://azure.microsoft.com/en-us/products/storage/blobs) account with a public container

### Installation

```bash
git clone https://github.com/your-username/ai-video-course-generator.git
cd ai-video-course-generator
npm install
```

### Environment Variables

Create a `.env` file in the root and fill in all values:

```env
# Database
DATABASE_URL=your_neon_postgresql_connection_string

# Clerk — Authentication & Billing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Azure OpenAI
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
AZURE_OPENAI_VERSION=2024-12-01-preview

# ElevenLabs — Text to Speech
ELEVENLABS_API_KEY=sk_...

# Replicate — Whisper Captions
REPLICATE_API_TOKEN=r8_...

# Azure Storage — Audio File Hosting
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=...
AZURE_STORAGE_CONTAINER_NAME=audio
AZURE_STORAGE_PUBLIC_BASE_URL=https://your-account.blob.core.windows.net
```

### Database Setup

```bash
npx drizzle-kit push
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

---

## Project Structure

```
├── app/
│   ├── (auth)/               # Clerk sign-in / sign-up pages
│   ├── (routes)/
│   │   ├── course/[courseId]/    # Course detail + video player
│   │   └── pricing/              # Clerk billing table
│   ├── _components/          # Shared UI (Header, Hero, CourseList)
│   ├── api/                  # API routes (course, generate-*, user)
│   ├── layout.tsx            # Root layout with Clerk + Toaster
│   └── provider.tsx          # Client wrapper (user context + header)
│
├── components/
│   ├── Logo.tsx              # SVG logo component
│   └── ui/                   # shadcn/ui component library
│
├── config/
│   ├── db.tsx                # Drizzle + Neon connection
│   ├── openai.ts             # Azure OpenAI client
│   └── schema.tsx            # Database table definitions
│
├── data/
│   ├── Dummy.ts              # Demo courses shown to guest users
│   ├── Prompt.ts             # AI system prompts
│   └── constant.ts           # Quick-start topic suggestions
│
├── lib/
│   └── rate-limit.ts         # In-memory sliding-window rate limiter
│
└── type/
    └── CourseType.tsx        # Shared TypeScript types
```

---

## Rate Limits

Every API endpoint has rate limiting built in to protect the underlying AI services.

| Endpoint | Limit | Window |
|---|---|---|
| Course layout generation | 5 requests | per 10 minutes |
| Video content generation | 15 requests | per 15 minutes |
| Course reads | 60 requests | per minute |
| User sync | 10 requests | per minute |

Blocked requests return `HTTP 429` with `Retry-After` and `X-RateLimit-*` headers.

> **Scaling note:** The current implementation uses an in-memory store, which works well for single-server deployments. For multi-instance or serverless deployments, swap the store in [`lib/rate-limit.ts`](lib/rate-limit.ts) for [Upstash Redis](https://upstash.com) — the function interface stays the same.

---

## Roadmap

- [ ] Export courses as downloadable MP4
- [ ] Custom voice selection from the ElevenLabs voice library
- [ ] Slide editor — regenerate or tweak individual slides
- [ ] Public course gallery
- [ ] Embeddable player for third-party sites
- [ ] Multi-language course generation

---

## Contributing

Contributions are welcome. Open an issue first to discuss what you'd like to change. Please keep pull requests focused — one feature or fix per PR.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with curiosity, caffeine, and a firm belief that good ideas deserve to be shared.

</div>
