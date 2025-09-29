import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { arxivHandlers } from "./mocks/arxiv-api";

// Setup MSW server for API mocking
export const server = setupServer(...arxivHandlers);

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
	server.close();
});

beforeEach(() => {
	server.resetHandlers();
});

afterEach(() => {
	// Clean up any test state
});

// Global test utilities
declare global {
	var testUtils: {
		createMockEnv: () => any;
		createMockCloudflareContext: () => any;
	};
}

global.testUtils = {
	createMockEnv: () => ({
		GITHUB_OWNER: "testowner",
		GITHUB_REPO: "testrepo",
		APP_VERSION: "2.0.0",
	}),

	createMockCloudflareContext: () => ({
		env: global.testUtils.createMockEnv(),
		ctx: {
			waitUntil: (promise: Promise<any>) => promise,
			passThroughOnException: () => {},
		},
		request: new Request("http://localhost/test"),
	}),
};
