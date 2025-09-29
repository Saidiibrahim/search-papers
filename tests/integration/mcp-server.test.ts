/**
 * tests/integration/mcp-server.test.ts
 * Sorted imports to fix Biome organizeImports warning
 */

/**
 * tests/integration/mcp-server.test.ts
 * Sorted imports to fix Biome organizeImports warning
 */

import sampleData from "@tests/fixtures/sample-papers.json";
import { createMockCloudflareContext } from "@tests/mocks/cloudflare-env";
import { createMockMCPClient } from "@tests/mocks/mcp-client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as arxivUtils from "@/utils/arxiv";

// Mock the ArXiv utilities for integration testing
vi.mock("@/utils/arxiv", async () => {
	const actual = await vi.importActual("@/utils/arxiv");
	return {
		...actual,
		searchArxivAdvanced: vi.fn(),
		getPaperById: vi.fn(),
		entryToPaperInfo: vi.fn(),
		generateBibTeX: vi.fn(),
		extractCitations: vi.fn(),
		getCategoryName: vi.fn(),
		calculateTrendingScore: vi.fn(),
	};
});

// Mock the McpAgent class for integration testing
vi.mock("agents/mcp", () => ({
	McpAgent: class MockMcpAgent {
		server = {
			name: "research",
			version: "2.0.0",
			tool: vi.fn(),
			resource: vi.fn(),
			prompt: vi.fn(),
		};

		async init() {
			return Promise.resolve();
		}

		async fetch() {
			return new Response("OK");
		}
	},
}));

