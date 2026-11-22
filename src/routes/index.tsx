import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, Bot, Building2, Calculator as CalcIcon, Check, ClipboardList, Coins, FileSearch, Handshake,
  LineChart, MessageSquareText, PiggyBank, Scale, ShieldCheck, Sparkles, Timer, Wallet, Wrench,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Calculator } from "@/components/Calculator";
import { QuoteStart } from "@/components/QuoteStart";
import { LenderList } from "@/components/LenderList";
import { CtaBand, Page, seo } from "@/components/SiteShell";
import { listLenders } from "@/lib/cms.functions";
import { guides } from "@/lib/guides";
import { loanGroups } from "@/lib/menu";
import { serviceIcon } from "@/lib/service-icons";
import { getService, type Service } from "@/lib/services";

export const Route = createFileRoute("/")({
  loader: () => listLenders({ data: {} }).catch(() => []),
  head: ({ matches }) =>
    seo({ matches,
      title: "Business Funding UK | Find Your Funding Route | FundingCompany",
      description:
        "Explore UK business funding for cash flow, equipment, growth and property. Compare finance types, check eligibility guidance and enquire about suitable funding routes.",
      path: "/",
    }),
  component: Home,
});

const goals = [
  { icon: Coins, t: "Manage cash flow", d: "Working capital and invoice finance", slug: "working-capital-finance" },
  { icon: LineChart, t: "Grow my business", d: "Business loans and growth finance", slug: "business-expansion-finance" },
  { icon: Wrench, t: "Buy equipment", d: "Asset finance and leasing", slug: "asset-finance" },
  { icon: Building2, t: "Fund a property", d: "Commercial and development finance", slug: "property-finance" },
];

const trust = [
  { icon: BadgeCheck, t: "Free to enquire", d: "No fee to send an enquiry" },
  { icon: ShieldCheck, t: "Secure by design", d: "Your details stay protected" },
  { icon: Scale, t: "Clear and fair", d: "Costs and risks explained" },
  { icon: Handshake, t: "No obligation", d: "You decide whether to proceed" },
];

const groupMeta = [
  { icon: PiggyBank, blurb: "Lump-sum borrowing for growth, stock, staff and refinancing." },
  { icon: Building2, blurb: "Spread the cost of equipment, vehicles, premises and projects." },
  { icon: Wallet, blurb: "Unlock cash tied up in invoices, card sales and short-term gaps." },
];

const steps = [
  { icon: ClipboardList, t: "Tell us what you need", d: "Share your goal, the amount and a few business details in a short enquiry." },
  { icon: FileSearch, t: "We review your funding route", d: "We look at which finance types and providers may suit your situation." },
  { icon: MessageSquareText, t: "Explore your options", d: "If suitable, you'll receive options to review — with no obligation to proceed." },
];

const fit = [
  { icon: LineChart, t: "Turnover", d: "Regular income shows a provider how repayments will be met." },
  { icon: Timer, t: "Trading history", d: "Many products prefer 6–24 months of trading." },
  { icon: Wallet, t: "Affordability", d: "Bank statements show what fits alongside existing costs." },
  { icon: ShieldCheck, t: "Credit profile", d: "Business and director credit history are typically reviewed." },
];


