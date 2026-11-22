import { createFileRoute } from "@tanstack/react-router";
import { guides } from "@/lib/guides";
import { services } from "@/lib/services";

const staticPaths = ["/", "/business-loan-calculator", "/eligibility-guide", "/guides", "/how-it-works", "/about", "/contact", "/faqs", "/legal", "/glossary", "/invoice-finance-calculator", "/asset-finance-calculator", "/blog", "/partners", "/funding-advisor", "/lenders"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { publicDb } = await import("@/lib/public-db.server");
        const { data: cms } = await publicDb().from("cms_pages").select("kind, slug").eq("published", true);
        const cmsPaths = (cms ?? []).map((c) => (c.kind === "post" ? `/blog/${c.slug}` : `/${c.slug}`));
        const paths = [...new Set([...staticPaths, ...cmsPaths, ...services.map((s) => `/${s.slug}`), ...guides.map((g) => `/guides/${g.slug}`)])];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
