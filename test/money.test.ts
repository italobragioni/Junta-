import { describe, it, expect } from "vitest";
import { toCents, toReais, parseReais, sumCents, splitInstallments, percentOf } from "@/lib/money";

describe("money — conversão em centavos", () => {
  it("converte reais em centavos sem erro de ponto flutuante", () => {
    expect(toCents(0.1)).toBe(10);
    expect(toCents(0.2)).toBe(20);
    expect(toCents(0.1 + 0.2)).toBe(30); // clássico 0.30000000000004
    expect(toCents(1.005)).toBe(101); // half-up correto (não 100)
    expect(toCents(1234.56)).toBe(123456);
    expect(toCents(-50.5)).toBe(-5050);
  });

  it("converte centavos de volta em reais", () => {
    expect(toReais(123456)).toBe(1234.56);
    expect(toReais(10)).toBe(0.1);
  });

  it("soma centavos como inteiros (sem drift)", () => {
    const cents = Array.from({ length: 10 }, () => toCents(0.1)); // 10 x R$0,10
    expect(sumCents(cents)).toBe(100); // exatamente R$1,00
  });
});

describe("money — parse de entrada do usuário", () => {
  it("entende formato brasileiro", () => {
    expect(parseReais("R$ 1.234,56")).toBeCloseTo(1234.56);
    expect(parseReais("1.234,56")).toBeCloseTo(1234.56);
    expect(parseReais("50,00")).toBeCloseTo(50);
    expect(parseReais("1.000")).toBeCloseTo(1000); // milhar
  });
  it("entende formato americano", () => {
    expect(parseReais("1,234.56")).toBeCloseTo(1234.56);
    expect(parseReais("1234.56")).toBeCloseTo(1234.56);
  });
  it("trata negativos e vazios", () => {
    expect(parseReais("(100,00)")).toBeCloseTo(-100);
    expect(parseReais("-25,50")).toBeCloseTo(-25.5);
    expect(parseReais("")).toBe(0);
    expect(parseReais("abc")).toBe(0);
  });
});

describe("money — parcelamento (soma exata)", () => {
  it("divide sem perder nem criar centavos", () => {
    expect(splitInstallments(1000, 3)).toEqual([334, 333, 333]);
    expect(sumCents(splitInstallments(1000, 3))).toBe(1000);
    expect(splitInstallments(10000, 7).reduce((a, b) => a + b, 0)).toBe(10000);
    expect(splitInstallments(123457, 12).reduce((a, b) => a + b, 0)).toBe(123457);
  });
  it("1 parcela devolve o total", () => {
    expect(splitInstallments(5000, 1)).toEqual([5000]);
  });
});

describe("money — percentual", () => {
  it("calcula e protege divisão por zero", () => {
    expect(percentOf(50, 200)).toBe(25);
    expect(percentOf(100, 0)).toBe(0);
  });
});
