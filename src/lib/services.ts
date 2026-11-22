export type Service = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  uses: string[];
  types: { t: string; d: string }[];
  considerations: { t: string; d: string }[];
  costs: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

const S = (s: Service) => s;

export const services: Service[] = [
  S({
    slug: "business-loans",
    name: "Business Loans",
    eyebrow: "Business loans UK",
    title: "Business Loans UK | Explore Finance Options | FundingCompany",
    description:
      "Explore UK business loan options for working capital, equipment and growth. Understand eligibility, compare finance types and enquire about suitable funding routes.",
    h1: "Business loans for UK companies and small businesses",
    intro:
      "A business loan gives your company a lump sum that is repaid, with interest, over an agreed term. It is one of the most flexible ways to fund growth, smooth cash flow or invest in the things that keep your business moving. FundingCompany helps you understand the main loan types, what providers look for, and which route may suit your circumstances before you enquire.",
    uses: [
      "Hiring staff or expanding your team",
      "Buying stock ahead of a busy season",
      "Marketing and launching new products",
      "Refurbishing or fitting out premises",
      "Refinancing existing, more expensive debt",
      "Covering a temporary gap in cash flow",
    ],
    types: [
      { t: "Unsecured business loans", d: "No specific asset is pledged as security. Providers usually rely on trading performance and often ask directors for a personal guarantee." },
      { t: "Secured business loans", d: "Borrowing backed by property or other assets. Security can support larger amounts or longer terms, but the asset may be at risk if repayments are missed." },
      { t: "Short-term business loans", d: "Typically repaid within 3 to 18 months. Useful for time-sensitive needs, though the cost per year can be higher than longer-term borrowing." },
      { t: "Revolving credit facilities", d: "A credit limit you can draw on, repay and draw again, so you only pay interest on what you use." },
    ],
    considerations: [
      { t: "Trading history", d: "Many providers prefer at least 6 to 24 months of trading, depending on the product." },
      { t: "Turnover and affordability", d: "Bank statements and accounts help show whether repayments fit comfortably within your cash flow." },
      { t: "Credit profile", d: "Business and personal credit history for directors are commonly reviewed." },
      { t: "Purpose of funds", d: "A clear plan for how the money will be used helps providers assess the request." },
    ],
    costs:
      "Business loan costs depend on the interest rate, the term, any arrangement or broker fees, and whether the rate is fixed or variable. A longer term can reduce monthly repayments but usually increases the total amount repaid. Always compare the total cost of borrowing, not just the monthly figure.",
    faqs: [
      { q: "How much can my business borrow?", a: "It depends on turnover, affordability, trading history and the type of finance. Smaller loans can start from a few thousand pounds, while secured or specialist facilities can be considerably larger." },
      { q: "Will enquiring affect my credit score?", a: "Initial eligibility checks are often soft searches, which do not affect your credit score. A full application may involve a hard search — you should be told before this happens." },
      { q: "Can a new business get a loan?", a: "Some providers support start-ups and early-stage businesses, though options are usually narrower. Government-backed Start Up Loans are another route worth exploring." },
      { q: "Is a business loan the same as an overdraft?", a: "No. A loan is a fixed amount repaid on a schedule, while an overdraft is a flexible facility linked to your business current account." },
    ],
    related: ["small-business-loans", "working-capital-finance", "business-expansion-finance"],
  }),
  S({
    slug: "small-business-loans",
    name: "Small Business Loans",
    eyebrow: "Small business loans UK",
    title: "Small Business Loans UK | Funding for Sole Traders & SMEs | FundingCompany",
    description:
      "Find out how small business loans work in the UK, who they suit, what providers check and how to enquire about funding for your small business.",
    h1: "Small business loans that fit how you actually trade",
    intro:
      "Small businesses rarely have a finance team, which can make borrowing feel daunting. Small business loans are designed for sole traders, partnerships and smaller limited companies that need practical amounts of funding, quick decisions and repayments that sit sensibly alongside day-to-day running costs.",
    uses: [
      "New equipment, tools or a work vehicle",
      "Stock for a new product line",
      "A website, rebrand or marketing campaign",
      "Bridging the gap while waiting for customers to pay",
      "Moving into a larger unit or shop",
    ],
    types: [
      { t: "Term loans", d: "A fixed amount with set monthly repayments over an agreed term — simple to budget for." },
      { t: "Start Up Loans", d: "A government-backed personal loan for business purposes, aimed at newer businesses, often with free mentoring." },
      { t: "Merchant cash advance", d: "An advance repaid as a percentage of card takings, so repayments flex with your sales." },
      { t: "Business credit cards", d: "Useful for smaller, regular costs, with the option to spread payments." },
    ],
    considerations: [
      { t: "Business structure", d: "Sole traders, partnerships and limited companies can all borrow, but documents and guarantees differ." },
      { t: "Bank statements", d: "Recent statements show income patterns and regular outgoings." },
      { t: "Personal credit", d: "For smaller businesses, the owner's personal credit history often carries more weight." },
      { t: "Existing commitments", d: "Other loans, leases and card balances affect what is affordable." },
    ],
    costs:
      "Smaller loans can carry higher interest rates than large secured facilities because the provider takes on more risk. Look at the APR or total repayable, check for early repayment charges and make sure the monthly cost leaves room for quiet months.",
    faqs: [
      { q: "Can sole traders apply?", a: "Yes. Many providers lend to sole traders, though they will usually look closely at personal credit and income." },
      { q: "What documents will I need?", a: "Typically recent business bank statements, ID, and for limited companies, filed accounts or management information." },
      { q: "How fast can funds arrive?", a: "Some smaller loans can be decided within days of a complete application. Timescales vary by provider and product." },
    ],
    related: ["business-loans", "sme-funding", "working-capital-finance"],
  }),
  S({
    slug: "sme-funding",
    name: "SME Funding",
    eyebrow: "SME funding UK",
    title: "SME Funding UK | Loans, Grants & Growth Finance | FundingCompany",
    description:
      "A clear guide to SME funding in the UK — from business loans and asset finance to grants and equity. Understand your options and find the right funding route.",
    h1: "SME funding: find the right route for your next stage",
    intro:
      "Small and medium-sized enterprises have more funding routes available than ever — from high-street banks to specialist lenders, government-backed schemes, grants and equity investors. The challenge is knowing which one suits your goal. This page maps out the main SME funding options so you can focus on the right conversations.",
    uses: [
      "Scaling production or service capacity",
      "Entering new markets or opening new sites",
      "Investing in technology and automation",
      "Acquiring a competitor or supplier",
      "Strengthening working capital",
    ],
    types: [
      { t: "Debt finance", d: "Loans, revolving credit and asset finance — you keep full ownership and repay over time." },
      { t: "Invoice and trade finance", d: "Funding linked to your sales ledger or supplier payments." },
      { t: "Grants", d: "Non-repayable funding, usually for specific purposes such as innovation, energy efficiency or regional growth. Often competitive." },
      { t: "Equity investment", d: "Investors provide capital in exchange for a share of the business. No repayments, but you give up some ownership." },
    ],
    considerations: [
      { t: "Your goal", d: "Matching the type of funding to the purpose usually leads to better terms." },
      { t: "Financial records", d: "Up-to-date accounts, forecasts and management information strengthen any request." },
      { t: "Ownership", d: "Decide early whether you are open to sharing equity." },
      { t: "Timing", d: "Grants and equity rounds can take months; debt finance is often faster." },
    ],
    costs:
      "Debt has a visible cost in interest and fees. Equity has a less visible cost: a share of future profits and control. Grants may require match funding or reporting. Weigh total cost against what each route lets you achieve.",
    faqs: [
      { q: "What counts as an SME in the UK?", a: "Generally a business with fewer than 250 employees and turnover under about £44 million, though definitions vary between schemes." },
      { q: "Are there government-backed schemes?", a: "Yes. The British Business Bank supports several programmes delivered through accredited lenders. Availability changes, so check current schemes." },
      { q: "Can I combine different types of funding?", a: "Often, yes. Many SMEs use asset finance for equipment alongside a loan or invoice finance for working capital." },
    ],
    related: ["business-loans", "business-expansion-finance", "asset-finance"],
  }),
  S({
    slug: "working-capital-finance",
    name: "Working Capital Finance",
    eyebrow: "Working capital finance UK",
    title: "Working Capital Finance UK | Manage Business Cash Flow | FundingCompany",
    description:
      "Working capital finance helps UK businesses manage cash flow, pay suppliers and cover seasonal gaps. Explore options, eligibility and costs.",
    h1: "Working capital finance to keep cash flowing",
    intro:
      "Profitable businesses can still run short of cash. Customers pay late, suppliers want paying now, and seasonal peaks need stock bought in advance. Working capital finance bridges the gap between money going out and money coming in, so you can keep operating — and growing — without straining your reserves.",
    uses: [
      "Paying suppliers while waiting for customer payments",
      "Buying stock ahead of peak season",
      "Covering payroll during a slower month",
      "Taking on a large new contract",
      "Handling an unexpected cost",
    ],
    types: [
      { t: "Revolving credit facility", d: "Draw funds when you need them, repay, and draw again within your limit." },
      { t: "Short-term loan", d: "A lump sum repaid over months rather than years." },
      { t: "Invoice finance", d: "Release cash tied up in unpaid invoices." },
      { t: "Business overdraft", d: "A flexible buffer on your current account, usually reviewed annually." },
    ],
    considerations: [
      { t: "Cash flow pattern", d: "Providers want to understand your seasonal highs and lows." },
      { t: "Debtor book", d: "For invoice-based products, the quality of your customers matters." },
      { t: "Trading history", d: "Longer trading records usually unlock more options." },
      { t: "Existing facilities", d: "Current overdrafts or loans affect affordability." },
    ],
    costs:
      "Working capital products are often priced on what you use and for how long. Watch for facility fees, non-utilisation fees and renewal charges, and compare against the cost of simply missing out on an order.",
    faqs: [
      { q: "What is working capital?", a: "Current assets (cash, stock, money owed to you) minus current liabilities (bills due within a year). It shows how easily you can cover short-term commitments." },
      { q: "Is working capital finance short term?", a: "Usually. It is designed for day-to-day and seasonal needs rather than long-term investment." },
      { q: "Do I need security?", a: "Not always. Many facilities are unsecured, while invoice finance is secured against your invoices." },
    ],
    related: ["invoice-finance", "business-loans", "small-business-loans"],
  }),
  S({
    slug: "business-expansion-finance",
    name: "Business Expansion Finance",
    eyebrow: "Business expansion finance",
    title: "Business Expansion Finance UK | Fund Your Growth | FundingCompany",
    description:
      "Planning to grow? Explore business expansion finance for new premises, hiring, acquisitions and new markets — with clear guidance on options and eligibility.",
    h1: "Business expansion finance for your next big step",
    intro:
      "Growth usually needs investment before it pays back — a new site, more people, extra equipment or an acquisition. Business expansion finance gives you the capital to move when the opportunity is right, with repayment structured around the returns your growth is expected to generate.",
    uses: [
      "Opening a second location",
      "Acquiring another business",
      "Recruiting a new team",
      "Launching in a new region or online channel",
      "Scaling manufacturing capacity",
    ],
    types: [
      { t: "Growth loans", d: "Medium to long-term loans sized around your expansion plan." },
      { t: "Acquisition finance", d: "Funding to buy another business, often structured around the target's cash flow." },
      { t: "Asset finance", d: "Spread the cost of the equipment and vehicles your growth needs." },
      { t: "Commercial mortgages", d: "Long-term finance to buy premises rather than rent." },
    ],
    considerations: [
      { t: "Business plan", d: "A credible plan with forecasts shows how the expansion will repay the funding." },
      { t: "Track record", d: "Evidence of past growth and stable profits helps." },
      { t: "Management capacity", d: "Providers consider whether the team can deliver the plan." },
      { t: "Security", d: "Larger amounts may be secured on property or assets." },
    ],
    costs:
      "Expansion funding is usually larger and longer, so small differences in rate add up. Model best, expected and cautious scenarios to make sure repayments remain affordable if growth takes longer than planned.",
    faqs: [
      { q: "How much should I borrow to expand?", a: "Enough to deliver the plan with a sensible contingency — not so much that repayments outpace realistic returns." },
      { q: "Can I phase the funding?", a: "Some facilities allow staged drawdowns as milestones are reached." },
      { q: "Is equity better for expansion?", a: "It can be for high-growth businesses with uncertain cash flow. Debt keeps ownership intact. Many businesses use a mix." },
    ],
    related: ["sme-funding", "property-finance", "asset-finance"],
  }),
  S({
    slug: "invoice-finance",
    name: "Invoice Finance",
    eyebrow: "Invoice finance for small businesses",
    title: "Invoice Finance for Small Businesses UK | Factoring & Discounting | FundingCompany",
    description:
      "Unlock cash tied up in unpaid invoices. Learn how invoice factoring and invoice discounting work for UK small businesses, plus costs and eligibility.",
    h1: "Invoice finance: get paid for work you've already done",
    intro:
      "If you sell to other businesses on 30, 60 or 90-day terms, a large share of your cash can sit in unpaid invoices. Invoice finance releases most of that value soon after you raise an invoice, so you can pay suppliers, take on new work and stop waiting on your customers' payment runs.",
    uses: [
      "Smoothing cash flow on long payment terms",
      "Funding fast growth in B2B sales",
      "Taking on larger contracts",
      "Reducing reliance on an overdraft",
    ],
    types: [
      { t: "Invoice factoring", d: "The provider manages your sales ledger and collects payment from customers. Useful if you lack credit control resources." },
      { t: "Invoice discounting", d: "You keep control of collections and customer relationships; the facility is often confidential." },
      { t: "Selective invoice finance", d: "Fund individual invoices or customers rather than your whole ledger." },
    ],
    considerations: [
      { t: "B2B sales", d: "Invoice finance works for business-to-business invoices, not consumer sales." },
      { t: "Customer quality", d: "The creditworthiness of your customers matters as much as yours." },
      { t: "Invoice volume", d: "Regular invoicing suits whole-ledger facilities." },
      { t: "Disputes", d: "Low levels of disputed invoices make your ledger more fundable." },
    ],
    costs:
      "Costs usually include a service fee (a percentage of turnover) and a discount charge (similar to interest) on the funds drawn. Check minimum terms, notice periods and any bad debt protection fees.",
    faqs: [
      { q: "How much of an invoice can I receive upfront?", a: "Commonly a large proportion of the invoice value, with the balance (minus fees) paid when your customer settles." },
      { q: "Will my customers know?", a: "With factoring they usually will. Confidential invoice discounting can keep the arrangement private." },
      { q: "What happens if a customer doesn't pay?", a: "With recourse facilities you remain responsible. Non-recourse facilities include credit protection for an extra fee." },
    ],
    related: ["working-capital-finance", "small-business-loans", "business-loans"],
  }),
  S({
    slug: "asset-finance",
    name: "Asset Finance",
    eyebrow: "Business asset finance UK",
    title: "Business Asset Finance UK | Equipment, Vehicle & Machinery Finance | FundingCompany",
    description:
      "Spread the cost of vehicles, machinery and equipment with business asset finance. Compare hire purchase, leasing and refinance options for UK businesses.",
    h1: "Asset finance for the equipment your business runs on",
    intro:
      "Asset finance lets you get the vehicles, machinery and technology you need now and pay for them over their working life. Because the asset itself supports the finance, it can be easier to arrange than unsecured borrowing — and it keeps your cash free for everything else.",
    uses: [
      "Vans, cars and HGVs",
      "Construction and agricultural machinery",
      "Manufacturing and catering equipment",
      "IT hardware, servers and software",
      "Medical and dental equipment",
    ],
    types: [
      { t: "Hire purchase", d: "Pay in instalments and own the asset after the final payment." },
      { t: "Finance lease", d: "Use the asset for most of its life for a rental, with options at the end of the term." },
      { t: "Operating lease", d: "Shorter-term rental, often with maintenance, without ownership." },
      { t: "Asset refinance", d: "Release cash from equipment you already own." },
    ],
    considerations: [
      { t: "The asset", d: "Type, age and resale value influence terms." },
      { t: "Deposit", d: "Some agreements require an upfront deposit or advance payments." },
      { t: "Ownership goal", d: "Decide whether you want to own the asset at the end." },
      { t: "Tax treatment", d: "Hire purchase and leasing are treated differently — ask your accountant." },
    ],
    costs:
      "Compare the total amount payable, any balloon or option-to-purchase fees, and the cost of insurance and maintenance. Leasing can mean lower monthly costs, while hire purchase builds ownership.",
    faqs: [
      { q: "Can I finance used equipment?", a: "Yes, many providers finance used assets, depending on age and condition." },
      { q: "Do I need a deposit?", a: "Not always. It depends on the provider, the asset and your business profile." },
      { q: "Can start-ups use asset finance?", a: "Often, because the asset provides security. A deposit or guarantee may be requested." },
    ],
    related: ["business-expansion-finance", "sme-funding", "business-loans"],
  }),
  S({
    slug: "property-finance",
    name: "Property Finance",
    eyebrow: "Commercial property finance",
    title: "Commercial Property Finance UK | Mortgages, Bridging & Development | FundingCompany",
    description:
      "Explore commercial property finance in the UK — commercial mortgages, bridging loans and development finance for buying, refinancing or building business premises.",
    h1: "Commercial property finance for premises and projects",
    intro:
      "Owning your premises can provide stability and a long-term asset. Commercial property finance covers buying a property for your own business, investing in let commercial property, short-term bridging and development projects. Terms depend heavily on the property, your deposit and the strength of the business or rental income.",
    uses: [
      "Buying offices, shops, warehouses or units",
      "Refinancing an existing commercial mortgage",
      "Purchasing at auction with bridging finance",
      "Refurbishing or converting a building",
      "Ground-up development projects",
    ],
    types: [
      { t: "Owner-occupier commercial mortgage", d: "Long-term borrowing to buy premises your business trades from." },
      { t: "Commercial investment mortgage", d: "Finance for property let to other businesses." },
      { t: "Bridging loans", d: "Short-term secured funding for fast purchases or chain breaks." },
      { t: "Development finance", d: "Staged funding for construction and major refurbishment." },
    ],
    considerations: [
      { t: "Deposit", d: "Commercial mortgages often require a meaningful deposit." },
      { t: "Property type", d: "Location, use and condition all affect lending." },
      { t: "Income cover", d: "Business profits or rent must comfortably cover repayments." },
      { t: "Exit strategy", d: "Bridging and development finance need a clear plan to repay." },
    ],
    costs:
      "Expect arrangement fees, valuation and legal costs alongside interest. Bridging and development finance are typically priced monthly and suit short-term use. Your property may be repossessed if you do not keep up repayments.",
    faqs: [
      { q: "How long are commercial mortgage terms?", a: "Often between 3 and 25 years, depending on the provider and property." },
      { q: "Can I use bridging finance for a business purchase?", a: "Yes, bridging can fund a property purchase quickly while longer-term finance is arranged." },
      { q: "Is commercial property finance regulated?", a: "Most commercial lending to businesses is not regulated by the FCA, unlike residential mortgages. Ask your provider how you are protected." },
    ],
    related: ["business-expansion-finance", "asset-finance", "sme-funding"],
  }),
];

import { moreLoans } from "./more-loans";
import { extraPages } from "./extra-pages";
services.push(...moreLoans, ...extraPages);

export const getService = (slug: string) => services.find((s) => s.slug === slug);
