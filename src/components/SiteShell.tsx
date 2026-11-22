import { Link, useLoaderData } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import type { NavItem, SeoOverride, SiteSettings } from "@/lib/cms.functions";
import { ChevronDown, Facebook, Instagram, Linkedin, Menu, Twitter, X, Youtube } from "lucide-react";

export function useSiteSettings(): SiteSettings | null {
  const data = useLoaderData({ from: "__root__", structuralSharing: false }) as { settings?: SiteSettings | null } | undefined;
  return data?.settings ?? null;
}

const socialIcons = [
  ["linkedin", "LinkedIn", Linkedin], ["x", "X (Twitter)", Twitter], ["facebook", "Facebook", Facebook],
  ["instagram", "Instagram", Instagram], ["youtube", "YouTube", Youtube],
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  const social = useSiteSettings()?.social ?? {};
  return (
    <div className={`flex gap-2 ${className}`}>
      {socialIcons.map(([k, label, Icon]) => social[k] ? (
        <a key={k} href={social[k]} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/20 transition hover:bg-accent hover:text-accent-foreground">
          <Icon className="h-4 w-4" />
        </a>
      ) : null)}
    </div>
  );
}
import { useState, type ReactNode } from "react";
import { calculators, loanGroups } from "@/lib/menu";
import { getService } from "@/lib/services";

type Item = { label: string; href: string; desc?: string };
type Menu = { label: string; items?: Item[]; columns?: { label: string; items: Item[] }[] };

const staticNav = (): NavItem[] => {
  const rows: NavItem[] = [];
  let o = 0;
  const push = (menu: string, section: string | null, label: string, href: string) => rows.push({ id: `${o}`, menu, section, label, href, sort_order: o++ });
  for (const g of loanGroups) for (const x of g.slugs) { const sv = getService(x); if (sv) push("Loans", g.label, sv.name, `/${x}`); }
  for (const c of calculators) push("Calculators", null, c.label, c.to);
  [["Blog", "/blog"], ["Funding guides", "/guides"], ["AI Funding Advisor", "/funding-advisor"], ["Eligibility guide", "/eligibility-guide"], ["Finance glossary", "/glossary"], ["FAQs", "/faqs"]].forEach(([l, h]) => push("Resources", null, l!, h!));
  [["About us", "/about"], ["How it works", "/how-it-works"], ["Become a partner", "/partners"], ["Contact", "/contact"], ["Legal & regulatory", "/legal"]].forEach(([l, h]) => push("Company", null, l!, h!));
  return rows;
};

export function buildMenus(nav: NavItem[]): Menu[] {
  const menus: Menu[] = [];
  for (const n of [...nav].sort((a, b) => a.sort_order - b.sort_order)) {
    let m = menus.find((x) => x.label === n.menu);
    if (!m) { m = { label: n.menu }; menus.push(m); }
    const item = { label: n.label, href: n.href };
    if (n.section) {
      m.columns ??= [];
      let c = m.columns.find((x) => x.label === n.section);
      if (!c) { c = { label: n.section, items: [] }; m.columns.push(c); }
      c.items.push(item);
    } else (m.items ??= []).push(item);
  }
  return menus;
}

const allItems = (m: Menu) => [...(m.columns?.flatMap((c) => c.items) ?? []), ...(m.items ?? [])];

function useNav(): NavItem[] {
  const data = useLoaderData({ from: "__root__", structuralSharing: false }) as { nav?: NavItem[] } | undefined;
  return data?.nav?.length ? data.nav : staticNav();
}

function MenuLink({ i, onClick, className }: { i: Item; onClick?: () => void; className?: string }) {
  if (/^https?:/.test(i.href)) return <a href={i.href} onClick={onClick} className={className} rel="noopener">{i.label}</a>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Link to={i.href as any} onClick={onClick} className={className}>{i.label}{i.desc && <span className="block text-xs font-normal text-muted-foreground">{i.desc}</span>}</Link>;
}

