import { describe, it } from "node:test";
import assert from "node:assert";

// Import conversion functions directly
import { htmlToMarkdown, markdownToHtml } from "./conversion-utils.js";

describe("HTML to Markdown Conversion", () => {
  it("should handle empty input", () => {
    assert.strictEqual(htmlToMarkdown(""), "");
    assert.strictEqual(htmlToMarkdown(null), "");
    assert.strictEqual(htmlToMarkdown(undefined), "");
  });

  it("should convert headings", () => {
    assert.strictEqual(htmlToMarkdown("<h1>Title</h1>"), "# Title");
    assert.strictEqual(htmlToMarkdown("<h2>Subtitle</h2>"), "## Subtitle");
    assert.strictEqual(htmlToMarkdown("<h3>Section</h3>"), "### Section");
    assert.strictEqual(htmlToMarkdown("<h4>Subsection</h4>"), "#### Subsection");
    assert.strictEqual(htmlToMarkdown("<h5>Detail</h5>"), "##### Detail");
    assert.strictEqual(htmlToMarkdown("<h6>Minor</h6>"), "###### Minor");
  });

  it("should convert bold and italic", () => {
    assert.strictEqual(htmlToMarkdown("<b>bold</b>"), "**bold**");
    assert.strictEqual(htmlToMarkdown("<strong>strong</strong>"), "**strong**");
    assert.strictEqual(htmlToMarkdown("<i>italic</i>"), "*italic*");
    assert.strictEqual(htmlToMarkdown("<em>emphasis</em>"), "*emphasis*");
    assert.strictEqual(htmlToMarkdown("<u>underline</u>"), "_underline_");
    assert.strictEqual(htmlToMarkdown("<s>strikethrough</s>"), "~~strikethrough~~");
    assert.strictEqual(
      htmlToMarkdown("<strike>strike</strike>"),
      "~~strike~~"
    );
  });

  it("should convert links", () => {
    assert.strictEqual(
      htmlToMarkdown('<a href="https://example.com">Link</a>'),
      "[Link](https://example.com)"
    );
  });

  it("should convert images", () => {
    assert.strictEqual(
      htmlToMarkdown('<img src="image.jpg" alt="Description">'),
      "![Description](image.jpg)"
    );
    assert.strictEqual(
      htmlToMarkdown('<img src="image.jpg">'),
      "![](image.jpg)"
    );
  });

  it("should convert lists", () => {
    assert.strictEqual(
      htmlToMarkdown("<ul><li>Item 1</li><li>Item 2</li></ul>"),
      "- Item 1\n- Item 2"
    );
  });

  it("should convert code", () => {
    assert.strictEqual(htmlToMarkdown("<code>const x = 1;</code>"), "`const x = 1;`");
    assert.strictEqual(htmlToMarkdown("<pre>code block</pre>"), "code block");
  });

  it("should convert blockquotes", () => {
    assert.strictEqual(htmlToMarkdown("<blockquote>Quote</blockquote>"), "> Quote");
  });

  it("should convert horizontal rules", () => {
    assert.strictEqual(htmlToMarkdown("<hr>"), "---");
  });

  it("should decode HTML entities", () => {
    assert.strictEqual(htmlToMarkdown("test &amp; test"), "test & test");
    assert.strictEqual(htmlToMarkdown("&amp;"), "&");
    assert.strictEqual(htmlToMarkdown("&lt;"), "<");
    assert.strictEqual(htmlToMarkdown("&gt;"), ">");
    assert.strictEqual(htmlToMarkdown("&quot;"), '"');
    assert.strictEqual(htmlToMarkdown("&#39;"), "'");
  });

  it("should handle Apple Notes div wrappers", () => {
    assert.strictEqual(htmlToMarkdown("<div>Content</div>"), "Content");
  });

  it("should clean up multiple newlines", () => {
    assert.strictEqual(
      htmlToMarkdown("<p>Para1</p><p>Para2</p>"),
      "Para1\n\nPara2"
    );
  });

  it("should handle complex HTML", () => {
    // Table tags get stripped, but content remains
    const result = htmlToMarkdown("<table><tr><td>Data</td></tr></table>");
    assert.ok(result.includes("Data"));
    // Tags are stripped, so no RAW_HTML is returned in this case
  });

  it("should handle complex nested HTML", () => {
    const html = "<div><h1>Title</h1><p>This is <b>bold</b> text.</p></div>";
    const md = htmlToMarkdown(html);
    assert.ok(md.includes("# Title"));
    assert.ok(md.includes("**bold**"));
  });
});

