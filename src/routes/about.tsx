import { createFileRoute } from "@tanstack/react-router";
import { CmsArticle } from "@/components/CmsArticle";
import { getCmsPage } from "@/lib/cms.functions";
import { CtaBand, Page, PageHero, seo, useSiteSettings } from "@/components/SiteShell";
import { CompanyDetails } from "@/components/CompanyDetails";

const crumbs = [{ name: "About us", path: "/about" }];

export const Route = createFileRoute("/about")({
  head: ({ matches, loaderData: cms }) => seo({ matches,
    title: cms?.seo_title || "About FundingCompany | Business Funding, Made Clearer",
    description: cms?.seo_description || "FundingCompany helps UK business owners understand finance options and connect with suitable funding routes — clearly, transparently and without pressure.",
    image: cms?.hero_image_url ?? null,
    path: "/about",
    crumbs,
  }),
  loader: () => getCmsPage({ data: { kind: "page", slug: "about" } }).catch(() => null),
  component: About,
});

function About() {
  const cms = Route.useLoaderData();
  const st = useSiteSettings();
  if (cms) return <CmsArticle page={cms} crumbs={crumbs}><CompanyDetails /></CmsArticle>;
  return (
    <Page>
      <PageHero eyebrow="About us" title="Business funding, made clearer." intro="Less searching. More informed funding decisions." crumbs={crumbs} />
      <section className="container-x prose-fc max-w-3xl py-12">
        <p>Most business owners aren't finance specialists — and they shouldn't need to be. Yet finding the right funding often means wading through jargon, comparing products that look the same, and wondering which route actually fits.</p>
        <p>We start with what your business is trying to achieve — managing cash flow, buying equipment, expanding or funding property — and help you understand the routes that may fit.</p>
        {st?.company_history && <><h2>Our history</h2><p className="whitespace-pre-wrap">{st.company_history}</p></>}
        {st?.company_services && <><h2>Our services</h2><p className="whitespace-pre-wrap">{st.company_services}</p></>}
        <h2>What we believe</h2>
        <p><strong>Clarity first.</strong> Every page explains how finance works, what it costs and what providers look for.</p>
        <p><strong>Honest guidance.</strong> We explain funding options without promising approval. FundingCompany is not a lender.</p>
        <p><strong>Your choice.</strong> Enquiring is free and there's no obligation to proceed.</p>
      </section>
      <CompanyDetails />
      <CtaBand />
    </Page>
  );
}
