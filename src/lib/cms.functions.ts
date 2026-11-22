import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicDb } from "./public-db.server";

export type NavItem = { id: string; menu: string; section: string | null; label: string; href: string; sort_order: number };
export type SeoOverride = { path: string; title: string | null; description: string | null; og_image_url: string | null; noindex: boolean };
export type SiteSettings = {
  company_name: string | null; trading_name: string | null; company_number: string | null; registered_address: string | null;
  fca_status: string | null; fca_number: string | null; principal_firm: string | null; phone: string | null; email: string | null;
  social: Record<string, string>; company_history: string | null; company_services: string | null;
};

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicDb();
  const [nav, seo, st] = await Promise.all([
    db.from("nav_items").select("id, menu, section, label, href, sort_order").eq("visible", true).order("sort_order"),
    db.from("seo_overrides").select("path, title, description, og_image_url, noindex"),
    db.from("site_settings").select("company_name, trading_name, company_number, registered_address, fca_status, fca_number, principal_firm, phone, email, social, company_history, company_services").eq("id", 1).maybeSingle(),
  ]);
  return { nav: (nav.data ?? []) as NavItem[], seo: (seo.data ?? []) as SeoOverride[], settings: (st.data ?? null) as SiteSettings | null };
});

const pageCols = "id, kind, slug, title, seo_title, seo_description, eyebrow, excerpt, body, hero_image_url, category, author, published_at, updated_at";

export const getCmsPage = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ kind: z.enum(["page", "post"]), slug: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row } = await publicDb().from("cms_pages").select(pageCols).eq("kind", data.kind).eq("slug", data.slug).eq("published", true).maybeSingle();
    return row ?? null;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicDb()
    .from("cms_pages")
    .select("slug, title, excerpt, category, hero_image_url, published_at, author")
    .eq("kind", "post").eq("published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
});

export const listPublishedSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicDb().from("cms_pages").select("kind, slug").eq("published", true);
  return data ?? [];
});

export type Lender = { id: string; name: string; logo_url: string | null; description: string | null; products: string[]; rate_from: string | null; min_amount: string | null; max_amount: string | null; term: string | null; speed: string | null; apply_url: string | null; featured: boolean; source_url: string | null; checked_at: string | null; relationship: string };

export const listLenders = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ product: z.string().max(100).optional() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    let q = publicDb().from("lenders").select("id, name, logo_url, description, products, rate_from, min_amount, max_amount, term, speed, apply_url, featured, source_url, checked_at, relationship").eq("visible", true);
    if (data.product) q = q.contains("products", [data.product]);
    const { data: rows } = await q.order("featured", { ascending: false }).order("sort_order");
    return (rows ?? []) as Lender[];
  });
