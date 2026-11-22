import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Building2, Handshake, LineChart, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Confirmation, field } from "@/components/EnquiryForm";
import { Page, PageHero, seo } from "@/components/SiteShell";
import { submitPartner } from "@/lib/leads.functions";

const crumbs = [{ name: "Become a partner", path: "/partners" }];

export const Route = createFileRoute("/partners")({
  head: ({ matches }) => seo({ matches,
    title: "Become a FundingCompany Partner | Lenders, Brokers & Introducers UK",
    description: "Partner with FundingCompany. We work with UK lenders, brokers, accountants and business introducers to connect SMEs with suitable funding.",
    path: "/partners",
    crumbs,
  }),
  component: Partners,
});

const types = [
  { icon: Building2, t: "Lenders & funders", d: "Banks, specialist lenders and alternative finance providers looking to reach well-prepared UK SMEs." },
  { icon: Handshake, t: "Brokers & introducers", d: "Commercial finance brokers and introducers who want a trusted partner for complex or out-of-scope cases." },
  { icon: LineChart, t: "Accountants & advisers", d: "Accountants, bookkeepers and business advisers who want to help clients access the right funding." },
  { icon: ShieldCheck, t: "Business platforms", d: "Software, banking and membership platforms that want to offer funding guidance to their users." },
];

function Partners() {
  const submit = useServerFn(submitPartner);
  const [state, setState] = useState<{ s: "idle" | "sending" | "done" | "error"; ref?: string; err?: string }>({ s: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => (f.get(k) as string) || "";
    setState({ s: "sending" });
    try {
      const r = await submit({ data: { full_name: g("full_name"), email: g("email"), phone: g("phone"), company: g("company"), website: g("website"), partner_type: g("partner_type"), fca_number: g("fca_number"), message: g("message"), consent: (f.get("consent") === "on") as true, website_hp: g("website_hp") } });
      setState({ s: "done", ref: r.reference });
    } catch (err) {
      let msg = err instanceof Error ? err.message : "Something went wrong.";
      try { const j = JSON.parse(msg); if (j?.[0]?.message) msg = j[0].message; } catch { /* plain */ }
      setState({ s: "error", err: msg });
    }
  }

  return (
    <Page>
      <PageHero eyebrow="Partnerships" title="Grow with FundingCompany" intro="We partner with lenders, brokers, accountants and platforms who share our commitment to clear, fair business finance for UK SMEs." crumbs={crumbs} />
      <section className="container-x py-16">
        <h2 className="text-3xl font-semibold md:text-4xl">Who we work with</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {types.map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-2xl border bg-card p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-accent"><I className="h-5 w-5" /></span><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="bg-secondary">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">Why partner with us</h2>
            <ul className="mt-6 space-y-4 text-muted-foreground">
              <li><strong className="text-foreground">Better-prepared enquiries.</strong> Businesses arrive understanding their options and what lenders look for.</li>
              <li><strong className="text-foreground">Transparent relationships.</strong> We disclose how we work with partners and how we are paid.</li>
              <li><strong className="text-foreground">Compliance first.</strong> Our content is designed to be clear, fair and not misleading.</li>
              <li><strong className="text-foreground">Shared growth.</strong> Co-marketing, referral and integration options to suit your model.</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">Have a question first? <Link to="/contact" className="text-signal underline">Contact us</Link>.</p>
          </div>
          <div className="rounded-3xl border bg-card p-8 shadow-xl">
            {state.s === "done" ? (
              <Confirmation reference={state.ref!} title="Thanks — your partner application is in"><p className="mt-4 text-sm text-muted-foreground">Our partnerships team will review your details and contact you to discuss next steps.</p></Confirmation>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
                <h2 className="font-display text-2xl font-semibold sm:col-span-2">Apply to become a partner</h2>
                <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <label className="text-sm font-medium">Full name *<input name="full_name" required className={`${field} mt-1`} /></label>
                <label className="text-sm font-medium">Company *<input name="company" required className={`${field} mt-1`} /></label>
                <label className="text-sm font-medium">Email *<input name="email" type="email" required className={`${field} mt-1`} /></label>
                <label className="text-sm font-medium">Phone<input name="phone" type="tel" className={`${field} mt-1`} /></label>
                <label className="text-sm font-medium">Website<input name="website" className={`${field} mt-1`} placeholder="https://" /></label>
                <label className="text-sm font-medium">Partner type
                  <select name="partner_type" className={`${field} mt-1`}>{types.map((t) => <option key={t.t}>{t.t}</option>)}<option>Other</option></select>
                </label>
                <label className="text-sm font-medium sm:col-span-2">FCA firm reference number (if applicable)<input name="fca_number" className={`${field} mt-1`} /></label>
                <label className="text-sm font-medium sm:col-span-2">Tell us about your business<textarea name="message" rows={4} className={`${field} mt-1`} /></label>
                <label className="flex gap-3 text-sm text-muted-foreground sm:col-span-2"><input name="consent" type="checkbox" required className="mt-1" />I agree to FundingCompany using these details to respond to my application, as described in the <Link to="/legal" className="text-signal underline">privacy notice</Link>.</label>
                {state.s === "error" && <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.err}</p>}
                <button disabled={state.s === "sending"} className="btn-primary disabled:opacity-60 sm:col-span-2">{state.s === "sending" ? "Sending…" : "Submit application"}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Page>
  );
}
