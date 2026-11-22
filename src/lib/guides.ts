export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: "Getting started" | "Cash flow" | "Growth" | "Applying";
  read: string;
  sections: { h: string; p: string[] }[];
  related: string[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-get-a-business-loan-uk",
    title: "How to get a business loan in the UK: a step-by-step guide",
    description: "A practical walkthrough of preparing, enquiring and applying for a UK business loan — including documents and common mistakes.",
    category: "Applying",
    read: "7 min",
    sections: [
      { h: "1. Be clear on why you need the money", p: ["Providers want to know what the funding is for and how it helps the business. Write a one-paragraph summary: the amount, the purpose and how repayments will be covered.", "Matching the product to the purpose matters. Equipment usually suits asset finance; seasonal gaps suit working capital facilities; long-term growth may suit a term loan."] },
      { h: "2. Check your numbers", p: ["Look at the last 6–12 months of bank statements. Are there regular returned payments or long periods in overdraft? Fix what you can before applying.", "Work out what monthly repayment is comfortable in a quiet month, not just an average one."] },
      { h: "3. Gather your documents", p: ["Most applications ask for ID for directors, 3–6 months of business bank statements, and for limited companies the latest filed accounts. Larger requests may need management accounts, forecasts and an asset and liability statement."] },
      { h: "4. Compare routes before applying", p: ["Multiple hard credit searches in a short period can affect your credit profile. Use eligibility checks and conversations with a broker or adviser to narrow options first."] },
      { h: "5. Read the agreement carefully", p: ["Check the total amount repayable, fees, early repayment terms, personal guarantees and any security. If anything is unclear, ask before you sign."] },
    ],
    related: ["business-loans", "small-business-loans"],
  },
  {
    slug: "secured-vs-unsecured-business-loans",
    title: "Secured vs unsecured business loans: what's the difference?",
    description: "Understand how secured and unsecured business loans differ on cost, risk, amounts and eligibility so you can choose with confidence.",
    category: "Getting started",
    read: "5 min",
    sections: [
      { h: "Secured loans", p: ["A secured loan is backed by an asset — commonly property, but sometimes vehicles or equipment. Security reduces the provider's risk, which can mean larger amounts, longer terms or lower rates.", "The trade-off is that the asset may be at risk if repayments are not maintained."] },
      { h: "Unsecured loans", p: ["Unsecured loans don't require a specific asset. Decisions rely on trading performance and credit history. They are usually quicker to arrange but may cost more and be for smaller amounts.", "Most providers still ask directors for a personal guarantee, which means you may be personally liable if the business cannot repay."] },
      { h: "Which is right for you?", p: ["If you need a smaller amount quickly and don't want to pledge property, unsecured may suit. For larger, longer-term needs, security can open up better terms. Consider your appetite for risk as well as cost."] },
    ],
    related: ["business-loans", "property-finance"],
  },
  {
    slug: "improve-business-cash-flow",
    title: "9 practical ways to improve business cash flow",
    description: "Simple, proven actions UK business owners can take to improve cash flow — and when finance can help bridge the gap.",
    category: "Cash flow",
    read: "6 min",
    sections: [
      { h: "Get paid faster", p: ["Invoice promptly, state clear payment terms, offer easy payment methods and chase politely but consistently. Consider deposits or staged payments on large jobs."] },
      { h: "Manage what goes out", p: ["Negotiate supplier terms, review subscriptions and recurring costs, and avoid buying stock far earlier than needed."] },
      { h: "Forecast weekly", p: ["A simple 13-week cash flow forecast shows pinch points before they arrive, giving you time to act."] },
      { h: "Use the right finance", p: ["Where gaps are structural — long customer payment terms or seasonal peaks — working capital finance or invoice finance can provide a steady buffer instead of emergency borrowing."] },
    ],
    related: ["working-capital-finance", "invoice-finance"],
  },
  {
    slug: "invoice-factoring-vs-discounting",
    title: "Invoice factoring vs invoice discounting explained",
    description: "Compare invoice factoring and invoice discounting: who collects payments, confidentiality, costs and which suits your business.",
    category: "Cash flow",
    read: "5 min",
    sections: [
      { h: "Factoring", p: ["The provider advances funds against invoices and takes over credit control, chasing your customers for payment. Good for smaller businesses without dedicated credit control."] },
      { h: "Discounting", p: ["You receive the advance but keep collecting payments yourself. Often confidential, so customers are unaware. Usually suits larger businesses with established processes."] },
      { h: "Choosing between them", p: ["Consider your turnover, your credit control capability, and how important it is that customers deal only with you."] },
    ],
    related: ["invoice-finance", "working-capital-finance"],
  },
  {
    slug: "funding-business-expansion",
    title: "How to fund a business expansion without overstretching",
    description: "Plan the funding for your business growth: sizing the amount, choosing the right mix of finance and protecting cash flow.",
    category: "Growth",
    read: "6 min",
    sections: [
      { h: "Start with the plan, not the loan", p: ["Set out what the expansion costs, when costs arrive, and when the extra income starts. The gap between the two is your funding need."] },
      { h: "Mix finance to match the assets", p: ["Use asset finance for equipment, commercial mortgages for premises and working capital facilities for the extra stock and payroll growth brings."] },
      { h: "Stress-test it", p: ["Ask: if revenue arrives six months later than planned, can we still repay? Build in contingency."] },
    ],
    related: ["business-expansion-finance", "asset-finance", "sme-funding"],
  },
  {
    slug: "asset-finance-hire-purchase-vs-leasing",
    title: "Hire purchase vs leasing: which asset finance suits you?",
    description: "Hire purchase or leasing? Compare ownership, monthly cost, flexibility and tax considerations for business equipment and vehicles.",
    category: "Growth",
    read: "5 min",
    sections: [
      { h: "Hire purchase", p: ["You pay instalments and own the asset at the end. Suits assets with a long working life you intend to keep."] },
      { h: "Leasing", p: ["You pay to use the asset without owning it, often with lower monthly payments. Suits technology or vehicles you upgrade regularly."] },
      { h: "Talk to your accountant", p: ["Tax and accounting treatment differs between agreements, so get professional advice for your situation."] },
    ],
    related: ["asset-finance"],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
