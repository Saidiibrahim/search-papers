/**
 * Mock MCP client for testing server interactions
 */


/**
 * Mock MCP tool request
 */
export interface MockToolRequest {
	method: "tools/call";
	params: {
		name: string;
		arguments?: Record<string, any>;
	};
}

/**
 * Mock MCP tool response
 */
export interface MockToolResponse {
	content: Array<{
		type: "text" | "image";
		text?: string;
		data?: string;
		mimeType?: string;
	}>;
	isError?: boolean;
}

/**
 * Mock MCP resource request
 */
export interface MockResourceRequest {
	method: "resources/read";
	params: {
		uri: string;
	};
}

/**
 * Mock MCP prompt request
 */
export interface MockPromptRequest {
	method: "prompts/get";
	params: {
		name: string;
		arguments?: Record<string, any>;
	};
}

/**
 * Mock MCP client that simulates interactions with the server
 */
export class MockMCPClient {
	private mockResponses: Map<string, any> = new Map();
	private callHistory: Array<{ method: string; params: any; timestamp: Date }> =
		[];

	constructor() {
		this.setupDefaultMocks();
	}

	/**
	 * Set up default mock responses
	 */
	private setupDefaultMocks() {
		// Default tool responses
		this.setMockResponse("tools/call:advanced_search", {
			content: [
				{
					type: "text",
					text: "Found 5 papers:\n\n## 1. Sample Paper Title\n**Authors**: John Doe, Jane Smith\n**Published**: 2024-01-15\n**Abstract**: This is a sample abstract...",
				},
			],
		});

		this.setMockResponse("tools/call:search_by_author", {
			content: [
				{
					type: "text",
					text: "## Author: Geoffrey Hinton\n**Total Papers Found**: 10\n\n### Recent Papers:\n1. Deep Learning Advances...",
				},
			],
		});

		this.setMockResponse("tools/call:get_paper_by_id", {
			content: [
				{
					type: "text",
					text: "# Sample AI Paper Title\n\n**Authors**: John Doe, Jane Smith\n**Published**: 2024-01-15\n**Categories**: cs.AI\n\n**Abstract**: This is a sample abstract for testing purposes.",
				},
			],
		});

		this.setMockResponse("tools/call:export_bibliography", {
			content: [
				{
					type: "text",
					text: "@article{Doe2024,\n  title={Sample Paper},\n  author={John Doe and Jane Smith},\n  year={2024}\n}",
				},
			],
		});

		// Default resource responses
		this.setMockResponse("resources/read:categories", {
			contents: [
				{
					uri: "categories",
					mimeType: "application/json",
					text: JSON.stringify({
						"cs.AI": "Artificial Intelligence",
						"cs.CV": "Computer Vision",
						"cs.LG": "Machine Learning",
					}),
				},
			],
		});

		// Default prompt responses
		this.setMockResponse("prompts/get:literature_review", {
			description: "Generate a comprehensive literature review",
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: "Based on the 10 papers about transformer architectures, create a literature review...",
					},
				},
			],
		});
	}

	/**
	 * Mock tool call
	 */
	async callTool(
		name: string,
		params?: Record<string, any>
	): Promise<MockToolResponse> {
		const key = `tools/call:${name}`;
		this.recordCall("tools/call", { name, arguments: params });

		const mockResponse = this.mockResponses.get(key);
		if (mockResponse) {
			return mockResponse;
		}

		// Default error response for unmocked tools
		return {
			content: [
				{
					type: "text",
					text: `Mock response for tool: ${name}`,
				},
			],
			isError: false,
		};
	}

	/**
	 * Mock resource read
	 */
	async readResource(uri: string): Promise<any> {
		const key = `resources/read:${uri}`;
		this.recordCall("resources/read", { uri });

		const mockResponse = this.mockResponses.get(key);
		if (mockResponse) {
			return mockResponse;
		}

		// Default response for unmocked resources
		return {
			contents: [
				{
					uri,
					mimeType: "text/plain",
					text: `Mock resource content for: ${uri}`,
				},
			],
		};
	}

	/**
	 * Mock prompt call
	 */
	async getPrompt(name: string, params?: Record<string, any>): Promise<any> {
		const key = `prompts/get:${name}`;
		this.recordCall("prompts/get", { name, arguments: params });

		// Handle specific prompts dynamically
		if (name === "literature_review" && params) {
			const topic = params.topic || "research topic";
			const numPapers = params.num_papers || "10";
			const focusAreas = params.focus_areas || "";

			return {
				description: "Generate a comprehensive literature review",
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: `Based on the ${numPapers} papers about ${topic}, create a literature review${focusAreas ? ` focusing on ${focusAreas}` : ""}.`,
						},
					},
				],
			};
		}

		const mockResponse = this.mockResponses.get(key);
		if (mockResponse) {
			return mockResponse;
		}

		// Default response for unmocked prompts
		return {
			description: `Mock prompt: ${name}`,
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `Mock prompt content for: ${name}`,
					},
				},
			],
		};
	}

	/**
	 * Set mock response for a specific method/name combination
	 */
	setMockResponse(key: string, response: any): void {
		this.mockResponses.set(key, response);
	}

	/**
	 * Get call history for testing
	 */
	getCallHistory(): Array<{ method: string; params: any; timestamp: Date }> {
		return [...this.callHistory];
	}

	/**
	 * Clear call history
	 */
	clearCallHistory(): void {
		this.callHistory = [];
	}

	/**
	 * Record method calls for verification in tests
	 */
	private recordCall(method: string, params: any): void {
		this.callHistory.push({
			method,
			params,
			timestamp: new Date(),
		});
	}

	/**
	 * Helper to verify that a specific tool was called
	 */
	wasToolCalled(toolName: string): boolean {
		return this.callHistory.some(
			(call) => call.method === "tools/call" && call.params.name === toolName
		);
	}

	/**
	 * Helper to verify that a specific resource was accessed
	 */
	wasResourceAccessed(uri: string): boolean {
		return this.callHistory.some(
			(call) => call.method === "resources/read" && call.params.uri === uri
		);
	}

	/**
	 * Helper to verify that a specific prompt was called
	 */
	wasPromptCalled(promptName: string): boolean {
		return this.callHistory.some(
			(call) => call.method === "prompts/get" && call.params.name === promptName
		);
	}
}

/**
 * Factory function to create a mock MCP client
 */
export function createMockMCPClient(): MockMCPClient {
	return new MockMCPClient();
}
