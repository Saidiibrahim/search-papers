import { defineConfig } from "vitest/config";
import baseConfig from "./vitest.config";

export default defineConfig({
	...baseConfig,
	test: {
		...baseConfig.test,
		include: ["tests/integration/**/*.test.ts"],
		testTimeout: 30000, // Longer timeout for integration tests
		hookTimeout: 30000, // Longer timeout for setup/teardown hooks
	},
});
