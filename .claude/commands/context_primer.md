# Context Window Prime

RUN:
    git ls-files
    tree -L 2 -a -I 'node_modules|.claude|.cursor|.gemini|.vscode|.git|.next|dist|build|public|coverage|logs|cache|temp|docs|'

READ:
    src/
    README_CLOUDFLARE.md
    worker-configuration.d.ts
    wrangler.jsonc

SEARCH:
    Use your web search capabilities to familiarise yourself with the model context protocol (MCP) using these resources:
    - https://modelcontextprotocol.io/docs/getting-started/intro
    - https://modelcontextprotocol.io/docs/learn/architecture
    - https://modelcontextprotocol.io/docs/learn/server-concepts
    - https://modelcontextprotocol.io/docs/learn/client-concepts
    - https://modelcontextprotocol.io/quickstart/server
    - https://modelcontextprotocol.io/legacy/tools/inspector

REVIEW:
    recent commits (2 most recent) in the current branch and summarise what was done
