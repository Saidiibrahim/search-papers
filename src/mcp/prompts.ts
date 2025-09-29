import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { PromptDefinition } from "../types/domain";

interface PromptRegistration {
	name: string;
	description: string;
	schema: Record<string, z.ZodTypeAny>;
	handler: (params: Record<string, string | undefined>) => {
		messages: Array<{
			role: "user" | "assistant";
			content: { type: "text"; text: string };
		}>;
	};
	doc: PromptDefinition;
}

const PROMPT_REGISTRATIONS: PromptRegistration[] = [
	{
		name: "literature_review",
		description: "Generate a comprehensive literature review on a research topic",
		schema: {
			topic: z.string().describe("Research topic for the literature review"),
			num_papers: z
				.string()
				.optional()
				.describe("Number of papers to analyze"),
			focus_areas: z
				.string()
				.optional()
				.describe("Specific aspects to focus on"),
		},
		handler: ({
			topic,
			num_papers: numPapers,
			focus_areas: focusAreas,
		}) => {
			const papersToAnalyze = numPapers || "15";
			const focus = focusAreas || "";

			const promptText = `Create a comprehensive literature review on '${topic}' by following these steps:

1. Use the advanced_search tool to find ${papersToAnalyze} recent and relevant papers on '${topic}'
2. For the most cited/important papers, use get_paper_by_id to get full details
3. Analyze the papers and structure your review as follows:

## Literature Review Structure:

### 1. Introduction
- Overview of the research area
- Importance and current relevance
- Scope of this review

### 2. Theoretical Background
- Key concepts and definitions
- Historical development
- Fundamental theories

### 3. Current Research Themes
- Main research directions
- Methodological approaches
- Key findings and breakthroughs

### 4. Research Methods
- Common methodologies used
- Experimental setups
- Evaluation metrics

### 5. Critical Analysis
- Strengths and limitations of current approaches
- Contradictions or debates in the field
- Gaps in current knowledge

### 6. Future Directions
- Emerging trends
- Open research questions
- Potential applications

### 7. Conclusion
- Summary of key insights
- Recommendations for researchers

${focus ? `\nSpecial Focus: ${focus}` : ""}

Please ensure the review is well-structured, cites specific papers, and provides critical insights rather than just summaries.`;

			return {
				messages: [
					{
						role: "user",
						content: { type: "text", text: promptText },
					},
				],
			};
		},
		doc: {
			name: "literature_review",
			description:
				"Generate comprehensive literature reviews with structured analysis.",
			parameters: [
				{ name: "topic", type: "string", description: "Research topic" },
				{ name: "num_papers", type: "string", description: "Papers to analyze" },
				{ name: "focus_areas", type: "string", description: "Specific aspects" },
			],
		},
	},
	{
		name: "research_gaps",
		description: "Identify research gaps and opportunities in a field",
		schema: {
			field: z.string().describe("Research field to analyze"),
			time_period: z
				.string()
				.optional()
				.describe("Years to analyze (default: 2)"),
		},
		handler: ({ field, time_period: timePeriod }) => {
			const years = timePeriod || "2";
			const dateFrom = new Date();
			dateFrom.setFullYear(dateFrom.getFullYear() - parseInt(years));

			const promptText = `Identify research gaps and opportunities in '${field}' by:

1. Use search_by_date_range to get papers from the last ${years} years in '${field}'
2. Use advanced_search with different keyword combinations to map the research landscape
3. Analyze the papers to identify:

## Research Gap Analysis:

### 1. Understudied Areas
- Topics mentioned but not thoroughly investigated
- Theoretical concepts lacking empirical validation
- Applications not yet explored

### 2. Methodological Gaps
- Limitations in current research methods
- Need for new evaluation frameworks
- Missing interdisciplinary approaches

### 3. Technological Limitations
- Technical challenges mentioned in papers
- Scalability issues
- Performance bottlenecks

### 4. Theoretical Gaps
- Incomplete theoretical frameworks
- Unresolved contradictions
- Missing connections between subfields

### 5. Practical Applications
- Disconnect between theory and practice
- Industry needs not addressed by research
- Real-world constraints not considered

### 6. Emerging Opportunities
- New technologies enabling fresh approaches
- Cross-disciplinary opportunities
- Societal needs creating research demands

Provide specific examples from papers and actionable recommendations for researchers entering this field.`;

			return {
				messages: [
					{
						role: "user",
						content: { type: "text", text: promptText },
					},
				],
			};
		},
		doc: {
			name: "research_gaps",
			description: "Identify research gaps and opportunities in a field.",
			parameters: [
				{ name: "field", type: "string", description: "Research field" },
				{ name: "time_period", type: "string", description: "Years to analyze" },
			],
		},
	},
	{
		name: "paper_comparison",
		description:
			"Compare multiple papers across methodology, results, and contributions",
		schema: {
			paper_ids: z
				.string()
				.describe("Comma-separated ArXiv IDs of papers to compare"),
			aspects: z
				.string()
				.optional()
				.describe("Specific aspects to compare"),
		},
		handler: ({ paper_ids: paperIds, aspects }) => {
			const comparisonAspects = aspects ||
				"Methodology, Results, Contributions, Limitations";
			const promptText = `Compare the following papers in detail:

Papers: ${paperIds}

Use the following aspects for comparison: ${comparisonAspects}

For each paper, retrieve details using get_paper_by_id and structure the comparison as follows:

## Paper Comparison Framework

### 1. Summary Table
- Key metadata (title, authors, publication date)
- Primary contributions
- Research domain/subfield

### 2. Methodology Analysis
- Research methods and techniques used
- Datasets or evaluation benchmarks
- Experimental setup and reproducibility

### 3. Results and Findings
- Main results and metrics
- Comparative performance
- Statistical significance and robustness

### 4. Contributions and Impact
- Novelty and innovation
- Theoretical/practical impact
- Citation context

### 5. Strengths and Limitations
- Unique strengths of each paper
- Limitations or open questions
- Quality of evidence and evaluation

### 6. Comparative Insights
- Areas of agreement or disagreement between papers
- Complementary findings
- Which paper excels in which dimension

### 7. Future Directions
- Suggested improvements or follow-up studies
- Emerging questions raised by the comparison
- Opportunities for integrating approaches

Provide a concluding summary that synthesizes the findings and recommends next steps for researchers.`;

			return {
				messages: [
					{
						role: "user",
						content: { type: "text", text: promptText },
					},
				],
			};
		},
		doc: {
			name: "paper_comparison",
			description:
				"Compare multiple papers across methodology, results, and contributions.",
			parameters: [
				{ name: "paper_ids", type: "string", description: "Comma-separated IDs" },
				{ name: "aspects", type: "string", description: "Focus areas" },
			],
		},
	},
	{
		name: "trend_analysis",
		description: "Analyze research trends over time with publication patterns",
		schema: {
			topic: z.string().describe("Research topic to analyze"),
			time_span: z
				.string()
				.optional()
				.describe("Years to cover in the analysis"),
			category: z
				.string()
				.optional()
				.describe("Optional category to focus on"),
		},
		handler: ({ topic, time_span: timeSpan, category }) => {
			const years = timeSpan || "5";
			const categoryFilter = category || "";

			const promptText = `Analyze research trends in '${topic}' over the past ${years} years:

1. Use search_by_date_range with yearly intervals to track publication patterns
2. ${categoryFilter ? `Focus on category ${categoryFilter}` : "Search across relevant categories"}
3. Use advanced_search to identify subtopic evolution

## Trend Analysis Framework:

### 1. Publication Volume Trends
- Papers per year
- Growth rate analysis
- Peak periods and their causes

### 2. Topic Evolution
- How research focus has shifted
- Emerging subtopics
- Declining areas of interest

### 3. Methodological Trends
- Evolution of research methods
- New techniques adopted
- Deprecated approaches

### 4. Author and Institution Analysis
- Key contributors
- Collaborative patterns
- Geographic distribution

### 5. Technology and Tool Adoption
- Popular frameworks/tools
- Datasets commonly used
- Evaluation benchmarks

### 6. Impact and Citations
- Highly influential papers
- Citation patterns
- Cross-disciplinary impact

### 7. Future Projections
- Extrapolate current trends
- Predict emerging areas
- Identify potential breakthroughs

### 8. Visualization Suggestions
- Recommend charts/graphs for trends
- Key metrics to track
- Dashboard design ideas

Provide data-driven insights with specific examples from papers and quantitative analysis where possible.`;

			return {
				messages: [
					{
						role: "user",
						content: { type: "text", text: promptText },
					},
				],
			};
		},
		doc: {
			name: "trend_analysis",
			description: "Analyze research trends over time with publication patterns.",
			parameters: [
				{ name: "topic", type: "string", description: "Topic to analyze" },
				{ name: "time_span", type: "string", description: "Years to cover" },
				{ name: "category", type: "string", description: "Optional category" },
			],
		},
	},
	{
		name: "generate_search_prompt",
		description: "Generate a comprehensive research prompt for paper analysis",
		schema: {
			topic: z.string().describe("The research topic to search for"),
			num_papers: z.string().describe("Number of papers to retrieve"),
		},
		handler: ({ topic, num_papers: numPapers }) => {
			const papers = numPapers || "5";
			const promptText = `Search for ${papers} academic papers about '${topic}' using the search_papers tool, then provide a comprehensive analysis of the research landscape.`;

			return {
				messages: [
					{
						role: "user",
						content: { type: "text", text: promptText },
					},
				],
			};
		},
		doc: {
			name: "generate_search_prompt",
			description: "Legacy prompt generator for the original search_papers workflow.",
			parameters: [
				{ name: "topic", type: "string", description: "The research topic" },
				{ name: "num_papers", type: "string", description: "Number of papers" },
			],
		},
	},
];

export function registerPrompts(server: McpServer) {
	for (const prompt of PROMPT_REGISTRATIONS) {
		server.prompt(prompt.name, prompt.description, prompt.schema, (params) =>
			prompt.handler(params as Record<string, string | undefined>)
		);
	}
}

export const PROMPT_DOCUMENTATION: PromptDefinition[] = PROMPT_REGISTRATIONS.map(
	(prompt) => prompt.doc
);
