import { describe, it } from "bun:test";
import assert from "node:assert";

// Utility functions for testing

function getPreview(body, maxLength) {
  if (!body) {
    return "";
  }
  const length = Math.min(maxLength, body.length);
  let preview = body.substring(0, length);
  if (body.length > length) {
    preview += "...";
  }
  return preview;
}

function generateUniqueTitle(baseTitle, existingTitles) {
  const existingSet = new Set(existingTitles);

  if (!existingSet.has(baseTitle)) {
    return baseTitle;
  }

  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = `${baseTitle} (${suffix})`;
    if (!existingSet.has(candidate)) {
      return candidate;
    }
    suffix++;
  }
}

describe("getPreview utility", () => {
  it("should handle empty input", () => {
    assert.strictEqual(getPreview("", 100), "");
    assert.strictEqual(getPreview(null, 100), "");
    assert.strictEqual(getPreview(undefined, 100), "");
  });

  it("should return full text when shorter than maxLength", () => {
    const text = "Short text";
    assert.strictEqual(getPreview(text, 100), "Short text");
  });

  it("should truncate text when longer than maxLength", () => {
    const text = "This is a very long text that needs to be truncated";
    const preview = getPreview(text, 10);
    assert.strictEqual(preview, "This is a ...");
  });

  it("should add ellipsis only when truncated", () => {
    const text = "Exact length";
    // When maxLength >= text length, no truncation
    assert.strictEqual(getPreview(text, 12), "Exact length");
    assert.strictEqual(getPreview(text, 20), "Exact length");
    // When maxLength < text length, truncate and add ...
    assert.strictEqual(getPreview(text, 11), "Exact lengt...");
    assert.strictEqual(getPreview(text, 9), "Exact len...");
  });

  it("should handle maxLength of 0", () => {
    const text = "Some text";
    assert.strictEqual(getPreview(text, 0), "...");
  });
});

describe("generateUniqueTitle utility", () => {
  it("should return base title when not in use", () => {
    const existing = ["Note 1", "Note 2"];
    assert.strictEqual(generateUniqueTitle("Note 3", existing), "Note 3");
  });

  it("should add suffix when title exists", () => {
    const existing = ["Meeting", "Other Note"];
    assert.strictEqual(generateUniqueTitle("Meeting", existing), "Meeting (2)");
  });

  it("should increment suffix until finding unique title", () => {
    const existing = ["Todo", "Todo (2)", "Todo (3)"];
    assert.strictEqual(generateUniqueTitle("Todo", existing), "Todo (4)");
  });

  it("should handle empty existing titles", () => {
    const existing = [];
    assert.strictEqual(generateUniqueTitle("New Note", existing), "New Note");
  });

  it("should find next available suffix", () => {
    const existing = ["Project", "Project (2)", "Project (3)", "Project (5)"];
    assert.strictEqual(generateUniqueTitle("Project", existing), "Project (4)");
  });

  it("should handle multiple existing with same prefix", () => {
    const existing = ["Log", "Log (2)", "Log (3)", "Log (4)", "Log (5)", "Log (6)"];
    assert.strictEqual(generateUniqueTitle("Log", existing), "Log (7)");
  });
});
