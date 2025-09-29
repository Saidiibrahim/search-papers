import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import {
	searchArxivAdvanced,
	getPaperById,
	entryToPaperInfo,
	generateBibTeX,
	extractCitations,
	getCategoryName,
} from "../utils/arxiv";
import { formatPaperDetails, formatPaperSummary } from "../utils/formatters";
import type {
	AdvancedSearchParams,
	PaperInfo,
	ToolDefinition,
} from "../types/domain";
import { ARXIV_CATEGORIES } from "../types/domain";

export type ToolCategory = "search" | "analysis" | "export" | "legacy";

type ToolSchema = Record<string, z.ZodTypeAny>;
type ToolHandler = (
	parameters: unknown,
	context: unknown
) => Promise<CallToolResult> | CallToolResult;

interface ToolRegistration {
	name: string;
	schema: ToolSchema;
	handler: ToolHandler;
	doc: ToolDefinition;
	category: ToolCategory;
}

const TOOL_REGISTRATIONS: ToolRegistration[] = [
	{
		name: "advanced_search",
		schema: {
			title: z.string().optional().describe("Search in paper titles"),
			author: z.string().optional().describe("Search by author name"),
			abstract: z.string().optional().describe("Search in abstracts"),
			category: z
				.string()
				.optional()
				.describe("ArXiv category (e.g., 'cs.AI', 'physics.quant-ph')"),
			date_from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
			date_to: z.string().optional().describe("End date (YYYY-MM-DD)"),
			max_results: z
				.number()
				.min(1)
				.max(50)
				.default(10)
				.describe("Maximum results (1-50)"),
			sort_by: z
				.enum(["relevance", "lastUpdatedDate", "submittedDate"])
				.default("relevance")
				.describe("Sort order"),
			sort_order: z
				.enum(["ascending", "descending"])
				.optional()
				.describe("Sort direction"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const params = parameters as AdvancedSearchParams;
			try {
				const searchParams: AdvancedSearchParams = {
					...params,
					max_results: params.max_results || 10,
				};

				const entries = await searchArxivAdvanced(searchParams);
				const papers = entries.map(entryToPaperInfo);

				if (papers.length === 0) {
					return {
						content: [
							{
								type: "text",
								text:
									"No papers found matching your criteria. Try broadening your search.",
							},
						],
					};
				}

				let response = `Found ${papers.length} papers:\n\n`;
				papers.forEach((paper, idx) => {
					response += formatPaperDetails(paper, idx + 1);
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error in advanced search: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "advanced_search",
			description:
				"Advanced search with field-specific queries, date ranges, and sorting options.",
			parameters: [
				{ name: "title", type: "string", description: "Search in paper titles" },
				{ name: "author", type: "string", description: "Search by author name" },
				{ name: "abstract", type: "string", description: "Search in abstracts" },
				{
					name: "category",
					type: "string",
					description: "ArXiv category filter",
				},
				{
					name: "date_from",
					type: "string",
					description: "Start date (YYYY-MM-DD)",
				},
				{ name: "date_to", type: "string", description: "End date (YYYY-MM-DD)" },
				{
					name: "sort_by",
					type: "string",
					description: "relevance/lastUpdatedDate/submittedDate",
				},
			],
		},
		category: "search",
	},
	{
		name: "search_by_author",
		schema: {
			author: z.string().describe("Author name to search for"),
			max_results: z
				.number()
				.min(1)
				.max(50)
				.default(10)
				.describe("Maximum results"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { author, max_results: maxResults } = parameters as {
				author: string;
				max_results?: number;
			};
			try {
				const entries = await searchArxivAdvanced({
					author,
					max_results: maxResults || 10,
					sort_by: "submittedDate",
					sort_order: "descending",
				});

				const papers = entries.map(entryToPaperInfo);

				if (papers.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No papers found for author: ${author}`,
							},
						],
					};
				}

				const authorInfo = {
					name: author,
					paper_count: papers.length,
					affiliations: [
						...new Set(papers.flatMap((p) => p.affiliations || [])),
					],
					recent_papers: papers,
				};

				let response = `## Author: ${authorInfo.name}\n`;
				response += `**Total Papers Found**: ${authorInfo.paper_count}\n`;
				if (authorInfo.affiliations.length > 0) {
					response += `**Affiliations**: ${authorInfo.affiliations.join(", ")}\n`;
				}
				response += `\n### Recent Papers:\n\n`;

				papers.forEach((paper, idx) => {
					response += formatPaperSummary(paper, idx + 1);
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error searching by author: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "search_by_author",
			description:
				"Find all papers by a specific author with affiliation information.",
			parameters: [
				{
					name: "author",
					type: "string",
					description: "Author name to search for",
				},
				{
					name: "max_results",
					type: "number",
					description: "Maximum results (1-50)",
				},
			],
		},
		category: "search",
	},
	{
		name: "search_by_category",
		schema: {
			category: z
				.string()
				.describe("ArXiv category (e.g., 'cs.AI', 'physics.quant-ph')"),
			max_results: z
				.number()
				.min(1)
				.max(50)
				.default(10)
				.describe("Maximum results"),
			sort_by: z
				.enum(["relevance", "lastUpdatedDate", "submittedDate"])
				.default("submittedDate"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { category, max_results: maxResults, sort_by: sortBy } =
				parameters as {
					category: string;
					max_results?: number;
					sort_by?: "relevance" | "lastUpdatedDate" | "submittedDate";
				};
			try {
				const entries = await searchArxivAdvanced({
					category,
					max_results: maxResults || 10,
					sort_by: sortBy || "submittedDate",
					sort_order: "descending",
				});

				const papers = entries.map(entryToPaperInfo);
				const categoryInfo = ARXIV_CATEGORIES[category];

				let response = `## Category: ${categoryInfo ? categoryInfo.name : category}\n`;
				if (categoryInfo?.description) {
					response += `*${categoryInfo.description}*\n`;
				}
				response += `\nFound ${papers.length} recent papers:\n\n`;

				papers.forEach((paper, idx) => {
					response += formatPaperSummary(paper, idx + 1);
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error searching by category: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "search_by_category",
			description: "Browse papers in specific ArXiv categories.",
			parameters: [
				{
					name: "category",
					type: "string",
					description: "ArXiv category (e.g., cs.AI)",
				},
				{ name: "max_results", type: "number", description: "Maximum results" },
				{ name: "sort_by", type: "string", description: "Sort order" },
			],
		},
		category: "search",
	},
	{
		name: "search_by_date_range",
		schema: {
			date_from: z.string().describe("Start date (YYYY-MM-DD)"),
			date_to: z.string().describe("End date (YYYY-MM-DD)"),
			category: z
				.string()
				.optional()
				.describe("Optional: limit to specific category"),
			max_results: z
				.number()
				.min(1)
				.max(50)
				.default(20)
				.describe("Maximum results"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const {
				date_from: dateFrom,
				date_to: dateTo,
				category,
				max_results: maxResults,
			} = parameters as {
				date_from: string;
				date_to: string;
				category?: string;
				max_results?: number;
			};
			try {
				const searchParams: AdvancedSearchParams = {
					date_from: dateFrom,
					date_to: dateTo,
					max_results: maxResults || 20,
					sort_by: "submittedDate",
					sort_order: "descending",
				};

				if (category) {
					searchParams.category = category;
				}

				const entries = await searchArxivAdvanced(searchParams);
				const papers = entries.map(entryToPaperInfo);

				let response = `## Papers from ${dateFrom} to ${dateTo}\n`;
				if (category) {
					response += `Category: ${getCategoryName(category)}\n`;
				}
				response += `\nFound ${papers.length} papers:\n\n`;

				papers.forEach((paper, idx) => {
					response += formatPaperSummary(paper, idx + 1);
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error searching by date: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "search_by_date_range",
			description: "Find papers published within a specific time period.",
			parameters: [
				{
					name: "date_from",
					type: "string",
					description: "Start date (YYYY-MM-DD)",
				},
				{ name: "date_to", type: "string", description: "End date (YYYY-MM-DD)" },
				{
					name: "category",
					type: "string",
					description: "Optional category filter",
				},
			],
		},
		category: "search",
	},
	{
		name: "get_paper_by_id",
		schema: {
			paper_id: z
				.string()
				.describe(
					"ArXiv paper ID (e.g., '2401.12345' or 'arxiv:2401.12345')",
				),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { paper_id: paperId } = parameters as { paper_id: string };
			try {
				const entry = await getPaperById(paperId);

				if (!entry) {
					return {
						content: [
							{
								type: "text",
								text: `Paper not found: ${paperId}`,
							},
						],
					};
				}

				const paper = entryToPaperInfo(entry);
				const response = formatPaperDetails(paper, 1, true);

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching paper: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "get_paper_by_id",
			description: "Retrieve complete information about a specific paper.",
			parameters: [
				{ name: "paper_id", type: "string", description: "ArXiv paper ID" },
			],
		},
		category: "analysis",
	},
	{
		name: "get_paper_versions",
		schema: {
			paper_id: z.string().describe("ArXiv paper ID (e.g., '2401.12345')"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { paper_id: paperId } = parameters as { paper_id: string };
			try {
				const versions: PaperInfo[] = [];

				for (let version = 1; version <= 5; version++) {
					const entry = await getPaperById(`${paperId}v${version}`);
					if (!entry) {
						break;
					}

					const paper = entryToPaperInfo(entry);
					paper.version = version;
					versions.push(paper);
				}

				if (versions.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No versions found for paper: ${paperId}`,
							},
						],
					};
				}

				let response = `## Paper Versions for ${paperId}\n\n`;
				response += `Found ${versions.length} version(s):\n\n`;

				versions.forEach((paper) => {
					response += `### Version ${paper.version} - Published: ${paper.published}\n`;
					if (paper.updated && paper.updated !== paper.published) {
						response += `Updated: ${paper.updated}\n`;
					}
					response += `${paper.summary.substring(0, 200)}...\n\n`;
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching versions: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "get_paper_versions",
			description: "Track all versions of a paper and see how it evolved.",
			parameters: [
				{ name: "paper_id", type: "string", description: "ArXiv paper ID" },
			],
		},
		category: "analysis",
	},
	{
		name: "get_citations",
		schema: {
			paper_id: z
				.string()
				.describe("ArXiv paper ID to extract citations from"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { paper_id: paperId } = parameters as { paper_id: string };
			try {
				const entry = await getPaperById(paperId);

				if (!entry) {
					return {
						content: [
							{
								type: "text",
								text: `Paper not found: ${paperId}`,
							},
						],
					};
				}

				const paper = entryToPaperInfo(entry);
				const textToSearch = `${paper.summary} ${paper.comment || ""}`;
				const citations = extractCitations(textToSearch);

				let response = `## Citations extracted from ${paperId}\n\n`;
				response += `**Paper**: ${paper.title}\n\n`;

				if (citations.length > 0) {
					response += `Found ${citations.length} potential ArXiv citations:\n\n`;
					citations.forEach((cite, idx) => {
						response += `${idx + 1}. arXiv:${cite}\n`;
					});
				} else {
					response += "No ArXiv citations found in abstract/comments.\n";
					response +=
						"Note: Full citation extraction requires access to the paper's full text.\n";
				}

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error extracting citations: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "get_citations",
			description: "Extract ArXiv citations from a paper's abstract and metadata.",
			parameters: [
				{ name: "paper_id", type: "string", description: "Paper to analyze" },
			],
		},
		category: "analysis",
	},
	{
		name: "get_related_papers",
		schema: {
			paper_id: z
				.string()
				.describe("ArXiv paper ID to find related papers for"),
			max_results: z
				.number()
				.min(1)
				.max(20)
				.default(10)
				.describe("Maximum related papers to return"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { paper_id: paperId, max_results: maxResults } = parameters as {
				paper_id: string;
				max_results?: number;
			};
			try {
				const entry = await getPaperById(paperId);

				if (!entry) {
					return {
						content: [
							{
								type: "text",
								text: `Paper not found: ${paperId}`,
							},
						],
					};
				}

				const paper = entryToPaperInfo(entry);
				const titleKeywords = paper.title
					.split(" ")
					.filter((word) => word.length > 4)
					.slice(0, 3)
					.join(" ");

				const searchParams: AdvancedSearchParams = {
					all: titleKeywords,
					category: paper.primary_category,
					max_results: (maxResults || 10) + 1,
				};

				const entries = await searchArxivAdvanced(searchParams);
				const relatedPapers = entries
					.map(entryToPaperInfo)
					.filter((p) => p.id !== paper.id)
					.slice(0, maxResults || 10);

				let response = `## Papers related to: ${paper.title}\n\n`;
				response += `Based on keywords and category (${paper.primary_category}), found ${relatedPapers.length} related papers:\n\n`;

				relatedPapers.forEach((related, idx) => {
					response += formatPaperSummary(related, idx + 1);
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error finding related papers: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "get_related_papers",
			description: "Find similar papers based on title keywords and categories.",
			parameters: [
				{ name: "paper_id", type: "string", description: "Reference paper" },
				{
					name: "max_results",
					type: "number",
					description: "Number of related papers",
				},
			],
		},
		category: "analysis",
	},
	{
		name: "export_bibliography",
		schema: {
			paper_ids: z.array(z.string()).describe("Array of ArXiv paper IDs"),
			format: z
				.enum(["bibtex", "json"])
				.default("bibtex")
				.describe("Export format"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { paper_ids: paperIds, format } = parameters as {
				paper_ids: string[];
				format: "bibtex" | "json";
			};
            try {
                const papers: PaperInfo[] = [];

                // Fetch in parallel for performance
                const results = await Promise.all(
                    paperIds.map(async (id) => {
                        try {
                            return await getPaperById(id);
                        } catch (_err) {
                            return undefined;
                        }
                    })
                );

                for (const entry of results) {
                    if (entry) {
                        papers.push(entryToPaperInfo(entry));
                    }
                }

				if (papers.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: "No valid papers found for the provided IDs.",
							},
						],
					};
				}

				let response = "";

				if (format === "bibtex") {
					response = `% BibTeX entries for ${papers.length} papers\n\n`;
					papers.forEach((paper) => {
						response += `${generateBibTeX(paper)}\n\n`;
					});
				} else {
					response = JSON.stringify(papers, null, 2);
				}

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error exporting bibliography: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "export_bibliography",
			description:
				"Export papers in BibTeX or JSON format for reference managers.",
			parameters: [
				{ name: "paper_ids", type: "array", description: "Array of paper IDs" },
				{ name: "format", type: "string", description: "bibtex or json" },
			],
		},
		category: "export",
	},
	{
		name: "search_papers",
		schema: {
			topic: z.string().describe("The topic to search for"),
			max_results: z
				.number()
				.min(1)
				.max(20)
				.default(5)
				.describe("Maximum number of results"),
		} as ToolSchema,
		handler: async (parameters: unknown, _context: unknown) => {
			const { topic, max_results: maxResults } = parameters as {
				topic: string;
				max_results?: number;
			};
			try {
				const entries = await searchArxivAdvanced({
					all: topic,
					max_results: maxResults || 5,
				});

				const papers = entries.map(entryToPaperInfo);

				if (papers.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No papers found for topic: "${topic}"`,
							},
						],
					};
				}

				let response = `Found ${papers.length} papers on "${topic}":\n\n`;
				papers.forEach((paper, idx) => {
					response += formatPaperDetails(paper, idx + 1);
				});

				return {
					content: [{ type: "text", text: response }],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error searching papers: ${
								error instanceof Error ? error.message : String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		},
		doc: {
			name: "search_papers",
			description: "Basic keyword search across all arXiv fields (legacy tool).",
			parameters: [
				{ name: "topic", type: "string", description: "The topic to search for" },
				{
					name: "max_results",
					type: "number",
					description: "Maximum number of results",
				},
			],
		},
		category: "legacy",
	},
];

export function registerTools(server: McpServer) {
	for (const tool of TOOL_REGISTRATIONS) {
		server.tool(tool.name, tool.schema, tool.handler);
	}
}

export const TOOL_DOCUMENTATION: Record<ToolCategory, ToolDefinition[]> = (
	() => {
		const docs: Record<ToolCategory, ToolDefinition[]> = {
			search: [],
			analysis: [],
			export: [],
			legacy: [],
		};

		for (const tool of TOOL_REGISTRATIONS) {
			docs[tool.category].push(tool.doc);
		}

		return docs;
	}
)();
