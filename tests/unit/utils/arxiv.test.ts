import { describe, it, expect, } from "vitest";
import {
	buildSearchQuery,
	searchArxivAdvanced,
	getPaperById,
	entryToPaperInfo,
	generateBibTeX,
	extractCitations,
	getCategoryName,
	calculateTrendingScore,
} from "@/utils/arxiv";
import type { AdvancedSearchParams, PaperInfo } from "@/types/domain";
import sampleData from "@tests/fixtures/sample-papers.json";

describe("ArXiv Utils", () => {
	describe("buildSearchQuery", () => {
		it("should build simple title search query", () => {
			const params: AdvancedSearchParams = {
				title: "machine learning",
			};

			const query = buildSearchQuery(params);
			expect(query).toBe('ti:"machine learning"');
		});

		it("should build simple author search query", () => {
			const params: AdvancedSearchParams = {
				author: "Geoffrey Hinton",
			};

			const query = buildSearchQuery(params);
			expect(query).toBe('au:"Geoffrey Hinton"');
		});

		it("should build complex search query with multiple fields", () => {
			const params: AdvancedSearchParams = {
				title: "neural networks",
				author: "Geoffrey Hinton",
				category: "cs.AI",
				abstract: "deep learning",
			};

			const query = buildSearchQuery(params);
			expect(query).toContain('ti:"neural networks"');
			expect(query).toContain('au:"Geoffrey Hinton"');
			expect(query).toContain("cat:cs.AI");
			expect(query).toContain('abs:"deep learning"');
			expect(query).toContain(" AND ");
		});

		it("should handle date range queries", () => {
			const params: AdvancedSearchParams = {
				title: "transformer",
				date_from: "2023-01-01",
				date_to: "2024-01-01",
			};

			const query = buildSearchQuery(params);
			expect(query).toContain('ti:"transformer"');
			expect(query).toContain("submittedDate:[20230101 TO 20240101]");
		});

		it("should handle date_from only", () => {
			const params: AdvancedSearchParams = {
				all: "AI",
				date_from: "2023-01-01",
			};

			const query = buildSearchQuery(params);
			expect(query).toContain('all:"AI"');
			expect(query).toMatch(/submittedDate:\[20230101 TO \d{8}\]/);
		});

		it("should handle date_to only", () => {
			const params: AdvancedSearchParams = {
				all: "AI",
				date_to: "2024-01-01",
			};

			const query = buildSearchQuery(params);
			expect(query).toContain('all:"AI"');
			expect(query).toContain("submittedDate:[19900101 TO 20240101]");
		});

		it("should handle empty parameters", () => {
			const query = buildSearchQuery({});
			expect(query).toBe("all:*");
		});

		it("should handle all field search", () => {
			const params: AdvancedSearchParams = {
				all: "transformer attention",
			};

			const query = buildSearchQuery(params);
			expect(query).toBe('all:"transformer attention"');
		});

		it("should handle comment field search", () => {
			const params: AdvancedSearchParams = {
				comment: "accepted to ICLR",
			};

			const query = buildSearchQuery(params);
			expect(query).toBe('co:"accepted to ICLR"');
		});

		it("should handle journal reference search", () => {
			const params: AdvancedSearchParams = {
				journal_ref: "Nature",
			};

			const query = buildSearchQuery(params);
			expect(query).toBe('jr:"Nature"');
		});
	});

	describe("searchArxivAdvanced", () => {
		it("should search and return papers", async () => {
			const params: AdvancedSearchParams = {
				all: "machine learning",
				max_results: 5,
			};

			const results = await searchArxivAdvanced(params);
			expect(results).toBeDefined();
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBeGreaterThan(0);

			// Verify the structure of returned entries
			if (results.length > 0) {
				const firstResult = results[0];
				expect(firstResult).toHaveProperty("id");
				expect(firstResult).toHaveProperty("title");
				expect(firstResult).toHaveProperty("author");
				expect(firstResult).toHaveProperty("published");
				expect(Array.isArray(firstResult.id)).toBe(true);
				expect(Array.isArray(firstResult.title)).toBe(true);
			}
		});

		it("should handle empty search results", async () => {
			const params: AdvancedSearchParams = {
				all: "nonexistent topic xyz123",
			};

			const results = await searchArxivAdvanced(params);
			expect(results).toBeDefined();
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(0);
		});

		it("should handle API errors gracefully", async () => {
			const params: AdvancedSearchParams = {
				all: "error",
			};

			await expect(searchArxivAdvanced(params)).rejects.toThrow();
		});

		it("should handle timeout errors", async () => {
			const params: AdvancedSearchParams = {
				all: "timeout",
			};

			await expect(searchArxivAdvanced(params)).rejects.toThrow();
		});

		it("should use default max_results when not specified", async () => {
			const params: AdvancedSearchParams = {
				all: "machine learning",
			};

			const results = await searchArxivAdvanced(params);
			expect(results).toBeDefined();
			// We can't test exact count due to mocking, but ensure it doesn't throw
		});
	});

	describe("entryToPaperInfo", () => {
		it("should convert ArXiv entry to PaperInfo", () => {
			const mockEntry = {
				id: ["http://arxiv.org/abs/2401.12345v1"],
				title: ["Sample AI Paper Title"],
				summary: ["This is a sample abstract."],
				author: [
					{ name: ["John Doe"], affiliation: ["University of AI"] },
					{ name: ["Jane Smith"], affiliation: ["Tech Institute"] },
				],
				published: ["2024-01-15T00:00:00Z"],
				link: [
					{
						$: { href: "http://arxiv.org/abs/2401.12345v1", rel: "alternate" },
					},
					{
						$: {
							href: "http://arxiv.org/pdf/2401.12345v1.pdf",
							rel: "related",
						},
					},
				],
				category: [{ $: { term: "cs.AI" } }],
				"arxiv:primary_category": [{ $: { term: "cs.AI" } }],
				"arxiv:comment": ["10 pages, 5 figures"],
			};

			const paper = entryToPaperInfo(mockEntry as any);

			expect(paper.id).toBe("2401.12345");
			expect(paper.title).toBe("Sample AI Paper Title");
			expect(paper.authors).toEqual(["John Doe", "Jane Smith"]);
			expect(paper.published).toBe("2024-01-15");
			expect(paper.categories).toEqual(["cs.AI"]);
			expect(paper.primary_category).toBe("cs.AI");
			expect(paper.affiliations).toEqual([
				"University of AI",
				"Tech Institute",
			]);
			expect(paper.comment).toBe("10 pages, 5 figures");
			expect(paper.pdf_url).toBe("http://arxiv.org/pdf/2401.12345v1.pdf");
			expect(paper.arxiv_url).toBe("http://arxiv.org/abs/2401.12345v1");
		});

		it("should handle entries with minimal data", () => {
			const mockEntry = {
				id: ["http://arxiv.org/abs/2401.99999v1"],
				title: ["Minimal Paper"],
				summary: ["Short summary."],
				author: [{ name: ["Solo Author"] }],
				published: ["2024-01-01T00:00:00Z"],
				link: [
					{
						$: { href: "http://arxiv.org/abs/2401.99999v1", rel: "alternate" },
					},
				],
			};

			const paper = entryToPaperInfo(mockEntry as any);

			expect(paper.id).toBe("2401.99999");
			expect(paper.title).toBe("Minimal Paper");
			expect(paper.authors).toEqual(["Solo Author"]);
			expect(paper.affiliations).toEqual([]);
			expect(paper.categories).toEqual([]);
			expect(paper.primary_category).toBeUndefined();
		});

		it("should handle entries with multiple categories", () => {
			const mockEntry = {
				id: ["http://arxiv.org/abs/2401.55555v1"],
				title: ["Multi-Category Paper"],
				summary: ["Cross-disciplinary research."],
				author: [{ name: ["Author Name"] }],
				published: ["2024-01-01T00:00:00Z"],
				link: [
					{
						$: { href: "http://arxiv.org/abs/2401.55555v1", rel: "alternate" },
					},
				],
				category: [
					{ $: { term: "cs.AI" } },
					{ $: { term: "cs.CV" } },
					{ $: { term: "stat.ML" } },
				],
				"arxiv:primary_category": [{ $: { term: "cs.AI" } }],
			};

			const paper = entryToPaperInfo(mockEntry as any);

			expect(paper.categories).toEqual(["cs.AI", "cs.CV", "stat.ML"]);
			expect(paper.primary_category).toBe("cs.AI");
		});
	});

	describe("generateBibTeX", () => {
		it("should generate valid BibTeX entry", () => {
			const paper: PaperInfo = sampleData.samplePaper;

			const bibtex = generateBibTeX(paper);

			expect(bibtex).toContain("@article{");
			expect(bibtex).toContain("title={Sample AI Paper Title}");
			expect(bibtex).toContain("author={John Doe and Jane Smith}");
			expect(bibtex).toContain("year={2024}");
			expect(bibtex).toContain("eprint={2401.12345}");
			expect(bibtex).toContain("archivePrefix={arXiv}");
			expect(bibtex).toContain("primaryClass={cs.AI}");
		});

		it("should handle single author", () => {
			const paper: PaperInfo = {
				...sampleData.samplePaper,
				authors: ["Single Author"],
			};

			const bibtex = generateBibTeX(paper);

			expect(bibtex).toContain("author={Single Author}");
			expect(bibtex).not.toContain(" and ");
		});

		it("should handle missing optional fields gracefully", () => {
			const paper: PaperInfo = {
				id: "2401.99999",
				title: "Test Paper",
				authors: ["Test Author"],
				summary: "Test summary",
				pdf_url: "http://arxiv.org/pdf/2401.99999.pdf",
				arxiv_url: "http://arxiv.org/abs/2401.99999",
				published: "2024-01-01",
			};

			const bibtex = generateBibTeX(paper);

			expect(bibtex).toContain("@article{");
			expect(bibtex).toContain("title={Test Paper}");
			expect(bibtex).toContain("author={Test Author}");
			expect(bibtex).not.toContain("primaryClass=");
			expect(bibtex).not.toContain("journal=");
		});
	});

	describe("extractCitations", () => {
		it("should extract ArXiv citations from text", () => {
			const text = `
        This work builds on arXiv:2301.00001 and extends the ideas from 2302.12345.
        See also arxiv:2303.54321v2 for related work. Another reference is arXiv:2304.99999v1.
      `;

			const citations = extractCitations(text);

			expect(citations).toContain("2301.00001");
			expect(citations).toContain("2302.12345");
			expect(citations).toContain("2303.54321v2");
			expect(citations).toContain("2304.99999v1");
			expect(citations).toHaveLength(4);
		});

		it("should handle text with no citations", () => {
			const text = "This is a paper with no citations to other arXiv papers.";

			const citations = extractCitations(text);

			expect(citations).toEqual([]);
		});

		it("should handle various citation formats", () => {
			const text = `
        References include arXiv:2301.00001, ARXIV:2302.12345, 
        and https://arxiv.org/abs/2303.54321. Also see arXiv:2304.99999v3.
      `;

			const citations = extractCitations(text);

			expect(citations.length).toBeGreaterThan(0);
			expect(citations).toContain("2301.00001");
			expect(citations).toContain("2302.12345");
		});

		it("should remove duplicates", () => {
			const text = `
        This paper references arXiv:2301.00001 and also mentions arXiv:2301.00001 again.
        See arXiv:2301.00001 for details.
      `;

			const citations = extractCitations(text);

			expect(citations).toEqual(["2301.00001"]);
		});
	});

	describe("getCategoryName", () => {
		it("should return full name for known categories", () => {
			expect(getCategoryName("cs.AI")).toBe("Artificial Intelligence");
			expect(getCategoryName("cs.CV")).toBe("Computer Vision");
			expect(getCategoryName("cs.LG")).toBe("Machine Learning");
			expect(getCategoryName("quant-ph")).toBe("Quantum Physics");
		});

		it("should return the category code for unknown categories", () => {
			expect(getCategoryName("unknown.category")).toBe("unknown.category");
			expect(getCategoryName("custom.field")).toBe("custom.field");
		});

		it("should handle empty and null inputs", () => {
			expect(getCategoryName("")).toBe("");
			expect(getCategoryName(undefined as any)).toBe("");
			expect(getCategoryName(null as any)).toBe("");
		});
	});

	describe("calculateTrendingScore", () => {
		it("should calculate higher scores for recent papers", () => {
			const recentPaper: PaperInfo = {
				...sampleData.samplePaper,
				published: new Date().toISOString().split("T")[0], // Today
				categories: ["cs.AI"],
			};

			const oldPaper: PaperInfo = {
				...sampleData.samplePaper,
				published: "2020-01-01",
				categories: ["cs.AI"],
			};

			const recentScore = calculateTrendingScore(recentPaper);
			const oldScore = calculateTrendingScore(oldPaper);

			expect(recentScore).toBeGreaterThan(oldScore);
		});

		it("should boost scores for hot categories", () => {
			const aiPaper: PaperInfo = {
				...sampleData.samplePaper,
				categories: ["cs.AI"],
				published: "2024-01-01",
			};

			const mathPaper: PaperInfo = {
				...sampleData.samplePaper,
				categories: ["math.CO"],
				published: "2024-01-01",
			};

			const aiScore = calculateTrendingScore(aiPaper);
			const mathScore = calculateTrendingScore(mathPaper);

			expect(aiScore).toBeGreaterThan(mathScore);
		});

		it("should handle papers without categories", () => {
			const paper: PaperInfo = {
				...sampleData.samplePaper,
				categories: undefined,
				published: "2024-01-01",
			};

			const score = calculateTrendingScore(paper);

			expect(score).toBeGreaterThan(0);
			expect(typeof score).toBe("number");
		});

		it("should handle papers with multiple categories", () => {
			const paper: PaperInfo = {
				...sampleData.samplePaper,
				categories: ["cs.AI", "cs.CV", "cs.LG"],
				published: "2024-01-01",
			};

			const score = calculateTrendingScore(paper);

			expect(score).toBeGreaterThan(0);
			expect(typeof score).toBe("number");
		});
	});

	describe("getPaperById", () => {
		it("should fetch paper by ID", async () => {
			const paperId = "2401.12345";

			const paper = await getPaperById(paperId);

			expect(paper).toBeDefined();
			if (paper) {
				expect(paper.id[0]).toContain(paperId);
				expect(paper).toHaveProperty("title");
				expect(paper).toHaveProperty("author");
				expect(paper).toHaveProperty("summary");
			}
		});

		it("should handle non-existent paper IDs", async () => {
			const paperId = "nonexistent.99999";

			const paper = await getPaperById(paperId);

			expect(paper).toBeNull();
		});

		it("should handle API errors when fetching by ID", async () => {
			const paperId = "error.12345";

			await expect(getPaperById(paperId)).rejects.toThrow();
		});
	});
});
