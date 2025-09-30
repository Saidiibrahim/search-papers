/**
 * Landing page HTML generation for the Research Papers MCP Server v2.0
 */

import { getStyles } from "./styles";
import { ICONS } from "./assets";
import { TOOL_DOCUMENTATION } from "../mcp/tools";
import { PROMPT_DOCUMENTATION } from "../mcp/prompts";
import { RESOURCE_DOCUMENTATION } from "../mcp/resources";
import type { Env } from "../types/domain";


export async function generateLandingPage(env?: Env): Promise<string> {
	const appVersion = env?.APP_VERSION || "0.1.1";

	const searchToolCount = TOOL_DOCUMENTATION.search.length;
	const analysisToolCount = TOOL_DOCUMENTATION.analysis.length;
	const exportToolCount = TOOL_DOCUMENTATION.export.length;
	const legacyToolCount = TOOL_DOCUMENTATION.legacy.length;
	const promptTemplateCount = PROMPT_DOCUMENTATION.length;
	const resourceCount = RESOURCE_DOCUMENTATION.length;

	// Create dynamic GitHub URLs
	const owner = env?.GITHUB_OWNER || "Saidiibrahim";
	const repo = env?.GITHUB_REPO || "search-papers";
	const githubUrl = `https://github.com/${owner}/${repo}`;
	const githubIssuesUrl = `${githubUrl}/issues`;
	const githubReadmeUrl = `${githubUrl}/blob/main/README.md`;
	const githubDiscussionsUrl = `${githubUrl}/discussions`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Papers</title>
    <meta name="description" content="Advanced Model Context Protocol server for searching and analyzing academic papers from arXiv with AI-powered insights.">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <style>${getStyles()}</style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <svg class="nav-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>Search Papers MCP <span style="color: #10b981; font-weight: 700;">v${appVersion}</span></span>
            </div>
            <div class="nav-links">
                <a href="#features" class="nav-link">Features</a>
                <a href="#tools" class="nav-link">Tools</a>
                <a href="#quickstart" class="nav-link">Quick Start</a>
                <a href="${githubUrl}" target="_blank" class="nav-link">GitHub</a>
                <button class="nav-cta">Get Started</button>
            </div>
            <button class="nav-toggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    
    <div class="container">
        <header class="header">
            <!-- Two-column Hero Container -->
            <div class="hero-content-wrapper">
                <div class="hero-container">
                <!-- Left Column: Content -->
                <div class="hero-content">

                    <h1> Agents 🤝 <span class="gradient-text">arXiv Papers</span></h1>
                    <p class="subtitle">
                        Empower your agents to search, analyse, and explore academic papers from arXiv autonomously.
                    </p>
                    
                    <div class="hero-actions">
                        <button class="btn-primary" onclick="document.getElementById('quickstart').scrollIntoView({behavior: 'smooth'})">
                            ${ICONS.external}
                            <span>Get Started</span>
                        </button>
                        <a href="${githubUrl}" target="_blank" class="btn-secondary">
                            ${ICONS.github}
                            <span>View on GitHub</span>
                        </a>
                    </div>
                    
                    <!-- Status Badges -->
                    <div class="status-badges">
                        <div class="status-badge">
                            ${ICONS.connect}
                            <span>MIT Licensed</span>
                        </div>
                        <div class="status-badge">
                            ${ICONS.star}
                            <span>Open Source</span>
                        </div>
                        <div class="status-badge">
                            ${ICONS.tool}
                            <span>Active Development</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </header>

        <!-- Features Overview -->
        <section id="features" class="section features-section">
            <div class="section-container">
                <div class="section-header">
                    <h2>Powerful Academic Research Integration</h2>
                    <p class="section-subtitle">Everything you need to integrate arXiv research workflows with AI assistants and automation tools.</p>
                </div>
                
                <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        ${ICONS.tool}
                    </div>
                    <div class="feature-content">
                        <h3>Autonomous Research</h3>
                        <p>AI agents can independently search papers, analyze literature, and iterate on research questions without human intervention.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        ${ICONS.endpoint}
                    </div>
                    <div class="feature-content">
                        <h3>Complete Workflow</h3>
                        <p>From paper discovery to bibliography export—manage the entire academic research lifecycle through AI commands.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        ${ICONS.prompt}
                    </div>
                    <div class="feature-content">
                        <h3>Lightning Fast Search</h3>
                        <p>Advanced field-specific queries with real-time arXiv access deliver blazing fast paper discovery for rapid research cycles.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        ${ICONS.connect}
                    </div>
                    <div class="feature-content">
                        <h3>AI Analysis</h3>
                        <p>Generate literature reviews, identify research gaps, and analyze trends with comprehensive AI-powered insights.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        ${ICONS.star}
                    </div>
                    <div class="feature-content">
                        <h3>Citation Networks</h3>
                        <p>Extract citations, track paper versions, and discover related research with automated paper relationship mapping.</p>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        ${ICONS.external}
                    </div>
                    <div class="feature-content">
                        <h3>Multi-Client Support</h3>
                        <p>Works with Cursor, Claude Desktop, VS Code, and any MCP-compatible client for maximum flexibility.</p>
                    </div>
                </div>
            </div>
        </section>

		<section id="tools" class="section">
			<div class="section-container">
				<div class="section-header">
					<h2>MCP Tools &amp; Resources</h2>
					<p class="section-subtitle">Discover the capabilities available to your AI agents, from advanced search to structured prompts and contextual resources.</p>
				</div>

				<div class="capabilities-summary">
					<article class="capability-card">
						<div class="capability-icon">${ICONS.tool}</div>
						<div class="capability-content">
							<h3>Search &amp; Discovery</h3>
							<p>${searchToolCount} focused tools to pinpoint the right papers by keyword, author, category, or publication window without leaving your IDE.</p>
							<ul>
								<li>Stack precise filters for field-specific queries.</li>
								<li>Monitor the newest arXiv releases in your domain.</li>
							</ul>
						</div>
					</article>

					<article class="capability-card">
						<div class="capability-icon">${ICONS.endpoint}</div>
						<div class="capability-content">
							<h3>Analysis &amp; Context</h3>
							<p>${analysisToolCount} deep-dive endpoints plus ${legacyToolCount} quick utility help agents compare versions, surface citations, and map related work instantly.</p>
							<ul>
								<li>Retrieve rich metadata for summaries and QA.</li>
								<li>Trace citations and find adjacent research threads.</li>
							</ul>
						</div>
					</article>

					<article class="capability-card">
						<div class="capability-icon">${ICONS.connect}</div>
						<div class="capability-content">
							<h3>Export &amp; Share</h3>
							<p>${exportToolCount} export paths turn insights into BibTeX or JSON packages that plug straight into your reference managers and downstream automations.</p>
							<ul>
								<li>Create bibliographies on demand for any research sprint.</li>
								<li>Keep citation data consistent across projects.</li>
							</ul>
						</div>
					</article>

					<article class="capability-card">
						<div class="capability-icon">${ICONS.prompt}</div>
						<div class="capability-content">
							<h3>Prompt Templates</h3>
							<p>${promptTemplateCount} ready-made prompts kick-start literature reviews, research gap hunts, comparisons, and trend reports with structured outputs.</p>
							<ul>
								<li>Drop templates into autonomous agent workflows.</li>
								<li>Blend with custom prompts to guide nuanced analysis.</li>
							</ul>
						</div>
					</article>

					<article class="capability-card">
						<div class="capability-icon">${ICONS.arrow}</div>
						<div class="capability-content">
							<h3>Contextual Resources</h3>
							<p>${resourceCount} curated resources seed your agents with reference docs, sample queries, and default scopes so teammates can plug in and get answers fast.</p>
							<ul>
								<li>Link directly to arXiv categories and helper guides.</li>
								<li>Share consistent onboarding notes across teams.</li>
							</ul>
						</div>
					</article>
				</div>
			</div>
		</section>

        <!-- Getting Started Section -->
        <section id="quickstart" class="section getting-started-section">
            <div class="section-container">
                <div class="section-header">
                    <h2>Getting Started</h2>
                    <p class="section-subtitle">No installation required - just configure your MCP client</p>
                </div>
                
                <div class="installation-grid">
                <!-- Configuration Example -->
                <div class="installation-card main-config">
                    <div class="installation-header">
                        <div class="installation-type">
                            ${ICONS.external}
                            <span>Configuration Example</span>
                        </div>
                        <div class="installation-subtitle">Add to your MCP client configuration</div>
                    </div>
                    
				<div class="tabbed-config">
					<div class="config-tabs" role="tablist" aria-label="Client configuration examples">
						<button class="config-tab active" type="button" data-target="config-cursor" aria-selected="true">Cursor</button>
						<button class="config-tab" type="button" data-target="config-claude" aria-selected="false">Claude Code</button>
						<button class="config-tab" type="button" data-target="config-codex" aria-selected="false">Codex</button>
					</div>
					<div class="config-panels">
					<div class="config-panel active" id="config-cursor" role="tabpanel">
						<div class="ai-code-block">
							<div class="code-block-header">
								<div class="code-block-info">
									<a class="cursor-install-link" href="https://cursor.com/install-mcp?name=search-papers&config=eyJjb21tYW5kIjoibnB4IG1jcC1yZW1vdGUgaHR0cHM6Ly9zZWFyY2gtcGFwZXJzLmNvbS9zc2UifQ%3D%3D" target="_blank" rel="noopener noreferrer">
										<img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Install MCP Server" />
									</a>
								</div>
								<button class="ai-copy-button" data-code-id="config-code-cursor">
									<svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
									</svg>
										<svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
											<polyline points="20,6 9,17 4,12"></polyline>
										</svg>
										<span class="copy-text">Copy</span>
									</button>
								</div>
								<div class="code-block-content">
									<div class="line-numbers">
										<span>1</span>
										<span>2</span>
										<span>3</span>
										<span>4</span>
										<span>5</span>
										<span>6</span>
									</div>
									<pre class="code-pre" id="config-code-cursor"><code><span class="token punctuation">{</span>
  <span class="token property">"search-papers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"npx"</span><span class="token punctuation">,</span>
    <span class="token property">"args"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"mcp-remote"</span><span class="token punctuation">,</span> <span class="token string">"https://search-papers.com/sse"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>
								</div>
							</div>
						</div>
					<div class="config-panel" id="config-claude" role="tabpanel">
						<div class="ai-code-block">
							<div class="code-block-header">
								<div class="code-block-info"></div>
								<button class="ai-copy-button" data-code-id="config-command-claude">
									<svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
									</svg>
									<svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
										<polyline points="20,6 9,17 4,12"></polyline>
									</svg>
									<span class="copy-text">Copy</span>
								</button>
							</div>
							<div class="code-block-content">
								<div class="line-numbers">
									<span>1</span>
								</div>
								<pre class="code-pre" id="config-command-claude"><code>claude mcp add --transport sse cloudflare-docs -s project https://search-papers.com/sse</code></pre>
							</div>
						</div>
						<div class="ai-code-block">
							<div class="code-block-header">
								<div class="code-block-info"></div>
								<button class="ai-copy-button" data-code-id="config-code-claude">
									<svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
										</svg>
										<svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
											<polyline points="20,6 9,17 4,12"></polyline>
										</svg>
										<span class="copy-text">Copy</span>
									</button>
								</div>
								<div class="code-block-content">
									<div class="line-numbers">
										<span>1</span>
										<span>2</span>
										<span>3</span>
										<span>4</span>
										<span>5</span>
									</div>
									<pre class="code-pre" id="config-code-claude"><code><span class="token punctuation">{</span>
  <span class="token property">"search-papers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"sse"</span><span class="token punctuation">,</span>
    <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://search-papers.com/sse"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>
								</div>
							</div>
						</div>
							<div class="config-panel" id="config-codex" role="tabpanel">
								<div class="ai-code-block">
									<div class="code-block-header">
										<div class="code-block-info"></div>
										<button class="ai-copy-button" data-code-id="config-code-codex">
											<svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
											<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
										</svg>
										<svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
											<polyline points="20,6 9,17 4,12"></polyline>
										</svg>
										<span class="copy-text">Copy</span>
									</button>
								</div>
									<div class="code-block-content">
										<div class="line-numbers">
											<span>1</span>
											<span>2</span>
											<span>3</span>
										</div>
										<pre class="code-pre" id="config-code-codex"><code>[mcp_servers.search-papers]
command = "npx"
args = ["https://search-papers.com/sse"]</code></pre>
									</div>
							</div>
						</div>
					</div>
				</div>
			</div>
                </div>
            </div>
        </section>

        <!-- Contributing Section -->
        <section id="contributing" class="section contributing-section">
            <div class="section-container">
                <div class="section-header">
                    <h2>Help Improve Research Papers MCP</h2>
                    <p class="section-subtitle">Contribute to make this tool even better</p>
                </div>
                
                <div class="contributing-grid">
                <div class="contributing-card">
                    ${ICONS.github}
                    <h3>Contribute Code</h3>
                    <p>Submit pull requests, fix bugs, or add new features to enhance the research capabilities</p>
                    <a href="${githubIssuesUrl}" target="_blank" class="contribute-link">
                        ${ICONS.external}
                        <span>View Issues</span>
                    </a>
                </div>
                
                <div class="contributing-card">
                    ${ICONS.star}
                    <h3>Contributing Guide</h3>
                    <p>Learn how to set up your development environment and contribute to the project</p>
                    <a href="${githubReadmeUrl}" target="_blank" class="contribute-link">
                        ${ICONS.external}
                        <span>Read Guide</span>
                    </a>
                </div>
                
                <div class="contributing-card">
                    ${ICONS.tool}
                    <h3>Feature Requests</h3>
                    <p>Have ideas for new tools or improvements? We'd love to hear your suggestions</p>
                    <a href="${githubDiscussionsUrl}" target="_blank" class="contribute-link">
                        ${ICONS.external}
                        <span>Start Discussion</span>
                    </a>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="footer-content">
				<div class="footer-brand">
					<div class="footer-logo">
						${ICONS.prompt}
						<span>Research Papers MCP</span>
					</div>
				</div>
                
                <div class="footer-text">
                    <p>Made with ❤️ and AI by <a href="https://github.com/Saidiibrahim" target="_blank" class="footer-author">Ibrahim Saidi (@Saidiibrahim)</a></p>
                </div>
                
                <div class="footer-social">
                    <a href="${githubUrl}" target="_blank" class="social-link">
                        ${ICONS.github}
                        <span>GitHub</span>
                    </a>
                    <a href="https://modelcontextprotocol.io" target="_blank" class="social-link">
                        ${ICONS.connect}
                        <span>MCP</span>
                    </a>
                    <a href="https://arxiv.org" target="_blank" class="social-link">
                        ${ICONS.external}
                        <span>arXiv</span>
                    </a>
                </div>
                
                <div class="footer-copyright">
                    <p>© 2025 MIT License</p>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        // Enhanced copy code functionality for ai-elements style buttons
        function copyCode(elementId) {
            let textToCopy = '';
            
            // Handle different code element types
            if (elementId) {
                const element = document.getElementById(elementId);
                textToCopy = element ? element.textContent : '';
            } else {
                // Find the code element in the same container as the button
                const button = event.target.closest('.copy-button, .ai-copy-button');
			const codeContainer = button.closest('.code-block, .ai-code-block, .installation-card');
			const codeElement = codeContainer.querySelector('pre code');
                textToCopy = codeElement ? codeElement.textContent : '';
            }
            
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                    // Find the button (could be the clicked element or its parent)
                    const button = event.target.closest('.copy-button, .ai-copy-button') || event.target;
                    
                    if (button.classList.contains('ai-copy-button')) {
                        // Handle ai-elements style button
                        const copyIcon = button.querySelector('.copy-icon');
                        const checkIcon = button.querySelector('.check-icon');
                        const copyText = button.querySelector('.copy-text');
                        
                        // Toggle icons
                        if (copyIcon) copyIcon.style.display = 'none';
                        if (checkIcon) checkIcon.style.display = 'block';
                        if (copyText) copyText.textContent = 'Copied!';
                        
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            if (copyIcon) copyIcon.style.display = 'block';
                            if (checkIcon) checkIcon.style.display = 'none';
                            if (copyText) copyText.textContent = 'Copy';
                            button.classList.remove('copied');
                        }, 2000);
                    } else {
                        // Handle regular copy button
                        const originalContent = button.innerHTML;
                        button.innerHTML = '✓ Copied!';
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            button.innerHTML = originalContent;
                            button.classList.remove('copied');
                        }, 2000);
                    }
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        }

        // Handle ai-copy-button clicks
        function handleAiCopyButton(event) {
            const button = event.currentTarget;
            const codeId = button.getAttribute('data-code-id');
            
            if (codeId) {
                const codeElement = document.getElementById(codeId);
                if (codeElement) {
                    const textToCopy = codeElement.textContent;
                    
                    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                        const copyIcon = button.querySelector('.copy-icon');
                        const checkIcon = button.querySelector('.check-icon');
                        const copyText = button.querySelector('.copy-text');
                        
                        // Toggle icons
                        if (copyIcon) copyIcon.style.display = 'none';
                        if (checkIcon) checkIcon.style.display = 'block';
                        if (copyText) copyText.textContent = 'Copied!';
                        
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            if (copyIcon) copyIcon.style.display = 'block';
                            if (checkIcon) checkIcon.style.display = 'none';
                            if (copyText) copyText.textContent = 'Copy';
                            button.classList.remove('copied');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy:', err);
                    });
                }
            }
        }
        
        // Mobile menu toggle
        document.addEventListener('DOMContentLoaded', function() {
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', function() {
                    navLinks.classList.toggle('nav-open');
                    navToggle.classList.toggle('active');
                });
            }

            // Add click handlers for copy buttons without specific IDs
            document.querySelectorAll('.copy-button').forEach(button => {
                if (!button.getAttribute('onclick')) {
                    button.addEventListener('click', copyCode);
                }
            });

            // Add click handlers for ai-copy-button elements
            document.querySelectorAll('.ai-copy-button').forEach(button => {
                button.addEventListener('click', handleAiCopyButton);
            });

            // Toggle client configuration tabs
            document.querySelectorAll('.tabbed-config').forEach(container => {
                const tabs = Array.from(container.querySelectorAll('.config-tab'));
                const panels = Array.from(container.querySelectorAll('.config-panel'));

                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        const targetId = tab.getAttribute('data-target');

                        tabs.forEach(btn => {
                            const isActive = btn === tab;
                            btn.classList.toggle('active', isActive);
                            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                        });

                        panels.forEach(panel => {
                            const shouldShow = panel.id === targetId;
                            panel.classList.toggle('active', shouldShow);
                        });
                    });
                });
            });

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add entrance animations on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all sections for scroll animations
            document.querySelectorAll('.section').forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(section);
            });
        });
    </script>
    
	<style>
		.tabbed-config {
			margin-top: 1.5rem;
		}

        .config-tabs {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.75rem;
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .config-tab {
            border: none;
            background: transparent;
            color: #cbd5f5;
            font-weight: 600;
            padding: 0.4rem 0.9rem;
            border-radius: 0.6rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .config-tab:hover {
            color: #f8fafc;
            background: rgba(148, 163, 184, 0.15);
        }

        .config-tab.active {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(16, 185, 129, 0.8));
            color: #fff;
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }

        .config-panels {
            margin-top: 1rem;
        }

		.config-panel {
			display: none;
		}

		.config-panel.active {
			display: block;
		}

		.capabilities-summary {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
			gap: 1.75rem;
			margin-top: 3rem;
		}

		.capability-card {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1.75rem;
			background: var(--surface);
			border: 1px solid var(--border-color);
			border-radius: 1.25rem;
		}

		.capability-card:hover {
			background: var(--surface-soft);
		}

		.capability-icon {
			width: 42px;
			height: 42px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 0.9rem;
			background: var(--surface);
			border: 1px solid var(--border-color);
			color: var(--text-primary);
		}

		.capability-icon svg {
			width: 22px;
			height: 22px;
		}

		.capability-content h3 {
			font-size: 1.2rem;
			font-weight: 600;
			margin-bottom: 0.4rem;
			color: var(--text-primary);
		}

		.capability-content p {
			color: var(--text-secondary);
			font-size: 0.95rem;
			line-height: 1.6;
		}

		.capability-content ul {
			margin: 0.75rem 0 0;
			padding-left: 1.25rem;
			color: var(--text-secondary);
			font-size: 0.9rem;
			line-height: 1.5;
		}

		.capability-content li {
			margin-bottom: 0.35rem;
		}
	</style>
</body>
</html>`;
}
