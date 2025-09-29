import { http, HttpResponse } from "msw";

// Sample ArXiv XML responses for testing
export const sampleArxivXML = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:arxiv="http://arxiv.org/schemas/atom">
  <entry>
    <id>http://arxiv.org/abs/2401.12345v1</id>
    <title>Sample AI Paper Title</title>
    <summary>This is a sample abstract for testing purposes. It demonstrates machine learning techniques applied to natural language processing tasks.</summary>
    <published>2024-01-15T00:00:00Z</published>
    <updated>2024-01-15T00:00:00Z</updated>
    <author>
      <name>John Doe</name>
      <affiliation>University of AI</affiliation>
    </author>
    <author>
      <name>Jane Smith</name>
      <affiliation>Tech Institute</affiliation>
    </author>
    <link href="http://arxiv.org/abs/2401.12345v1" rel="alternate" type="text/html"/>
    <link href="http://arxiv.org/pdf/2401.12345v1.pdf" rel="related" type="application/pdf"/>
    <category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
    <arxiv:primary_category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
    <arxiv:comment>10 pages, 5 figures</arxiv:comment>
  </entry>
</feed>`;

export const multipleArxivXML = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:arxiv="http://arxiv.org/schemas/atom">
  <entry>
    <id>http://arxiv.org/abs/2401.12345v1</id>
    <title>Machine Learning in Natural Language Processing</title>
    <summary>A comprehensive survey of machine learning techniques in NLP.</summary>
    <published>2024-01-15T00:00:00Z</published>
    <updated>2024-01-15T00:00:00Z</updated>
    <author>
      <name>Alice Johnson</name>
    </author>
    <link href="http://arxiv.org/abs/2401.12345v1" rel="alternate" type="text/html"/>
    <link href="http://arxiv.org/pdf/2401.12345v1.pdf" rel="related" type="application/pdf"/>
    <category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
    <arxiv:primary_category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
  </entry>
  <entry>
    <id>http://arxiv.org/abs/2401.67890v1</id>
    <title>Deep Learning Architectures for Computer Vision</title>
    <summary>Latest advances in deep learning for computer vision applications.</summary>
    <published>2024-01-16T00:00:00Z</published>
    <updated>2024-01-16T00:00:00Z</updated>
    <author>
      <name>Bob Wilson</name>
    </author>
    <link href="http://arxiv.org/abs/2401.67890v1" rel="alternate" type="text/html"/>
    <link href="http://arxiv.org/pdf/2401.67890v1.pdf" rel="related" type="application/pdf"/>
    <category term="cs.CV" scheme="http://arxiv.org/schemas/atom"/>
    <arxiv:primary_category term="cs.CV" scheme="http://arxiv.org/schemas/atom"/>
  </entry>
</feed>`;

export const emptyArxivXML = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">
  <opensearch:totalResults>0</opensearch:totalResults>
  <opensearch:startIndex>0</opensearch:startIndex>
  <opensearch:itemsPerPage>0</opensearch:itemsPerPage>
</feed>`;

export const arxivHandlers = [
	// Mock successful search with machine learning query
	http.get("http://export.arxiv.org/api/query", ({ request }) => {
		const url = new URL(request.url);
		const searchQuery = url.searchParams.get("search_query");
		const idList = url.searchParams.get("id_list");
		const _maxResults = url.searchParams.get("max_results");

		// Handle ID-based queries (getPaperById)
		if (idList) {
			// Handle error cases for ID queries
			if (idList.includes("error")) {
				return new HttpResponse(null, {
					status: 500,
					statusText: "Internal Server Error",
				});
			}

			// Handle non-existent paper IDs
			if (idList.includes("nonexistent")) {
				return HttpResponse.xml(emptyArxivXML, {
					headers: {
						"Content-Type": "application/atom+xml; charset=utf-8",
					},
				});
			}

			// Return single paper for valid ID
			return HttpResponse.xml(sampleArxivXML, {
				headers: {
					"Content-Type": "application/atom+xml; charset=utf-8",
				},
			});
		}

		// Return empty results for non-existent topics
		if (
			searchQuery?.includes("nonexistent") ||
			searchQuery?.includes("xyz123")
		) {
			return HttpResponse.xml(emptyArxivXML, {
				headers: {
					"Content-Type": "application/atom+xml; charset=utf-8",
				},
			});
		}

		// Return multiple results for broad searches
		if (
			searchQuery?.includes("machine learning") ||
			searchQuery?.includes("all:*")
		) {
			return HttpResponse.xml(multipleArxivXML, {
				headers: {
					"Content-Type": "application/atom+xml; charset=utf-8",
				},
			});
		}

		// Simulate API error for error test cases
		if (searchQuery?.includes("error") || searchQuery?.includes("fail")) {
			return new HttpResponse(null, {
				status: 500,
				statusText: "Internal Server Error",
			});
		}

		// Simulate timeout for timeout test cases
		if (searchQuery?.includes("timeout")) {
			return new HttpResponse(null, {
				status: 408,
				statusText: "Request Timeout",
			});
		}

		// Default response for other queries
		return HttpResponse.xml(sampleArxivXML, {
			headers: {
				"Content-Type": "application/atom+xml; charset=utf-8",
			},
		});
	}),

	// Mock rate limiting scenarios
	http.get("http://export.arxiv.org/api/query", ({ request }) => {
		const url = new URL(request.url);
		if (url.searchParams.get("search_query")?.includes("ratelimit")) {
			return new HttpResponse(null, {
				status: 429,
				statusText: "Too Many Requests",
				headers: {
					"Retry-After": "60",
				},
			});
		}
	}),
];
