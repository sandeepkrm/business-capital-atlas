/** Navigation groups and quick facts for each funding page. */
export const loanGroups: { label: string; slugs: string[] }[] = [
  { label: "Business loans", slugs: ["business-loans", "unsecured-business-loans", "secured-business-loans", "working-capital-finance", "short-term-business-loans", "bad-credit-business-loans", "limited-company-business-loans", "business-loans-for-women", "business-loans-for-sole-traders", "small-business-loans", "start-up-loans"] },
  { label: "Asset & property", slugs: ["asset-finance", "finance-leasing", "alternative-finance", "construction-finance", "growth-guarantee-scheme", "property-finance", "bridging-loans", "business-expansion-finance", "sme-funding"] },
  { label: "Cash flow", slugs: ["cash-flow-solutions", "business-credit-cards", "invoice-finance", "invoice-discounting", "invoice-factoring", "merchant-cash-advance", "revolving-credit-facility"] },
];

export const calculators = [
  { to: "/business-loan-calculator", label: "Business loan calculator", desc: "Monthly repayments & total cost" },
  { to: "/invoice-finance-calculator", label: "Invoice finance calculator", desc: "Upfront cash & fees" },
  { to: "/asset-finance-calculator", label: "Asset finance calculator", desc: "Monthly payments on equipment" },
] as const;

/** [typical amount, typical term, security, typical speed] — illustrative only */
export const facts: Record<string, [string, string, string, string]> = {
  "business-loans": ["£1k – £5m+", "3 months – 25 years", "Secured or unsecured", "Days to weeks"],
  "unsecured-business-loans": ["£1k – £500k", "3 months – 6 years", "Personal guarantee", "Often within days"],
  "secured-business-loans": ["£25k – £5m+", "1 – 25 years", "Property or assets", "Typically weeks"],
  "working-capital-finance": ["£5k – £1m+", "Revolving / short term", "Varies", "Days"],
  "short-term-business-loans": ["£1k – £250k", "3 – 18 months", "Usually unsecured", "Often within days"],
  "bad-credit-business-loans": ["£1k – £500k", "3 months – 5 years", "Varies", "Days to weeks"],
  "limited-company-business-loans": ["£1k – £5m+", "3 months – 10 years", "Secured or unsecured", "Days to weeks"],
  "business-loans-for-women": ["£500 – £5m+", "Varies by product", "Varies", "Varies"],
  "business-loans-for-sole-traders": ["£1k – £250k", "3 months – 5 years", "Usually unsecured", "Days"],
  "small-business-loans": ["£1k – £250k", "3 months – 5 years", "Usually unsecured", "Days"],
  "start-up-loans": ["£500 – £25k+", "1 – 5 years", "Usually unsecured", "Weeks"],
  "asset-finance": ["£1k – £10m+", "1 – 7 years", "The asset", "Days"],
  "finance-leasing": ["£1k – £10m+", "1 – 7 years", "The asset", "Days"],
  "alternative-finance": ["£1k – £5m", "Varies", "Varies", "Hours to weeks"],
  "construction-finance": ["£50k – £50m+", "6 – 36 months (dev)", "Site / plant", "Weeks"],
  "growth-guarantee-scheme": ["Up to scheme limits", "Up to scheme limits", "Lender-dependent", "Weeks"],
  "property-finance": ["£50k – £50m+", "3 – 25 years", "Property", "Weeks"],
  "bridging-loans": ["£50k – £25m+", "1 – 24 months", "Property", "Days to weeks"],
  "business-expansion-finance": ["£25k – £10m+", "1 – 15 years", "Often secured", "Weeks"],
  "sme-funding": ["£1k – £10m+", "Varies", "Varies", "Varies"],
  "cash-flow-solutions": ["£1k – £5m+", "Revolving / short term", "Varies", "Days"],
  "business-credit-cards": ["£500 – £50k+", "Revolving", "Personal liability", "Days"],
  "invoice-finance": ["£10k – £10m+", "Ongoing facility", "Your invoices", "1–3 weeks to set up"],
  "invoice-discounting": ["£50k – £10m+", "Ongoing facility", "Your invoices", "Weeks"],
  "invoice-factoring": ["£10k – £5m", "Ongoing facility", "Your invoices", "1–2 weeks"],
  "merchant-cash-advance": ["£5k – £500k", "Repaid from sales", "Future card takings", "Often within days"],
  "revolving-credit-facility": ["£5k – £1m+", "1 – 3 years", "Varies", "Days"],
};
