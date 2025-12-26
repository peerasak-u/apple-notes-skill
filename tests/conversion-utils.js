// Conversion tests for HTML <-> Markdown
// These are Node.js ports of the JXA functions for testing

function htmlToMarkdown(html) {
  if (!html) return "";

  let md = html;

  // Remove Apple Notes specific wrapper divs but keep content
  md = md.replace(/<div[^>]*>/gi, "\n");
  md = md.replace(/<\/div>/gi, "");

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n");
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n");
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n");
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n");

  // Bold and italic
  md = md.replace(/<(b|strong)[^>]*>(.*?)<\/(b|strong)>/gi, "**$2**");
  md = md.replace(/<(i|em)[^>]*>(.*?)<\/(i|em)>/gi, "*$2*");
  md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, "_$1_");
  md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, "~~$1~~");
  md = md.replace(/<strike[^>]*>(.*?)<\/strike>/gi, "~~$1~~");

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");

  // Images
  md = md.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    "![$2]($1)"
  );
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Lists - handle nested lists
  md = md.replace(/<ul[^>]*>/gi, "\n");
  md = md.replace(/<\/ul>/gi, "\n");
  md = md.replace(/<ol[^>]*>/gi, "\n");
  md = md.replace(/<\/ol>/gi, "\n");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");

  // Line breaks and paragraphs
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>/gi, "\n");
  md = md.replace(/<\/p>/gi, "\n");

  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, "```\n$1\n```\n");

  // Blockquote
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1\n");

  // Horizontal rule
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  md = md.replace(/&nbsp;/g, " ");
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&apos;/g, "'");

  // Clean up multiple newlines
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();

  // Check if conversion was successful (no remaining HTML-like content)
  if (/<[a-z][\s\S]*>/i.test(md)) {
    return "[RAW_HTML]\n" + html;
  }

  return md;
}

function markdownToHtml(markdown) {
  if (!markdown) return "";

  let html = markdown;

  // Unescape common escape sequences from command line
  html = html.replace(/\\n/g, "\n");
  html = html.replace(/\\t/g, "\t");

  // Headings (must be at start of line)
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic (order matters)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<b><i>$1</i></b>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  html = html.replace(/\*(.+?)\*/g, "<i>$1</i>");
  html = html.replace(/_(.+?)_/g, "<i>$1</i>");
  html = html.replace(/~~(.+?)~~/g, "<s>$1</s>");

  // Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Code
  html = html.replace(/```([\s\S]*?)```/g, "<pre>$1</pre>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/^\*\*\*$/gm, "<hr>");

  // Lists (simple handling)
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, function (match) {
    return "<ul>" + match + "</ul>";
  });

  // Paragraphs - wrap lines that aren't already HTML
  const lines = html.split("\n");
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      result.push("<br>");
    } else if (!/^</.test(line)) {
      result.push("<div>" + line + "</div>");
    } else {
      result.push(line);
    }
  }
  html = result.join("\n");

  return html;
}

// Export for testing
export { htmlToMarkdown, markdownToHtml };