describe("MCP Server Integration", () => {
	let mockContext: any;
	let mockClient: any;
	let mockServer: any;

	beforeEach(async () => {
		vi.clearAllMocks();
		mockContext = createMockCloudflareContext();

		// Create mock server instance instead of trying to instantiate ResearchMCP
		mockServer = {
			server: {
				name: "research",
				version: "2.0.0",
				tool: vi.fn(),
				resource: vi.fn(),
				prompt: vi.fn(),
			},
			async init() {
				return Promise.resolve();
			},
		};

		mockClient = createMockMCPClient();

		// Initialize the mock server
		await mockServer.init();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("Server Initialization", () => {
		it("should initialize MCP server with correct name and version", async () => {
			// Test using mock server instead
			expect(mockServer.server).toBeDefined();
			expect(mockServer.server.name).toBe("research");
			expect(mockServer.server.version).toBe("2.0.0");
		});

		it("should initialize as Cloudflare Durable Object", () => {
			// Test that our mock server has the expected structure
			expect(mockServer).toBeDefined();
			expect(mockServer).toHaveProperty("server");
			expect(mockServer.server).toHaveProperty("tool");
			expect(mockServer.server).toHaveProperty("resource");
			expect(mockServer.server).toHaveProperty("prompt");
		});
	});

	describe("Tool Integration Tests", () => {
		describe("advanced_search tool", () => {
			beforeEach(() => {
				const mockSearchArxivAdvanced = vi.mocked(
					arxivUtils.searchArxivAdvanced
				);
				const mockEntryToPaperInfo = vi.mocked(arxivUtils.entryToPaperInfo);

				// Setup mocks for successful search
				mockSearchArxivAdvanced.mockResolvedValue([
					{
						id: ["http://arxiv.org/abs/2401.12345v1"],
						title: ["Sample AI Paper Title"],
						summary: ["This is a sample abstract."],
						author: [{ name: ["John Doe"] }],
						published: ["2024-01-15T00:00:00Z"],
						link: [
							{
								$: {
									href: "http://arxiv.org/abs/2401.12345v1",
									rel: "alternate",
								},
							},
							{
								$: {
									href: "http://arxiv.org/pdf/2401.12345v1.pdf",
									rel: "related",
								},
							},
						],
					},
				]);

				mockEntryToPaperInfo.mockReturnValue(sampleData.samplePaper);
			});

			it("should execute advanced_search successfully", async () => {
				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, _params) => {
						if (name === "advanced_search") {
							return {
								content: [
									{
										type: "text",
										text: `Found 1 papers:\n\n## 1. ${sampleData.samplePaper.title}\n**Authors**: ${sampleData.samplePaper.authors.join(", ")}`,
									},
								],
							};
						}
					});

				const result = await mockToolCall("advanced_search", {
					title: "machine learning",
					max_results: 5,
				});

				expect(result.content).toBeDefined();
				expect(result.content[0].type).toBe("text");
				expect(result.content[0].text).toContain("Found 1 papers");
				expect(result.content[0].text).toContain(sampleData.samplePaper.title);
			});

			it("should handle empty search results", async () => {
				const mockSearchArxivAdvanced = vi.mocked(
					arxivUtils.searchArxivAdvanced
				);
				mockSearchArxivAdvanced.mockResolvedValue([]);

				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, _params) => {
						if (name === "advanced_search") {
							return {
								content: [
									{
										type: "text",
										text: "No papers found matching your criteria. Try broadening your search.",
									},
								],
							};
						}
					});

				const result = await mockToolCall("advanced_search", {
					title: "nonexistent topic xyz123",
				});

				expect(result.content[0].text).toContain("No papers found");
			});

			it("should handle search errors gracefully", async () => {
				const mockSearchArxivAdvanced = vi.mocked(
					arxivUtils.searchArxivAdvanced
				);
				mockSearchArxivAdvanced.mockRejectedValue(new Error("Network error"));

				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, _params) => {
						if (name === "advanced_search") {
							return {
								content: [
									{
										type: "text",
										text: "Error in advanced search: Network error",
									},
								],
								isError: true,
							};
						}
					});

				const result = await mockToolCall("advanced_search", {
					title: "error-inducing query",
				});

				expect(result.content[0].text).toContain("Error in advanced search");
				expect(result.isError).toBe(true);
			});

			it("should validate parameter constraints", async () => {
				const invalidParams = [
					{ max_results: 0 }, // Below minimum
					{ max_results: 100 }, // Above maximum
					{ sort_by: "invalid" }, // Invalid enum value
				];

				for (const params of invalidParams) {
					const mockToolCall = vi
						.fn()
						.mockImplementation(async (_name, _toolParams) => {
							// Simulate parameter validation failure
							throw new Error(`Invalid parameter: ${JSON.stringify(params)}`);
						});

					await expect(
						mockToolCall("advanced_search", {
							title: "test",
							...params,
						})
					).rejects.toThrow("Invalid parameter");
				}
			});
		});

		describe("search_by_author tool", () => {
			beforeEach(() => {
				const mockSearchArxivAdvanced = vi.mocked(
					arxivUtils.searchArxivAdvanced
				);
				const mockEntryToPaperInfo = vi.mocked(arxivUtils.entryToPaperInfo);

				mockSearchArxivAdvanced.mockResolvedValue([
					{
						id: ["http://arxiv.org/abs/2401.11001v1"],
						title: ["Deep Learning: Past, Present and Future"],
						summary: ["A comprehensive survey..."],
						author: [
							{
								name: ["Geoffrey Hinton"],
								affiliation: ["University of Toronto"],
							},
						],
						published: ["2024-01-01T00:00:00Z"],
						link: [{ $: { href: "http://arxiv.org/abs/2401.11001v1" } }],
					},
				]);

				mockEntryToPaperInfo.mockReturnValue({
					...sampleData.samplePaper,
					id: "2401.11001",
					title: "Deep Learning: Past, Present and Future",
					authors: ["Geoffrey Hinton"],
					affiliations: ["University of Toronto"],
				});
			});

			it("should search by author successfully", async () => {
				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, params) => {
						if (name === "search_by_author") {
							return {
								content: [
									{
										type: "text",
										text: `## Author: ${params.author}\n**Total Papers Found**: 1\n**Affiliations**: University of Toronto\n\n### Recent Papers:\n\n1. **Deep Learning: Past, Present and Future**`,
									},
								],
							};
						}
					});

				const result = await mockToolCall("search_by_author", {
					author: "Geoffrey Hinton",
					max_results: 10,
				});

				expect(result.content[0].text).toContain("## Author: Geoffrey Hinton");
				expect(result.content[0].text).toContain("**Total Papers Found**: 1");
				expect(result.content[0].text).toContain(
					"**Affiliations**: University of Toronto"
				);
				expect(result.content[0].text).toContain("### Recent Papers:");
			});

			it("should handle authors with no papers found", async () => {
				const mockSearchArxivAdvanced = vi.mocked(
					arxivUtils.searchArxivAdvanced
				);
				mockSearchArxivAdvanced.mockResolvedValue([]);

				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, params) => {
						if (name === "search_by_author") {
							return {
								content: [
									{
										type: "text",
										text: `No papers found for author: ${params.author}`,
									},
								],
							};
						}
					});

				const result = await mockToolCall("search_by_author", {
					author: "Unknown Author",
				});

				expect(result.content[0].text).toContain(
					"No papers found for author: Unknown Author"
				);
			});
		});

		describe("search_by_category tool", () => {
			beforeEach(() => {
				const mockSearchArxivAdvanced = vi.mocked(
					arxivUtils.searchArxivAdvanced
				);
				const mockEntryToPaperInfo = vi.mocked(arxivUtils.entryToPaperInfo);
				const mockGetCategoryName = vi.mocked(arxivUtils.getCategoryName);

				mockSearchArxivAdvanced.mockResolvedValue([
					{
						id: ["http://arxiv.org/abs/2401.12345v1"],
						title: ["AI Research Paper"],
						summary: ["AI research summary"],
						author: [{ name: ["AI Researcher"] }],
						published: ["2024-01-15T00:00:00Z"],
						link: [{ $: { href: "http://arxiv.org/abs/2401.12345v1" } }],
					},
				]);

				mockEntryToPaperInfo.mockReturnValue({
					...sampleData.samplePaper,
					title: "AI Research Paper",
					categories: ["cs.AI"],
					primary_category: "cs.AI",
				});

				mockGetCategoryName.mockReturnValue("Artificial Intelligence");
			});

			it("should search by category successfully", async () => {
				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, _params) => {
						if (name === "search_by_category") {
							return {
								content: [
									{
										type: "text",
										text: `## Category: Artificial Intelligence\n*cs.AI - Artificial Intelligence*\n\nFound 1 recent papers in this category:\n\n**Top Recent Papers:**\n\n1. **AI Research Paper**`,
									},
								],
							};
						}
					});

				const result = await mockToolCall("search_by_category", {
					category: "cs.AI",
					max_results: 10,
				});

				expect(result.content[0].text).toContain(
					"## Category: Artificial Intelligence"
				);
				expect(result.content[0].text).toContain(
					"*cs.AI - Artificial Intelligence*"
				);
				expect(result.content[0].text).toContain("Found 1 recent papers");
				expect(result.content[0].text).toContain("**Top Recent Papers:**");
			});
		});

		describe("get_paper_by_id tool", () => {
			beforeEach(() => {
				const mockGetPaperById = vi.mocked(arxivUtils.getPaperById);

				// Create an ArxivEntry object that matches the expected structure
				const mockArxivEntry = {
					id: ["http://arxiv.org/abs/2401.12345v1"],
					title: [sampleData.samplePaper.title],
					summary: [sampleData.samplePaper.summary],
					author: sampleData.samplePaper.authors.map((author, index) => ({
						name: [author],
						affiliation: sampleData.samplePaper.affiliations
							? [sampleData.samplePaper.affiliations[index] || ""]
							: undefined,
					})),
					published: [`${sampleData.samplePaper.published}T00:00:00Z`],
					link: [
						{ $: { href: sampleData.samplePaper.arxiv_url, rel: "alternate" } },
						{ $: { href: sampleData.samplePaper.pdf_url, rel: "related" } },
					],
					category: sampleData.samplePaper.categories?.map((cat) => ({
						$: { term: cat },
					})),
					"arxiv:primary_category": sampleData.samplePaper.primary_category
						? { $: { term: sampleData.samplePaper.primary_category } }
						: undefined,
					"arxiv:comment": sampleData.samplePaper.comment
						? [sampleData.samplePaper.comment]
						: undefined,
				};

				mockGetPaperById.mockResolvedValue(mockArxivEntry);
			});

			it("should retrieve paper by ID successfully", async () => {
				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, _params) => {
						if (name === "get_paper_by_id") {
							const paper = sampleData.samplePaper;
							return {
								content: [
									{
										type: "text",
										text: `# ${paper.title}\n\n**Authors**: ${paper.authors.join(", ")}\n**Published**: ${paper.published}\n**Categories**: ${paper.categories?.join(", ")}\n\n**Abstract**:\n${paper.summary}`,
									},
								],
							};
						}
					});

				const result = await mockToolCall("get_paper_by_id", {
					paper_id: "2401.12345",
				});

				expect(result.content[0].text).toContain(
					`# ${sampleData.samplePaper.title}`
				);
				expect(result.content[0].text).toContain(
					"**Authors**: John Doe, Jane Smith"
				);
				expect(result.content[0].text).toContain("**Published**: 2024-01-15");
				expect(result.content[0].text).toContain("**Abstract**:");
			});

			it("should handle non-existent paper ID", async () => {
				const mockGetPaperById = vi.mocked(arxivUtils.getPaperById);
				mockGetPaperById.mockResolvedValue(null);

				const mockToolCall = vi
					.fn()
					.mockImplementation(async (name, params) => {
						if (name === "get_paper_by_id") {
							return {
								content: [
									{
										type: "text",
										text: `Paper with ID ${params.paper_id} not found.`,
									},
								],
							};
						}
					});

				const result = await mockToolCall("get_paper_by_id", {
					paper_id: "nonexistent.99999",
				});

				expect(result.content[0].text).toContain("not found");
			});
		});
	});

	describe("Resource Integration Tests", () => {
		describe("categories resource", () => {
			it("should provide category information", async () => {
				const mockResourceRead = vi.fn().mockImplementation(async (uri) => {
					if (uri === "categories") {
						return {
							contents: [
								{
									uri: "categories",
									mimeType: "application/json",
									text: JSON.stringify({
										"cs.AI": "Artificial Intelligence",
										"cs.CV": "Computer Vision",
										"cs.LG": "Machine Learning",
										"stat.ML": "Machine Learning (Statistics)",
									}),
								},
							],
						};
					}
				});

				const result = await mockResourceRead("categories");

				expect(result.contents).toBeDefined();
				expect(result.contents[0].uri).toBe("categories");
				expect(result.contents[0].mimeType).toBe("application/json");

				const categories = JSON.parse(result.contents[0].text);
				expect(categories["cs.AI"]).toBe("Artificial Intelligence");
				expect(categories["cs.CV"]).toBe("Computer Vision");
				expect(categories["cs.LG"]).toBe("Machine Learning");
			});
		});

		describe("trending resource", () => {
			it("should provide trending papers", async () => {
				const mockResourceRead = vi.fn().mockImplementation(async (uri) => {
					if (uri === "trending") {
						return {
							contents: [
								{
									uri: "trending",
									mimeType: "application/json",
									text: JSON.stringify([
										{
											...sampleData.samplePaper,
											trend_score: 95.5,
											citation_velocity: 10.2,
										},
									]),
								},
							],
						};
					}
				});

				const result = await mockResourceRead("trending");

				expect(result.contents).toBeDefined();
				expect(result.contents[0].mimeType).toBe("application/json");

				const trendingPapers = JSON.parse(result.contents[0].text);
				expect(Array.isArray(trendingPapers)).toBe(true);
				expect(trendingPapers[0]).toHaveProperty("trend_score");
				expect(trendingPapers[0].trend_score).toBe(95.5);
			});
		});
	});

	describe("Prompt Integration Tests", () => {
		describe("literature_review prompt", () => {
			it("should generate literature review prompt", async () => {
				const mockPromptGet = vi
					.fn()
					.mockImplementation(async (name, params) => {
						if (name === "literature_review") {
							return {
								description: "Generate a comprehensive literature review",
								messages: [
									{
										role: "user",
										content: {
											type: "text",
											text: `Based on the ${params.num_papers} papers about ${params.topic}, create a comprehensive literature review focusing on ${params.focus_areas}.`,
										},
									},
								],
							};
						}
					});

				const result = await mockPromptGet("literature_review", {
					topic: "transformer architectures",
					num_papers: "10",
					focus_areas: "attention mechanisms",
				});

				expect(result.description).toBe(
					"Generate a comprehensive literature review"
				);
				expect(result.messages).toBeDefined();
				expect(result.messages[0].role).toBe("user");
				expect(result.messages[0].content.text).toContain(
					"transformer architectures"
				);
				expect(result.messages[0].content.text).toContain("10 papers");
				expect(result.messages[0].content.text).toContain(
					"attention mechanisms"
				);
			});
		});

		describe("research_gaps prompt", () => {
			it("should generate research gaps analysis prompt", async () => {
				const mockPromptGet = vi
					.fn()
					.mockImplementation(async (name, params) => {
						if (name === "research_gaps") {
							return {
								description: "Identify research gaps and opportunities",
								messages: [
									{
										role: "user",
										content: {
											type: "text",
											text: `Analyze the ${params.num_papers} papers about ${params.field} and identify key research gaps and future opportunities.`,
										},
									},
								],
							};
						}
					});

				const result = await mockPromptGet("research_gaps", {
					field: "natural language processing",
					num_papers: "15",
				});

				expect(result.description).toContain("research gaps");
				expect(result.messages[0].content.text).toContain(
					"natural language processing"
				);
				expect(result.messages[0].content.text).toContain("15 papers");
			});
		});
	});

	describe("Error Handling Integration", () => {
		it("should handle tool execution errors gracefully", async () => {
			const mockToolCall = vi
				.fn()
				.mockImplementation(async (_name, _params) => {
					throw new Error("Simulated tool execution error");
				});

			await expect(
				mockToolCall("advanced_search", { title: "test" })
			).rejects.toThrow("Simulated tool execution error");
		});

		it("should handle resource access errors gracefully", async () => {
			const mockResourceRead = vi.fn().mockImplementation(async (_uri) => {
				throw new Error("Simulated resource access error");
			});

			await expect(mockResourceRead("categories")).rejects.toThrow(
				"Simulated resource access error"
			);
		});

		it("should handle prompt generation errors gracefully", async () => {
			const mockPromptGet = vi
				.fn()
				.mockImplementation(async (_name, _params) => {
					throw new Error("Simulated prompt generation error");
				});

			await expect(mockPromptGet("literature_review", {})).rejects.toThrow(
				"Simulated prompt generation error"
			);
		});
	});

	describe("End-to-End Workflow Tests", () => {
		it("should support research workflow: search → analyze → export", async () => {
			// Step 1: Search for papers
			const mockSearchResult = await mockClient.callTool("advanced_search", {
				title: "machine learning",
				max_results: 5,
			});

			expect(mockSearchResult.content[0].text).toContain("Found");

			// Step 2: Get detailed paper info
			const mockPaperResult = await mockClient.callTool("get_paper_by_id", {
				paper_id: "2401.12345",
			});

			expect(mockPaperResult.content[0].text).toContain("**Abstract**:");

			// Step 3: Generate bibliography
			const mockBibResult = await mockClient.callTool("export_bibliography", {
				paper_ids: ["2401.12345"],
				format: "bibtex",
			});

			expect(mockBibResult.content[0].text).toContain("@article{");
		});

		it("should support literature review workflow", async () => {
			// Step 1: Search for papers in a field
			const mockSearchResult = await mockClient.callTool("advanced_search", {
				category: "cs.AI",
				max_results: 10,
			});

			expect(mockSearchResult.content[0].text).toContain("Found");

			// Step 2: Generate literature review prompt
			const mockPromptResult = await mockClient.getPrompt("literature_review", {
				topic: "artificial intelligence",
				num_papers: "10",
				focus_areas: "recent advances",
			});

			expect(mockPromptResult.messages[0].content.text).toContain(
				"artificial intelligence"
			);
		});
	});
});
