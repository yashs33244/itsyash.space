import type { BlogPost, BlogMeta } from "./github-blog";

export const staticBlogs: BlogPost[] = [
  {
    slug: "doxa-memory-indian-doctors-never-had",
    title: "Doxa: The Memory Indian Doctors Never Had",
    date: "2026-05-30",
    tags: ["healthcare", "ai", "startups", "india", "ambient-ai"],
    excerpt:
      "Why I'm building Doxa, an AI medical memory layer for India's 800,000 paper-based clinics, where doctors see 40 patients a day and remember none of them after they walk out.",
    sha: "static-doxa-intro",
    content: `It's late. I just got back from sitting inside a clinic in a Tier-2 Indian town watching a doctor see 38 patients in four hours. Forty seconds of eye contact. A scribbled prescription on a half-torn pad. "Come back in three days." Next patient. Repeat. Repeat. Repeat.

That doctor will not remember any of those 38 people tomorrow morning. Not their names, not what he prescribed, not who he told to come back. The paper leaves with the patient. The memory leaves with the patient. And in 72 hours when nobody walks back through the door, he won't even know who didn't return.

This is the reality of Indian outpatient care for roughly **800,000 clinics**. And we are building Doxa to fix it.

## The problem nobody in healthtech wants to look at

Everyone building "AI scribes" right now is building for a 30-minute American appointment in an air-conditioned room with a laptop on the desk and Epic in the browser. Abridge. Nabla. Ambience. Beautiful products. Completely useless for the doctor I just watched.

Indian outpatient consultations are **3 minutes long**. The doctor will not type. The doctor will not put a tablet between himself and the patient. The doctor will not "integrate with the EMR" because there is no EMR. There is a pen, a pad, and a memory that's already overflowing by 11am.

Practo tried. DocPlix tried. Every Indian healthtech that tried to "digitize the clinic" failed because they attacked the wrong artifact. **The prescription paper was never the problem.** The 20-second handwritten Rx is actually a beautiful piece of design, it's fast, it's tactile, the patient trusts it, the chemist reads it. Trying to kill paper is trying to kill the workflow that lets a doctor see 40 patients a day in the first place.

The problem is what happens *after* the patient walks out. The memory disappears. And with it, around **₹50,000 a month per clinic** in follow-ups that never happen because nobody remembered to call.

## What Doxa actually is

Doxa is not an EMR. I keep saying this because I need it to be loud: **we are not building an EMR.**

We are building the memory layer that sits on top of the existing paper workflow without touching it.

The doctor sees the patient like he always has. Writes the paper like he always has. Hands it over in 20 seconds like he always has. Then, after the patient leaves, he taps his phone and speaks for fifteen seconds:

> "Amit, 34, fever three days, viral, PCM 500 BD five days, follow-up 31st."

That's it. Our AI structures that voice memo into a real medical record, patient, age, symptoms, diagnosis, medicines with dosage, follow-up date. At the end of the day the doctor swipes through forty entries in two minutes and confirms. Next morning his phone tells him: *eight follow-ups due today, three chronic patients overdue.* The SMS goes out automatically. The patient comes back. The doctor recovers the revenue that was always silently leaking out the door.

Zero typing. Zero workflow change. Zero seconds added to the patient's wait time. Fifteen seconds, once, after they leave.

## Why this works in India when it can't work anywhere else

The whole AI scribe wave is happening because ambient transcription finally works. But "ambient" assumes a quiet room and a long appointment. Indian clinics are loud, fast, code-mixed, and chaotic. So we flipped the constraint: don't try to listen ambiently, give the doctor a 15-second post-consultation micro-interaction he can actually do.

And we're training on **Hinglish medical voice**, the actual language doctors think in. *"BP 120 by 80, sugar 110, fever hai, PCM do BD mein, 3 din baad aana."* No global AI scribe handles this. None of them will, because they're optimizing for Kaiser Permanente, not for a single-doctor clinic in Jaipur. That dataset gap is our moat.

## Why I'm doing this

I grew up around this. I've watched doctors in my family run clinics where the most sophisticated piece of technology is a thermometer. I've watched them lie awake worried about a medico-legal case where their only defense is a one-line scribble on a piece of paper from three years ago. I've watched them genuinely forget patients they've seen 12 times and feel ashamed about it.

These are some of the smartest, hardest-working people I know. They don't need a 50-feature dashboard. They need their memory back.

The bigger picture, the one that keeps me up: if we get this right, Doxa becomes the first time Indian primary care has structured data at all. Which means we become the first time you can actually manage diabetes and hypertension at the primary care level in this country at scale. India has the largest preventive healthcare opportunity on the planet sitting on top of the world's largest paper trail. We want to be the layer that turns that paper into signal.

## Where we are

We're a small team. We're embedding in clinics. We're shipping fast, the loop is build, sit in a clinic for two hours, watch a doctor use it, ship a fix the same evening. We're picking our first cohort of doctors as design partners, not customers.

If you're a doctor running a small clinic and any of this sounds like your life, I want to hear from you. If you're an engineer who wants to build voice and AI for a market that nobody else is taking seriously, I want to hear from you. If you're an investor, an operator, a clinic owner, a med-rep, a chemist, a patient with strong opinions, same thing.

Find me on Twitter/X. The DMs are open. We're not building an EMR. We're building the memory Indian doctors never had.

More soon.`,
  },
  {
    slug: "notes-from-after-binocs",
    title: "Notes from after Binocs",
    date: "2026-05-28",
    tags: ["binocs", "startup-life", "claude-code", "builder", "doxa"],
    excerpt:
      "A year onsite at a Bangalore startup teaches you a few things. These are mine, and what I've been building since I left.",
    sha: "static-after-binocs",
    content: `I spent the last year onsite in Bangalore at [Binocs](https://binocs.co). Joined as an intern, left at the end of May. This is a small post about what I learned and what I've been doing since.

## What the year taught me

Most of what I picked up at Binocs wasn't a piece of tech, it was a way of working.

The most useful thing was debugging maturity. Not "I read the stack trace", more the calm that comes from knowing a production system has a handful of plausible failure modes and the patience to walk through them instead of guessing. It came from a lot of late nights staring at logs that were trying to tell me something I wasn't ready to hear.

The second thing was shipping under ambiguity. A startup hands you a request that's half-formed, and you build the thing before anyone's sure what the thing is. You learn to make small, reversible decisions quickly. You learn that a working v1 you can show people is worth more than a perfect v2 you can describe.

And ownership. The bug is yours, the cost spike is yours, the deploy is yours, the user complaint is yours. There's no escalation. You are the escalation.

Some specific things I worked on, in case it's useful context: the 130-page AI investment-deck pipeline (got the per-deck cost down by about 99% by being deliberate about prompt design, caching and which model handled which sub-task), an LLM orchestration engine underneath that, a 24-hour admin and deal generator used by ~40 teammates, the Fibre CDD vertical launch, Stripe international payments, a SendGrid → SES migration, a QA regression agent, and a Cloudflare and domain migration. I don't think any of those are uniquely impressive on their own. What was useful was doing them all back-to-back. Reps compound.

## What I've been doing since

I gave myself zero days off because I had a few things I wanted to try. In the days after leaving I put up a handful of personal projects.

[chess.itsyash.space](https://chess.itsyash.space) is a real-time multiplayer chess board, mostly a Sunday project. [outreach.itsyash.space](https://outreach.itsyash.space) is an AI outreach tool that fits how I actually run cold email. [doxa.itsyash.space](https://doxa.itsyash.space) is a doctor's AI scribe for Indian clinics, and the one I care about most. [pilot.itsyash.space](https://pilot.itsyash.space) is a small set of AI agents for DevOps and SRE chores. [shots.itsyash.space](https://shots.itsyash.space) is a portfolio for the photography I shoot. [itsyash.space](https://itsyash.space) is this site. And [finalcv.co](https://finalcv.co) is a resume builder I'd been meaning to finish.

These are personal projects. None of them are finished. A couple are barely past v0.1. They exist, they're on domains, and I can hand someone a link.

## A personal tool that helped

The reason I could move at all was a small Claude Code setup I made for myself, mostly for my own projects. I call it my **y-brain**. It's just a folder of CLAUDE.md files, skills and hooks I've been collecting and tweaking for months. Public configs from people whose work I respect (Anthropic, Vercel, gstack, Matt Pocock), plus a layer of my own glue.

It hasn't made me 10x at anything. It just removes enough friction that I get to spend my time on the thing I actually wanted to build instead of on the plumbing around it.

## What I'm looking for next

I'm an AI engineer, mostly. Comfortable across fullstack and infra, with some design and photography on the side. I want to keep building things that ship.

Doxa is the project I'd most like to keep pushing on, Indian primary care has a real, painful, unsolved documentation problem and I think the loop we're prototyping has a shot. If that's a space you care about, or if you're hiring for serious AI work, I'd love to talk.

Find me on [Twitter/X](https://twitter.com/yashs33244) or [LinkedIn](https://linkedin.com/in/yash-singh-bb1a1a212).`,
  },
  {
    slug: "y-brain-personal-claude-code-setup",
    title: "y-brain: How I Turned Claude Code Into a One-Person Engineering Team",
    date: "2026-05-29",
    tags: ["claude-code", "ai-engineering", "developer-tools", "second-brain", "productivity"],
    excerpt:
      "I stitched together 130+ skills from Anthropic, Vercel, GStack, and Matt Pocock into a single Claude Code environment that auto-commits itself, here's why it matters.",
    sha: "static-y-brain",
    content: `I've been running a setup I call **y-brain** for a few months now. It's my personal Claude Code environment, a curated mashup of \`CLAUDE.md\` files, skills, agents, and hooks pulled from engineers I actually respect, plus a bunch of my own glue. It lives at [github.com/yashs33244/my-mac-claude](https://github.com/yashs33244/my-mac-claude) and installs on a fresh Mac with one line:

\`\`\`bash
git clone https://github.com/yashs33244/claude-god-setup.git ~/.claude
\`\`\`

That's it. No package manager. No config wizard. Claude Code auto-discovers everything from \`~/.claude/skills/\` via flat symlinks. The whole thing is git-tracked, and every time Claude Code emits a \`Stop\` event, a hook auto-commits and pushes the diff. My environment is version-controlled in a way my dotfiles never were.

## Why I built this

I'm a final-year B.Tech CS student at IIIT Una and I just finished an SDE stint at Binocs in Bangalore. I ship full-stack work daily, Next.js frontends, Python/FastAPI backends, the occasional React Native app, infra on AWS. The bottleneck was never code. It was *context-switching*. Debugging one repo, doing QA on another, writing a PRD for a third, then trying to remember which Vercel project the env var lives in.

Claude Code solves the typing. It doesn't solve the *workflow*. y-brain is the workflow layer.

## What's inside

130+ skills, organized by source collection so I can trace who wrote what:

- **\`skills/anthropic/\`**, Document processing that actually works. \`docx\`, \`xlsx\`, \`pdf\`, \`pptx\` skills that read, edit, and produce real files. The \`pdf\` skill handles OCR. The \`xlsx\` one writes formulas, not just CSVs pretending to be spreadsheets.
- **\`skills/superpowers/\`**, The discipline layer. \`test-driven-development\` enforces red-green-refactor before I'm allowed to write implementation code. \`systematic-debugging\` and \`diagnose\` force a reproduce → minimize → hypothesize → instrument loop instead of vibes-debugging. \`verification-before-completion\` blocks me from declaring "done" without checks.
- **\`skills/gstack/\`**, Browser stuff. \`browse\`, \`scrape\`, \`automate\`, plus \`qa\`, \`canary\`, \`benchmark\`. I can hand Claude a URL and get back Core Web Vitals, screenshots, and a bug report.
- **\`skills/mattpocock/\`**, Engineering taste. Refactor planning, code review, architecture deepening.
- **\`skills/vercel/\`**, \`vercel:nextjs\`, \`vercel:ai-sdk\`, \`vercel:shadcn\`, \`vercel:deploy\`, \`vercel:env\`. When I'm in a Next.js repo, Claude already knows my deployment target.
- **\`skills/obsidian-second-brain/\`**, 31 vault commands. \`/obsidian-save\`, \`/obsidian-daily\`, \`/x-read\`, \`/research-deep\`. Every research finding, decision, and person I meet gets written to my vault automatically.
- **\`skills/token-efficient/\`**, Response profiles for when I just want the answer, not the essay.

Plus design (\`frontend-design\`, \`design-shotgun\`, \`theme-factory\`), security (\`cso\`, \`security-review\`), and retro/health checks (\`retro\`, \`health\`).

## The philosophy

This is downstream of Karpathy's LLM Wiki idea, the notion that your knowledge base should *rewrite itself* as new information comes in, not just accumulate. The Obsidian skills implement this literally: sources update existing pages, contradictions get reconciled, scheduled agents maintain the vault while I sleep.

The skills library is the same pattern applied to *workflow*. Every skill is a crystallized version of "how a good engineer handles X." TDD isn't a vibe anymore, it's a \`SKILL.md\` file that the model is forced to read before writing code. Code review isn't optional, it's \`/codex\` running an adversarial pass on my diff before I open the PR.

A single engineer with this setup isn't a single engineer anymore. There's a Designer skill, an Eng Manager skill, a CEO skill, a Security Officer skill, a QA skill. They all disagree with me at different stages of a project. I argue with them. The code gets better.

## Parallel delegation

Claude isn't alone in this setup. I have Gemini CLI installed at \`/opt/homebrew/bin/gemini\` and I use it as a peer agent. When a task is parallelizable, say, "analyze this 80-file directory", I fire Gemini in the background while Claude works on the actual implementation. Two model families, two context windows, one orchestrator.

\`\`\`bash
gemini -p "audit src/ for unused exports" &
# claude does the refactor in parallel
wait
\`\`\`

## The tradeoffs

I'm not going to pretend this is free.

**Cost.** Running Claude Code daily with Opus on long-context tasks is real money. The token-efficient skills help, but I still budget for it monthly like a SaaS subscription.

**Complexity.** 130 skills means 130 things that can fire when you didn't expect them to. I've had \`/obsidian-save\` trigger mid-debugging session and break my flow. Tuning skill triggers is an ongoing project.

**Learning curve.** Nothing about this is plug-and-play if you don't already know what TDD, ADRs, second brains, and CI/CD pipelines are. The skills assume an engineer who's read the book, not someone looking for one.

**Lock-in to a workflow.** Once you have a \`/ship\` command that does the right thing every time, going back to manual \`git push && vercel deploy\` feels barbaric. That's either a feature or a problem depending on the day.

## Fork it, build your own

y-brain is opinionated because it's *mine*. Your skills should reflect *your* engineering taste, your stack, your second-brain structure. But the scaffolding works for anyone:

\`\`\`bash
git clone https://github.com/yashs33244/my-mac-claude.git
\`\`\`

Read the \`SKILL.md\` files. Delete the ones you don't want. Add your own. Wire up a Stop hook so your environment commits itself. Run it for a week.

You'll either go back to vanilla Claude Code, or you won't be able to. I haven't been able to.`,
  },
  {
    slug: "github-spec-kit",
    title: "GitHub Spec-Kit: Executable Blueprints for SDD",
    date: "2026-05-23",
    tags: ["spec-kit", "github", "SDD", "ai-agents"],
    excerpt: "Spec-Driven Development turns documentation into executable blueprints for AI agents.",
    sha: "static-spec-kit",
    content: `## The Fall of "Vibe Coding"

In the early days of generative AI for software engineering, developers relied heavily on what the industry colloquially calls **"vibe coding."** This is the practice of throwing a loose, unstructured prompt at an AI (like "build me a React app that does X") and hoping for the best. While it works for weekend prototypes, it fails catastrophically in enterprise environments. It lacks predictability, testability, and architectural rigor. 

When you vibe code, the AI is forced to make hundreds of micro-decisions about your tech stack, your styling preferences, and your business logic. If it guesses wrong, you spend hours debugging AI-generated spaghetti code.

## The Shift to Spec-Driven Development (SDD)

**Spec-Kit** introduces a paradigm shift known as **Spec-Driven Development (SDD)**. In SDD, specifications are no longer just passive markdown files that sit in a Wiki gathering dust. Instead, they become **executable blueprints**.

With Spec-Kit, developers focus entirely on defining the "what" and the "why"—the product scenarios, user experiences, and predictable outcomes. The AI agent is then strictly constrained to follow these blueprints, transforming high-level requirements into working implementations through a highly structured, multi-step refinement process.

## The 7-Step Executable Lifecycle

The SDD workflow is managed via the \`specify\` CLI tool, which ensures that the AI never writes a single line of application code until the architectural rules are firmly established.

\`\`\`mermaid
graph TD
    A[Initialize] -->|Bootstrap Integrations| B[Constitution]
    B -->|Establish Standards| C[Specify]
    C -->|Define Functional Reqs| D[Plan]
    D -->|Architecture and Tech Stack| E[Tasks]
    E -->|Dependency-Aware List| F[Implement]
    F -->|Agent Execution TDD| G[Validate]
    G -->|Quality Check| A
\`\`\`

Let's break down exactly what happens in each phase:

1. **Initialize:** This is the bootstrapping phase. The CLI sets up the project directory, installs necessary dependencies, and configures agent integrations (connecting your workspace to tools like GitHub Copilot or Anthropic's Claude).
2. **Constitution:** Before any features are discussed, you establish governing principles. A "Constitution" file is created that dictates your project's strict standards. It tells the AI: "Always use TailwindCSS for styling," "Never use \`any\` in TypeScript," or "Always write Jest unit tests." The AI must obey this constitution globally.
3. **Specify:** Here, you define the functional requirements. You write out the exact user stories and scenarios. "A user must be able to log in using OAuth2." This acts as the source of truth for *what* needs to be built.
4. **Plan:** The agent reads the Specification and the Constitution, and proposes a technical architecture. It decides on the directory structure, the database schemas, and the API routes required to fulfill the specification.
5. **Tasks:** The plan is broken down into a granular, dependency-aware task list. The AI cannot build the frontend login button until the backend OAuth route is marked as complete. This prevents the AI from getting confused or hallucinating APIs that don't exist yet.
6. **Implement:** Finally, code is written. The agent executes the tasks in order. Crucially, it follows a Test-Driven Development (TDD) approach: it writes a failing test based on the spec, writes the code to make it pass, and moves on.
7. **Validate:** The system performs a cross-artifact consistency analysis. It checks the final code against the original Specification and Constitution to ensure no rules were broken and no requirements were missed.

By adopting SDD, engineering teams can safely scale AI code generation, turning chaotic "vibes" into predictable, enterprise-grade software delivery.`
  },
  {
    slug: "effective-harnesses-for-long-running-agents",
    title: "Effective Harnesses for Long-Running Agents",
    date: "2026-05-23",
    tags: ["anthropic", "agents", "long-running", "llm"],
    excerpt: "Overcoming the Long-Running Agent Problem with a Two-Fold System and structured state management.",
    sha: "static-anthropic-harness",
    content: `## The Long-Running Agent Problem

As AI agents transition from simple chatbots to autonomous software engineers, we encounter a massive challenge: **The Long-Running Agent Problem**. 

Large Language Models (LLMs) operate within a fixed "context window"—a limit on how much text they can "remember" at one time. When an agent is tasked with building a complex, full-stack application, it requires dozens, if not hundreds, of conversational turns to plan, write, debug, and test the code. 

If an agent tries to "one-shot" a complex application in a single session, it will inevitably run out of context. Once the context window fills up, the agent begins to forget its original instructions, loses track of its current task, or prematurely declares victory simply because it doesn't have the "mental space" to continue. 

To solve this, Anthropic engineers developed a human-inspired "harness" that bridges the memory gap between multiple discrete agent sessions.

## The Two-Fold Agent Architecture

Instead of relying on one massive, monolithic session, the solution uses a **Two-Fold Agent System** that relies on strict state handoffs.

\`\`\`mermaid
graph LR
    subgraph Initialization
        A[Initializer Agent] -->|Creates| B(init.sh)
        A -->|Creates| C(claude-progress.txt)
        A -->|Creates| D(feature_list.json)
    end
    
    subgraph Execution
        E[Coding Agent Session 1] -->|Reads State| D
        E -->|Writes Code| F[Workspace]
        E -->|Updates| D
        E -->|Commits to| G[(Git)]
        
        H[Coding Agent Session N] -->|Reads State and Git| D
        H -->|Self-Verifies Puppeteer| F
    end
\`\`\`

### Phase 1: The Initializer Agent

The first phase of the harness is run exactly once by the **Initializer Agent**. Its entire job is to read the user's high-level request, scaffold the environment, and—most importantly—create structured state files that future agents will use to orient themselves. 

It generates:
- \`init.sh\`: A script containing all necessary setup commands (e.g., \`npm install\`, \`docker-compose up\`).
- \`claude-progress.txt\`: A human-readable and machine-readable log of what the overall goal is and what the current status is.
- \`feature_list.json\`: A comprehensive, granular checklist of every requirement. Crucially, the Initializer Agent marks every single requirement in this file as \`"status": "failing"\`.

### Phase 2: The Coding Agent (Iterative Sessions)

With the environment prepped, the **Coding Agent** takes over. However, this agent is not allowed to run forever. It is designed to be spun up, do a very specific chunk of work, and then be safely terminated.

1. **Orientation:** When a new Coding Agent session starts, it doesn't need the entire chat history. It simply reads the \`feature_list.json\`, identifies the *first* feature marked as \`failing\`, and makes that its sole objective for the session.
2. **Self-Verification:** To ensure it actually completed the task, the agent utilizes a Puppeteer MCP (Model Context Protocol). This allows the agent to literally open a headless browser, navigate to the local development server, and visually verify that the button it just coded actually works.
3. **State Check-in:** Once the agent proves the feature works, it updates \`feature_list.json\` to \`"status": "passing"\`.
4. **Git as Memory:** Finally, the agent commits its work to Git with a descriptive message. 

Because the state is saved structurally in JSON and Git, the current session can safely die. When the *next* session spins up, it reads the JSON, sees the previous feature is "passing", picks the next "failing" feature, and continues the work seamlessly. This "harness" effectively grants agents infinite memory and infinite persistence.`
  },
  {
    slug: "beyond-pass-1-reliability-framework",
    title: "Beyond pass@1: A Reliability Science Framework for AI",
    date: "2026-05-23",
    tags: ["arxiv", "llm", "benchmarking", "reliability"],
    excerpt: "Transitioning from simple performance metrics to a robust Reliability Science framework for evaluating long-horizon LLM agents.",
    sha: "static-arxiv-reliability",
    content: `## The Illusion of pass@1

In the early days of evaluating Large Language Models for coding, the industry standard metric was **pass@1**. The methodology was simple: give the model a discrete problem (like a LeetCode algorithm), let it generate a single response, and check if the code passes the unit tests on the very first try. 

While pass@1 was useful for measuring raw coding capability in a vacuum, it has become fundamentally obsolete in the era of autonomous AI agents. Modern AI agents are not just writing standalone functions; they are navigating file systems, debugging complex server errors, and orchestrating multi-step deployments. 

If an agent fails to write the correct code on its first try, but successfully reads the error log, identifies its mistake, and patches the code on the second try, it is demonstrating high agency and reliability. Yet, under a strict pass@1 metric, this agent would score a zero. 

To accurately evaluate modern AI, we must transition from single-turn metrics to a comprehensive **Reliability Science Framework**.

## What is Reliability Science in AI?

Reliability Science is the systematic study of an AI agent's consistency, error recovery capabilities, and long-term stability across extended, multi-step executions ("long-horizon tasks"). It shifts the question from *"Did it get it right immediately?"* to *"Can it reliably reach the finish line, no matter what obstacles it encounters?"*

### The Framework Architecture

\`\`\`mermaid
graph TD
    A[Agent Evaluation] --> B(Reliability Benchmarking)
    A --> C(Long-Horizon Metrics)
    A --> D(Evaluation Infrastructure)
    
    B --> E[ReliabilityBench]
    B --> F[Tau Bench]
    B --> G[SWE-bench Pro]
    
    C --> H[Multi-step Success]
    C --> I[Error Recovery Rate]
    
    D --> J[Context Rot Measurement]
    D --> K[Attention Collapse Tracking]
\`\`\`

### Core Pillars of the Framework

**1. Reliability Benchmarking**
We can no longer use simple algorithm tests. The industry is adopting complex, multi-environment benchmarks:
- **SWE-bench Pro:** Evaluates agents on resolving real-world, complex GitHub issues in massive codebases (like Django or React). The agent must find the bug, fix it, and ensure all existing tests pass.
- **Tau Bench & ReliabilityBench:** These test an agent's ability to follow complex rules over long periods without deviating from instructions.

**2. Long-Horizon Metrics**
The framework introduces new metrics that capture the reality of agentic workflows:
- **Error Recovery Rate:** When an agent executes a command and receives a terminal error (e.g., a massive Webpack stack trace), how often can it successfully diagnose and recover from the error without human intervention?
- **Multi-step Success:** Measuring the probability that an agent can successfully string together 10, 50, or 100 consecutive correct decisions to reach a final goal.

**3. Evaluation Infrastructure (Tracking Rot)**
As agents run for longer periods, their context windows fill with thousands of tokens of history. The framework measures two critical failure states:
- **Context Rot:** As the context grows, the model's "attention" becomes diluted. It begins to hallucinate or forget instructions given at the beginning of the prompt.
- **Attention Collapse:** The sudden, catastrophic failure where a model completely loses the thread of the conversation and begins repeating itself or outputting nonsensical code. The framework builds infrastructure to track exactly at what token count this collapse occurs.

By adopting Reliability Science, engineers can stop obsessing over perfect first attempts and start building robust, self-healing agentic systems.`
  },
  {
    slug: "effective-context-engineering-for-ai-agents",
    title: "Effective Context Engineering for AI Agents",
    date: "2026-05-23",
    tags: ["anthropic", "context", "llm", "prompt-engineering"],
    excerpt: "Context Engineering is the art of curating the optimal set of tokens to maximize an agent's attention budget.",
    sha: "static-anthropic-context",
    content: `## Prompt Engineering is Dead. Long Live Context Engineering.

For years, "Prompt Engineering" was the buzzword. Developers spent hours tweaking the exact phrasing of their instructions: *"You are an expert coder. Take a deep breath and think step-by-step."* 

However, as models have grown vastly more intelligent (like Claude 3.5 Sonnet or GPT-4o), they no longer need heavy-handed emotional manipulation to perform well. Instead, the primary bottleneck in building effective AI agents has shifted to how we manage the data we feed them. 

Anthropic defines this new discipline as **Context Engineering**. It is the systematic curation of the optimal set of tokens—instructions, tool schemas, conversation history, and file data—to maximize a model's "attention budget."

## The Attention Budget and Context Rot

Imagine trying to read a 1,000-page textbook, and then being asked to instantly recall a single, highly specific sentence from page 4. Even with a massive context window (like 200,000 tokens), LLMs struggle with this. Every token you add to the context window acts as "noise" that slightly dilutes the model's attention. 

If you just dump an entire codebase into the prompt, the model suffers from **Context Rot**. It becomes overwhelmed, hallucinates details, and its precision degrades. Context Engineering is about aggressively minimizing noise to keep the signal pure.

## Strategies & Architecture

\`\`\`mermaid
graph TD
    A[Context Engineering] --> B[Just-in-Time Retrieval]
    A --> C[Long-Horizon Techniques]
    A --> D[Tool Design]
    
    B -->|grep and glob| E[Load Relevant Snippets Only]
    
    C --> F[Compaction: Summarize History]
    C --> G[Structured Note-taking: NOTES.md]
    C --> H[Sub-agent Orchestration]
    
    H -->|Deep Dive| I[Specialized Agent]
    I -->|Returns 1000 Tokens| J[Orchestrator Agent]
\`\`\`

### 1. Just-in-Time (JIT) Retrieval

Instead of loading all files upfront, a well-engineered agent uses self-contained tools to explore the system dynamically. Rather than reading a 5,000-line file, the agent is provided tools like \`grep_search\` (to search for specific regex patterns) and \`glob\` (to view directory structures). The agent explores the codebase surgically, reading only the specific lines of code (e.g., \`start_line: 40, end_line: 60\`) that are relevant to its immediate task.

### 2. Long-Horizon Techniques

When an agent needs to work for a long time, Context Engineers employ several techniques to keep the context window artificially lean:

- **Compaction:** Once a conversation history gets too long, the system pauses, asks the LLM to write a dense 500-word summary of everything that has happened, and then starts a *brand new* session with only that summary as the starting context.
- **Agentic Memory (\`NOTES.md\`):** Agents are given tools to write to a dedicated \`NOTES.md\` file outside their context window. They can "offload" thoughts, to-do lists, and architectural decisions to this file, reading it back only when needed. This acts as a secondary hard drive, freeing up the primary "RAM" (the context window).
- **Sub-agent Orchestration:** The ultimate form of Context Engineering. A primary "Orchestrator" agent runs with a very lean prompt. When a complex task arises (like researching a bug in a massive file), it delegates the task to a specialized "Sub-agent". The Sub-agent churns through 50,000 tokens of file data, figures out the bug, and then terminates—returning a concise, 200-token summary back to the Orchestrator. The Orchestrator's context remains pristine.

By treating the context window as a highly limited, precious resource, Context Engineering unlocks the true autonomous capabilities of modern LLMs.`
  },
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
`
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
`
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

    A <--> B
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
`
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
