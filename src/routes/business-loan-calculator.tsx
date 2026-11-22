import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { CtaBand, Page, PageHero, RiskNotice, seo } from "@/components/SiteShell";

const crumbs = [{ name: "Business loan calculator", path: "/business-loan-calculator" }];

export const Route = createFileRoute("/business-loan-calculator")({
  head: ({ matches }) => seo({ matches,
    title: "Business Loan Calculator UK | Estimate Monthly Repayments | FundingCompany",
    description: "Use our free UK business loan calculator to estimate monthly repayments, total repayable and borrowing costs by amount, rate, term and fees.",
    path: "/business-loan-calculator",
    crumbs,
  }),
  component: CalcPage,
});

function CalcPage() {
  return (
    <Page>
      <PageHero eyebrow="Business loan calculator UK" title="Business loan calculator" intro="Adjust the amount, interest rate, term and fees to see an illustrative monthly repayment and the total cost of borrowing." crumbs={crumbs} />
      <section className="container-x py-16"><Calculator /></section>
      <section className="container-x prose-fc max-w-3xl pb-8">
        <h2>How the calculator works</h2>
        <p>The calculator uses a standard repayment formula, assuming a fixed annual interest rate and equal monthly instalments over the term. Fees are added to the total repayable so you can see the full cost.</p>
        <h2>Why your actual repayment may differ</h2>
        <p>Real offers depend on your business profile, the finance type and the provider. Some products are priced with a fixed fee or factor rate rather than interest, some have variable rates, and some — like merchant cash advances or invoice finance — don't have fixed monthly repayments at all.</p>
        <h2>Tips for using your estimate</h2>
        <p>Test a cautious scenario with a higher rate. Compare a shorter term (lower total cost) against a longer one (lower monthly payment). Then check the repayment against your quietest trading month, not your average.</p>
        <p>Ready to explore real options? <Link to="/$slug" params={{ slug: "business-loans" }} className="text-signal underline">Read about business loans</Link> or <Link to="/contact" className="text-signal underline">start an enquiry</Link>.</p>
      </section>
      <section className="container-x pt-12"><RiskNotice /></section>
      <CtaBand />
    </Page>
  );
}
