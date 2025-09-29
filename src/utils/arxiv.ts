/**
 * Utility functions for enhanced ArXiv API interactions
 */

import {
	type ArxivEntry,
	type ArxivResponse,
	type PaperInfo,
	type AdvancedSearchParams,
	ARXIV_CATEGORIES,
} from "../types/domain";

/**
 * Build advanced search query from parameters
 */
export function buildSearchQuery(params: AdvancedSearchParams): string {
	const queryParts: string[] = [];

	if (params.title) {
		queryParts.push(`ti:"${params.title}"`);
	}
	if (params.author) {
		queryParts.push(`au:"${params.author}"`);
	}
	if (params.abstract) {
		queryParts.push(`abs:"${params.abstract}"`);
	}
	if (params.comment) {
		queryParts.push(`co:"${params.comment}"`);
	}
	if (params.journal_ref) {
		queryParts.push(`jr:"${params.journal_ref}"`);
	}
	if (params.category) {
		queryParts.push(`cat:${params.category}`);
	}
	if (params.all) {
		queryParts.push(`all:"${params.all}"`);
	}

	let query = queryParts.join(" AND ");

	// Add date filtering if provided
	if (params.date_from || params.date_to) {
		const dateQuery = buildDateQuery(params.date_from, params.date_to);
		if (dateQuery) {
			query = query ? `${query} AND ${dateQuery}` : dateQuery;
		}
	}

	return query || "all:*";
}

/**
 * Build date range query
 */
function buildDateQuery(dateFrom?: string, dateTo?: string): string {
	if (!dateFrom && !dateTo) return "";

	const from = dateFrom ? dateFrom.replace(/-/g, "") : "19900101";
	const to = dateTo
		? dateTo.replace(/-/g, "")
		: new Date().toISOString().split("T")[0].replace(/-/g, "");

	return `submittedDate:[${from} TO ${to}]`;
}

/**
 * Parse authors from entry XML
 */
function parseAuthors(entryXml: string): any[] {
	const authors: any[] = [];
	const authorMatches = entryXml.matchAll(/<author>(.*?)<\/author>/gs);
	
	for (const authorMatch of authorMatches) {
		const authorXml = authorMatch[1];
		const name = extractXmlValue(authorXml, "name");
		const affiliation = extractXmlValue(authorXml, "affiliation");

		const author: any = { name: [name] };
		if (affiliation) {
			author.affiliation = [affiliation];
		}
		authors.push(author);
	}
	
	return authors;
}

/**
 * Parse links from entry XML
 */
function parseLinks(entryXml: string): any[] {
	const links: any[] = [];
	const linkMatches = entryXml.matchAll(
		/<link[^>]*href="([^"]*?)"[^>]*rel="([^"]*?)"[^>]*(?:type="([^"]*?)")?[^>]*\/>/gs
	);
	
	for (const linkMatch of linkMatches) {
		links.push({
			$: {
				href: linkMatch[1] || "",
				rel: linkMatch[2] || "",
				type: linkMatch[3] || "",
			},
		});
	}
	
	return links;
}

/**
 * Parse categories from entry XML
 */
function parseCategories(entryXml: string): any[] {
	const categories: any[] = [];
	const categoryMatches = entryXml.matchAll(
		/<category[^>]*term="([^"]*?)"[^>]*\/>/gs
	);
	
	for (const catMatch of categoryMatches) {
		categories.push({ $: { term: catMatch[1] } });
	}
	
	return categories;
}

/**
 * Parse optional ArXiv fields from entry XML
 */
function parseOptionalFields(entryXml: string, entry: ArxivEntry): void {
	// Parse optional fields
	const updated = extractXmlValue(entryXml, "updated");
	if (updated) entry.updated = [updated];

	// Parse primary category
	const primaryCatMatch = entryXml.match(
		/<arxiv:primary_category[^>]*term="([^"]*?)"[^>]*\/>/s
	);
	if (primaryCatMatch) {
		entry["arxiv:primary_category"] = { $: { term: primaryCatMatch[1] } };
	}

	// Parse comment
	const comment = extractXmlValue(entryXml, "arxiv:comment");
	if (comment) entry["arxiv:comment"] = [comment];

	// Parse journal ref
	const journalRef = extractXmlValue(entryXml, "arxiv:journal_ref");
	if (journalRef) entry["arxiv:journal_ref"] = [journalRef];

	// Parse DOI
	const doi = extractXmlValue(entryXml, "arxiv:doi");
	if (doi) entry["arxiv:doi"] = [doi];
}

