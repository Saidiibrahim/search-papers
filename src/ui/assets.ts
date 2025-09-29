/**
 * SVG assets, icons, and images for the Research Papers MCP Server
 */

// Research Papers MCP SVG Banner
export const RESEARCH_BANNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" class="hero-banner-svg">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bannerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="bannerGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="bannerGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
    </linearGradient>
    
    <!-- Filters -->
    <filter id="bannerGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="bannerShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background circles -->
  <circle cx="120" cy="100" r="60" fill="url(#bannerGrad1)" opacity="0.1" class="float-1"/>
  <circle cx="480" cy="320" r="80" fill="url(#bannerGrad2)" opacity="0.08" class="float-2"/>
  <circle cx="550" cy="80" r="40" fill="url(#bannerGrad3)" opacity="0.12" class="float-3"/>
  
  <!-- Academic Papers Stack -->
  <g transform="translate(80, 120)" filter="url(#bannerShadow)">
    <!-- Paper 3 (back) -->
    <rect x="8" y="8" width="120" height="140" rx="8" fill="#1E293B" opacity="0.6"/>
    <rect x="8" y="8" width="120" height="140" rx="8" fill="none" stroke="url(#bannerGrad1)" stroke-width="1" opacity="0.8"/>
    
    <!-- Paper 2 (middle) -->
    <rect x="4" y="4" width="120" height="140" rx="8" fill="#334155" opacity="0.8"/>
    <rect x="4" y="4" width="120" height="140" rx="8" fill="none" stroke="url(#bannerGrad2)" stroke-width="1" opacity="0.9"/>
    
    <!-- Paper 1 (front) -->
    <rect x="0" y="0" width="120" height="140" rx="8" fill="#475569"/>
    <rect x="0" y="0" width="120" height="140" rx="8" fill="none" stroke="url(#bannerGrad1)" stroke-width="2"/>
    
    <!-- Folded corner -->
    <path d="M100 0 L120 0 L120 20 Z" fill="#334155"/>
    <path d="M100 0 L100 20 L120 20" fill="none" stroke="url(#bannerGrad1)" stroke-width="1" opacity="0.6"/>
    
    <!-- Text lines on paper -->
    <rect x="15" y="25" width="80" height="2" rx="1" fill="url(#bannerGrad1)" opacity="0.7" class="text-line"/>
    <rect x="15" y="35" width="60" height="2" rx="1" fill="url(#bannerGrad2)" opacity="0.6" class="text-line"/>
    <rect x="15" y="45" width="75" height="2" rx="1" fill="url(#bannerGrad1)" opacity="0.7" class="text-line"/>
    <rect x="15" y="55" width="50" height="2" rx="1" fill="url(#bannerGrad3)" opacity="0.6" class="text-line"/>
  </g>
  
  <!-- Search/Magnifying Glass -->
  <g transform="translate(260, 80)" filter="url(#bannerGlow)">
    <circle cx="0" cy="0" r="25" fill="none" stroke="url(#bannerGrad2)" stroke-width="4" class="search-ring"/>
    <path d="20 20 L35 35" stroke="url(#bannerGrad2)" stroke-width="6" stroke-linecap="round" class="search-handle"/>
    
    <!-- Search beam -->
    <path d="M0 0 L50 -30" stroke="url(#bannerGrad2)" stroke-width="2" opacity="0.4" class="search-beam"/>
    <path d="M0 0 L55 -10" stroke="url(#bannerGrad2)" stroke-width="1" opacity="0.3" class="search-beam"/>
    <path d="M0 0 L45 -50" stroke="url(#bannerGrad2)" stroke-width="1" opacity="0.3" class="search-beam"/>
  </g>
  
  <!-- Neural Network Connections -->
  <g transform="translate(350, 150)" opacity="0.8">
    <!-- Connection nodes -->
    <circle cx="0" cy="0" r="8" fill="url(#bannerGrad1)" class="node pulse-1"/>
    <circle cx="60" cy="-30" r="6" fill="url(#bannerGrad2)" class="node pulse-2"/>
    <circle cx="80" cy="20" r="6" fill="url(#bannerGrad3)" class="node pulse-3"/>
    <circle cx="120" cy="-10" r="8" fill="url(#bannerGrad1)" class="node pulse-1"/>
    <circle cx="40" cy="40" r="5" fill="url(#bannerGrad2)" class="node pulse-2"/>
    
    <!-- Connection lines -->
    <path d="M0 0 L60 -30" stroke="url(#bannerGrad1)" stroke-width="2" opacity="0.6" class="connection"/>
    <path d="M0 0 L80 20" stroke="url(#bannerGrad2)" stroke-width="2" opacity="0.6" class="connection"/>
    <path d="M60 -30 L120 -10" stroke="url(#bannerGrad1)" stroke-width="2" opacity="0.6" class="connection"/>
    <path d="M80 20 L120 -10" stroke="url(#bannerGrad3)" stroke-width="2" opacity="0.6" class="connection"/>
    <path d="M0 0 L40 40" stroke="url(#bannerGrad2)" stroke-width="2" opacity="0.6" class="connection"/>
    <path d="M40 40 L80 20" stroke="url(#bannerGrad1)" stroke-width="2" opacity="0.6" class="connection"/>
  </g>
  
  <!-- MCP Symbol -->
  <g transform="translate(480, 200)" filter="url(#bannerGlow)">
    <rect x="-15" y="-8" width="30" height="16" rx="8" fill="url(#bannerGrad1)" class="mcp-badge"/>
    <text x="0" y="2" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="white">MCP</text>
  </g>
  
  <!-- AI Brain/Processor -->
  <g transform="translate(500, 100)" opacity="0.7">
    <rect x="-20" y="-15" width="40" height="30" rx="6" fill="url(#bannerGrad1)" opacity="0.3"/>
    <rect x="-15" y="-10" width="30" height="20" rx="4" fill="url(#bannerGrad2)" opacity="0.5"/>
    <rect x="-10" y="-5" width="20" height="10" rx="2" fill="url(#bannerGrad3)"/>
    
    <!-- Processing lines -->
    <rect x="-8" y="-2" width="16" height="1" fill="white" opacity="0.8" class="process-line"/>
    <rect x="-6" y="0" width="12" height="1" fill="white" opacity="0.6" class="process-line"/>
    <rect x="-4" y="2" width="8" height="1" fill="white" opacity="0.4" class="process-line"/>
  </g>
