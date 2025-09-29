/**
 * Modern CSS styles for the Research Papers MCP Server landing page
 */

export const getStyles = () => `
  :root {
    --primary: #FFFFFF;
    --primary-dark: #FFFFFF;
    --secondary: #FFFFFF;
    --accent: #FFFFFF;
    --success: #E5E5E5;
    --warning: #E5E5E5;
    --danger: #E5E5E5;
    --dark: #000000;
    --light: #111111;
    --gray: #1A1A1A;
    --white: #FFFFFF;
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.75);
    --text-tertiary: rgba(255, 255, 255, 0.55);
    --surface: #101010;
    --surface-soft: #121212;
    --border-color: rgba(255, 255, 255, 0.12);
    --shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 15px 30px rgba(0, 0, 0, 0.5);
    --gradient: none;
    --gradient-radial: none;
    
    /* Section themes */
    --bg-hero: #000000;
    --bg-dark-section: #000000;
    --bg-light-section: #000000;
    --bg-footer: #000000;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--dark);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }

  /* Navigation Bar */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
    transition: all 0.3s ease;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .nav-logo {
    width: 32px;
    height: 32px;
    color: var(--primary);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  .nav-link:hover::after {
    width: 100%;
  }

  .nav-cta {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .nav-cta:hover {
    background: var(--surface-soft);
    box-shadow: none;
  }

  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .nav-toggle span {
    width: 24px;
    height: 2px;
    background: var(--white);
    transition: all 0.3s ease;
  }

  /* Container */
  .container {
    margin: 0;
    padding: 0;
    padding-top: 6rem; /* Account for fixed navbar */
    position: relative;
    z-index: 1;
  }

  /* Section containers */
  .section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 4rem;
    position: relative;
    background: var(--bg-hero);
    padding: 4rem 0;
  }

  /* Hero content wrapper for proper padding */
  .hero-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  /* Hero Container - Two Column Layout */
  .hero-container {
    display: block;
    margin-bottom: 0.5rem;
  }

  .hero-content {
    width: 100%;
    text-align: left;
  }

  .hero-content h1 {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .hero-content .subtitle {
    text-align: left;
    margin: 0 0 2rem 0;
    max-width: none;
  }

  /* Status Badges */
  .status-badges {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
    flex-wrap: wrap;
  }

  .hero-content .status-badges {
    justify-content: flex-start;
    gap: 1.5rem;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .status-badge .icon {
    width: 16px;
    height: 16px;
    color: var(--primary);
  }

  /* Gradient Text */
  .gradient-text {
    color: var(--text-primary);
  }

  .hero-badge {
    display: inline-block;
    background: var(--surface);
    color: var(--text-secondary);
    padding: 0.375rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
  }

  h1 {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  .subtitle {
    font-size: 1.5rem;
    color: var(--text-secondary);
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto 2rem;
  }

  /* Hero Stats */
  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin: 2rem 0;
  }

  .stat {
    text-align: center;
  }

  .stat strong {
    display: block;
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }

  .stat span {
    font-size: 0.875rem;
    color: var(--text-tertiary);
  }

  /* Hero Actions */
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0 3rem;
  }

  .hero-content .hero-actions {
    justify-content: flex-start;
    margin: 2rem 0;
  }

  .btn-primary {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary:hover {
    background: var(--surface-soft);
    box-shadow: none;
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-secondary:hover {
    background: var(--surface);
    border-color: var(--border-color);
  }

  .btn-secondary .icon {
    width: 20px;
    height: 20px;
  }

  /* Demo Container */
  .demo-container {
    max-width: 800px;
    margin: 3rem auto 0;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
  }

  .demo-header {
    background: rgba(0, 0, 0, 0.6);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .demo-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .demo-title {
    margin-left: auto;
    font-size: 0.875rem;
    color: var(--text-tertiary);
  }

  .demo-code {
    padding: 1.5rem;
    margin: 0;
    overflow-x: auto;
  }

  .demo-code code {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .code-comment {
    color: var(--text-tertiary);
  }

  .code-keyword,
  .code-key,
  .code-string,
  .code-number {
    color: var(--text-secondary);
  }

  /* Sections */
  .section {
    margin-bottom: 3rem;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-subtitle {
    text-align: center;
    color: var(--text-secondary);
    font-size: 1.125rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Features Section */
  .features-section {
    padding: 4rem 0;
    background: var(--bg-dark-section);
    border-radius: 0;
    margin-bottom: 0;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .feature-card {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
    opacity: 1;
  }

  .feature-card:hover {
    background: var(--surface-soft);
    border-color: var(--border-color);
    box-shadow: none;
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: none;
  }

  .feature-icon .icon {
    width: 24px;
    height: 24px;
    color: var(--text-primary);
  }

  .feature-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  .feature-content p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.95rem;
  }
  
  /* Getting Started Section */
  .getting-started-section {
    background: var(--bg-light-section);
    border-radius: 0;
    padding: 4rem;
    margin-bottom: 0;
  }

  .installation-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 3rem;
  }

  .installation-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .installation-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .main-config {
    grid-column: span 2;
  }

  .installation-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .installation-type {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  .installation-type .icon {
    width: 20px;
    height: 20px;
    color: var(--primary);
  }

  .installation-subtitle {
    color: var(--text-tertiary);
    font-size: 0.875rem;
  }

  /* AI Elements Code Block Styles */
  .ai-code-block {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    margin: 1rem 0;
  }

  /* Special styling for the demo block in hero section */
  .ai-code-block.demo-block {
    margin: 2rem auto;
    max-width: 600px;
    background: var(--surface);
    border: 1px solid var(--border-color);
    box-shadow: none;
  }

  .ai-code-block.compact {
    margin: 0.75rem 0;
  }

  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .code-block-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .code-block-language {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .code-block-filename {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .ai-copy-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    font-family: inherit;
  }

  .ai-copy-button:hover {
    background: var(--surface-soft);
    border-color: var(--border-color);
    color: var(--text-primary);
  }

  .ai-copy-button.copied {
    background: var(--surface-soft);
    border-color: var(--border-color);
    color: var(--text-primary);
  }

  .ai-copy-button .copy-icon,
  .ai-copy-button .check-icon {
    transition: all 0.2s ease;
  }

  .code-block-content {
    display: flex;
    position: relative;
  }

  .line-numbers {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    margin-right: 1rem;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    user-select: none;
    min-width: 3rem;
    text-align: right;
  }

  .line-numbers span {
    height: 1.5rem;
    line-height: 1.5rem;
    padding-right: 1rem;
    color: var(--text-tertiary);
    font-size: 0.875rem;
  }

  .ai-code-block .code-pre {
    flex: 1;
    margin: 0;
    padding: 1rem 1rem 1rem 0;
    overflow-x: auto;
    line-height: 1.5;
    font-size: 0.875rem;
  }

  .ai-code-block.compact .code-pre {
    padding: 0.75rem 1rem;
  }

  .ai-code-block.compact .code-block-content {
    display: block;
  }

  .ai-code-block.compact .line-numbers {
    display: none;
  }

  /* Syntax Highlighting Tokens */
  .token.comment {
    color: var(--text-tertiary);
    font-style: italic;
  }

  .token.string,
  .token.property,
  .token.number,
  .token.boolean,
  .token.operator,
  .token.punctuation,
  .token.function,
  .token.keyword,
  .token.builtin,
  .token.parameter {
    color: var(--text-secondary);
    font-weight: normal;
  }

  .dialogue-result {
    margin-top: 1.5rem;
  }

  .dialogue-result .dialogue-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .dialogue-result .dialogue-text {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  /* Contributing Section */
  .contributing-section {
    padding: 4rem 0;
    background: var(--bg-light-section);
    border-radius: 0;
    margin-bottom: 0;
  }

  .contributing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .contributing-card {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
  }

  .contributing-card .icon {
    width: 48px;
    height: 48px;
    color: var(--text-primary);
    margin: 0 auto 1.5rem;
    display: block;
  }

  .contributing-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .contributing-card p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .contribute-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface);
    color: var(--text-primary);
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    border: 1px solid var(--border-color);
    transition: background 0.2s ease, color 0.2s ease;
  }

  .contribute-link:hover {
    background: var(--surface-soft);
  }

  .contribute-link .icon {
    width: 16px;
    height: 16px;
    margin: 0;
  }
  
  .code-block {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .code-header {
    background: rgba(0, 0, 0, 0.6);
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .code-filename {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  }
  
  .copy-button {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  
  .copy-button:hover {
    background: var(--surface-soft);
  }
  
  .copy-button.copied {
    background: var(--surface-soft);
    color: var(--text-primary);
    border-color: var(--border-color);
  }
  
  .code-pre {
    padding: 1.5rem;
    margin: 0;
    overflow-x: auto;
  }
  
  .code-pre code {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--text-primary);
  }


  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  h2 .icon {
    width: 28px;
    height: 28px;
    color: var(--text-primary);
  }

  /* Cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
  }

  /* Endpoint cards */
  .endpoint-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
  }

  .endpoint-icon {
    width: 40px;
    height: 40px;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .endpoint-icon .icon {
    width: 20px;
    height: 20px;
    color: var(--text-primary);
  }

  .endpoint-content {
    flex: 1;
  }

  .endpoint-url {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }

  .endpoint-description {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  /* Tool/Prompt cards */
  .feature-card {
    position: relative;
    padding-left: 3rem;
  }

  .feature-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-icon .icon {
    width: 20px;
    height: 20px;
    color: var(--text-primary);
  }

  .feature-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  }

  .feature-description {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.8;
  }

  .param {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .param-bullet {
    color: var(--text-secondary);
    font-weight: bold;
    flex-shrink: 0;
  }

  .param code {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
  }

  /* Connect section */
  .connect-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .connect-card {
    text-align: center;
    padding: 2rem;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
  }

  .connect-number {
    width: 40px;
    height: 40px;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.25rem;
    margin: 0 auto 1rem;
  }

  /* Footer */
  .footer {
    margin-top: 0;
    padding: 3rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: var(--bg-footer);
  }

  .footer-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  .footer-brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .footer-logo .icon {
    width: 28px;
    height: 28px;
    color: var(--text-primary);
  }

  .footer-text {
    margin-bottom: 2rem;
    color: var(--text-secondary);
  }

  .footer-author {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .footer-author:hover {
    color: var(--text-primary);
  }

  .footer-social {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border-color);
  }

  .social-link:hover {
    color: var(--text-primary);
    background: var(--surface-soft);
    border-color: var(--border-color);
  }

  .social-link .icon {
    width: 18px;
    height: 18px;
  }

  .footer-copyright {
    color: var(--text-tertiary);
    font-size: 0.875rem;
  }

  /* Utilities */
  .icon {
    display: inline-block;
    vertical-align: middle;
  }

  .arrow {
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    
    .subtitle {
      font-size: 1.125rem;
    }
    
    .container {
      padding: 1rem;
      padding-top: 5rem;
    }
    
    /* Mobile Navigation */
    .nav-links {
      position: fixed;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: none;
      flex-direction: column;
      padding: 2rem;
      gap: 1rem;
      transition: none;
      transform: translateY(0);
      opacity: 0;
      pointer-events: none;
    }
    
    .nav-links.nav-open {
      transform: translateY(-100%);
      opacity: 1;
      pointer-events: all;
    }
    
    .nav-toggle {
      display: flex;
    }
    
    .nav-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    /* Mobile Hero Container */
    .hero-container {
      flex-direction: column;
      gap: 2rem;
      text-align: center;
    }

    .hero-content {
      text-align: center;
    }

    .hero-content h1 {
      text-align: center;
    }

    .hero-content .subtitle {
      text-align: center;
      margin: 0 auto 2rem;
      max-width: 600px;
    }

    .hero-content .hero-actions {
      justify-content: center;
    }

    .hero-content .status-badges {
      justify-content: center;
    }

    /* Mobile Hero Actions */
    .hero-actions {
      flex-direction: column;
      width: 100%;
      gap: 1rem;
    }
    
    .btn-primary,
    .btn-secondary {
      width: 100%;
      justify-content: center;
    }

    /* Mobile Status Badges */
    .status-badges {
      gap: 1rem;
    }

    .status-badge {
      font-size: 0.8rem;
    }

    /* Mobile Features Grid */
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .feature-card {
      padding: 1.5rem;
      gap: 1rem;
    }

    /* Mobile Installation Grid */
    .installation-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .getting-started-section {
      padding: 2rem;
    }

    /* Mobile Examples Grid */
    .examples-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    /* Mobile Contributing Grid */
    .contributing-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .contributing-section {
      padding: 2rem 0;
    }

    /* Mobile Footer */
    .footer-brand {
      flex-direction: column;
      gap: 1rem;
    }

    .footer-social {
      gap: 1rem;
    }

    .social-link {
      padding: 0.75rem 1rem;
    }

    /* Mobile Demo Container */
    .demo-container {
      margin: 2rem auto 0;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 2rem;
    }

    .container {
      padding: 0.75rem;
      padding-top: 4.5rem;
    }

    .feature-card {
      flex-direction: column;
      text-align: center;
      padding: 1.25rem;
    }

    .installation-card,
    .installation-option {
      padding: 1.25rem;
    }

    .contributing-card {
      padding: 1.5rem;
    }
  }

  .loading {
    opacity: 1;
  }
`;
