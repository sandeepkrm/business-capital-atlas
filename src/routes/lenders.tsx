import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LenderList } from "@/components/LenderList";
import { CtaBand, Page, PageHero, RiskNotice, seo } from "@/components/SiteShell";
import { listLenders } from "@/lib/cms.functions";
import { services } from "@/lib/services";

const crumbs = [{ name: "Lender directory", path: "/lenders" }];

export const Route = createFileRoute("/lenders")({
  loader: () => listLenders({ data: {} }),
  head: ({ matches }) => seo({ matches,
    title: "UK Business Lender Directory | Rates, Terms & Products | FundingCompany",
    description: "Browse published UK bank business loan amounts, representative rates and terms with official lender links. All lending is subject to status.",
    path: "/lenders",
    crumbs,
  }),
  component: Lenders,
});

function Lenders() {
  const all = Route.useLoaderData();
  const [product, setProduct] = useState("");
  const shown = product ? all.filter((l) => l.products.includes(product)) : all;
  const used = services.filter((s) => all.some((l) => l.products.includes(s.slug)));
  return (
    <Page>
      <PageHero eyebrow="Lender directory" title="UK lenders and business funding" intro="Compare publicly advertised products, rates, amounts and terms. Directory inclusion does not imply a partnership. Every application is subject to the lender's own checks and a personalised quote." crumbs={crumbs} />
      <section className="container-x py-16">
        {used.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button onClick={() => setProduct("")} className={`rounded-full border px-4 py-2 text-sm ${!product ? "bg-ink text-ink-foreground" : "bg-card"}`}>All</button>
            {used.map((s) => <button key={s.slug} onClick={() => setProduct(s.slug)} className={`rounded-full border px-4 py-2 text-sm ${product === s.slug ? "bg-ink text-ink-foreground" : "bg-card"}`}>{s.name}</button>)}
          </div>
        )}
        {shown.length ? <LenderList lenders={shown} showProducts /> : <p className="text-muted-foreground">Our lender directory is being updated. Please <a href="/contact" className="text-signal underline">contact us</a> to discuss your options.</p>}
        <div className="mt-10"><RiskNotice /></div>
      </section>
      <CtaBand />
    </Page>
  );
}