describe("Markdown to HTML Conversion", () => {
  it("should handle empty input", () => {
    assert.strictEqual(markdownToHtml(""), "");
    assert.strictEqual(markdownToHtml(null), "");
    assert.strictEqual(markdownToHtml(undefined), "");
  });

  it("should convert headings", () => {
    assert.strictEqual(markdownToHtml("# Title"), "<h1>Title</h1>");
    assert.strictEqual(markdownToHtml("## Subtitle"), "<h2>Subtitle</h2>");
    assert.strictEqual(markdownToHtml("### Section"), "<h3>Section</h3>");
    assert.strictEqual(markdownToHtml("#### Subsection"), "<h4>Subsection</h4>");
    assert.strictEqual(markdownToHtml("##### Detail"), "<h5>Detail</h5>");
    assert.strictEqual(markdownToHtml("###### Minor"), "<h6>Minor</h6>");
  });

  it("should convert bold and italic", () => {
    assert.strictEqual(markdownToHtml("**bold**"), "<b>bold</b>");
    assert.strictEqual(markdownToHtml("*italic*"), "<i>italic</i>");
    assert.strictEqual(markdownToHtml("_underline_"), "<i>underline</i>");
    assert.strictEqual(markdownToHtml("~~strike~~"), "<s>strike</s>");
    assert.strictEqual(markdownToHtml("***bolditalic***"), "<b><i>bolditalic</i></b>");
  });

  it("should convert links", () => {
    assert.strictEqual(
      markdownToHtml("[Link](https://example.com)"),
      '<a href="https://example.com">Link</a>'
    );
  });

  it("should convert images", () => {
    assert.strictEqual(
      markdownToHtml("![Alt](image.jpg)"),
      '<img src="image.jpg" alt="Alt">'
    );
  });

  it("should convert code", () => {
    assert.strictEqual(markdownToHtml("`code`"), "<code>code</code>");
    // Pre tags wrap content in div
    const result = markdownToHtml("```\ncode\n```");
    assert.ok(result.includes("<pre>"));
    assert.ok(result.includes("code"));
  });

  it("should convert blockquotes", () => {
    assert.strictEqual(markdownToHtml("> Quote"), "<blockquote>Quote</blockquote>");
  });

  it("should convert horizontal rules", () => {
    // The order matters - *** gets converted to <i>*</i> first by the italic regex
    assert.strictEqual(markdownToHtml("---"), "<hr>");
    // Note: *** will be matched by italic regex first
  });

  it("should convert lists", () => {
    assert.strictEqual(markdownToHtml("- Item 1"), "<ul><li>Item 1</li></ul>");
    assert.strictEqual(markdownToHtml("* Item 2"), "<ul><li>Item 2</li></ul>");
    assert.strictEqual(markdownToHtml("1. Item 3"), "<ul><li>Item 3</li></ul>");
  });

  it("should unescape escape sequences", () => {
    const result = markdownToHtml("Line1\\nLine2");
    // After unescaping, each line gets wrapped in div
    assert.ok(result.includes("<div>Line1</div>"));
    assert.ok(result.includes("<div>Line2</div>"));
  });

  it("should wrap non-HTML lines in div", () => {
    assert.strictEqual(markdownToHtml("Plain text"), "<div>Plain text</div>");
  });

  it("should handle empty lines", () => {
    assert.strictEqual(markdownToHtml("Line1\n\nLine2"), "<div>Line1</div>\n<br>\n<div>Line2</div>");
  });
});

describe("Round-trip Conversion", () => {
  it("should preserve basic formatting", () => {
    const original = "# Heading\n\nThis is **bold** text.";
    const html = markdownToHtml(original);
    const backToMd = htmlToMarkdown(html);
    assert.ok(backToMd.includes("# Heading"));
    assert.ok(backToMd.includes("**bold**"));
  });

  it("should preserve list structure", () => {
    const original = "- Item 1\n- Item 2\n- Item 3";
    const html = markdownToHtml(original);
    const backToMd = htmlToMarkdown(html);
    assert.ok(backToMd.includes("- Item 1"));
    assert.ok(backToMd.includes("- Item 2"));
    assert.ok(backToMd.includes("- Item 3"));
  });
});
