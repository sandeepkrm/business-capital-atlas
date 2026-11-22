import { createFileRoute } from "@tanstack/react-router";
import { AdminApp } from "@/components/admin/AdminApp";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin | FundingCompany CMS" }, { name: "description", content: "Manage FundingCompany pages, lender figures, enquiries and FundingMate knowledge." }, { property: "og:title", content: "Admin | FundingCompany CMS" }, { property: "og:description", content: "FundingCompany content and enquiry management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminApp,
});
