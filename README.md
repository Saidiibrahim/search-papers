# Agents 🤝 arXiv Papers

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=search-papers&config=eyJjb21tYW5kIjoibnB4IG1jcC1yZW1vdGUgaHR0cHM6Ly9zZWFyY2gtcGFwZXJzLW1jcC5pYnJhaGltLWFrYS1hamF4LndvcmtlcnMuZGV2L3NzZSJ9)

Empower your agents to search, analyse, and explore academic papers from arXiv autonomouly.

## Table of Contents

- [Agents 🤝 arXiv Papers](#agents--arxiv-papers)
  - [Table of Contents](#table-of-contents)
  - [To Do](#to-do)
  - [Key Features](#key-features)
  - [Getting Started](#getting-started)
    - [Cursor](#cursor)
    - [Claude Code](#claude-code)
    - [Codex](#codex)
  - [Architecture](#architecture)
    - [Search Papers MCP Features](#search-papers-mcp-features)
  - [Usage Examples](#usage-examples)
    - [Advanced Searches](#advanced-searches)
    - [Paper Analysis](#paper-analysis)
    - [Research Insights](#research-insights)
    - [Export \& Resources](#export--resources)
  - [Additional Resources](#additional-resources)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## To Do

- [ ] Publish to the MCP registry
- [ ] Try Cloudflare's experimental [Code Mode](https://blog.cloudflare.com/code-mode/)

## Key Features

- **Advanced multi-field search** with date ranges and sorting options
- **Author-specific searches** with affiliation tracking
- **Category browsing** for all ArXiv subject areas
- **Version tracking** to see how papers evolved
- **Citation extraction** from abstracts and metadata
- **Related paper discovery** based on content similarity
- **Bibliography export** in BibTeX and JSON formats

## Getting Started

### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=search-papers&config=eyJjb21tYW5kIjoibnB4IG1jcC1yZW1vdGUgaHR0cHM6Ly9zZWFyY2gtcGFwZXJzLW1jcC5pYnJhaGltLWFrYS1hamF4LndvcmtlcnMuZGV2L3NzZSJ9)

```json
{
  "search-papers": {
    "command": "npx",
    "args": ["mcp-remote", "https://search-papers.com/sse"]
  }
}
```

### Claude Code

```bash
claude mcp add --transport sse cloudflare-docs -s project https://search-papers.com/sse
```

```json
{
  "search-papers": {
    "type": "sse",
    "url": "https://search-papers.com/sse"
  }
}
```

### Codex

```toml
[mcp_servers.search-papers]
command = "npx"
args = ["https://search-papers.com/sse"]
```


## Architecture

### Search Papers MCP Features

**Search & Discovery Tools**:
- `advanced_search` - Multi-field search with date ranges and sorting
- `search_by_author` - Find all papers by specific authors
- `search_by_category` - Browse papers in ArXiv categories
- `search_by_date_range` - Find papers within time periods

**Paper Analysis Tools**:
- `get_paper_by_id` - Retrieve complete paper information
- `get_paper_versions` - Track all versions of a paper
- `get_citations` - Extract ArXiv citations from papers
- `get_related_papers` - Discover similar papers

**Export & Bibliography**:
- `export_bibliography` - Export in BibTeX or JSON format

**AI-Powered Prompts**:
- `literature_review` - Generate comprehensive literature reviews
- `research_gaps` - Identify research gaps and opportunities
- `paper_comparison` - Compare multiple papers
- `trend_analysis` - Analyze research trends over time

**Resources**:
- `categories://list` - Browse all ArXiv categories
- `trending://{category}/{days}` - Get trending papers

## Usage Examples

### Advanced Searches
```
"Find papers on transformer architectures by Vaswani published after 2023"
"Search for quantum computing papers in the last month"
"Show me all papers by Geoffrey Hinton with their affiliations"
```

### Paper Analysis
```
"Get all versions of paper 2401.12345 and show how it evolved"
"Extract citations from paper 2401.12345"
"Find papers related to arXiv:2301.00001"
```

### Research Insights
```
"Generate a literature review on vision transformers focusing on architecture innovations"
"Identify research gaps in federated learning over the last 2 years"
"Compare papers 2401.12345, 2401.67890, and 2401.11111 on methodology"
"Analyze trends in large language models research over 5 years"
```

### Export & Resources
```
"Export these 5 papers in BibTeX format for my thesis"
"Show trending AI papers from the last week"
"List all computer science categories in ArXiv"
```

## Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [ArXiv API Documentation](https://info.arxiv.org/help/api/index.html)
- [Cloudflare Workers Guide](https://developers.cloudflare.com/workers/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This repository is licensed under the [Apache-2.0 License](https://github.com/openai/codex/blob/main/LICENSE)

## Acknowledgments

Built with ❤️ by [Ibrahim Saidi](https://github.com/Saidiibrahim) and AI agents.
