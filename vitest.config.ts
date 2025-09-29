import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
			exclude: [
				"node_modules/",
				"dist/",
				".wrangler/",
				"coverage/",
				"**/*.test.ts",
				"**/*.spec.ts",
				"tests/",
				"src/ui/", // UI components might need different testing approach
			],
		},
		setupFiles: ["./tests/setup.ts"],
		testTimeout: 10000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@tests": path.resolve(__dirname, "./tests"),
		},
	},
	// Enable JSON module imports
	json: {
		stringify: false,
	},
});
