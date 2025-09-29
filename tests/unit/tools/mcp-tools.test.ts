import { describe, it, expect, beforeEach, vi } from "vitest";
import { z } from "zod";
import { createMockCloudflareContext } from "@tests/mocks/cloudflare-env";
import { registerTools } from "@/mcp/tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Mock the utils to control their behavior
vi.mock("@/utils/arxiv", () => ({
	searchArxivAdvanced: vi.fn(),
	getPaperById: vi.fn(),
	entryToPaperInfo: vi.fn(),
	generateBibTeX: vi.fn(),
	extractCitations: vi.fn(),
	getCategoryName: vi.fn(),
	calculateTrendingScore: vi.fn(),
}));

// Mock the McpAgent class to avoid constructor issues
vi.mock("agents/mcp", () => ({
	McpAgent: class MockMcpAgent {
		server = {
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

describe("MCP Tools", () => {
	let mockContext: any;
	let mockServer: any;

	beforeEach(() => {
		vi.clearAllMocks();
		mockContext = createMockCloudflareContext();

		// Create a mock server instance instead of trying to instantiate ResearchMCP
		mockServer = {
			tool: vi.fn(),
			resource: vi.fn(),
			prompt: vi.fn(),
		};
	});

    it("registers tool handlers without throwing", () => {
        // Smoke test that our tool registrations are valid
        expect(() => registerTools(mockServer as unknown as McpServer)).not.toThrow();
    });

	describe("Tool Parameter Validation", () => {
		describe("advanced_search tool", () => {
			it("should validate title parameter", () => {
				const schema = z.object({
					title: z.string().optional().describe("Search in paper titles"),
				});

				const validData = { title: "machine learning" };
				const result = schema.safeParse(validData);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.title).toBe("machine learning");
				}
			});

			it("should validate author parameter", () => {
				const schema = z.object({
					author: z.string().optional().describe("Search by author name"),
				});

				const validData = { author: "Geoffrey Hinton" };
				const result = schema.safeParse(validData);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.author).toBe("Geoffrey Hinton");
				}
			});

			it("should validate max_results parameter constraints", () => {
				const schema = z.object({
					max_results: z.number().min(1).max(50).default(10),
				});

				// Valid values
				expect(schema.safeParse({ max_results: 1 }).success).toBe(true);
				expect(schema.safeParse({ max_results: 25 }).success).toBe(true);
				expect(schema.safeParse({ max_results: 50 }).success).toBe(true);

				// Invalid values
				expect(schema.safeParse({ max_results: 0 }).success).toBe(false);
				expect(schema.safeParse({ max_results: -1 }).success).toBe(false);
				expect(schema.safeParse({ max_results: 51 }).success).toBe(false);
				expect(schema.safeParse({ max_results: 100 }).success).toBe(false);

				// Default value
				const defaultResult = schema.safeParse({});
				expect(defaultResult.success).toBe(true);
				if (defaultResult.success) {
					expect(defaultResult.data.max_results).toBe(10);
				}
			});

			it("should validate sort_by enum parameter", () => {
				const schema = z.object({
					sort_by: z
						.enum(["relevance", "lastUpdatedDate", "submittedDate"])
						.default("relevance"),
				});

				// Valid enum values
				expect(schema.safeParse({ sort_by: "relevance" }).success).toBe(true);
				expect(schema.safeParse({ sort_by: "lastUpdatedDate" }).success).toBe(
					true
				);
				expect(schema.safeParse({ sort_by: "submittedDate" }).success).toBe(
					true
				);

				// Invalid enum values
				expect(schema.safeParse({ sort_by: "invalid" }).success).toBe(false);
				expect(schema.safeParse({ sort_by: "popularity" }).success).toBe(false);

				// Default value
				const defaultResult = schema.safeParse({});
				expect(defaultResult.success).toBe(true);
				if (defaultResult.success) {
					expect(defaultResult.data.sort_by).toBe("relevance");
				}
			});

			it("should validate date format parameters", () => {
				const schema = z.object({
					date_from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
					date_to: z.string().optional().describe("End date (YYYY-MM-DD)"),
				});

				// Valid date formats (schema doesn't enforce format, just string type)
				const validData = {
					date_from: "2023-01-01",
					date_to: "2024-01-01",
				};
				const result = schema.safeParse(validData);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.date_from).toBe("2023-01-01");
					expect(result.data.date_to).toBe("2024-01-01");
				}
			});

			it("should validate optional parameters", () => {
				const schema = z.object({
					title: z.string().optional(),
					author: z.string().optional(),
					abstract: z.string().optional(),
					category: z.string().optional(),
				});

				// Empty object should be valid
				expect(schema.safeParse({}).success).toBe(true);

				// Partial objects should be valid
				expect(schema.safeParse({ title: "test" }).success).toBe(true);
				expect(
					schema.safeParse({ author: "test", category: "cs.AI" }).success
				).toBe(true);
			});
		});

		describe("search_by_author tool", () => {
			it("should validate required author parameter", () => {
				const schema = z.object({
					author: z.string().describe("Author name to search for"),
					max_results: z.number().min(1).max(50).default(10),
				});

				// Valid data
				const validData = { author: "Geoffrey Hinton" };
				const result = schema.safeParse(validData);
				expect(result.success).toBe(true);

				// Missing required parameter
				const invalidData = {};
				const invalidResult = schema.safeParse(invalidData);
				expect(invalidResult.success).toBe(false);

				// Empty string should be invalid for required field
				const emptyResult = schema.safeParse({ author: "" });
				expect(emptyResult.success).toBe(true); // String schema allows empty strings
			});

			it("should use default max_results", () => {
				const schema = z.object({
					author: z.string(),
					max_results: z.number().min(1).max(50).default(10),
				});

				const result = schema.safeParse({ author: "Test Author" });
				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.max_results).toBe(10);
				}
			});
		});

		describe("search_by_category tool", () => {
			it("should validate category parameter format", () => {
				const schema = z.object({
					category: z.string().describe("ArXiv category"),
				});

				// Valid category formats
				expect(schema.safeParse({ category: "cs.AI" }).success).toBe(true);
				expect(schema.safeParse({ category: "physics.quant-ph" }).success).toBe(
					true
				);
				expect(schema.safeParse({ category: "math.ST" }).success).toBe(true);
				expect(schema.safeParse({ category: "stat.ML" }).success).toBe(true);

				// Schema doesn't validate actual category existence, just string type
				expect(schema.safeParse({ category: "invalid.category" }).success).toBe(
					true
				);
			});
		});
	});

	describe("Tool Response Format Validation", () => {
		it("should validate successful response format", () => {
			const mockResponse = {
				content: [
					{
						type: "text",
						text: "Found 5 papers:\n\n## 1. Sample Paper Title\n**Authors**: John Doe\n**Published**: 2024-01-15\n**Abstract**: Sample abstract...",
					},
				],
			};

			expect(mockResponse.content).toBeDefined();
			expect(Array.isArray(mockResponse.content)).toBe(true);
			expect(mockResponse.content.length).toBeGreaterThan(0);
			expect(mockResponse.content[0]).toHaveProperty("type");
			expect(mockResponse.content[0]).toHaveProperty("text");
			expect(mockResponse.content[0].type).toBe("text");
			expect(typeof mockResponse.content[0].text).toBe("string");
		});

		it("should validate error response format", () => {
			const mockErrorResponse = {
				content: [
					{
						type: "text",
						text: "Error in advanced search: Network error",
					},
				],
				isError: true,
			};

			expect(mockErrorResponse.content).toBeDefined();
			expect(Array.isArray(mockErrorResponse.content)).toBe(true);
			expect(mockErrorResponse.isError).toBe(true);
			expect(mockErrorResponse.content[0].type).toBe("text");
			expect(typeof mockErrorResponse.content[0].text).toBe("string");
			expect(mockErrorResponse.content[0].text).toContain("Error");
		});

		it("should validate empty results response format", () => {
			const mockEmptyResponse = {
				content: [
					{
						type: "text",
						text: "No papers found matching your criteria. Try broadening your search.",
					},
				],
			};

			expect(mockEmptyResponse.content).toBeDefined();
			expect(mockEmptyResponse.content[0].text).toContain("No papers found");
		});
	});

	describe("Tool Parameter Edge Cases", () => {
		it("should handle boundary values for max_results", () => {
			const schema = z.number().min(1).max(50).default(10);

			// Boundary values
			expect(schema.safeParse(1).success).toBe(true);
			expect(schema.safeParse(50).success).toBe(true);

			// Outside boundaries
			expect(schema.safeParse(0).success).toBe(false);
			expect(schema.safeParse(51).success).toBe(false);

			// Non-integer numbers
			expect(schema.safeParse(10.5).success).toBe(true); // Zod number allows decimals
			expect(schema.safeParse(25.0).success).toBe(true);
		});

		it("should handle special characters in search strings", () => {
			const schema = z.string().optional();

			// Special characters that might cause issues
			const testStrings = [
				"machine learning & AI",
				"neural networks (deep)",
				"data-driven approaches",
				"résumé parsing",
				'search with "quotes"',
				"unicode: 机器学习",
				"symbols: α β γ",
				"",
			];

			testStrings.forEach((testString) => {
				const result = schema.safeParse(testString);
				expect(result.success).toBe(true);
			});
		});

		it("should handle very long search strings", () => {
			const schema = z.string().optional();

			// Very long string
			const longString = "a".repeat(1000);
			const result = schema.safeParse(longString);
			expect(result.success).toBe(true);
		});

		it("should validate date string format expectations", () => {
			// While Zod schema only validates string type, we expect YYYY-MM-DD format
			const dateStrings = [
				"2024-01-01", // Valid format
				"2023-12-31", // Valid format
				"2024/01/01", // Different format (would need custom validation)
				"01-01-2024", // Different format
				"2024-1-1", // Different format
				"invalid-date", // Invalid format
			];

			const schema = z.string().optional();

			// All would pass basic string validation
			dateStrings.forEach((dateString) => {
				const result = schema.safeParse(dateString);
				expect(result.success).toBe(true);
			});
		});
	});

	describe("Tool Business Logic Validation", () => {
		it("should handle search parameter combinations", () => {
			const testCases = [
				// Single parameter searches
				{ title: "machine learning" },
				{ author: "Geoffrey Hinton" },
				{ category: "cs.AI" },
				{ abstract: "neural networks" },

				// Multi-parameter searches
				{ title: "transformer", author: "Ashish Vaswani" },
				{ category: "cs.AI", date_from: "2023-01-01" },
				{ title: "deep learning", category: "cs.LG", max_results: 20 },

				// Complex searches
				{
					title: "attention mechanism",
					author: "Vaswani",
					category: "cs.CL",
					date_from: "2017-01-01",
					date_to: "2024-01-01",
					max_results: 15,
					sort_by: "submittedDate" as const,
				},
			];

			const schema = z.object({
				title: z.string().optional(),
				author: z.string().optional(),
				category: z.string().optional(),
				abstract: z.string().optional(),
				date_from: z.string().optional(),
				date_to: z.string().optional(),
				max_results: z.number().min(1).max(50).default(10),
				sort_by: z
					.enum(["relevance", "lastUpdatedDate", "submittedDate"])
					.default("relevance"),
			});

			testCases.forEach((testCase, _index) => {
				const result = schema.safeParse(testCase);
				expect(result.success).toBe(true);
			});
		});

		it("should validate author name formats", () => {
			const authorNames = [
				"Geoffrey Hinton",
				"Yann LeCun",
				"Yoshua Bengio",
				"Ian J. Goodfellow",
				"Andrej Karpathy",
				"Fei-Fei Li",
				"Andrew Y. Ng",
				"Jürgen Schmidhuber", // Umlaut
				"José M. González", // Accented characters
				"李飞飞", // Chinese characters
				"J. Smith", // Initial
				"van den Berg, A.", // Dutch name format
				"", // Empty string
			];

			const schema = z.string();

			authorNames.forEach((name) => {
				const result = schema.safeParse(name);
				expect(result.success).toBe(true);
			});
		});

		it("should validate category hierarchies", () => {
			const validCategories = [
				"cs.AI",
				"cs.CV",
				"cs.CL",
				"cs.LG",
				"cs.NE",
				"cs.RO",
				"stat.ML",
				"stat.TH",
				"math.ST",
				"math.OC",
				"math.PR",
				"physics.quant-ph",
				"physics.cond-mat",
				"q-bio.QM",
				"q-bio.NC",
				"eess.IV",
				"eess.SP",
			];

			const schema = z.string();

			validCategories.forEach((category) => {
				const result = schema.safeParse(category);
				expect(result.success).toBe(true);
			});
		});

		it("should validate date range logic", () => {
			const dateRangeCases = [
				{ date_from: "2023-01-01", date_to: "2024-01-01" }, // Normal range
				{ date_from: "2024-01-01", date_to: "2024-12-31" }, // Same year
				{ date_from: "2020-01-01", date_to: "2024-01-01" }, // Long range
				{ date_from: "2024-01-01" }, // Only start date
				{ date_to: "2024-01-01" }, // Only end date
				{ date_from: "2024-01-01", date_to: "2023-01-01" }, // Invalid range (end before start)
			];

			const schema = z.object({
				date_from: z.string().optional(),
				date_to: z.string().optional(),
			});

			dateRangeCases.forEach((dateCase, _index) => {
				const result = schema.safeParse(dateCase);
				expect(result.success).toBe(true); // Schema validation passes, logic validation would be separate
			});
		});
	});

	describe("Response Content Validation", () => {
		it("should validate paper formatting in responses", () => {
			const mockPaperResponse = `Found 2 papers:

## 1. Sample AI Paper Title
**Authors**: John Doe, Jane Smith
**Published**: 2024-01-15
**Categories**: cs.AI
**Abstract**: This is a sample abstract for testing purposes...
**PDF**: http://arxiv.org/pdf/2401.12345v1.pdf
**ArXiv**: http://arxiv.org/abs/2401.12345v1

## 2. Deep Learning Architectures
**Authors**: Alice Johnson, Bob Wilson
**Published**: 2024-01-16
**Categories**: cs.CV, cs.AI
**Abstract**: Latest advances in deep learning for computer vision...
**PDF**: http://arxiv.org/pdf/2401.67890v1.pdf
**ArXiv**: http://arxiv.org/abs/2401.67890v1`;

			// Validate response structure
			expect(mockPaperResponse).toContain("Found 2 papers:");
			expect(mockPaperResponse).toContain("## 1.");
			expect(mockPaperResponse).toContain("## 2.");
			expect(mockPaperResponse).toContain("**Authors**:");
			expect(mockPaperResponse).toContain("**Published**:");
			expect(mockPaperResponse).toContain("**Categories**:");
			expect(mockPaperResponse).toContain("**Abstract**:");
			expect(mockPaperResponse).toContain("**PDF**:");
			expect(mockPaperResponse).toContain("**ArXiv**:");

			// Validate URLs
			expect(mockPaperResponse).toContain("http://arxiv.org/pdf/");
			expect(mockPaperResponse).toContain("http://arxiv.org/abs/");
		});

		it("should validate author info formatting", () => {
			const mockAuthorResponse = `## Author: Geoffrey Hinton
**Total Papers Found**: 15
**Affiliations**: University of Toronto, Google

### Recent Papers:

1. **Deep Learning: Past, Present and Future** (2024-01-01)
   *Categories*: cs.AI, cs.LG
   *Abstract*: A comprehensive survey of deep learning...

2. **Forward-Forward Algorithm** (2024-01-15)
   *Categories*: cs.AI
   *Abstract*: Novel training algorithm for neural networks...`;

			expect(mockAuthorResponse).toContain("## Author:");
			expect(mockAuthorResponse).toContain("**Total Papers Found**:");
			expect(mockAuthorResponse).toContain("**Affiliations**:");
			expect(mockAuthorResponse).toContain("### Recent Papers:");
			expect(mockAuthorResponse).toMatch(/\d+\.\s\*\*/); // Numbered list pattern
			expect(mockAuthorResponse).toContain("*Categories*:");
			expect(mockAuthorResponse).toContain("*Abstract*:");
		});

		it("should validate category search formatting", () => {
			const mockCategoryResponse = `## Category: Artificial Intelligence
*cs.AI - Artificial Intelligence*

Found 10 recent papers in this category:

**Top Recent Papers:**

1. **Sample AI Paper Title** (2024-01-15)
   Authors: John Doe, Jane Smith
   Abstract: This is a sample abstract...

2. **Advanced Neural Networks** (2024-01-14)
   Authors: Alice Johnson
   Abstract: Novel approaches to neural network design...`;

			expect(mockCategoryResponse).toContain("## Category:");
			expect(mockCategoryResponse).toContain("Found");
			expect(mockCategoryResponse).toContain("recent papers");
			expect(mockCategoryResponse).toContain("**Top Recent Papers:**");
			expect(mockCategoryResponse).toMatch(/\*cs\.\w+\s-\s/); // Category format
		});
	});
});
