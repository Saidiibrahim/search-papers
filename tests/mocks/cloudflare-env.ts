/**
 * Cloudflare Workers environment mocks for testing
 */

import { vi } from "vitest";

/**
 * Mock Cloudflare Durable Object
 */
export class MockDurableObject {
	state: any;

	constructor() {
		this.state = {
			blockConcurrencyWhile: vi.fn(),
			waitUntil: vi.fn(),
			id: {
				toString: () => "mock-durable-object-id",
				equals: () => true,
				name: "mock-do",
			},
			storage: {
				get: vi.fn(),
				put: vi.fn(),
				delete: vi.fn(),
				list: vi.fn(),
				deleteAll: vi.fn(),
				sync: vi.fn(),
				transaction: vi.fn(),
			},
		};
	}

	// Mock the MCP server methods that would be called
	async fetch(_request: Request): Promise<Response> {
		return new Response("Mock Durable Object Response", { status: 200 });
	}
}

/**
 * Mock Cloudflare Workers environment
 */
export function createMockEnv(): any {
	return {
		// Environment variables
		GITHUB_OWNER: "testowner",
		GITHUB_REPO: "testrepo",
		APP_VERSION: "2.0.0",

		// Durable Object bindings
		MCP_OBJECT: {
			get: (_id: any) => new MockDurableObject(),
			idFromName: (name: string) => ({ toString: () => `id-${name}` }),
			idFromString: (id: string) => ({ toString: () => id }),
			newUniqueId: () => ({ toString: () => "unique-id" }),
		},

		// KV namespace (if needed in future)
		RESEARCH_KV: {
			get: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			list: vi.fn(),
		},

		// R2 bucket (if needed in future)
		RESEARCH_R2: {
			get: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			list: vi.fn(),
			head: vi.fn(),
		},
	};
}

/**
 * Mock Cloudflare Workers execution context
 */
export function createMockExecutionContext(): ExecutionContext {
	return {
		waitUntil: vi.fn(),
		passThroughOnException: vi.fn(),
		props: {}, // Add the missing props property
	};
}

/**
 * Mock Cloudflare Workers request context
 */
export function createMockCloudflareContext() {
	return {
		env: createMockEnv(),
		ctx: createMockExecutionContext(),
		request: new Request("http://localhost/test", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "test-agent",
			},
		}),
	};
}

/**
 * Mock fetch function for testing external API calls
 */
export function createMockFetch() {
	return vi.fn().mockImplementation(async (_url: string, _options?: any) => {
		// This can be used to mock specific API endpoints if needed
		// For now, we rely on MSW for HTTP mocking
		return new Response("Mock response", { status: 200 });
	});
}
