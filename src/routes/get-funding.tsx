import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Confirmation, field } from "@/components/EnquiryForm";
import { Page, PageHero, RiskNotice, seo } from "@/components/SiteShell";
import { submitEnquiry } from "@/lib/leads.functions";
import { amountError, businessQuestions, parseAmount, questionsFor, reasonLabel, reasons, type Question } from "@/lib/quote-flow";

const crumbs = [{ name: "Get funding", path: "/get-funding" }];

export const Route = createFileRoute("/get-funding")({
  validateSearch: (s) => z.object({ amount: z.string().max(20).optional(), reason: z.string().max(40).optional() }).parse(s),
  head: ({ matches }) => seo({ matches,
    title: "Start Your Funding Search | Compare UK Business Finance | FundingCompany",
    description: "Tell us how much you need and why. A few quick questions help us find business finance routes that may suit you — free, no obligation and no impact on your credit score.",
    path: "/get-funding", crumbs,
  }),
  component: GetFunding,
});

function errText(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  try { const j = JSON.parse(m); if (Array.isArray(j) && j[0]?.message) return j[0].message as string; } catch { /* plain */ }
  return m || "Something went wrong. Please try again.";
}

function Ask({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  if (q.type === "choice")
    return (
      <fieldset>
        <legend className="font-semibold">{q.label}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {q.options.map((o) => (
            <button
              type="button"
              key={o}
              onClick={() => onChange(value === o ? "" : o)}
              aria-pressed={value === o}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                value === o ? "border-signal bg-secondary font-semibold" : "bg-background hover:border-signal"
              }`}
            >
              <span>{o}</span>
              {value === o && <Check className="h-4 w-4 text-signal shrink-0 ml-2" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </fieldset>
    );
  return (
    <label className="block font-semibold">{q.label}
      {q.type === "money"
        ? <div className="mt-2 flex items-center rounded-xl border bg-background px-4 font-normal"><span className="text-muted-foreground">£</span><input value={value} onChange={(e) => onChange(e.target.value.replace(/[^\d,]/g, ""))} inputMode="numeric" className="w-full bg-transparent px-2 py-3 outline-none" /></div>
        : <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} maxLength={500} className={`${field} mt-2 font-normal`} />}
    </label>
  );
}

export function GetFunding() {
  const search = Route.useSearch();
  const submit = useServerFn(submitEnquiry);
  const [amount, setAmount] = useState(search.amount ?? "");
  const [reason, setReason] = useState(reasons.some((r) => r.value === search.reason) ? search.reason! : "");
  const [step, setStep] = useState(search.amount && search.reason && !amountError(search.amount) ? 1 : 0);
  const [a, setA] = useState<Record<string, string>>({});
  const [c, setC] = useState({ full_name: "", company: "", email: "", phone: "", consent: false, website_hp: "" });
  const [state, setState] = useState<{ s: "idle" | "sending" | "done"; ref?: string; err?: string }>({ s: "idle" });
  const [err, setErr] = useState<string | null>(null);

  const rq = questionsFor(reason);
  const steps = ["Amount & reason", reasonLabel(reason) || "Your needs", "Your business", "Your details"];
  const bqIds = businessQuestions.map((q) => q.id);

  const [unlockedDetails, setUnlockedDetails] = useState({
    company: false,
    email: false,
    phone: false,
    consent: false,
  });

  const showCompany = Boolean(unlockedDetails.company || c.company.trim() || c.full_name.trim().length >= 2);
  const showEmail = Boolean(unlockedDetails.email || c.email.trim() || (showCompany && c.company.trim().length > 0));
  const showPhone = Boolean(unlockedDetails.phone || c.phone.trim() || (showEmail && c.email.trim().length > 0));
  const showConsent = Boolean(unlockedDetails.consent || c.consent || (showPhone && c.phone.trim().length > 0));

  const updateContact = (k: "full_name" | "company" | "email" | "phone", val: string) => {
    setState((prev) => ({ ...prev, err: undefined }));
    setC((prev) => {
      const next = { ...prev, [k]: val };
      const allEmpty = !next.full_name.trim() && !next.company.trim() && !next.email.trim() && !next.phone.trim();
      if (allEmpty) {
        setUnlockedDetails({ company: false, email: false, phone: false, consent: false });
      }
      return next;
    });

    if (k === "full_name" && val.trim().length >= 2) {
      setUnlockedDetails((prev) => ({ ...prev, company: true }));
    } else if (k === "company" && val.trim().length > 0) {
      setUnlockedDetails((prev) => ({ ...prev, email: true }));
    } else if (k === "email" && val.trim().length > 0) {
      setUnlockedDetails((prev) => ({ ...prev, phone: true }));
    } else if (k === "phone" && val.trim().length > 0) {
      setUnlockedDetails((prev) => ({ ...prev, consent: true }));
    }
  };

  const set = (id: string) => (v: string) => {
    setErr(null);
    setA((p) => {
      const next = { ...p, [id]: v };
      if (!v) {
        delete next[id];
      }
      if (id === "use" && !v) {
        delete next["when"];
      }
      const bqIdx = bqIds.indexOf(id);
      if (bqIdx !== -1 && !v) {
        for (let i = bqIdx + 1; i < bqIds.length; i++) {
          delete next[bqIds[i]!];
        }
      }
      return next;
    });
  };

  function next() {
    setErr(null);
    if (step === 0) {
      const e = amountError(amount) ?? (!reason ? "Please choose a reason" : null);
      if (e) return setErr(e);
    }
    if (step === 1) {
      if (reason === "working_capital") {
        if (!a["use"]) return setErr("Please choose what the money will mainly be used for");
        if (!a["when"]) return setErr("Please choose when you need the funds");
      } else if (rq.some((q) => q.type === "choice" && !a[q.id])) {
        return setErr("Please answer each question");
      }
    }
    if (step === 2) {
      if (!a["business_type"]) return setErr("Please choose what type of business it is");
      if (!a["time_trading"]) return setErr("Please choose how long it has been trading");
      if (!a["turnover"]) return setErr("Please choose your annual turnover");
      if (!a["homeowner"]) return setErr("Please answer whether any directors or owners are homeowners");
    }
    setStep(step + 1);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (c.full_name.trim().length < 2) {
      setState((prev) => ({ ...prev, err: "Please enter your full name" }));
      return;
    }
    if (!c.company.trim()) {
      setUnlockedDetails((prev) => ({ ...prev, company: true }));
      setState((prev) => ({ ...prev, err: "Please enter your business name" }));
      return;
    }
    if (!c.email.trim() || !c.email.includes("@") || !c.email.includes(".")) {
      setUnlockedDetails((prev) => ({ ...prev, company: true, email: true }));
      setState((prev) => ({ ...prev, err: "Please enter a valid email address" }));
      return;
    }
    if (!c.phone.trim()) {
      setUnlockedDetails((prev) => ({ ...prev, company: true, email: true, phone: true }));
      setState((prev) => ({ ...prev, err: "Please enter your phone number" }));
      return;
    }
    if (!c.consent) {
      setUnlockedDetails((prev) => ({ ...prev, company: true, email: true, phone: true, consent: true }));
      setState((prev) => ({ ...prev, err: "Please agree to the privacy policy and terms of service" }));
      return;
    }
    setState({ s: "sending" });
    const details = rq.filter((q) => a[q.id]).map((q) => `${q.label} ${q.type === "money" ? "£" : ""}${a[q.id]}`);
    try {
      const res = await submit({ data: {
        ...c, consent: c.consent as true,
        amount: `£${(parseAmount(amount) ?? 0).toLocaleString("en-GB")}`,
        funding_purpose: reasonLabel(reason),
        business_type: a["business_type"], time_trading: a["time_trading"], turnover: a["turnover"],
        message: [...details, `Homeowner: ${a["homeowner"] ?? "-"}`].join("\n"),
        source_page: "/get-funding",
      } });
      setState({ s: "done", ref: res.reference });
    } catch (x) { setState({ s: "idle", err: errText(x) }); }
  }

  return (
    <Page>
      <PageHero eyebrow="Get funding" title="Compare business finance options in minutes" intro="Free, no obligation and no impact on your credit score. FundingCompany is a credit broker, not a lender." crumbs={crumbs} />
      <section className="container-x -mt-10 pb-20">
        <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-6 shadow-xl md:p-8">
          {state.s === "done" ? (
            <Confirmation reference={state.ref!} title="Thank you — your funding request has been received">
              <p className="mt-4 text-sm text-muted-foreground">A member of our team will review your answers and contact you about routes that may suit your business. Any finance is subject to status and the lender's own checks.</p>
              <Link to="/" className="btn-ghost mt-6">Back to home</Link>
            </Confirmation>
          ) : (
            <>
              <ol className="flex gap-2" aria-label="Progress">
                {steps.map((t, i) => <li key={t} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-signal" : "bg-secondary"}`} title={t} />)}
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">Step {step + 1} of 4 · {steps[step]}</p>

              {step === 0 && (
                <div className="mt-6 space-y-5">
                  <Ask q={{ id: "amount", label: "Amount you need", type: "money" }} value={amount} onChange={setAmount} />
                  <label className="block font-semibold">Reason
                    <select value={reason} onChange={(e) => { setReason(e.target.value); setA({}); }} className={`${field} mt-2 font-normal`}>
                      <option value="">Select</option>
                      {reasons.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="mt-6 space-y-6">
                  {rq.map((q) => {
                    const isSecondWcQuestion = reason === "working_capital" && q.id === "when";
                    if (isSecondWcQuestion && !a["use"]) return null;
                    return (
                      <div
                        key={q.id}
                        className={
                          isSecondWcQuestion
                            ? "animate-reveal animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none"
                            : undefined
                        }
                      >
                        <Ask q={q} value={a[q.id] ?? ""} onChange={set(q.id)} />
                      </div>
                    );
                  })}
                </div>
              )}
              {step === 2 && (
                <div className="mt-6 space-y-6">
                  {businessQuestions.map((q, i) => {
                    const isVisible = i === 0 || businessQuestions.slice(0, i).every((prevQ) => Boolean(a[prevQ.id]));
                    if (!isVisible) return null;
                    return (
                      <div
                        key={q.id}
                        className={
                          i > 0
                            ? "animate-reveal animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none"
                            : undefined
                        }
                      >
                        <Ask q={q} value={a[q.id] ?? ""} onChange={set(q.id)} />
                      </div>
                    );
                  })}
                </div>
              )}

              {step < 3 ? (
                <>
                  {err && <p role="alert" className="mt-4 text-sm text-destructive">{err}</p>}
                  <div className="mt-8 flex justify-between gap-3">
                    {step > 0 ? <button type="button" onClick={() => { setErr(null); setStep(step - 1); }} className="btn-ghost"><ArrowLeft className="h-4 w-4" />Back</button> : <span />}
                    <button type="button" onClick={next} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
                  </div>
                </>
              ) : (
                <form onSubmit={send} className="mt-6 space-y-4" noValidate>
                  <p className="rounded-xl bg-secondary p-4 text-sm">You're looking for <strong>£{(parseAmount(amount) ?? 0).toLocaleString("en-GB")}</strong> for <strong>{reasonLabel(reason)}</strong>.</p>
                  <label className="block text-sm font-medium">Full name
                    <input
                      type="text"
                      required
                      value={c.full_name}
                      onChange={(e) => updateContact("full_name", e.target.value)}
                      className={`${field} mt-1`}
                    />
                  </label>
                  {showCompany && (
                    <div className="animate-reveal animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none">
                      <label className="block text-sm font-medium">Business name
                        <input
                          type="text"
                          required
                          value={c.company}
                          onChange={(e) => updateContact("company", e.target.value)}
                          className={`${field} mt-1`}
                        />
                      </label>
                    </div>
                  )}
                  {showEmail && (
                    <div className="animate-reveal animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none">
                      <label className="block text-sm font-medium">Email
                        <input
                          type="email"
                          required
                          value={c.email}
                          onChange={(e) => updateContact("email", e.target.value)}
                          className={`${field} mt-1`}
                        />
                      </label>
                    </div>
                  )}
                  {showPhone && (
                    <div className="animate-reveal animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none">
                      <label className="block text-sm font-medium">Phone
                        <input
                          type="tel"
                          required
                          value={c.phone}
                          onChange={(e) => updateContact("phone", e.target.value)}
                          className={`${field} mt-1`}
                        />
                      </label>
                    </div>
                  )}
                  <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={c.website_hp} onChange={(e) => setC((prev) => ({ ...prev, website_hp: e.target.value }))} />
                  {showConsent && (
                    <div className="space-y-4 animate-reveal animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none">
                      <label className="flex gap-3 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          required
                          checked={c.consent}
                          onChange={(e) => {
                            setState((prev) => ({ ...prev, err: undefined }));
                            setC((prev) => ({ ...prev, consent: e.target.checked }));
                          }}
                          className="mt-1"
                        />
                        <span>I agree to FundingCompany contacting me about my enquiry and processing my details in line with the <Link to="/$slug" params={{ slug: "privacy-policy" }} className="text-signal underline">privacy policy</Link> and <Link to="/$slug" params={{ slug: "terms-of-service" }} className="text-signal underline">terms of service</Link>.</span>
                      </label>
                    </div>
                  )}
                  {state.err && <p role="alert" className="text-sm text-destructive">{state.err}</p>}
                  <div className="flex justify-between gap-3 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft className="h-4 w-4" />Back</button>
                    <button
                      type="submit"
                      disabled={state.s === "sending"}
                      className="btn-primary"
                    >
                      {state.s === "sending" ? "Sending…" : "Secure funding"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
        <div className="mx-auto mt-8 max-w-2xl"><RiskNotice variant="compact" /></div>
      </section>
    </Page>
  );
}
