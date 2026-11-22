import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, Page, PageHero, seo } from "@/components/SiteShell";
import { guides } from "@/lib/guides";

const crumbs = [{ name: "Funding guides", path: "/guides" }];

export const Route = createFileRoute("/guides/")({
  head: ({ matches }) => seo({ matches,
    title: "Business Finance Guides UK | Funding Knowledge Centre | FundingCompany",
    description: "Practical business finance guides for UK owners: loans, cash flow, invoice finance, asset finance, growth funding and applying with confidence.",
    path: "/guides",
    crumbs,
  }),
  component: Guides,
});

function Guides() {
  const cats = [...new Set(guides.map((g) => g.category))];
  return (
    <Page>
      <PageHero eyebrow="Funding knowledge centre" title="Business finance guides" intro="Plain-English guides to help you understand your options before you borrow." crumbs={crumbs} />
      <div className="container-x space-y-14 py-16">
        {cats.map((c) => (
          <section key={c}>
            <h2 className="text-2xl font-semibold">{c}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {guides.filter((g) => g.category === c).map((g) => (
                <Link key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} className="rounded-2xl border bg-card p-6 transition hover:shadow-lg">
                  <p className="eyebrow">{g.read} read</p>
                  <h3 className="mt-3 text-lg font-semibold">{g.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      <CtaBand />
    </Page>
  );
}
