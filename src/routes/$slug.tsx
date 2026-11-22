import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Clock, PoundSterling, ShieldCheck, CalendarRange } from "lucide-react";
import { Calculator } from "@/components/Calculator";
import { CmsArticle } from "@/components/CmsArticle";
import { Breadcrumbs, CtaBand, Page, RiskNotice, seo } from "@/components/SiteShell";
import { getCmsPage, listLenders } from "@/lib/cms.functions";
import { LenderList } from "@/components/LenderList";
import { QuoteStart } from "@/components/QuoteStart";
import { loanGroups } from "@/lib/menu";
import { lenderFacts } from "@/lib/lender-facts";
import { getService, type Service } from "@/lib/services";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const cms = await getCmsPage({ data: { kind: "page", slug: params.slug } }).catch(() => null);
    const s = getService(params.slug);
    if (!s && !cms) throw notFound();
    const lenders = s ? await listLenders({ data: {} }).catch(() => []) : [];
    return { s: s ?? null, cms, lenders };
  },
  head: ({ loaderData, matches }) => {
    const cms = loaderData?.cms;
    if (cms) return seo({ matches, title: cms.seo_title || `${cms.title} | FundingCompany`, description: cms.seo_description || cms.excerpt || "", path: `/${cms.slug}`, image: cms.hero_image_url, crumbs: [{ name: cms.title, path: `/${cms.slug}` }] });
    const s = loaderData?.s;
    if (!s) return { meta: [{ title: "Page not found | FundingCompany" }, { name: "robots", content: "noindex" }] };
    return seo({
      matches,
      title: s.title,
      description: s.description,
      path: `/${s.slug}`,
      crumbs: [{ name: "Loans", path: "/business-loans" }, { name: s.name, path: `/${s.slug}` }],
      jsonLd: [{ "@context": "https://schema.org", "@type": "FinancialProduct", name: s.name, description: s.description, areaServed: "GB", provider: { "@type": "Organization", name: "FundingCompany" } }],
    });
  },
  component: ServicePage,
});

const calcMode = (slug: string) =>
  slug.startsWith("invoice") ? "invoice" : ["asset-finance", "finance-leasing", "construction-finance"].includes(slug) ? "asset" : "loan";

const factLabels = [
  { icon: PoundSterling, l: "Published lender amounts" },
  { icon: CalendarRange, l: "Published lender terms" },
  { icon: ShieldCheck, l: "Security" },
  { icon: Clock, l: "Published funding speed" },
];

