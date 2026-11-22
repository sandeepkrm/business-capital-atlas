import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { CtaBand, Page, PageHero, RiskNotice, seo } from "@/components/SiteShell";

const crumbs = [{ name: "Calculators", path: "/business-loan-calculator" }, { name: "Invoice finance calculator", path: "/invoice-finance-calculator" }];

export const Route = createFileRoute("/invoice-finance-calculator")({
  head: ({ matches }) => seo({ matches,
    title: "Invoice Finance Calculator UK | Estimate Cash & Fees | FundingCompany",
    description: "Estimate how much cash invoice finance could release upfront and what it may cost, by invoice value, advance rate, fees and payment terms.",
    path: "/invoice-finance-calculator",
    crumbs,
  }),
  component: () => (
    <Page>
      <PageHero eyebrow="Invoice finance calculator" title="Invoice finance calculator" intro="See how much cash could be released from an unpaid invoice, and an illustrative cost." crumbs={crumbs} />
      <section className="container-x py-16"><Calculator mode="invoice" /></section>
      <section className="container-x prose-fc max-w-3xl">
        <h2>How invoice finance is priced</h2>
        <p>Most facilities combine a service fee — a percentage of your invoice value or turnover — with a discount charge, which works like interest on the money you draw, for as long as the invoice is outstanding.</p>
        <h2>What the advance rate means</h2>
        <p>The advance rate is the share of the invoice paid to you upfront. The remainder, minus fees, is released when your customer pays.</p>
        <p>Learn more about <Link to="/$slug" params={{ slug: "invoice-finance" }} className="text-signal underline">invoice finance</Link>, <Link to="/$slug" params={{ slug: "invoice-factoring" }} className="text-signal underline">factoring</Link> and <Link to="/$slug" params={{ slug: "invoice-discounting" }} className="text-signal underline">discounting</Link>.</p>
      </section>
      <section className="container-x pt-12"><RiskNotice /></section>
      <CtaBand />
    </Page>
  ),
});
