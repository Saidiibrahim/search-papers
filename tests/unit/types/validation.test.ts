import { describe, it, expect } from "vitest";
import {
	type PaperInfo,
	type AdvancedSearchParams,
	type CategoryInfo,
	type AuthorInfo,
	type BibliographyFormat,
	type ReadingList,
	type Alert,
	type TrendingPaper,
	type ArxivEntry,
	type ArxivResponse,
	ARXIV_CATEGORIES,
} from "@/types/domain";
import sampleData from "@tests/fixtures/sample-papers.json";

describe("Type Definitions", () => {
	describe("PaperInfo", () => {
		it("should validate a complete PaperInfo object", () => {
			const paper: PaperInfo = sampleData.samplePaper;

			expect(paper).toHaveProperty("id");
			expect(paper).toHaveProperty("title");
			expect(paper).toHaveProperty("authors");
			expect(paper).toHaveProperty("summary");
			expect(paper).toHaveProperty("pdf_url");
			expect(paper).toHaveProperty("arxiv_url");
			expect(paper).toHaveProperty("published");

			expect(typeof paper.id).toBe("string");
			expect(typeof paper.title).toBe("string");
			expect(Array.isArray(paper.authors)).toBe(true);
			expect(typeof paper.summary).toBe("string");
			expect(typeof paper.pdf_url).toBe("string");
			expect(typeof paper.arxiv_url).toBe("string");
			expect(typeof paper.published).toBe("string");
		});

		it("should validate optional fields in PaperInfo", () => {
			const paper: PaperInfo = {
				id: "2401.12345",
				title: "Test Paper",
				authors: ["Test Author"],
				summary: "Test summary",
				pdf_url: "http://example.com/paper.pdf",
				arxiv_url: "http://example.com/abs",
				published: "2024-01-01",
				updated: "2024-01-02",
				categories: ["cs.AI", "cs.CV"],
				primary_category: "cs.AI",
				comment: "Test comment",
				journal_ref: "Test Journal 2024",
				doi: "10.1000/test",
				affiliations: ["Test University"],
				version: 1,
			};

			expect(paper.updated).toBe("2024-01-02");
			expect(Array.isArray(paper.categories)).toBe(true);
			expect(paper.categories).toHaveLength(2);
			expect(typeof paper.primary_category).toBe("string");
			expect(typeof paper.comment).toBe("string");
			expect(typeof paper.journal_ref).toBe("string");
			expect(typeof paper.doi).toBe("string");
			expect(Array.isArray(paper.affiliations)).toBe(true);
			expect(typeof paper.version).toBe("number");
		});

		it("should work with minimal PaperInfo object", () => {
			const paper: PaperInfo = {
				id: "2401.99999",
				title: "Minimal Paper",
				authors: ["Author"],
				summary: "Summary",
				pdf_url: "http://example.com/paper.pdf",
				arxiv_url: "http://example.com/abs",
				published: "2024-01-01",
			};

			expect(paper.id).toBe("2401.99999");
			expect(paper.title).toBe("Minimal Paper");
			expect(paper.authors).toEqual(["Author"]);
			expect(paper.summary).toBe("Summary");
			expect(paper.published).toBe("2024-01-01");
		});
	});

	describe("AdvancedSearchParams", () => {
		it("should validate complete search parameters", () => {
			const params: AdvancedSearchParams = {
				title: "machine learning",
				author: "Geoffrey Hinton",
				abstract: "neural networks",
				comment: "accepted to ICLR",
				journal_ref: "Nature",
				category: "cs.AI",
				all: "transformer",
				date_from: "2023-01-01",
				date_to: "2024-01-01",
				start: 0,
				max_results: 10,
				sort_by: "relevance",
				sort_order: "ascending",
			};

			expect(typeof params.title).toBe("string");
			expect(typeof params.author).toBe("string");
			expect(typeof params.abstract).toBe("string");
			expect(typeof params.comment).toBe("string");
			expect(typeof params.journal_ref).toBe("string");
			expect(typeof params.category).toBe("string");
			expect(typeof params.all).toBe("string");
			expect(typeof params.date_from).toBe("string");
			expect(typeof params.date_to).toBe("string");
			expect(typeof params.start).toBe("number");
			expect(typeof params.max_results).toBe("number");
			expect(["relevance", "lastUpdatedDate", "submittedDate"]).toContain(
				params.sort_by
			);
			expect(["ascending", "descending"]).toContain(params.sort_order);
		});

		it("should validate empty search parameters", () => {
			const params: AdvancedSearchParams = {};

			expect(Object.keys(params)).toHaveLength(0);
		});

		it("should validate single field search parameters", () => {
			const titleParams: AdvancedSearchParams = {
				title: "neural networks",
			};

			const authorParams: AdvancedSearchParams = {
				author: "Yann LeCun",
			};

			const categoryParams: AdvancedSearchParams = {
				category: "cs.CV",
			};

			expect(titleParams.title).toBe("neural networks");
			expect(authorParams.author).toBe("Yann LeCun");
			expect(categoryParams.category).toBe("cs.CV");
		});

		it("should validate sort_by enum values", () => {
			const relevanceParams: AdvancedSearchParams = {
				all: "test",
				sort_by: "relevance",
			};

			const dateParams: AdvancedSearchParams = {
				all: "test",
				sort_by: "submittedDate",
			};

			const updateParams: AdvancedSearchParams = {
				all: "test",
				sort_by: "lastUpdatedDate",
			};

			expect(["relevance", "lastUpdatedDate", "submittedDate"]).toContain(
				relevanceParams.sort_by
			);
			expect(["relevance", "lastUpdatedDate", "submittedDate"]).toContain(
				dateParams.sort_by
			);
			expect(["relevance", "lastUpdatedDate", "submittedDate"]).toContain(
				updateParams.sort_by
			);
		});
	});

	describe("CategoryInfo", () => {
		it("should validate complete CategoryInfo object", () => {
			const category: CategoryInfo = {
				id: "cs.AI",
				name: "Artificial Intelligence",
				description: "Research in artificial intelligence",
				parent: "cs",
				subCategories: ["cs.CV", "cs.LG"],
			};

			expect(typeof category.id).toBe("string");
			expect(typeof category.name).toBe("string");
			expect(typeof category.description).toBe("string");
			expect(typeof category.parent).toBe("string");
			expect(Array.isArray(category.subCategories)).toBe(true);
		});

		it("should validate minimal CategoryInfo object", () => {
			const category: CategoryInfo = {
				id: "cs.AI",
				name: "Artificial Intelligence",
				description: "AI research",
			};

			expect(category.id).toBe("cs.AI");
			expect(category.name).toBe("Artificial Intelligence");
			expect(category.description).toBe("AI research");
			expect(category.parent).toBeUndefined();
			expect(category.subCategories).toBeUndefined();
		});
	});

	describe("AuthorInfo", () => {
		it("should validate complete AuthorInfo object", () => {
			const author: AuthorInfo = {
				name: "Geoffrey Hinton",
				affiliations: ["University of Toronto", "Google"],
				paper_count: 150,
				recent_papers: [sampleData.samplePaper],
			};

			expect(typeof author.name).toBe("string");
			expect(Array.isArray(author.affiliations)).toBe(true);
			expect(typeof author.paper_count).toBe("number");
			expect(Array.isArray(author.recent_papers)).toBe(true);
		});

		it("should validate minimal AuthorInfo object", () => {
			const author: AuthorInfo = {
				name: "Jane Doe",
			};

			expect(author.name).toBe("Jane Doe");
			expect(author.affiliations).toBeUndefined();
			expect(author.paper_count).toBeUndefined();
			expect(author.recent_papers).toBeUndefined();
		});
	});

	describe("BibliographyFormat", () => {
		it("should validate BibliographyFormat with different formats", () => {
			const bibtexFormat: BibliographyFormat = {
				format: "bibtex",
				papers: [sampleData.samplePaper],
			};

			const endnoteFormat: BibliographyFormat = {
				format: "endnote",
				papers: [],
			};

			const risFormat: BibliographyFormat = {
				format: "ris",
				papers: [sampleData.samplePaper, sampleData.multipleAuthorsePaper], // Use complete papers instead
			};

			const jsonFormat: BibliographyFormat = {
				format: "json",
				papers: [sampleData.samplePaper, sampleData.multipleAuthorsePaper],
			};

			expect(["bibtex", "endnote", "ris", "json"]).toContain(
				bibtexFormat.format
			);
			expect(["bibtex", "endnote", "ris", "json"]).toContain(
				endnoteFormat.format
			);
			expect(["bibtex", "endnote", "ris", "json"]).toContain(risFormat.format);
			expect(["bibtex", "endnote", "ris", "json"]).toContain(jsonFormat.format);

			expect(Array.isArray(bibtexFormat.papers)).toBe(true);
			expect(Array.isArray(endnoteFormat.papers)).toBe(true);
			expect(Array.isArray(risFormat.papers)).toBe(true);
			expect(Array.isArray(jsonFormat.papers)).toBe(true);
		});
	});

	describe("ReadingList", () => {
		it("should validate complete ReadingList object", () => {
			const readingList: ReadingList = {
				id: "rl_001",
				name: "Deep Learning Papers",
				description: "Collection of important deep learning papers",
				papers: ["2401.12345", "2401.67890"],
				created_at: "2024-01-01T00:00:00Z",
				updated_at: "2024-01-02T00:00:00Z",
				notes: {
					"2401.12345": "Important breakthrough paper",
					"2401.67890": "Good survey of recent advances",
				},
			};

			expect(typeof readingList.id).toBe("string");
			expect(typeof readingList.name).toBe("string");
			expect(typeof readingList.description).toBe("string");
			expect(Array.isArray(readingList.papers)).toBe(true);
			expect(typeof readingList.created_at).toBe("string");
			expect(typeof readingList.updated_at).toBe("string");
			expect(typeof readingList.notes).toBe("object");
			expect(readingList.notes).not.toBeNull();
		});

		it("should validate minimal ReadingList object", () => {
			const readingList: ReadingList = {
				id: "rl_002",
				name: "ML Papers",
				papers: ["2401.12345"],
				created_at: "2024-01-01T00:00:00Z",
				updated_at: "2024-01-01T00:00:00Z",
			};

			expect(readingList.id).toBe("rl_002");
			expect(readingList.name).toBe("ML Papers");
			expect(readingList.papers).toEqual(["2401.12345"]);
			expect(readingList.description).toBeUndefined();
			expect(readingList.notes).toBeUndefined();
		});
	});

	describe("Alert", () => {
		it("should validate complete Alert object", () => {
			const alert: Alert = {
				id: "alert_001",
				name: "New ML Papers",
				query: {
					category: "cs.LG",
					max_results: 10,
				},
				frequency: "daily",
				created_at: "2024-01-01T00:00:00Z",
				last_checked: "2024-01-10T00:00:00Z",
				email: "user@example.com",
			};

			expect(typeof alert.id).toBe("string");
			expect(typeof alert.name).toBe("string");
			expect(typeof alert.query).toBe("object");
			expect(["daily", "weekly", "monthly"]).toContain(alert.frequency);
			expect(typeof alert.created_at).toBe("string");
			expect(typeof alert.last_checked).toBe("string");
			expect(typeof alert.email).toBe("string");
		});

		it("should validate minimal Alert object", () => {
			const alert: Alert = {
				id: "alert_002",
				name: "AI Papers",
				query: { category: "cs.AI" },
				frequency: "weekly",
				created_at: "2024-01-01T00:00:00Z",
			};

			expect(alert.id).toBe("alert_002");
			expect(alert.frequency).toBe("weekly");
			expect(alert.last_checked).toBeUndefined();
			expect(alert.email).toBeUndefined();
		});

		it("should validate frequency enum values", () => {
			const dailyAlert: Alert = {
				id: "test",
				name: "Test",
				query: {},
				frequency: "daily",
				created_at: "2024-01-01T00:00:00Z",
			};

			const weeklyAlert: Alert = {
				id: "test",
				name: "Test",
				query: {},
				frequency: "weekly",
				created_at: "2024-01-01T00:00:00Z",
			};

			const monthlyAlert: Alert = {
				id: "test",
				name: "Test",
				query: {},
				frequency: "monthly",
				created_at: "2024-01-01T00:00:00Z",
			};

			expect(["daily", "weekly", "monthly"]).toContain(dailyAlert.frequency);
			expect(["daily", "weekly", "monthly"]).toContain(weeklyAlert.frequency);
			expect(["daily", "weekly", "monthly"]).toContain(monthlyAlert.frequency);
		});
	});

	describe("TrendingPaper", () => {
		it("should validate TrendingPaper extends PaperInfo", () => {
			const trendingPaper: TrendingPaper = {
				...sampleData.samplePaper,
				trend_score: 95.5,
				citation_velocity: 10.2,
				social_mentions: 25,
			};

			// Should have all PaperInfo properties
			expect(typeof trendingPaper.id).toBe("string");
			expect(typeof trendingPaper.title).toBe("string");
			expect(Array.isArray(trendingPaper.authors)).toBe(true);

			// Should have additional trending properties
			expect(typeof trendingPaper.trend_score).toBe("number");
			expect(typeof trendingPaper.citation_velocity).toBe("number");
			expect(typeof trendingPaper.social_mentions).toBe("number");
		});

		it("should work with minimal trending info", () => {
			const trendingPaper: TrendingPaper = {
				...sampleData.samplePaper,
				trend_score: 80.0,
			};

			expect(trendingPaper.trend_score).toBe(80.0);
			expect(trendingPaper.citation_velocity).toBeUndefined();
			expect(trendingPaper.social_mentions).toBeUndefined();
		});
	});

	describe("ArxivEntry", () => {
		it("should validate complete ArxivEntry object", () => {
			const entry: ArxivEntry = {
				id: ["http://arxiv.org/abs/2401.12345v1"],
				title: ["Sample Paper Title"],
				summary: ["Paper summary"],
				author: [
					{ name: ["John Doe"], affiliation: ["University"] },
					{ name: ["Jane Smith"] },
				],
				published: ["2024-01-15T00:00:00Z"],
				updated: ["2024-01-16T00:00:00Z"],
				link: [
					{
						$: { href: "http://arxiv.org/abs/2401.12345v1", rel: "alternate" },
					},
				],
				category: [
					{ $: { term: "cs.AI", scheme: "http://arxiv.org/schemas/atom" } },
				],
				"arxiv:primary_category": { $: { term: "cs.AI" } },
				"arxiv:comment": ["10 pages, 5 figures"],
				"arxiv:journal_ref": ["Nature 2024"],
				"arxiv:doi": ["10.1000/test"],
			};

			expect(Array.isArray(entry.id)).toBe(true);
			expect(Array.isArray(entry.title)).toBe(true);
			expect(Array.isArray(entry.summary)).toBe(true);
			expect(Array.isArray(entry.author)).toBe(true);
			expect(Array.isArray(entry.published)).toBe(true);
			expect(Array.isArray(entry.updated)).toBe(true);
			expect(Array.isArray(entry.link)).toBe(true);
			expect(Array.isArray(entry.category)).toBe(true);
			expect(Array.isArray(entry["arxiv:comment"])).toBe(true);
			expect(Array.isArray(entry["arxiv:journal_ref"])).toBe(true);
			expect(Array.isArray(entry["arxiv:doi"])).toBe(true);
		});

		it("should validate minimal ArxivEntry object", () => {
			const entry: ArxivEntry = {
				id: ["http://arxiv.org/abs/2401.99999v1"],
				title: ["Minimal Paper"],
				summary: ["Short summary"],
				author: [{ name: ["Author Name"] }],
				published: ["2024-01-01T00:00:00Z"],
				link: [
					{
						$: { href: "http://arxiv.org/abs/2401.99999v1", rel: "alternate" },
					},
				],
			};

			expect(entry.id).toEqual(["http://arxiv.org/abs/2401.99999v1"]);
			expect(entry.title).toEqual(["Minimal Paper"]);
			expect(entry.updated).toBeUndefined();
			expect(entry.category).toBeUndefined();
			expect(entry["arxiv:comment"]).toBeUndefined();
		});
	});

	describe("ArxivResponse", () => {
		it("should validate complete ArxivResponse object", () => {
			const response: ArxivResponse = {
				feed: {
					entry: [
						{
							id: ["http://arxiv.org/abs/2401.12345v1"],
							title: ["Paper Title"],
							summary: ["Paper summary"],
							author: [{ name: ["Author"] }],
							published: ["2024-01-01T00:00:00Z"],
							link: [{ $: { href: "http://arxiv.org/abs/2401.12345v1" } }],
						},
					],
					"opensearch:totalResults": ["1"],
					"opensearch:startIndex": ["0"],
					"opensearch:itemsPerPage": ["1"],
				},
			};

			expect(typeof response.feed).toBe("object");
			expect(Array.isArray(response.feed.entry)).toBe(true);
			expect(Array.isArray(response.feed["opensearch:totalResults"])).toBe(
				true
			);
			expect(Array.isArray(response.feed["opensearch:startIndex"])).toBe(true);
			expect(Array.isArray(response.feed["opensearch:itemsPerPage"])).toBe(
				true
			);
		});

		it("should validate empty ArxivResponse object", () => {
			const response: ArxivResponse = {
				feed: {
					"opensearch:totalResults": ["0"],
				},
			};

			expect(response.feed.entry).toBeUndefined();
			expect(response.feed["opensearch:totalResults"]).toEqual(["0"]);
		});
	});

	describe("ARXIV_CATEGORIES constant", () => {
		it("should contain expected category structure", () => {
			expect(typeof ARXIV_CATEGORIES).toBe("object");
			expect(ARXIV_CATEGORIES).not.toBeNull();

			// Test a few key categories
			expect(ARXIV_CATEGORIES["cs.AI"]).toBeDefined();
			expect(ARXIV_CATEGORIES["cs.AI"].id).toBe("cs.AI");
			expect(ARXIV_CATEGORIES["cs.AI"].name).toBe("Artificial Intelligence");
			expect(ARXIV_CATEGORIES["cs.AI"].parent).toBe("cs");

			expect(ARXIV_CATEGORIES["cs.CV"]).toBeDefined();
			expect(ARXIV_CATEGORIES["cs.LG"]).toBeDefined();
			expect(ARXIV_CATEGORIES["stat.ML"]).toBeDefined();
		});

		it("should have valid category hierarchies", () => {
			// Test parent-child relationships
			expect(ARXIV_CATEGORIES.cs).toBeDefined();
			expect(ARXIV_CATEGORIES["cs.AI"].parent).toBe("cs");
			expect(ARXIV_CATEGORIES["cs.CV"].parent).toBe("cs");
			expect(ARXIV_CATEGORIES["cs.LG"].parent).toBe("cs");

			expect(ARXIV_CATEGORIES.stat).toBeDefined();
			expect(ARXIV_CATEGORIES["stat.ML"].parent).toBe("stat");
		});

		it("should have required fields for all categories", () => {
			Object.values(ARXIV_CATEGORIES).forEach((category) => {
				expect(typeof category.id).toBe("string");
				expect(typeof category.name).toBe("string");
				expect(typeof category.description).toBe("string");
				expect(category.id.length).toBeGreaterThan(0);
				expect(category.name.length).toBeGreaterThan(0);
				expect(category.description.length).toBeGreaterThan(0);
			});
		});
	});
});
