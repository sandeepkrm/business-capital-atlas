export type Reason = { value: string; label: string };

export const reasons: Reason[] = [
  { value: "working_capital", label: "Working capital" },
  { value: "asset_finance", label: "Vehicle or machinery" },
  { value: "property_purchase", label: "Property finance" },
  { value: "acquisition", label: "Purchasing a business" },
  { value: "bridging", label: "Short-term cash flow boost" },
  { value: "bill_or_tax_payment", label: "Pay a bill/tax in instalments" },
  { value: "invoice_finance", label: "Invoice finance" },
  { value: "buyin_or_buyout", label: "Management Buy-In/Buy-Out" },
  { value: "debt_refinance", label: "Loan refinancing" },
  { value: "other", label: "Other" },
];

export type Question =
  | { id: string; label: string; type: "choice"; options: string[] }
  | { id: string; label: string; type: "money" | "text" };

export const MIN_AMOUNT = 1000;
export const MAX_AMOUNT = 15_000_000;

export function parseAmount(raw: string): number | null {
  const n = Number(String(raw).replace(/[£,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export function amountError(raw: string): string | null {
  if (!raw.trim()) return "This field is required";
  const n = parseAmount(raw);
  if (n === null) return "Please enter a number";
  if (n < MIN_AMOUNT) return `The minimum is £${MIN_AMOUNT.toLocaleString("en-GB")}`;
  if (n > MAX_AMOUNT) return `The maximum is £${MAX_AMOUNT.toLocaleString("en-GB")}`;
  return null;
}

const when: Question = { id: "when", label: "When do you need the funds?", type: "choice", options: ["As soon as possible", "Within a month", "In 1–3 months", "Just researching"] };

/** Questions that change depending on the chosen reason. */
export const reasonQuestions: Record<string, Question[]> = {
  working_capital: [
    { id: "use", label: "What will the money mainly be used for?", type: "choice", options: ["Stock or inventory", "Wages and staff", "Marketing", "Day-to-day running costs", "Something else"] },
    when,
  ],
  asset_finance: [
    { id: "asset", label: "What would you like to finance?", type: "choice", options: ["Car or van", "HGV or truck", "Machinery or plant", "IT or office equipment", "Other equipment"] },
    { id: "condition", label: "Is it new or used?", type: "choice", options: ["New", "Used", "Not sure yet"] },
    { id: "supplier", label: "Have you chosen a supplier?", type: "choice", options: ["Yes", "Not yet"] },
    when,
  ],
  property_purchase: [
    { id: "purpose", label: "What do you need property finance for?", type: "choice", options: ["Buying a property", "Refinancing a property", "Development or refurbishment", "Bridging a purchase"] },
    { id: "property_type", label: "What type of property is it?", type: "choice", options: ["Commercial", "Residential buy-to-let", "Semi-commercial", "Land"] },
    { id: "value", label: "Approximate property value", type: "money" },
    when,
  ],
  acquisition: [
    { id: "price", label: "Purchase price of the business", type: "money" },
    { id: "deposit", label: "How much can you put in yourself?", type: "money" },
    { id: "sector", label: "What sector is the business in?", type: "text" },
    when,
  ],
  bridging: [
    { id: "gap", label: "What is causing the cash flow gap?", type: "choice", options: ["Waiting for customer payments", "Seasonal dip", "Unexpected cost", "New contract or order", "Something else"] },
    { id: "repay", label: "When could you repay?", type: "choice", options: ["Within 3 months", "3–6 months", "6–12 months", "Over 12 months"] },
    when,
  ],
  bill_or_tax_payment: [
    { id: "bill", label: "What would you like to spread?", type: "choice", options: ["VAT", "Corporation tax", "PAYE / National Insurance", "Insurance premium", "Another bill"] },
    { id: "due", label: "When is it due?", type: "choice", options: ["Overdue", "Within 2 weeks", "Within a month", "Later"] },
  ],
  invoice_finance: [
    { id: "monthly", label: "How much do you invoice each month?", type: "money" },
    { id: "b2b", label: "Do you invoice other businesses?", type: "choice", options: ["Yes, mainly businesses", "A mix of businesses and consumers", "Mainly consumers"] },
    { id: "terms", label: "Typical payment terms", type: "choice", options: ["Up to 30 days", "31–60 days", "61–90 days", "Over 90 days"] },
  ],
  buyin_or_buyout: [
    { id: "deal", label: "What type of deal is it?", type: "choice", options: ["Management buy-out", "Management buy-in", "Not sure"] },
    { id: "price", label: "Approximate deal value", type: "money" },
    { id: "team", label: "How many people are in the management team?", type: "choice", options: ["1", "2–3", "4 or more"] },
  ],
  debt_refinance: [
    { id: "balance", label: "Outstanding balance to refinance", type: "money" },
    { id: "current", label: "What are you refinancing?", type: "choice", options: ["Business loan", "Merchant cash advance", "Asset finance", "Commercial mortgage", "Several debts"] },
    { id: "why", label: "Why are you refinancing?", type: "choice", options: ["Lower monthly payments", "Combine several debts", "Release extra funds", "Agreement ending"] },
  ],
  other: [
    { id: "describe", label: "Tell us what the funding is for", type: "text" },
    when,
  ],
};

export const businessQuestions: Question[] = [
  { id: "business_type", label: "What type of business is it?", type: "choice", options: ["Limited company", "Sole trader", "Partnership", "LLP", "Not trading yet"] },
  { id: "time_trading", label: "How long has it been trading?", type: "choice", options: ["Not yet trading", "Less than 6 months", "6–12 months", "1–2 years", "2–5 years", "Over 5 years"] },
  { id: "turnover", label: "Annual turnover", type: "choice", options: ["Under £100k", "£100k – £250k", "£250k – £1m", "£1m – £5m", "Over £5m"] },
  { id: "homeowner", label: "Are any directors or owners homeowners?", type: "choice", options: ["Yes", "No"] },
];

export function questionsFor(reason: string): Question[] {
  return reasonQuestions[reason] ?? reasonQuestions["other"]!;
}

export function reasonLabel(value: string) {
  return reasons.find((r) => r.value === value)?.label ?? value;
}
