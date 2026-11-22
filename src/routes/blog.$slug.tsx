import { createFileRoute, notFound } from "@tanstack/react-router";
import { CmsArticle } from "@/components/CmsArticle";
import { seo } from "@/components/SiteShell";
import { getCmsPage } from "@/lib/cms.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const p = await getCmsPage({ data: { kind: "post", slug: params.slug } });
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData: p, matches }) => {
    if (!p) return { meta: [{ title: "Article not found | FundingCompany" }, { name: "robots", content: "noindex" }] };
    const path = `/blog/${p.slug}`;
    return seo({
      matches,
      title: p.seo_title || `${p.title} | FundingCompany Blog`,
      description: p.seo_description || p.excerpt || "",
      path,
      type: "article",
      image: p.hero_image_url,
      crumbs: [{ name: "Blog", path: "/blog" }, { name: p.title, path }],
      jsonLd: [{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt, datePublished: p.published_at, dateModified: p.updated_at, author: { "@type": "Organization", name: p.author || "FundingCompany" } }],
    });
  },
  component: Post,
});

function Post() {
  const p = Route.useLoaderData();
  return <CmsArticle page={p} crumbs={[{ name: "Blog", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]} />;
}
