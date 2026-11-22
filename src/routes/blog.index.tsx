import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand, Page, PageHero, seo } from "@/components/SiteShell";
import { listPosts } from "@/lib/cms.functions";

const crumbs = [{ name: "Blog", path: "/blog" }];

export const Route = createFileRoute("/blog/")({
  loader: () => listPosts(),
  head: ({ matches }) => seo({ matches,
    title: "Business Finance Blog UK | News & Insights | FundingCompany",
    description: "News, insights and practical tips on UK business loans, cash flow, asset finance and growth funding from the FundingCompany team.",
    path: "/blog",
    crumbs,
  }),
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();
  return (
    <Page>
      <PageHero eyebrow="Blog" title="Business finance insights" intro="News, explainers and practical tips for UK business owners." crumbs={crumbs} />
      <section className="container-x py-16">
        {posts.length === 0 ? <p className="text-muted-foreground">New articles are coming soon.</p> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl border bg-card transition hover:-translate-y-1 hover:shadow-xl">
                {p.hero_image_url ? <img src={p.hero_image_url} alt={p.title} loading="lazy" className="aspect-[16/9] w-full object-cover" /> : <div className="hero-glow aspect-[16/9]" />}
                <div className="p-6">
                  <p className="eyebrow">{p.category ?? "Article"}{p.published_at && ` · ${new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}</p>
                  <h2 className="mt-3 text-xl font-semibold">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
        <p className="mt-10 text-sm text-muted-foreground">Looking for in-depth explainers? Browse our <Link to="/guides" className="text-signal underline">funding guides</Link>.</p>
      </section>
      <CtaBand />
    </Page>
  );
}