</svg>`;

// Banner image path (fallback)
export const BANNER_IMAGE_PATH = "https://i.imgur.com/your-image-id.png"; // Replace with your image URL

// Enhanced favicon with gradient and modern design
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="100" height="100" fill="url(#bgGrad)" rx="20"/>
  <g filter="url(#shadow)">
    <path d="M25 20 L25 75 L70 75 L70 30 L60 20 Z" fill="white" opacity="0.95"/>
    <path d="M60 20 L60 30 L70 30 Z" fill="white" opacity="0.7"/>
    <rect x="35" y="35" width="25" height="2" fill="#6366F1" rx="1"/>
    <rect x="35" y="42" width="20" height="2" fill="#8B5CF6" rx="1"/>
    <rect x="35" y="49" width="23" height="2" fill="#6366F1" rx="1"/>
    <rect x="35" y="56" width="18" height="2" fill="#8B5CF6" rx="1"/>
  </g>
</svg>`;

// Animated background SVG pattern
export const BACKGROUND_PATTERN = `
  <svg class="bg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800">
    <g class="floating-shapes">
      <circle cx="200" cy="150" r="80" fill="url(#grad1)" opacity="0.3"/>
      <circle cx="1200" cy="300" r="120" fill="url(#grad2)" opacity="0.2"/>
      <rect x="800" y="500" width="150" height="150" rx="20" fill="url(#grad3)" opacity="0.25" transform="rotate(45 875 575)"/>
      <path d="M100,600 Q300,500 500,600 T900,600" stroke="url(#grad4)" stroke-width="3" fill="none" opacity="0.3"/>
    </g>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#EF4444;stop-opacity:1" />
      </linearGradient>
    </defs>
  </svg>
`;

// Icon components
export const ICONS = {
	endpoint: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>`,

	tool: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>`,

	prompt: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
    <path d="M9 11l3 3 5-5"/>
  </svg>`,

	connect: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>`,

	arrow: `<svg class="icon arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`,

	github: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>`,

	star: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`,

	fork: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="18" r="3"/>
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="6" r="3"/>
    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
    <path d="M12 12v3"/>
  </svg>`,

	external: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`,
};