function Home() {
  const lenders = Route.useLoaderData();
  const [group, setGroup] = useState(0);
  const items = loanGroups[group]!.slugs.map(getService).filter(Boolean) as Service[];

  return (
    <Page>
      {/* Hero */}
      <section className="hero-glow overflow-hidden">
        <div className="container-x grid items-center gap-12 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-1.5 !text-accent"><Sparkles className="h-3.5 w-3.5" />Business finance and funding solutions across the UK</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] md:text-7xl">Thoughtful finance for <span className="text-accent">ambitious businesses.</span></h1>
            <p className="mt-6 max-w-xl text-lg opacity-80">We help businesses across the UK explore funding suited to their circumstances, introducing them to a panel of lenders, equity funds and grant agencies.</p>

            <div className="mt-8 max-w-xl"><QuoteStart /></div>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-80">
              {["Clear information", "Guided enquiry", "Options subject to eligibility"].map((x) => (
                <li key={x} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-accent" />{x}</li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img src={hero} alt="UK business owner in his workshop exploring funding options" width={1200} height={1408} className="aspect-[4/5] w-full rounded-3xl object-cover" />
            <div className="absolute -left-4 top-8 hidden rounded-2xl bg-card p-4 text-card-foreground shadow-2xl md:flex md:items-center md:gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent"><Bot className="h-5 w-5" /></span>
              <div><p className="text-xs text-muted-foreground">AI Funding Advisor</p><p className="font-semibold">Personalised suggestions</p></div>
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-card p-5 text-card-foreground shadow-2xl md:-left-8 md:right-auto">
              <p className="eyebrow">Funding finder</p>
              <p className="mt-1 font-display text-lg font-semibold">25+ funding routes · 1 simple enquiry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b bg-card">
        <div className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {trust.map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-signal"><I className="h-5 w-5" /></span>
              <div><p className="font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section id="finder" className="container-x py-20">
        <p className="eyebrow">Funding finder</p>
        <h2 className="mt-3 text-4xl font-semibold md:text-5xl">What does your business need?</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">Start with your goal. We'll help you explore the relevant funding routes.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map(({ icon: I, t, d, slug }) => (
            <Link key={t} to="/$slug" params={{ slug }} className="group relative overflow-hidden rounded-3xl border bg-card p-7 transition hover:-translate-y-1 hover:border-signal hover:shadow-xl">
              <I aria-hidden className="absolute -right-6 -top-6 h-32 w-32 text-secondary transition group-hover:text-accent/40" />
              <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-accent"><I className="h-7 w-7" /></span>
              <h3 className="relative mt-6 text-xl font-semibold">{t}</h3>
              <p className="relative mt-1 text-sm text-muted-foreground">{d}</p>
              <p className="relative mt-6 flex items-center gap-1 text-sm font-semibold text-signal">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p>
            </Link>
          ))}
        </div>
      </section>

      {/* Finance for the business you're building */}
      <section className="bg-secondary">
        <div className="container-x py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-end">
            <div>
              <p className="eyebrow">Funding solutions</p>
              <h2 className="mt-3 text-4xl font-semibold md:text-5xl">Finance for the business you're building</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3" role="tablist">
              {loanGroups.map((g, i) => {
                const M = groupMeta[i]!;
                return (
                  <button key={g.label} role="tab" aria-selected={group === i} onClick={() => setGroup(i)} className={`rounded-2xl p-4 text-left transition ${group === i ? "bg-ink text-ink-foreground shadow-xl" : "bg-card hover:shadow-md"}`}>
                    <M.icon className={`h-6 w-6 ${group === i ? "text-accent" : "text-signal"}`} />
                    <p className="mt-3 font-semibold">{g.label}</p>
                    <p className={`mt-1 text-xs ${group === i ? "opacity-75" : "text-muted-foreground"}`}>{M.blurb}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((s) => {
              const I = serviceIcon(s.slug);
              return (
                <Link key={s.slug} to="/$slug" params={{ slug: s.slug }} className="group flex flex-col rounded-2xl bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-signal transition group-hover:bg-accent group-hover:text-foreground"><I className="h-6 w-6" /></span>
                  <h3 className="mt-4 text-lg font-semibold">{s.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-signal">Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-20">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 text-4xl font-semibold md:text-5xl">Three steps from question to options</h2>
        <ol className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" />
          {steps.map(({ icon: I, t, d }, i) => (
            <li key={t} className="relative">
              <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-ink text-accent shadow-lg"><I className="h-7 w-7" /><span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-foreground">{i + 1}</span></span>
              <h3 className="mt-6 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* AI advisor + tools */}
      <section className="container-x pb-20">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <Link to="/funding-advisor" className="hero-glow group relative overflow-hidden rounded-3xl p-8">
            <Bot aria-hidden className="absolute -bottom-8 -right-8 h-48 w-48 opacity-10" />
            <p className="eyebrow !text-accent">New · AI Funding Advisor</p>
            <h3 className="mt-3 max-w-md text-3xl font-semibold">Describe your business. Get funding routes worth exploring.</h3>
            <p className="mt-3 max-w-md opacity-80">Plus what lenders may look at and the questions to ask them.</p>
            <span className="btn-primary mt-6">Try the advisor <ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link to="/business-loan-calculator" className="group rounded-3xl border bg-card p-8 transition hover:shadow-xl">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent"><CalcIcon className="h-6 w-6" /></span>
            <h3 className="mt-5 text-xl font-semibold">Repayment calculators</h3>
            <p className="mt-2 text-sm text-muted-foreground">Estimate loan, invoice and asset finance costs in seconds.</p>
          </Link>
          <Link to="/eligibility-guide" className="group rounded-3xl border bg-card p-8 transition hover:shadow-xl">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent"><BadgeCheck className="h-6 w-6" /></span>
            <h3 className="mt-5 text-xl font-semibold">Eligibility guide</h3>
            <p className="mt-2 text-sm text-muted-foreground">See what providers typically check before you apply.</p>
          </Link>
        </div>
      </section>

      {lenders.length > 0 && (
        <section className="bg-secondary">
          <div className="container-x py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="eyebrow">Lender directory</p><h2 className="mt-3 text-4xl font-semibold md:text-5xl">Explore UK business lenders</h2></div>
              <Link to="/lenders" className="font-semibold text-signal">Full directory →</Link>
            </div>
            <div className="mt-10"><LenderList lenders={lenders.slice(0, 3)} /></div>
          </div>
        </section>
      )}

      {/* Fit guide */}
      <section className="hero-glow">
        <div className="container-x grid gap-12 py-20 md:grid-cols-2">
          <div>
            <p className="eyebrow !text-accent">Funding fit guide</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">What providers may consider</h2>
            <p className="mt-4 opacity-80">Every provider has its own criteria, but most look at the same core areas. Knowing them helps you prepare a stronger enquiry.</p>
            <Link to="/eligibility-guide" className="btn-primary mt-8">Read the eligibility guide</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fit.map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl border border-ink-foreground/15 p-6">
                <I className="h-7 w-7 text-accent" />
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm opacity-80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <p className="eyebrow">Business loan calculator</p>
        <h2 className="mt-3 mb-10 text-4xl font-semibold md:text-5xl">Estimate your repayments</h2>
        <Calculator />
      </section>

      <section className="bg-secondary">
        <div className="container-x py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow">Insights & guides</p><h2 className="mt-3 text-4xl font-semibold md:text-5xl">Funding knowledge centre</h2></div>
            <div className="flex gap-4"><Link to="/blog" className="font-semibold text-signal">Blog →</Link><Link to="/guides" className="font-semibold text-signal">All guides →</Link></div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {guides.slice(0, 3).map((g) => (
              <Link key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} className="rounded-2xl bg-card p-6 transition hover:shadow-lg">
                <p className="eyebrow">{g.category} · {g.read}</p>
                <h3 className="mt-3 text-xl font-semibold">{g.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </Page>
  );
}
