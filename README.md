# SiteForge

AI-powered website builder using Claude and Llama 4 Maverick via Groq.

## Overview

SiteForge generates professional service business websites through conversational interaction. It uses:
- **Claude** for intelligent tasks (research, copywriting, architecture decisions)
- **Llama 4 Maverick via Groq** for cost-efficient template expansion and code generation

Estimated cost: ~$0.23 per website (89% savings vs Claude-only)

## Installation

```bash
# Clone and install
cd siteforge
pnpm install

# Build all packages
pnpm build
```

## Configuration

Set your API keys:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export GROQ_API_KEY=gsk_...
```

Or use the config command:

```bash
pnpm siteforge config --set-anthropic-key
pnpm siteforge config --set-groq-key
```

## Usage

### Create a new website

```bash
pnpm siteforge init my-roofing-company
```

This starts a conversational flow that:
1. Asks about your business
2. Researches your industry
3. Generates marketing content
4. Creates a complete Next.js website

### Build from existing config

```bash
pnpm siteforge build --config my-config.json
```

### Preview generated site

```bash
cd my-roofing-company
npm install
npm run dev
```

## Supported Industries

- Roofing
- Landscaping
- Plumbing
- HVAC
- Electrical
- Painting
- General Contractor
- And more...

## Project Structure

```
siteforge/
├── packages/
│   ├── cli/          # Command-line interface
│   ├── core/         # LLM clients and business logic
│   ├── generator/    # Code generation engine
│   ├── templates/    # Industry configs and templates
│   └── shared/       # Types and utilities
├── package.json
└── pnpm-workspace.yaml
```

## Generated Website Stack

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Lucide Icons
- Framer Motion

## Commands

| Command | Description |
|---------|-------------|
| `siteforge init [name]` | Create new website interactively |
| `siteforge build` | Build from config file |
| `siteforge preview` | Preview generated site |
| `siteforge config` | Manage API keys |

## Cost Breakdown

| Provider | Tasks | Est. Cost |
|----------|-------|-----------|
| Claude | Research, copywriting, review | ~$0.22 |
| Groq/Llama | Data expansion, code gen | ~$0.01 |
| **Total** | | **~$0.23** |

## License

MIT