/**
 * Parse ArXiv XML response using regular expressions (Cloudflare Workers compatible)
 */
function parseArxivXML(xmlText: string): ArxivResponse {
	const entries: ArxivEntry[] = [];

	// Extract all entry elements
	const entryMatches = xmlText.matchAll(/<entry>(.*?)<\/entry>/gs);

	for (const entryMatch of entryMatches) {
		const entryXml = entryMatch[1];

		const entry: ArxivEntry = {
			id: [extractXmlValue(entryXml, "id")],
			title: [extractXmlValue(entryXml, "title")],
			summary: [extractXmlValue(entryXml, "summary")],
			author: parseAuthors(entryXml),
			published: [extractXmlValue(entryXml, "published")],
			link: parseLinks(entryXml),
		};

		// Parse categories
		const categories = parseCategories(entryXml);
		if (categories.length > 0) {
			entry.category = categories;
		}

		// Parse optional fields
		parseOptionalFields(entryXml, entry);

		entries.push(entry);
	}

	return {
		feed: {
			entry: entries,
		},
	};
}

/**
 * Helper to extract text content from XML using regex
 */
function extractXmlValue(xml: string, tagName: string): string {
	const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "s");
	const match = xml.match(regex);
	return match ? match[1].trim() : "";
}

/**
 * Execute ArXiv API search with advanced parameters
 */
