import { createFileRoute } from "@tanstack/react-router";
import { CmsArticle } from "@/components/CmsArticle";
import { getCmsPage } from "@/lib/cms.functions";
import { Page, PageHero, seo, useSiteSettings } from "@/components/SiteShell";
import { CompanyDetails } from "@/components/CompanyDetails";

const crumbs = [{ name: "Legal & regulatory", path: "/legal" }];

export const Route = createFileRoute("/legal")({
  head: ({ matches, loaderData: cms }) => seo({ matches,
    title: cms?.seo_title || "Legal, Privacy & Regulatory Information | FundingCompany",
    description: cms?.seo_description || "FundingCompany's legal identity, service model, privacy notice and regulatory information for UK business funding enquiries.",
    image: cms?.hero_image_url ?? null,
    path: "/legal",
    crumbs,
  }),
  loader: () => getCmsPage({ data: { kind: "page", slug: "legal" } }).catch(() => null),
  component: Legal,
});

function Legal() {
  const cms = Route.useLoaderData();
  const st = useSiteSettings();
  if (cms) return <CmsArticle page={cms} crumbs={crumbs}><CompanyDetails /></CmsArticle>;
  return (
    <Page>
      <PageHero eyebrow="Legal" title="Legal & regulatory information" crumbs={crumbs} />
      <section className="container-x prose-fc max-w-3xl py-12">
        {!st?.company_name && <p>Company and regulatory details have not yet been published. Please contact FundingCompany to confirm the legal identity and regulatory status before proceeding.</p>}
        <h2>Our service</h2>
        <p>FundingCompany is not a lender. We help businesses explore finance options and may introduce them to finance providers. We may receive a commission from providers; this will be disclosed to you.</p>
        <h2>Privacy notice</h2>
        <p>We use the information you provide to respond to your enquiry and, with your consent, to share it with selected finance providers. You can ask to access, correct or delete your data at any time by contacting us.</p>
        <h2>Important information</h2>
        <p>All finance is subject to status and eligibility. Information on this website is general guidance and not financial advice. Your property may be repossessed if you do not keep up repayments on a mortgage or other debt secured on it.</p>
      </section>
      <CompanyDetails />
    </Page>
  );
}
