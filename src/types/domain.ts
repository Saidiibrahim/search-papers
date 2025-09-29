/**
 * Shared type definitions for the Research Papers MCP Server
 */

// ArXiv API types
export interface ArxivEntry {
	id: string[];
	title: string[];
	summary: string[];
	author: Array<{ name: string[]; affiliation?: string[] }>;
	published: string[];
	updated?: string[];
	link: Array<{ $: { href: string; rel?: string; type?: string } }>;
	category?: Array<{ $: { term: string; scheme?: string } }>;
	"arxiv:primary_category"?: { $: { term: string } };
	"arxiv:comment"?: string[];
	"arxiv:journal_ref"?: string[];
	"arxiv:doi"?: string[];
}

export interface ArxivResponse {
	feed: {
		entry?: ArxivEntry[];
		"opensearch:totalResults"?: string[];
		"opensearch:startIndex"?: string[];
		"opensearch:itemsPerPage"?: string[];
	};
}

export interface PaperInfo {
	id: string;
	title: string;
	authors: string[];
	summary: string;
	pdf_url: string;
	arxiv_url: string;
	published: string;
	updated?: string;
	categories?: string[];
	primary_category?: string;
	comment?: string;
	journal_ref?: string;
	doi?: string;
	affiliations?: string[];
	version?: number;
}

// Extended search types
export interface AdvancedSearchParams {
	title?: string;
	author?: string;
	abstract?: string;
	comment?: string;
	journal_ref?: string;
	category?: string;
	all?: string;
	date_from?: string;
	date_to?: string;
	start?: number;
	max_results?: number;
	sort_by?: "relevance" | "lastUpdatedDate" | "submittedDate";
	sort_order?: "ascending" | "descending";
}

export interface CategoryInfo {
	id: string;
	name: string;
	description: string;
	parent?: string;
	subCategories?: string[];
}

export interface AuthorInfo {
	name: string;
	affiliations?: string[];
	paper_count?: number;
	recent_papers?: PaperInfo[];
}

export interface BibliographyFormat {
	format: "bibtex" | "endnote" | "ris" | "json";
	papers: PaperInfo[];
}

export interface ReadingList {
	id: string;
	name: string;
	description?: string;
	papers: string[]; // Paper IDs
	created_at: string;
	updated_at: string;
	notes?: Record<string, string>; // Paper ID -> notes
}

export interface Alert {
	id: string;
	name: string;
	query: AdvancedSearchParams;
	frequency: "daily" | "weekly" | "monthly";
	created_at: string;
	last_checked?: string;
	email?: string;
}

export interface TrendingPaper extends PaperInfo {
	trend_score?: number;
	citation_velocity?: number;
	social_mentions?: number;
}

// Environment interface for Cloudflare Workers
export interface Env {
	// KV namespace for storing reading lists and alerts
	RESEARCH_KV?: KVNamespace;
	// D1 database for more complex data
	RESEARCH_DB?: D1Database;
	// R2 bucket for storing downloaded papers
	RESEARCH_R2?: R2Bucket;

	// GitHub configuration for dynamic stats fetching
	GITHUB_OWNER?: string;
	GITHUB_REPO?: string;
	GITHUB_TOKEN?: string; // Secret for authenticated API requests
	APP_VERSION?: string;
}

// MCP Tool and Prompt definitions for documentation
export interface ToolDefinition {
	name: string;
	description: string;
	parameters: Array<{
		name: string;
		type: string;
		description: string;
	}>;
}

export interface PromptDefinition {
	name: string;
	description: string;
	parameters: Array<{
		name: string;
		type: string;
		description: string;
	}>;
}

// ArXiv categories mapping
export const ARXIV_CATEGORIES: Record<string, CategoryInfo> = {
	cs: { id: "cs", name: "Computer Science", description: "Computer Science" },
	"cs.AI": {
		id: "cs.AI",
		name: "Artificial Intelligence",
		description: "Artificial Intelligence",
		parent: "cs",
	},
	"cs.CL": {
		id: "cs.CL",
		name: "Computation and Language",
		description: "Computational Linguistics",
		parent: "cs",
	},
	"cs.CV": {
		id: "cs.CV",
		name: "Computer Vision",
		description: "Computer Vision and Pattern Recognition",
		parent: "cs",
	},
	"cs.LG": {
		id: "cs.LG",
		name: "Machine Learning",
		description: "Machine Learning",
		parent: "cs",
	},
	"cs.RO": {
		id: "cs.RO",
		name: "Robotics",
		description: "Robotics",
		parent: "cs",
	},
	physics: { id: "physics", name: "Physics", description: "Physics" },
	"physics.quant-ph": {
		id: "physics.quant-ph",
		name: "Quantum Physics",
		description: "Quantum Physics",
		parent: "physics",
	},
	"quant-ph": {
		id: "quant-ph",
		name: "Quantum Physics",
		description: "Quantum Physics",
	},
	math: { id: "math", name: "Mathematics", description: "Mathematics" },
	"math.ST": {
		id: "math.ST",
		name: "Statistics Theory",
		description: "Statistics Theory",
		parent: "math",
	},
	"q-bio": {
		id: "q-bio",
		name: "Quantitative Biology",
		description: "Quantitative Biology",
	},
	"q-fin": {
		id: "q-fin",
		name: "Quantitative Finance",
		description: "Quantitative Finance",
	},
	stat: { id: "stat", name: "Statistics", description: "Statistics" },
	"stat.ML": {
		id: "stat.ML",
		name: "Machine Learning",
		description: "Machine Learning (Statistics)",
		parent: "stat",
	},
};
