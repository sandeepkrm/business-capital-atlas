import { describe, expect, it } from "vitest";
import { calcRepayment } from "@/lib/finance";

describe("calcRepayment", () => {
  it("computes standard amortised monthly repayment", () => {
    // £10,000 at 12% over 12 months ≈ £888.49
    expect(calcRepayment(10000, 12, 12).monthly).toBeCloseTo(888.49, 1);
  });
  it("handles zero interest and adds fees to total cost", () => {
    const r = calcRepayment(12000, 0, 12, 500);
    expect(r.monthly).toBe(1000);
    expect(r.totalCost).toBe(500);
  });
});

import { calcAsset, calcInvoice } from "@/lib/finance";
describe("calcInvoice", () => {
  it("advances 85% of a £10,000 invoice and charges fees", () => {
    const r = calcInvoice(10000, 85, 1, 10, 365);
    expect(r.advance).toBe(8500);
    expect(r.fees).toBeCloseTo(100 + 850, 5);
    expect(r.balance).toBeCloseTo(550, 5);
  });
});
describe("calcAsset", () => {
  it("zero interest spreads financed amount evenly", () => {
    const r = calcAsset(13000, 1000, 0, 12);
    expect(r.monthly).toBe(1000);
    expect(r.totalCost).toBe(0);
  });
});
