import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
	calculateTrendingScore,
	entryToPaperInfo,
	getCategoryName,
	searchArxivAdvanced,
} from "../utils/arxiv";
import type { TrendingPaper } from "../types/domain";
import { ARXIV_CATEGORIES } from "../types/domain";

export interface ResourceDefinition {
	name: string;
	uri: string;
	description: string;
}

const RESOURCES: ResourceDefinition[] = [
	{
		name: "categories",
		uri: "categories://list",
		description: "List of all ArXiv categories and their descriptions",
	},
	{
		name: "trending",
		uri: "trending://{category}/{days}",
		description: "Get trending papers in a category",
	},
];

export function registerResources(server: McpServer) {
	server.resource(
		"categories",
		"categories://list",
		{
			title: "ArXiv Categories",
			description: "List of all ArXiv categories and their descriptions",
		},
		async (uri) => {
			const categories = Object.entries(ARXIV_CATEGORIES)
				.map(([id, info]) => `${id}: ${info.name} - ${info.description}`)
				.join("\n");

			return {
				contents: [
					{
						uri: uri.href,
						text: `# ArXiv Categories\n\n${categories}`,
					},
				],
			};
		}
	);

	server.resource(
		"trending",
		new ResourceTemplate("trending://{category}/{days}", {
			list: undefined,
			complete: {
				category: (value) =>
					Object.keys(ARXIV_CATEGORIES).filter((cat) => cat.startsWith(value)),
				days: () => ["1", "7", "30"],
			},
		}),
		{
			title: "Trending Papers",
			description: "Get trending papers in a category",
		},
		async (uri, params) => {
			try {
				const category = Array.isArray(params.category)
					? params.category[0]
					: params.category || "";
				const days = Array.isArray(params.days)
					? params.days[0]
					: params.days || "7";

				const daysNum = parseInt(days) || 7;
				const dateFrom = new Date();
				dateFrom.setDate(dateFrom.getDate() - daysNum);

				const entries = await searchArxivAdvanced({
					category,
					date_from: dateFrom.toISOString().split("T")[0],
					max_results: 20,
					sort_by: "submittedDate",
					sort_order: "descending",
				});

				const papers = entries.map(entryToPaperInfo);
				const trendingPapers: TrendingPaper[] = papers.map((paper) => ({
					...paper,
					trend_score: calculateTrendingScore(paper),
				}));

				trendingPapers.sort(
					(a, b) => (b.trend_score || 0) - (a.trend_score || 0)
				);

				let response = `# Trending Papers in ${getCategoryName(category)} (Last ${days} days)\n\n`;

				trendingPapers.slice(0, 10).forEach((paper, idx) => {
					response += `## ${idx + 1}. ${paper.title}\n`;
					response += `**Trend Score**: ${paper.trend_score}\n`;
					response += `**Published**: ${paper.published}\n`;
					response += `**Authors**: ${paper.authors
						.slice(0, 3)
						.join(", ")}${paper.authors.length > 3 ? " et al." : ""}\n`;
					response += `**Summary**: ${paper.summary.substring(0, 200)}...\n\n`;
				});

				return {
					contents: [
						{
							uri: uri.href,
							text: response,
						},
					],
				};
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : String(error);
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error fetching trending papers: ${message}`,
                        },
                    ],
                };
            }
		}
	);
}

export const RESOURCE_DOCUMENTATION = RESOURCES;
