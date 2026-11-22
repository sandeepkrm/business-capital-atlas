import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CtaBand, Page, PageHero, seo } from "@/components/SiteShell";
import { getGuide } from "@/lib/guides";
import { getService } from "@/lib/services";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const g = getGuide(params.slug);
    if (!g) throw notFound();
    return g;
  },
  head: ({ loaderData: g, matches }) => {
    if (!g) return { meta: [{ title: "Guide not found | FundingCompany" }, { name: "robots", content: "noindex" }] };
    const path = `/guides/${g.slug}`;
    return seo({
      matches,
      title: `${g.title} | FundingCompany`,
      description: g.description,
      path,
      type: "article",
      crumbs: [{ name: "Guides", path: "/guides" }, { name: g.title, path }],
      jsonLd: [{ "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, publisher: { "@type": "Organization", name: "FundingCompany" } }],
    });
  },
  component: GuidePage,
});

function GuidePage() {
  const g = Route.useLoaderData();
  return (
    <Page>
      <PageHero eyebrow={`${g.category} · ${g.read} read`} title={g.title} intro={g.description} crumbs={[{ name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} />
      <article className="container-x prose-fc max-w-3xl py-12">
        {g.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((p) => <p key={p}>{p}</p>)}
          </section>
        ))}
        <div className="mt-12 rounded-2xl border bg-card p-6">
          <p className="font-semibold">Related funding routes</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {g.related.map((r) => { const s = getService(r); return s ? <li key={r}><Link to="/$slug" params={{ slug: r }} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium">{s.name}</Link></li> : null; })}
          </ul>
        </div>
        <p className="mt-8 text-xs">This guide is general information, not financial advice. Speak to a qualified adviser about your circumstances.</p>
      </article>
      <CtaBand />
    </Page>
  );
}
