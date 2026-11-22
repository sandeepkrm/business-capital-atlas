import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, Page, PageHero, seo } from "@/components/SiteShell";

const crumbs = [{ name: "Finance glossary", path: "/glossary" }];

const terms: [string, string][] = [
  ["APR", "Annual Percentage Rate — the yearly cost of borrowing including interest and certain fees."],
  ["Arrangement fee", "A one-off charge for setting up a loan or facility, sometimes added to the loan."],
  ["Asset finance", "Funding to acquire equipment or vehicles, secured on the asset itself."],
  ["Balloon payment", "A larger final payment at the end of some finance agreements."],
  ["Bridging loan", "Short-term secured finance used until longer-term funding or a sale completes."],
  ["CCJ", "County Court Judgment — a court order for unpaid debt that appears on credit files."],
  ["Debenture", "A legal charge giving a lender security over a company's assets."],
  ["Early repayment charge", "A fee for repaying borrowing before the end of the agreed term."],
  ["Factor rate", "A fixed multiplier used to price some short-term finance, e.g. 1.2 × the amount borrowed."],
  ["Hard credit search", "A credit check visible to other lenders, usually made on full application."],
  ["Invoice discounting", "Borrowing against unpaid invoices while you keep control of collections."],
  ["Invoice factoring", "Borrowing against invoices where the provider manages collections."],
  ["Loan-to-value (LTV)", "The loan amount as a percentage of the security's value."],
  ["Personal guarantee", "A director's personal promise to repay business debt if the business cannot."],
  ["Revolving credit", "A reusable credit limit you can draw, repay and redraw."],
  ["Secured loan", "Borrowing backed by an asset that may be at risk if repayments are missed."],
  ["Soft credit search", "A credit check that isn't visible to other lenders and doesn't affect your score."],
  ["Term", "The length of time over which borrowing is repaid."],
  ["Unsecured loan", "Borrowing without a specific asset pledged as security."],
  ["Working capital", "Current assets minus current liabilities — the cash available to run day to day."],
];

export const Route = createFileRoute("/glossary")({
  head: ({ matches }) => seo({ matches,
    title: "Business Finance Glossary | Funding Terms Explained | FundingCompany",
    description: "Plain-English definitions of common UK business finance terms — APR, factor rate, LTV, personal guarantees, invoice finance and more.",
    path: "/glossary",
    crumbs,
    jsonLd: [{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Business finance glossary", hasDefinedTerm: terms.map(([n, d]) => ({ "@type": "DefinedTerm", name: n, description: d })) }],
  }),
  component: Glossary,
});

function Glossary() {
  return (
    <Page>
      <PageHero eyebrow="Resources" title="Business finance glossary" intro="The funding terms you'll come across, explained in plain English." crumbs={crumbs} />
      <dl className="container-x grid max-w-4xl gap-3 py-16 md:grid-cols-2">
        {terms.map(([t, d]) => (
          <div key={t} className="rounded-xl border bg-card p-5"><dt className="font-display text-lg font-semibold">{t}</dt><dd className="mt-1 text-muted-foreground">{d}</dd></div>
        ))}
      </dl>
      <CtaBand />
    </Page>
  );
}
