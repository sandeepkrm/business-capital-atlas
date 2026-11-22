import { describe, expect, it } from "vitest";
import { amountError, questionsFor, reasons } from "@/lib/quote-flow";

describe("quote flow", () => {
  it("offers the same reason options in the same order", () => {
    expect(reasons.map((r) => r.label)).toEqual([
      "Working capital", "Vehicle or machinery", "Property finance", "Purchasing a business", "Short-term cash flow boost",
      "Pay a bill/tax in instalments", "Invoice finance", "Management Buy-In/Buy-Out", "Loan refinancing", "Other",
    ]);
  });
  it("requires an amount between £1,000 and £15m", () => {
    expect(amountError("")).toBe("This field is required");
    expect(amountError("999")).not.toBeNull();
    expect(amountError("50,000")).toBeNull();
    expect(amountError("15000001")).not.toBeNull();
  });
  it("changes the questions with the chosen reason", () => {
    expect(questionsFor("asset_finance").map((q) => q.id)).toContain("asset");
    expect(questionsFor("invoice_finance").map((q) => q.id)).toContain("monthly");
    expect(questionsFor("unknown")).toEqual(questionsFor("other"));
  });
});
