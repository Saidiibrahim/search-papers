import { defineConfig } from "vitest/config";
import baseConfig from "./vitest.config";

export default defineConfig({
	...baseConfig,
	test: {
		...baseConfig.test,
		include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"],
		exclude: ["tests/integration/**/*", "tests/e2e/**/*"],
		testTimeout: 5000, // Shorter timeout for unit tests
	},
});