export function Logo({ className = "h-10" }: { className?: string }) {
  return <img src={logo.url} alt="FundingCompany — Your vision, our finance" width={300} height={104} className={`${className} w-auto`} />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menus = buildMenus(useNav());
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 text-foreground backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="FundingCompany home"><Logo className="h-12" /></Link>
        <nav className="hidden h-full items-center gap-1 text-sm font-medium lg:flex">
          {menus.map((m) => (
            <div key={m.label} className={`group flex h-full items-center ${m.columns ? "static" : "relative"}`}>
              <button className="flex items-center gap-1 rounded-full px-3 py-2 group-hover:bg-secondary">{m.label}<ChevronDown className="h-4 w-4 transition group-hover:rotate-180" /></button>
              <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {m.columns ? (
                  <div className="grid w-[860px] grid-cols-3 gap-6 rounded-2xl border bg-popover p-6 text-popover-foreground shadow-2xl">
                    {m.columns.map((c) => (
                      <div key={c.label}>
                        <p className="eyebrow mb-2 px-3">{c.label}</p>
                        {c.items.map((i) => <MenuLink key={i.label + i.href} i={i} className="block rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-secondary" />)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid w-72 gap-1 rounded-2xl border bg-popover p-3 text-popover-foreground shadow-2xl">
                    {m.items!.map((i) => <MenuLink key={i.label + i.href} i={i} className="rounded-xl px-3 py-2 font-semibold hover:bg-secondary" />)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn-primary !px-4 !py-2 text-sm">Enquire</Link>
          <button aria-label="Menu" className="p-2 lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="container-x max-h-[75vh] space-y-2 overflow-y-auto pb-6 lg:hidden">
          {menus.map((m) => (
            <details key={m.label} className="rounded-xl bg-secondary p-3">
              <summary className="cursor-pointer font-semibold">{m.label}</summary>
              <div className="mt-2 grid gap-2">{allItems(m).map((i) => <MenuLink key={i.label + i.href} i={i} onClick={() => setOpen(false)} className="text-sm" />)}</div>
            </details>
          ))}
        </nav>
      )}
    </header>
  );
}

export function RiskNotice({ variant = "full" }: { variant?: "full" | "compact" }) {
  return (
    <aside aria-label="Important financial information" className="rounded-2xl border-l-4 border-signal bg-secondary p-6 text-sm leading-relaxed">
      <p className="font-display text-base font-semibold">Important financial information</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
        <li>Example rates, amounts, terms and fees on this site are illustrative only and must be confirmed directly with lenders before you make any decision.</li>
        <li>All finance is subject to status, affordability and lender criteria. Approval is not guaranteed.</li>
        {variant === "full" && <li>Late or missed repayments can cause serious problems, including legal action, additional charges and damage to your business and personal credit rating.</li>}
        {variant === "full" && <li>Directors may be asked for a personal guarantee, making them personally liable if the business cannot repay. Secured finance may put property or assets at risk — your property may be repossessed if you do not keep up repayments.</li>}
        <li>FundingCompany is not a lender. Information here is general guidance, not financial advice. Consider independent professional advice for your circumstances.</li>
      </ul>
    </aside>
  );
}

export function Footer() {
  const st = useSiteSettings();
  const legal = [st?.company_name, st?.company_number && `Company no. ${st.company_number}`, st?.registered_address && `Registered office: ${st.registered_address}`, st?.fca_number && `FCA FRN ${st.fca_number}${st.fca_status ? ` (${st.fca_status})` : ""}`].filter(Boolean).join(" · ");
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-x grid gap-10 py-16 md:grid-cols-7">
        <div className="md:col-span-2">
          <div className="inline-block rounded-xl bg-card p-3"><Logo className="h-10" /></div>
          <p className="mt-3 max-w-sm text-sm opacity-70">Business funding, made clearer. Helping UK businesses understand their finance options and connect with suitable funding routes.</p>
          <SocialLinks className="mt-5" />
        </div>
        <div className="grid gap-6 sm:grid-cols-3 md:col-span-3">
          {loanGroups.map((g) => (
            <div key={g.label}>
              <p className="mb-3 text-sm font-semibold">{g.label}</p>
              <ul className="space-y-2 text-sm opacity-70">
                {g.slugs.map((x) => getService(x)).filter(Boolean).map((sv) => <li key={sv!.slug}><Link to="/$slug" params={{ slug: sv!.slug }}>{sv!.name}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Tools & resources</p>
          <ul className="space-y-2 text-sm opacity-70">
            {calculators.map((c) => <li key={c.to}><Link to={c.to}>{c.label}</Link></li>)}
            <li><Link to="/eligibility-guide">Eligibility guide</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/guides">Funding guides</Link></li>
            <li><Link to="/funding-advisor">AI Funding Advisor</Link></li>
            <li><Link to="/glossary">Finance glossary</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Company</p>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/partners">Become a partner</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/legal">Legal & regulatory</Link></li>
            <li><Link to="/$slug" params={{ slug: "privacy-policy" }}>Privacy policy</Link></li>
            <li><Link to="/$slug" params={{ slug: "terms-of-service" }}>Terms of service</Link></li>
            <li><Link to="/$slug" params={{ slug: "complaints-policy" }}>Complaints policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-ink-foreground/10 py-6 text-xs leading-relaxed opacity-60">
        {legal && <p className="mb-2">{legal}</p>}
        <p>© {new Date().getFullYear()} FundingCompany. All finance is subject to status and eligibility. FundingCompany is not a lender. Information on this site is general guidance, not financial advice. Example rates and terms are illustrative and must be confirmed with lenders. Your property may be repossessed if you do not keep up repayments on a mortgage or other debt secured on it.</p>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm opacity-70">
      <ol className="flex flex-wrap gap-2">
        <li><a href="/">Home</a></li>
        {items.map((c, i) => (
          <li key={c.path} className="flex gap-2"><span>/</span>{i === items.length - 1 ? <span aria-current="page">{c.name}</span> : <a href={c.path}>{c.name}</a>}</li>
        ))}
      </ol>
    </nav>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function seo(opts: { title: string; description: string; path: string; type?: string; crumbs?: Crumb[]; jsonLd?: object[]; matches?: any[]; image?: string | null }) {
  const overrides = (opts.matches?.[0]?.loaderData?.seo ?? []) as SeoOverride[];
  const o = overrides.find((x) => x.path === opts.path);
  if (o?.title) opts = { ...opts, title: o.title };
  if (o?.description) opts = { ...opts, description: o.description };
  const image = o?.og_image_url || opts.image;
  const scripts = [...(opts.jsonLd ?? [])];
  if (opts.crumbs) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ name: "Home", path: "/" }, ...opts.crumbs].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.path })),
    });
  }
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: opts.path },
      { name: "twitter:card", content: "summary_large_image" },
      ...(image && /^https:/.test(image) ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ...(o?.noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: opts.path }],
    scripts: scripts.map((s) => ({ type: "application/ld+json", children: JSON.stringify(s) })),
  };
}

export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string | undefined; title: string; intro?: string | undefined; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <section className="hero-glow">
      <div className="container-x py-16 md:py-24">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow mt-6 !text-accent">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] md:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg opacity-80">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="container-x py-20">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-accent p-10 md:flex-row md:items-center md:p-14">
        <div>
          <h2 className="text-3xl font-semibold md:text-4xl">Ready to explore your funding route?</h2>
          <p className="mt-2 max-w-lg">Tell us what your business needs. No obligation, and initial checks won't affect your credit score.</p>
        </div>
        <Link to="/contact" className="rounded-full bg-ink px-6 py-3 font-semibold text-ink-foreground">Start your enquiry →</Link>
      </div>
    </section>
  );
}
