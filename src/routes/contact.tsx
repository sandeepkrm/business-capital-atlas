import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Page, PageHero, seo } from "@/components/SiteShell";

const crumbs = [{ name: "Contact", path: "/contact" }];

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => z.object({ amount: z.string().max(40).optional(), purpose: z.string().max(160).optional() }).parse(s),
  head: ({ matches }) => seo({ matches,
    title: "Start Your Business Funding Enquiry | Contact FundingCompany",
    description: "Tell us about your business and funding goal. Free, no-obligation enquiry — initial checks won't affect your credit score.",
    path: "/contact",
    crumbs,
  }),
  component: Contact,
});

function Contact() {
  const { amount, purpose } = Route.useSearch();
  return (
    <Page>
      <PageHero eyebrow="Funding enquiry" title="Tell us what your business needs" intro="A few details help us understand which funding routes may suit you. Free and no obligation." crumbs={crumbs} />
      <section className="container-x -mt-10 pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 shadow-xl">
          <EnquiryForm defaultAmount={amount ?? ""} defaultPurpose={purpose ?? ""} source="/contact" />
        </div>
      </section>
    </Page>
  );
}
