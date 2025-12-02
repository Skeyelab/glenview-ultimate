import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Configure marked with optimal settings for news content.
 * Uses GitHub Flavored Markdown (GFM) by default for modern markdown features.
 * Configuration is applied lazily to avoid issues in test environments.
 */
let configured = false;
function configureMarked(): void {
  if (configured) return;
  if (typeof marked.setOptions === "function") {
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown (enabled by default, but explicit for clarity)
      breaks: false, // Don't convert single line breaks to <br>
      pedantic: false, // Don't use original markdown.pl behavior
      silent: false, // Throw errors instead of logging them
    });
    configured = true;
  }
}

/**
 * Parse markdown content to HTML with sanitization.
 * Uses marked v17 async parsing for better performance.
 *
 * @param markdown - The markdown content to parse
 * @returns Promise resolving to sanitized HTML string
 * @throws Error if parsing fails
 */
export async function parseMarkdown(markdown: string): Promise<string> {
  configureMarked();
  try {
    const rawHtml = await marked.parse(markdown, { async: true });
    return sanitizeHtml(rawHtml);
  } catch (error) {
    // Re-throw with more context
    throw new Error(`Failed to parse markdown: ${error instanceof Error ? error.message : String(error)}`);
  }
}
