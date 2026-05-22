import type { BlogPost, BlogMeta } from "./github-blog";

export const staticBlogs: BlogPost[] = [
  {
    slug: "nrql-predictions",
    title: "NRQL Predictions: Forecasting Future Trends in New Relic",
    date: "2026-05-20",
    tags: ["observability", "NRQL", "ML", "forecasting"],
    excerpt: "How NRQL predictions use Holt-Winters exponential smoothing to forecast time series metrics.",
    sha: "static-1",
    content: `## Overview

**NRQL predictions** in New Relic uses your time series' historical data patterns to predict future trends, providing insights into how metrics might behave in the future.

> [!IMPORTANT] NRQL predictions are only compatible with time series queries using the \`TIMESERIES\` clause.

## How It Works

The system fits a machine learning model to historical data and projects it forward. It supports both **seasonal** and **non-seasonal** time series.

### Algorithm

NRQL predictions use the **Holt-Winters** (triple exponential smoothing) algorithm:

| Seasonality | Description | Min Data Required |
|-------------|-------------|-------------------|
| Hourly | Each minute behaves like the same minute in past hours | 2 hours |
| Daily | Each hour mirrors the same hour from yesterday | 2 days |
| Weekly | Each day repeats weekly patterns | 2 weeks |

## Usage

Basic prediction query:

\`\`\`sql
FROM Transaction SELECT count(*) WHERE error IS TRUE TIMESERIES PREDICT
\`\`\`

With a custom prediction window:

\`\`\`sql
FROM Transaction SELECT count(*) WHERE error IS TRUE TIMESERIES PREDICT BY 30 minutes
\`\`\`

With specified seasonality:

\`\`\`sql
FROM Transaction SELECT count(*) WHERE error IS TRUE TIMESERIES PREDICT holtwinters(seasonality: 1 hour)
\`\`\`

## When to Use Predictions

- Disk space running out as log volume increases
- Memory leaks slowly consuming container resources
- Projecting future infrastructure costs based on growth trends

## System Architecture

\`\`\`mermaid
graph TD
    A[Historical Data] --> B[Seasonality Detection]
    B --> C{Seasonal?}
    C -->|Yes| D[Holt-Winters Triple Smoothing]
    C -->|No| E[Holt-Winters Double Smoothing]
    D --> F[Forecast Output]
    E --> F
    F --> G[Chart Overlay]
    F --> H[Predictive Alerts]
\`\`\`

## Hyperparameters

For advanced users, you can tune the model:

| Parameter | Effect | Range |
|-----------|--------|-------|
| \`alpha\` | Level smoothing — higher = more weight on recent values | 0 to 1 |
| \`beta\` | Trend smoothing factor | 0 to 1 |
| \`gamma\` | Seasonal smoothing (not for non-seasonal) | 0 to 1 |
| \`phi\` | Trend damping — lower = flatter long-term forecast | 0.98 to 1 |

Example with all parameters:

\`\`\`sql
FROM Transaction SELECT count(*) WHERE error IS TRUE TIMESERIES
PREDICT holtwinters(alpha: 0.2, beta: 0.5, gamma: 0.5, phi: 0.99)
BY 1 hour USING 2 hours
\`\`\`

> [!TIP] The default \`PREDICT\` clause (no extra keywords) gives the best results for most use cases. Only customize if you need fine-grained control.
`,
  },
  {
    slug: "reducing-llm-costs-99-percent",
    title: "How I Reduced Claude API Cost by 99% with Prompt Chaining",
    date: "2026-05-15",
    tags: ["AI", "LLM", "Claude", "optimization", "prompt-engineering"],
    excerpt: "From $1.00 to $0.01 per slide — redesigning an AI presentation pipeline with structured outputs and prompt chaining.",
    sha: "static-2",
    content: `## The Problem

When I joined Binocs, the AI presentation pipeline was burning **$1.00 per slide** generated. At scale, this made the feature economically unviable for our users.

> [!IMPORTANT] High per-request LLM costs are almost always an architecture problem, not a model selection problem.

## Root Cause Analysis

The original pipeline worked like this:

\`\`\`mermaid
graph LR
    A[User Input] --> B[Single Massive Prompt]
    B --> C[Claude API - Full Context]
    C --> D[Parse Raw Text Output]
    D --> E[Retry if parse fails]
    E --> B
\`\`\`

**Problems identified:**

| Issue | Impact |
|-------|--------|
| Entire deck generated in one prompt | Massive token count, high cost |
| No structured output — free-form text | Frequent parse failures → retries |
| Retries sent full context again | 3-5x cost multiplier on failures |
| No caching of repeated sub-tasks | Redundant API calls |

## The Solution: Prompt Chaining + Structured Outputs

> [!TIP] Break one expensive prompt into a chain of cheap, focused prompts. Each step does one thing and outputs structured JSON.

### New Architecture

\`\`\`mermaid
graph TD
    A[User Input] --> B[Step 1: Outline Generation]
    B --> C{Valid JSON?}
    C -->|No| B
    C -->|Yes| D[Step 2: Per-Slide Content]
    D --> E[Parallel Slide Rendering]
    E --> F[Step 3: Final Assembly]
    F --> G[Structured Output]
\`\`\`

### Implementation

**Step 1 — Outline generation (cheap, cached):**

\`\`\`typescript
const outline = await anthropic.messages.create({
  model: "claude-haiku-4-5",  // cheapest model for structural tasks
  max_tokens: 512,
  messages: [{
    role: "user",
    content: \`Generate a JSON outline for a presentation about: \${topic}

    Return ONLY valid JSON matching this schema:
    { "slides": [{ "title": string, "key_points": string[] }] }\`
  }]
});
\`\`\`

**Step 2 — Per-slide content (parallel, focused):**

\`\`\`typescript
const slides = await Promise.all(
  outline.slides.map(slide =>
    anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: "You are a concise presentation writer. Output valid JSON only.",
      messages: [{
        role: "user",
        content: \`Write slide content for: "\${slide.title}"
        Key points: \${slide.key_points.join(", ")}
        Return: { "body": string, "speaker_notes": string }\`
      }]
    })
  )
);
\`\`\`

## Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Cost per slide | $1.00 | $0.01 | **-99%** |
| Parse failure rate | ~40% | <1% | **-97.5%** |
| Generation time | 8-12s | 2-3s | **-75%** |
| Retry rate | ~2.5x multiplier | 1.02x | **Eliminated** |

## Key Lessons

1. **Match model to task** — Use Haiku for structured/simple tasks, Sonnet/Opus only when reasoning depth is needed
2. **Always use structured outputs** — JSON schema enforcement eliminates parse failures
3. **Parallelize independent steps** — Per-slide generation is embarrassingly parallel
4. **Cache aggressively** — Anthropic's prompt caching can reduce repeated context costs by up to 90%

> [!NOTE] This pattern (chain of focused prompts → structured outputs → parallel execution) is now the standard at Binocs for all AI pipelines.

## Code Pattern to Steal

\`\`\`typescript
// The golden pattern for cost-efficient LLM pipelines
async function chainedPipeline<T>(
  steps: Array<{ prompt: string; schema: T }>,
  context: Record<string, unknown>
): Promise<T[]> {
  const results: T[] = [];

  for (const step of steps) {
    const result = await callLLM(step.prompt, context);
    results.push(validateSchema(result, step.schema));
    Object.assign(context, { previousResult: result });
  }

  return results;
}
\`\`\`
`,
  },
  {
    slug: "real-time-systems-websockets",
    title: "Building Real-Time Systems: WebSockets, Redis, and Sub-50ms Latency",
    date: "2026-05-10",
    tags: ["websockets", "redis", "real-time", "systems", "typescript"],
    excerpt: "Architecture decisions behind a real-time chess platform with sub-50ms move propagation and ELO matchmaking.",
    sha: "static-3",
    content: `## Why Real-Time is Hard

Most web apps are request-response: client asks, server answers. Real-time inverts this — the server *pushes* data to clients the moment something happens. This sounds simple but has sharp edges.

> [!WARNING] Don't reach for WebSockets until you've exhausted polling and SSE. Real-time infrastructure is operationally expensive.

## Architecture Overview

\`\`\`mermaid
graph TB
    subgraph Client
        A[Browser - React]
    end

    subgraph WebSocket Server
        B[WS Connection Pool]
        C[Game State Manager]
        D[Move Validator]
    end

    subgraph State Layer
        E[Redis - Game State Queue]
        F[PostgreSQL - Persistence]
    end

    subgraph Matching
        G[ELO Calculator]
        H[Matchmaking Queue]
    end

    A <-->|ws://| B
    B --> C
    C --> D
    D --> E
    E --> F
    H --> G
    G --> C
\`\`\`

## The Move Pipeline

Every chess move goes through this sequence and must complete in **<50ms**:

| Step | Action | Budget |
|------|--------|--------|
| 1 | Receive move via WebSocket | ~1ms |
| 2 | Validate move legality | ~2ms |
| 3 | Persist to Redis (game state) | ~3ms |
| 4 | Broadcast to opponent WS | ~5ms |
| 5 | Async write to Postgres | ~40ms (non-blocking) |

**Total round-trip: ~11ms actual, ~50ms worst case**

## WebSocket Connection Management

\`\`\`typescript
class GameConnectionManager {
  private rooms = new Map<string, Set<WebSocket>>();

  join(gameId: string, ws: WebSocket) {
    if (!this.rooms.has(gameId)) {
      this.rooms.set(gameId, new Set());
    }
    this.rooms.get(gameId)!.add(ws);

    ws.on("close", () => this.leave(gameId, ws));
  }

  broadcast(gameId: string, message: GameEvent, exclude?: WebSocket) {
    const room = this.rooms.get(gameId);
    if (!room) return;

    const payload = JSON.stringify(message);
    for (const client of room) {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  leave(gameId: string, ws: WebSocket) {
    this.rooms.get(gameId)?.delete(ws);
  }
}
\`\`\`

## Redis as Game State Queue

Redis gives us atomic operations with microsecond latency — perfect for game state:

\`\`\`typescript
// Store game state atomically
await redis.hset(\`game:\${gameId}\`, {
  fen: newPosition,      // FEN string = full board state
  turn: nextPlayer,
  moveCount: count,
  lastMove: JSON.stringify(move),
  updatedAt: Date.now()
});

// Set TTL — games auto-expire after 2 hours of inactivity
await redis.expire(\`game:\${gameId}\`, 7200);
\`\`\`

## ELO Rating System

The ELO formula is beautifully simple:

\`\`\`typescript
function calculateElo(
  playerRating: number,
  opponentRating: number,
  result: 1 | 0.5 | 0  // win / draw / loss
): number {
  const K = 32;  // K-factor: how much each game affects rating
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(playerRating + K * (result - expected));
}
\`\`\`

## Lessons Learned

> [!IMPORTANT] **Memory leak hunting**: WebSocket connection objects accumulate if you don't clean up on disconnect. Always implement a heartbeat + cleanup cycle.

1. **Use a connection registry** — Don't let WS references float. Track every connection in a Map keyed by userId.
2. **Separate WS server from HTTP server** — Different scaling characteristics. WS is long-lived, HTTP is burst.
3. **Redis for ephemeral state, Postgres for durable state** — Never write every move directly to Postgres.
4. **Heartbeats are mandatory** — Clients behind NAT firewalls silently drop idle connections after ~60s.

\`\`\`typescript
// Heartbeat implementation
const HEARTBEAT_INTERVAL = 30_000;

function setupHeartbeat(ws: WebSocket) {
  let isAlive = true;

  ws.on("pong", () => { isAlive = true; });

  const interval = setInterval(() => {
    if (!isAlive) return ws.terminate();
    isAlive = false;
    ws.ping();
  }, HEARTBEAT_INTERVAL);

  ws.on("close", () => clearInterval(interval));
}
\`\`\`
`,
  },
];

export function getStaticBlogMeta(): BlogMeta[] {
  return staticBlogs.map((blog) => ({
    slug: blog.slug,
    title: blog.title,
    date: blog.date,
    tags: blog.tags,
    excerpt: blog.excerpt,
    sha: blog.sha || "",
  }));
}

export function getStaticBlog(slug: string): BlogPost | null {
  return staticBlogs.find(b => b.slug === slug) || null;
}