function Section({ eyebrow, title, children, tone }: { eyebrow?: string; title: string; children: React.ReactNode; tone?: "muted" }) {
  return (
    <section className={tone === "muted" ? "bg-secondary" : ""}>
      <div className="container-x py-16 md:py-20">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 max-w-3xl text-3xl font-semibold md:text-4xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function QuickQuote({ s }: { s: Service }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState(s.name);
  return (
    <div className="rounded-3xl bg-card p-6 text-card-foreground shadow-2xl md:p-8">
      <p className="font-display text-xl font-semibold">Check your eligibility</p>
      <p className="mt-1 text-sm text-muted-foreground">Free, no obligation. Initial checks won't affect your credit score.</p>
      <label className="mt-5 block text-sm font-medium">How much do you need?
        <div className="mt-1 flex items-center rounded-xl border bg-background px-4"><span className="text-muted-foreground">£</span><input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" placeholder="50,000" className="w-full bg-transparent px-2 py-3 outline-none" /></div>
      </label>
      <label className="mt-4 block text-sm font-medium">What's it for?
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="mt-1 w-full rounded-xl border bg-background px-4 py-3">
          <option>{s.name}</option>
          {s.uses.map((u) => <option key={u}>{u}</option>)}
        </select>
      </label>
      <Link to="/contact" search={{ amount: amount || undefined, purpose }} className="btn-primary mt-6 w-full">Continue <ArrowRight className="h-4 w-4" /></Link>
      <p className="mt-3 text-xs text-muted-foreground">Finance subject to status. Example rates and terms must be confirmed with lenders.</p>
    </div>
  );
}

function ServicePage() {
  const { s: svc, cms, lenders } = Route.useLoaderData();
  if (cms) return (
    <CmsArticle page={cms} crumbs={[{ name: cms.title, path: `/${cms.slug}` }]} showRisk={!!svc}>
      {svc && (
        <>
          <section className="container-x max-w-3xl pb-4"><QuoteStart /></section>
          <Section tone="muted" eyebrow="Calculator" title="Estimate your costs today">
            <Calculator mode={calcMode(svc.slug)} />
            <div className="mt-6"><RiskNotice variant="compact" /></div>
          </Section>
          {lenders.some((l) => l.products.includes(svc.slug)) && (
            <Section eyebrow="Lender directory" title={`Lenders offering ${svc.name.toLowerCase()}`}>
              <LenderList lenders={lenders.filter((l) => l.products.includes(svc.slug))} />
            </Section>
          )}
        </>
      )}
    </CmsArticle>
  );
  if (!svc) return null;
  return <ServiceView s={svc} lenders={lenders} />;
}

function ServiceView({ s, lenders }: { s: Service; lenders: import("@/lib/cms.functions").Lender[] }) {
  const f = lenderFacts(lenders, s.slug);
  const matchingLenders = lenders.filter((l) => l.products.includes(s.slug));
  const related = s.related.map((r) => getService(r)).filter(Boolean) as Service[];
  const group = loanGroups.find((g) => g.slugs.includes(s.slug)) ?? loanGroups[0];
  const siblings = (group?.slugs ?? []).filter((x) => x !== s.slug).map((x) => getService(x)).filter(Boolean) as Service[];
  const compare = [s, ...related];
  const lname = s.name.toLowerCase();

  return (
    <Page>
      {/* Hero */}
      <section className="hero-glow">
        <div className="container-x grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Breadcrumbs items={[{ name: "Loans", path: "/business-loans" }, { name: s.name, path: `/${s.slug}` }]} />
            <p className="eyebrow mt-6 !text-accent">{s.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-6xl">{s.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg opacity-80">{s.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-85">
              {["Free to enquire", "No obligation", "Soft initial checks", "UK specialists"].map((x) => (
                <li key={x} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-accent" />{x}</li>
              ))}
            </ul>
          </div>
          <QuickQuote s={s} />
        </div>
      </section>

      {/* What it is */}
      <Section eyebrow="The basics" title={`${s.name}: what it is and how it works`}>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3 className="text-xl font-semibold">{s.name.endsWith("s") ? "What are" : "What is"} {lname}?</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.intro}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Key features</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {factLabels.map(({ icon: I, l }, i) => (
                <div key={l} className="rounded-2xl border bg-card p-4">
                  <I className="h-5 w-5 text-signal" />
                  <p className="mt-2 text-xs text-muted-foreground">{l}</p>
                  <p className="font-display font-semibold">{f[i]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Uses */}
      <Section tone="muted" eyebrow="Uses" title={`What can I use ${lname} for?`}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.uses.map((u) => <li key={u} className="flex gap-3 rounded-2xl bg-card p-5"><Check className="h-5 w-5 shrink-0 text-signal" />{u}</li>)}
        </ul>
      </Section>

      {/* How much */}
      <Section eyebrow="Amounts & terms" title="How much can I borrow?">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="leading-relaxed text-muted-foreground">How much you can borrow depends on your turnover, affordability, trading history, credit profile and any security offered. Figures below come from the matching lender directory entries, not a personalised quote. Rates, terms and any conditional funding times must be confirmed with the lender. Where no figure is published, we do not estimate one.</p>
          <table className="w-full overflow-hidden rounded-2xl border bg-card text-left text-sm">
            <tbody className="divide-y">
              {factLabels.map(({ l }, i) => <tr key={l}><th className="p-4 font-medium text-muted-foreground">{l}</th><td className="p-4 font-semibold">{f[i]}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Calculator */}
      <Section tone="muted" eyebrow="Calculator" title="Estimate your costs today">
        <Calculator mode={calcMode(s.slug)} />
        <div className="mt-6"><RiskNotice variant="compact" /></div>
      </Section>

      {/* Types */}
      <Section eyebrow="Options" title={`Types of ${lname}`}>
        <div className="grid gap-4 md:grid-cols-2">
          {s.types.map((t) => <div key={t.t} className="rounded-2xl border bg-card p-6"><h3 className="text-lg font-semibold">{t.t}</h3><p className="mt-2 text-muted-foreground">{t.d}</p></div>)}
        </div>
      </Section>

      {/* Compare */}
      <Section tone="muted" eyebrow="Compare" title={`${s.name} vs other finance options`}>
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink text-ink-foreground"><tr>{["Finance type", "Published amounts", "Published terms", "Security"].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {compare.map((c) => {
                const cf = lenderFacts(lenders, c.slug);
                return (
                  <tr key={c.slug} className={c.slug === s.slug ? "bg-accent/30" : ""}>
                    <td className="p-4 font-semibold">{c.slug === s.slug ? c.name : <Link to="/$slug" params={{ slug: c.slug }} className="text-signal">{c.name}</Link>}</td>
                    <td className="p-4">{cf[0]}</td><td className="p-4">{cf[1]}</td><td className="p-4">{cf[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Eligibility */}
      <Section eyebrow="Eligibility" title="What affects eligibility and rates?">
        <dl className="grid gap-4 md:grid-cols-2">
          {s.considerations.map((c, i) => (
            <div key={c.t} className="flex gap-4 rounded-2xl border bg-card p-6">
              <span className="font-display text-2xl font-semibold text-signal">0{i + 1}</span>
              <div><dt className="font-semibold">{c.t}</dt><dd className="mt-1 text-muted-foreground">{c.d}</dd></div>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm"><Link to="/eligibility-guide" className="font-semibold text-signal">Read the full eligibility guide →</Link></p>
      </Section>

      {/* Product information */}
      <section className="hero-glow">
        <div className="container-x grid gap-8 py-16 md:grid-cols-[1fr_1.4fr]">
          <div><p className="eyebrow !text-accent">Financial product information</p><h2 className="mt-2 text-3xl font-semibold">Costs, repayments and risks</h2></div>
          <p className="leading-relaxed opacity-85">{s.costs}</p>
        </div>
      </section>

      {matchingLenders.length > 0 && (
        <Section eyebrow="Lender directory" title={`Lenders offering ${lname}`}>
          <LenderList lenders={matchingLenders} />
          <p className="mt-4 text-sm"><Link to="/lenders" className="font-semibold text-signal">See the full lender directory →</Link></p>
        </Section>
      )}

      <section className="container-x pt-16"><RiskNotice /></section>

      {/* Alternatives */}
      <Section eyebrow="Alternatives" title={`Alternatives to ${lname}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/$slug" params={{ slug: r.slug }} className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-semibold">{r.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{r.description}</p>
              <p className="mt-4 text-sm font-semibold text-signal">Explore →</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section tone="muted" eyebrow="How it works" title="How FundingCompany works">
        <ol className="grid gap-4 md:grid-cols-3">
          {[["Tell us how much you need", "Share the amount, purpose and a few business details."], ["We explore your funding route", "We review which providers and products may suit you."], ["Review your options", "If suitable, compare options — with no obligation to proceed."]].map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-card p-6"><span className="font-display text-4xl font-semibold text-signal">0{i + 1}</span><h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p></li>
          ))}
        </ol>
      </Section>

      {/* Why choose */}
      <Section eyebrow="Why FundingCompany" title="Why choose FundingCompany?">
        <div className="grid gap-4 md:grid-cols-4">
          {[["Clear guidance", "Plain-English explanations of every option and its costs."], ["Goal-first approach", "We start with what your business needs, not a single product."], ["No obligation", "Free to enquire, and you're never pressured to proceed."], ["Personal support", "Talk to someone who understands UK business finance."]].map(([t, d]) => (
            <div key={t} className="rounded-2xl border bg-card p-6"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section tone="muted" eyebrow="FAQs" title={`Want to know more about ${lname}?`}>
        <div className="grid gap-3 lg:grid-cols-2">
          {s.faqs.map((q) => (
            <details key={q.q} className="rounded-xl bg-card p-5">
              <summary className="cursor-pointer font-semibold">{q.q}</summary>
              <p className="mt-3 text-muted-foreground">{q.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* More in group */}
      <Section eyebrow={group?.label ?? "Funding"} title={`More ${group?.label.toLowerCase() ?? "funding"} options`}>
        <div className="flex flex-wrap gap-2">
          {siblings.map((x) => <Link key={x.slug} to="/$slug" params={{ slug: x.slug }} className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-signal">{x.name}</Link>)}
        </div>
      </Section>

      <CtaBand />
    </Page>
  );
}
