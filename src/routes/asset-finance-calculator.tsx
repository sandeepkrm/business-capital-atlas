import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { CtaBand, Page, PageHero, RiskNotice, seo } from "@/components/SiteShell";

const crumbs = [{ name: "Calculators", path: "/business-loan-calculator" }, { name: "Asset finance calculator", path: "/asset-finance-calculator" }];

export const Route = createFileRoute("/asset-finance-calculator")({
  head: ({ matches }) => seo({ matches,
    title: "Asset Finance Calculator UK | Equipment & Vehicle Payments | FundingCompany",
    description: "Estimate monthly payments on equipment, machinery or vehicle finance by price, deposit, rate, term and balloon payment.",
    path: "/asset-finance-calculator",
    crumbs,
  }),
  component: () => (
    <Page>
      <PageHero eyebrow="Asset finance calculator" title="Asset finance calculator" intro="Estimate monthly payments for vans, machinery and equipment." crumbs={crumbs} />
      <section className="container-x py-16"><Calculator mode="asset" /></section>
      <section className="container-x prose-fc max-w-3xl">
        <h2>Deposits and balloon payments</h2>
        <p>A larger deposit reduces the amount financed and your monthly payment. A balloon payment defers part of the cost to the end of the agreement, lowering monthly payments but leaving a larger final sum.</p>
        <h2>Hire purchase vs leasing</h2>
        <p>This calculator is based on a hire purchase style agreement where you own the asset at the end. Leasing works differently — see <Link to="/$slug" params={{ slug: "finance-leasing" }} className="text-signal underline">finance leasing</Link> or <Link to="/$slug" params={{ slug: "asset-finance" }} className="text-signal underline">asset finance</Link>.</p>
      </section>
      <section className="container-x pt-12"><RiskNotice /></section>
      <CtaBand />
    </Page>
  ),
});
