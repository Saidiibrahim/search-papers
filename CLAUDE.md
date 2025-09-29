# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server application deployed on Cloudflare Workers that enables academic paper search and retrieval. The project allows users to:

1. Search for academic papers on arXiv based on specific topics
2. Retrieve complete paper information including abstracts, authors, and URLs in real-time
3. Use Claude to analyze and generate insights about papers through structured prompts
4. Access papers without any storage - all data is fetched directly from arXiv

## Architecture

### Technology Stack

- **TypeScript** - Provides type safety and modern JavaScript features
- **Cloudflare Workers** - Serverless edge computing platform for global deployment
- **Hono** - Lightweight web framework optimized for edge environments
- **@modelcontextprotocol/sdk** - Official MCP SDK for building MCP servers
- **Wrangler** - Cloudflare's CLI for developing and deploying Workers

### Core Components

1. **MCP Server (`src/index.ts`)**
   - Implements a simplified MCP server using the official SDK
   - Provides a single comprehensive tool:
     - `search_papers` - Search for papers on arXiv and return complete information
   - Defines prompts for generating research queries:
     - `generate_search_prompt` - Creates structured prompts for paper analysis
   - All functionality is consolidated in the main index.ts file

2. **Real-time Data Fetching**
   - No persistent storage required
   - Fetches paper data directly from arXiv API in real-time
   - Returns complete paper information in a single response
   - Stateless operation for maximum scalability

### MCP Implementation Details

1. **Simplified Structure**
   - All MCP functionality is implemented directly in `src/index.ts`
   - No separate directories for tools, resources, or prompts
   - Streamlined codebase for easier maintenance

2. **Tools**
   - Single `search_papers` tool that handles both searching and data retrieval
   - Interacts directly with arXiv API
   - Returns comprehensive paper information in one response

3. **Prompts**
   - `generate_search_prompt` defined inline in the main server file
   - Creates structured templates for research analysis
   - Parameterized for different topics and paper counts

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# The server will be available at http://localhost:8787
```

### Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format
```

### Deployment

```bash
# Login to Cloudflare (first time only)
npx wrangler login

# Deploy to Cloudflare Workers
npm run deploy
```

## Key Dependencies

- `@cloudflare/workers-types` - TypeScript types for Cloudflare Workers
- `@modelcontextprotocol/sdk` - MCP server implementation SDK
- `hono` - Web framework for edge computing
- `wrangler` - Cloudflare Workers CLI and development server

## Environment Configuration

### Wrangler Configuration (`wrangler.toml`)

- Defines the worker name and deployment settings
- Sets compatibility dates and features
- No KV namespaces needed (stateless operation)

### TypeScript Configuration (`tsconfig.json`)

- Targets ES2022 for modern JavaScript features
- Includes Cloudflare Workers types
- Enables strict type checking

## Best Practices

1. **Error Handling**
   - Always wrap external API calls in try-catch blocks
   - Return meaningful error messages to MCP clients
   - Log errors for debugging purposes

2. **Performance**
   - Minimize external API calls by fetching only what's needed
   - Keep response payloads reasonable in size
   - Leverage Cloudflare's edge network for fast global access

3. **Type Safety**
   - Define interfaces for all data structures
   - Use strict TypeScript settings
   - Avoid using `any` type

4. **MCP Compliance**
   - Follow MCP specification for tool/resource/prompt definitions
   - Use appropriate response formats
   - Handle all required parameters properly

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.