export async function searchArxivAdvanced(
	params: AdvancedSearchParams
): Promise<ArxivEntry[]> {
	const baseUrl = "http://export.arxiv.org/api/query";
	const query = buildSearchQuery(params);

	const urlParams = new URLSearchParams({
		search_query: query,
		start: (params.start || 0).toString(),
		max_results: (params.max_results || 10).toString(),
		sortBy: params.sort_by || "relevance",
		sortOrder: params.sort_order || "descending",
	});

	try {
		const response = await fetch(`${baseUrl}?${urlParams}`, {
			headers: {
				"User-Agent": "research-mcp-server/2.0",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const xmlText = await response.text();
		const parsed = parseArxivXML(xmlText);
		return parsed.feed.entry || [];
	} catch (error) {
		console.error("Error in advanced ArXiv search:", error);
		throw new Error(
			`Failed to search arXiv: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Get paper by ArXiv ID
 */
export async function getPaperById(
	arxivId: string
): Promise<ArxivEntry | null> {
	const baseUrl = "http://export.arxiv.org/api/query";
	const cleanId = arxivId.replace(/^arxiv:/i, "");

	const params = new URLSearchParams({
		id_list: cleanId,
		max_results: "1",
	});

	try {
		const response = await fetch(`${baseUrl}?${params}`, {
			headers: {
				"User-Agent": "research-mcp-server/2.0",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const xmlText = await response.text();
		const parsed = parseArxivXML(xmlText);
		return parsed.feed.entry?.[0] || null;
	} catch (error) {
		console.error("Error fetching paper by ID:", error);
		throw new Error(
			`Failed to fetch paper: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * Convert ArxivEntry to enhanced PaperInfo
 */
export function entryToPaperInfo(entry: ArxivEntry): PaperInfo {
	const paper: PaperInfo = {
		id: getShortId(entry),
		title: entry.title[0].trim(),
		authors: entry.author.map((a) => a.name[0]),
		summary: entry.summary[0].trim(),
		pdf_url: getPdfUrl(entry),
		arxiv_url: entry.id[0],
		published: entry.published[0].split("T")[0],
	};

	// Add optional fields
	if (entry.updated) {
		paper.updated = entry.updated[0].split("T")[0];
	}

	if (entry.category) {
		paper.categories = entry.category.map((c) => c.$.term);
	} else {
		// Always set categories as an array, even if empty
		paper.categories = [];
	}

	if (entry["arxiv:primary_category"]) {
		// Handle both array and object formats
		const primaryCategory = Array.isArray(entry["arxiv:primary_category"])
			? entry["arxiv:primary_category"][0]
			: entry["arxiv:primary_category"];
		paper.primary_category = primaryCategory?.$.term;
	}

	if (entry["arxiv:comment"]) {
		paper.comment = entry["arxiv:comment"][0];
	}

	if (entry["arxiv:journal_ref"]) {
		paper.journal_ref = entry["arxiv:journal_ref"][0];
	}

	if (entry["arxiv:doi"]) {
		paper.doi = entry["arxiv:doi"][0];
	}

	// Extract affiliations if available
	const affiliations = entry.author
		.filter((a) => a.affiliation)
		.map((a) => a.affiliation?.[0])
		.filter((affiliation): affiliation is string => affiliation !== undefined);
	// Always set affiliations as an array, even if empty
	paper.affiliations = affiliations;

	// Extract version from ID
	const versionMatch = entry.id[0].match(/v(\d+)$/);
	if (versionMatch) {
		paper.version = parseInt(versionMatch[1]);
	}

	return paper;
}

/**
 * Extract the short ID from an arXiv entry
 */
export function getShortId(entry: ArxivEntry): string {
	const idUrl = entry.id[0];
	const match = idUrl.match(/([0-9]+\.[0-9]+)(v[0-9]+)?$/);
	return match ? match[1] : idUrl;
}

/**
 * Get the PDF URL from an arXiv entry
 */
export function getPdfUrl(entry: ArxivEntry): string {
	const pdfLink = entry.link?.find(
		(link) => link.$.rel === "related" && link.$.href.includes("pdf")
	);

	if (pdfLink) {
		return pdfLink.$.href;
	}

	const shortId = getShortId(entry);
	return `https://arxiv.org/pdf/${shortId}.pdf`;
}

/**
 * Generate BibTeX entry for a paper
 */
export function generateBibTeX(paper: PaperInfo): string {
	const year = paper.published.split("-")[0];
	const firstAuthor = paper.authors[0].split(" ").pop() || "Unknown";
	const key = `${firstAuthor}${year}${paper.id.replace(".", "")}`;

	const bibtex = `@article{${key},
  title={${paper.title}},
  author={${paper.authors.join(" and ")}},${
		paper.journal_ref
			? `
  journal={${paper.journal_ref}},`
			: ""
	}
  year={${year}},
  eprint={${paper.id}},
  archivePrefix={arXiv}${
		paper.primary_category
			? `,
  primaryClass={${paper.primary_category}}`
			: ""
	}${
		paper.doi
			? `,
  doi={${paper.doi}}`
			: ""
	}
}`;

	return bibtex;
}

/**
 * Extract potential citations from paper text
 */
export function extractCitations(text: string): string[] {
	const citations: string[] = [];

	// Match arXiv IDs in various formats
	const arxivPattern = /(?:arXiv:)?(\d{4}\.\d{4,5}(?:v\d+)?)/g;
	const matches = text.matchAll(arxivPattern);

	for (const match of matches) {
		if (match[1] && !citations.includes(match[1])) {
			citations.push(match[1]);
		}
	}

	return citations;
}

/**
 * Get category name from ID
 */
export function getCategoryName(categoryId: string): string {
	if (!categoryId) {
		return "";
	}
	return ARXIV_CATEGORIES[categoryId]?.name || categoryId;
}

/**
 * Get category hierarchy
 */
export function getCategoryHierarchy(categoryId: string): string[] {
	const hierarchy: string[] = [];
	let current = categoryId;

	while (current && ARXIV_CATEGORIES[current]) {
		hierarchy.unshift(current);
		current = ARXIV_CATEGORIES[current].parent || "";
	}

	return hierarchy;
}

/**
 * Calculate trending score based on recency and other factors
 */
export function calculateTrendingScore(paper: PaperInfo): number {
	const now = new Date();
	const published = new Date(paper.published);
	const daysSincePublished =
		(now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);

	// Base score with better scaling for realistic time periods
	// Give a base score of 50, then add/subtract based on recency
	let score = 50;

	// Boost for very recent papers (within 30 days)
	if (daysSincePublished <= 30) {
		score += (30 - daysSincePublished) * 2; // Max +60 for today's papers
	} else if (daysSincePublished <= 365) {
		// Gradual decline for papers up to a year old
		score += Math.max(0, 30 - (daysSincePublished - 30) * 0.1);
	}

	// Boost for papers in hot categories
	const hotCategories = ["cs.AI", "cs.LG", "cs.CV", "cs.CL"];
	if (paper.categories?.some((cat) => hotCategories.includes(cat))) {
		score *= 1.5;
	}

	// Boost for papers with journal references
	if (paper.journal_ref) {
		score *= 1.2;
	}

	// Ensure minimum score of 1 to avoid zero scores
	return Math.max(1, Math.round(score));
}
