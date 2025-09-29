import type { PaperInfo } from "../types/domain";

export function formatPaperDetails(
	paper: PaperInfo,
	index: number,
	detailed: boolean = false
): string {
	let text = `## ${index}. ${paper.title}\n`;
	text += `**Paper ID**: ${paper.id}${paper.version ? ` (v${paper.version})` : ""}\n`;
	text += `**Authors**: ${paper.authors.join(", ")}\n`;
	if (paper.affiliations && paper.affiliations.length > 0) {
		text += `**Affiliations**: ${paper.affiliations.join(", ")}\n`;
	}
	text += `**Published**: ${paper.published}`;
	if (paper.updated && paper.updated !== paper.published) {
		text += ` (Updated: ${paper.updated})`;
	}
	text += `\n`;

	if (paper.categories && paper.categories.length > 0) {
		text += `**Categories**: ${paper.categories.join(", ")}\n`;
	}
	if (paper.journal_ref) {
		text += `**Journal Reference**: ${paper.journal_ref}\n`;
	}
	if (paper.doi) {
		text += `**DOI**: ${paper.doi}\n`;
	}
	if (paper.comment) {
		text += `**Comments**: ${paper.comment}\n`;
	}

	text += `**ArXiv URL**: ${paper.arxiv_url}\n`;
	text += `**PDF URL**: ${paper.pdf_url}\n`;

	if (detailed) {
		text += `\n**Abstract**: ${paper.summary}\n`;
	} else {
		text += `**Summary**: ${paper.summary.substring(0, 300)}${
			paper.summary.length > 300 ? "..." : ""
		}\n`;
	}

	text += "\n---\n\n";
	return text;
}

export function formatPaperSummary(paper: PaperInfo, index: number): string {
	let text = `${index}. **${paper.title}**\n`;
	text += `   - Authors: ${paper.authors.slice(0, 3).join(", ")}${
		paper.authors.length > 3 ? " et al." : ""
	}\n`;
	text += `   - Published: ${paper.published} | ID: ${paper.id}\n`;
	if (paper.primary_category) {
		text += `   - Category: ${paper.primary_category}\n`;
	}
	text += `   - [PDF](${paper.pdf_url}) | [ArXiv](${paper.arxiv_url})\n\n`;
	return text;
}
