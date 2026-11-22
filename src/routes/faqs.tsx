import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, Page, PageHero, seo } from "@/components/SiteShell";

const crumbs = [{ name: "FAQs", path: "/faqs" }];

const faqs = [
  ["Is FundingCompany a lender?", "No. We help businesses understand finance options and explore suitable funding routes. Any lending decision is made by the provider."],
  ["Does it cost anything to enquire?", "No. Enquiring is free and there's no obligation to proceed with any option."],
  ["Will enquiring affect my credit score?", "Initial checks are typically soft searches, which don't affect your score. You'll be told before any hard search."],
  ["What types of business can apply?", "Limited companies, LLPs, partnerships and sole traders across most UK sectors. Options vary by product."],
  ["How quickly can I get funding?", "It depends on the product and how quickly documents are provided. Some smaller facilities can be decided in days; property finance takes longer."],
  ["Can start-ups get funding?", "Some routes are open to newer businesses, including asset finance and government-backed Start Up Loans."],
  ["What information do I need?", "Usually ID, recent business bank statements and, for limited companies, filed accounts. Larger requests may need forecasts."],
  ["What's the difference between secured and unsecured finance?", "Secured finance is backed by an asset that may be at risk if you don't repay; unsecured finance isn't, but usually involves a personal guarantee."],
];

export const Route = createFileRoute("/faqs")({
  head: ({ matches }) => seo({ matches,
    title: "Business Funding FAQs | FundingCompany",
    description: "Answers to common questions about UK business funding, eligibility, credit checks, costs and how FundingCompany works.",
    path: "/faqs",
    crumbs,
  }),
  component: Faqs,
});

function Faqs() {
  return (
    <Page>
      <PageHero eyebrow="FAQs" title="Frequently asked questions" crumbs={crumbs} />
      <section className="container-x max-w-3xl space-y-3 py-16">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-xl border bg-card p-5">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </section>
      <CtaBand />
    </Page>
  );
}
