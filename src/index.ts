/**
 * Model Context Protocol (MCP) server for academic paper research - Cloudflare Workers Edition
 *
 * This module wires up the MCP server with its tools, resources, and prompts and exposes
 * Cloudflare Worker handlers for runtime integration.
 */

import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerPrompts } from "./mcp/prompts";
import { registerResources } from "./mcp/resources";
import { registerTools } from "./mcp/tools";
import type { Env } from "./types/domain";
import { FAVICON_SVG } from "./ui/assets";
import { generateLandingPage } from "./ui/landing-page";

// Import the Rpc namespace from cloudflare:workers
declare namespace Rpc {
	const __DURABLE_OBJECT_BRAND: "__DURABLE_OBJECT_BRAND";
}

export class ResearchMCP extends McpAgent {
	// Type brand required for Cloudflare Workers compatibility
	declare [Rpc.__DURABLE_OBJECT_BRAND]: never;

	server = new McpServer({
		name: "search-papers",
		version: "0.1.0",
	});

	async init() {
		registerTools(this.server);
		registerResources(this.server);
		registerPrompts(this.server);
	}
}

// Cloudflare Worker fetch handler
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/") {
			const html = await generateLandingPage(env);
			return new Response(html, {
				headers: {
					"Content-Type": "text/html; charset=utf-8",
				},
			});
		}

		if (url.pathname === "/favicon.ico" || url.pathname === "/favicon.svg") {
			return new Response(FAVICON_SVG, {
				headers: {
					"Content-Type": "image/svg+xml",
					"Cache-Control": "public, max-age=86400",
				},
			});
		}

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			// @ts-ignore - McpAgent types might not be fully compatible
			return ResearchMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore - McpAgent types might not be fully compatible
			return ResearchMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
