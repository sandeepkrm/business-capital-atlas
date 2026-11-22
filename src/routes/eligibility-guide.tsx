import { createFileRoute, Link } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CtaBand, Page, PageHero, RiskNotice, seo } from "@/components/SiteShell";

const crumbs = [{ name: "Eligibility guide", path: "/eligibility-guide" }];

export const Route = createFileRoute("/eligibility-guide")({
  head: ({ matches }) => seo({ matches,
    title: "Business Loan Eligibility UK | What Lenders Look For | FundingCompany",
    description: "Understand UK business loan eligibility: trading history, turnover, affordability, credit profile and documents — plus how to strengthen your application.",
    path: "/eligibility-guide",
    crumbs,
  }),
  component: Elig,
});

const criteria = [
  ["Trading history", "Some products are open to start-ups, but many providers prefer at least 6 months and some ask for 2 years of filed accounts. Longer histories usually open up more choice and better terms."],
  ["Turnover", "Providers look at the scale and consistency of your income. Minimum turnover levels vary widely between products."],
  ["Affordability", "Your bank statements show whether the new repayment fits alongside rent, payroll, existing finance and other costs."],
  ["Credit profile", "Business credit files and directors' personal credit history are commonly checked. Missed payments, CCJs or defaults may narrow options, but don't always rule funding out."],
  ["Business structure", "Limited companies, LLPs, partnerships and sole traders can all access finance, though guarantees and paperwork differ."],
  ["Security and guarantees", "Secured finance needs an asset. Unsecured finance often requires a personal guarantee from directors."],
];

function Elig() {
  return (
    <Page>
      <PageHero eyebrow="Business loan eligibility UK" title="Business loan eligibility: what providers look for" intro="No two providers use exactly the same criteria, but most assess the same core areas. Here's what they are and how to prepare." crumbs={crumbs} />
      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {criteria.map(([t, d], i) => (
            <div key={t} className="rounded-2xl border bg-card p-6">
              <span className="font-display text-sm font-semibold text-signal">0{i + 1}</span>
              <h2 className="mt-2 text-xl font-semibold">{t}</h2>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-x prose-fc max-w-3xl">
        <h2>Documents you may be asked for</h2>
        <p>Photo ID and proof of address for directors; 3–6 months of business bank statements; your latest filed accounts; for larger requests, management accounts, cash flow forecasts and a business plan.</p>
        <h2>How to strengthen your enquiry</h2>
        <p>Keep your bank account well managed, file accounts on time, check your credit reports for errors, explain the purpose of the funding clearly, and only request what you can comfortably repay.</p>
        <h2>Does checking eligibility affect my credit score?</h2>
        <p>Initial eligibility checks are often based on soft searches, which are not visible to other lenders. A full application may require a hard search, and you should be told before one takes place.</p>
        <p>Next, <Link to="/business-loan-calculator" className="text-signal underline">estimate your repayments</Link> or explore <Link to="/$slug" params={{ slug: "small-business-loans" }} className="text-signal underline">small business loans</Link>.</p>
      </section>
      <section className="container-x py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 shadow-xl">
          <h2 className="font-display text-2xl font-semibold">Check your eligibility</h2>
          <p className="mb-6 mt-2 text-sm text-muted-foreground">Send us a few details and we'll explain which funding routes may suit your business.</p>
          <EnquiryForm source="/eligibility-guide" />
        </div>
      </section>
      <section className="container-x pb-8"><RiskNotice /></section>
      <CtaBand />
    </Page>
  );
}
