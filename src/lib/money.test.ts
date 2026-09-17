import { describe, it, expect } from "vitest";
import { parseToCents, formatCents, formatPercent } from "./money";

describe("parseToCents", () => {
  it("parses BRL formatted strings", () => {
    expect(parseToCents("1.234,56")).toBe(123456);
    expect(parseToCents("R$ 1.234,56")).toBe(123456);
    expect(parseToCents("1234,5")).toBe(123450);
    expect(parseToCents("100")).toBe(10000);
    expect(parseToCents("0,99")).toBe(99);
  });

  it("parses plain and dot-decimal numbers", () => {
    expect(parseToCents("1234.56")).toBe(123456);
    expect(parseToCents(12.34)).toBe(1234);
  });

  it("returns null for invalid input", () => {
    expect(parseToCents("")).toBeNull();
    expect(parseToCents("abc")).toBeNull();
  });
});

describe("formatCents", () => {
  it("formats cents to BRL", () => {
    expect(formatCents(123456)).toBe("R$ 1.234,56");
    expect(formatCents(0)).toBe("R$ 0,00");
  });
});

describe("formatPercent", () => {
  it("formats with one decimal", () => {
    expect(formatPercent(18.4)).toBe("18,4%");
  });
});
