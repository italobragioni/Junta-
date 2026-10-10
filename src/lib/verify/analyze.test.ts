import { describe, expect, it } from "vitest";

import { validateInput, MAX_TEXT_LENGTH } from "./analyze";

describe("validateInput", () => {
  it("rejects empty input", () => {
    expect(validateInput({}).ok).toBe(false);
    expect(validateInput({ text: "   " }).ok).toBe(false);
  });

  it("accepts plain text", () => {
    expect(validateInput({ text: "Governo anuncia nova medida" }).ok).toBe(true);
  });

  it("rejects over-long text", () => {
    expect(validateInput({ text: "a".repeat(MAX_TEXT_LENGTH + 1) }).ok).toBe(false);
  });

  it("accepts a valid image data URL", () => {
    const tiny = "data:image/png;base64,iVBORw0KGgo=";
    expect(validateInput({ imageDataUrl: tiny }).ok).toBe(true);
  });

  it("rejects a non-image data URL", () => {
    const bad = "data:application/pdf;base64,JVBERi0=";
    expect(validateInput({ imageDataUrl: bad }).ok).toBe(false);
  });

  it("rejects a malformed image value", () => {
    expect(validateInput({ imageDataUrl: "not-a-data-url" }).ok).toBe(false);
  });
});
