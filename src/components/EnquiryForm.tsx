import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { submitEnquiry } from "@/lib/leads.functions";
import { services } from "@/lib/services";

export const field = "w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

function errorText(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  try {
    const issues = JSON.parse(msg);
    if (Array.isArray(issues) && issues[0]?.message) return issues[0].message as string;
  } catch { /* not zod json */ }
  return msg || "Something went wrong. Please try again.";
}

export function Confirmation({ reference, title, children }: { reference: string; title: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-signal" />
      <p className="mt-4 font-display text-2xl font-semibold">{title}</p>
      <p className="mt-2 text-muted-foreground">Your reference is <strong className="text-foreground">{reference}</strong>. Keep it handy if you contact us.</p>
      {children}
    </div>
  );
}

export function EnquiryForm({ defaultAmount = "", defaultPurpose = "", source = "" }: { defaultAmount?: string; defaultPurpose?: string; source?: string }) {
  const submit = useServerFn(submitEnquiry);
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; ref?: string; error?: string }>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => (f.get(k) as string) || "";
    setState({ status: "sending" });
    try {
      const res = await submit({
        data: {
          funding_purpose: g("funding_purpose"), amount: g("amount"), business_type: g("business_type"),
          time_trading: g("time_trading"), turnover: g("turnover"), full_name: g("full_name"), company: g("company"),
          email: g("email"), phone: g("phone"), message: g("message"), source_page: source,
          consent: f.get("consent") === "on" ? true : (false as unknown as true), website_hp: g("website_hp"),
        },
      });
      setState({ status: "done", ref: res.reference });
    } catch (err) {
      setState({ status: "error", error: errorText(err) });
    }
  }

  if (state.status === "done")
    return (
      <Confirmation reference={state.ref!} title="Thank you — your enquiry has been received">
        <p className="mt-4 text-sm text-muted-foreground">A member of our team will review your details and be in touch. Submitting an enquiry does not affect your credit score and does not commit you to anything.</p>
        <Link to="/funding-advisor" className="btn-ghost mt-6">Explore options with the AI Funding Advisor</Link>
      </Confirmation>
    );

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
      <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="text-sm font-medium sm:col-span-2">What do you need funding for?
        <select name="funding_purpose" className={`${field} mt-1`} defaultValue={defaultPurpose}>
          <option value="">Choose a funding route</option>
          {services.map((s) => <option key={s.slug}>{s.name}</option>)}
          {defaultPurpose && !services.some((s) => s.name === defaultPurpose) && <option>{defaultPurpose}</option>}
          <option>Not sure yet</option>
        </select>
      </label>
      <label className="text-sm font-medium">Amount needed (£)<input name="amount" defaultValue={defaultAmount} inputMode="numeric" className={`${field} mt-1`} /></label>
      <label className="text-sm font-medium">Business type
        <select name="business_type" className={`${field} mt-1`}><option>Limited company</option><option>Sole trader</option><option>Partnership / LLP</option></select>
      </label>
      <label className="text-sm font-medium">Time trading
        <select name="time_trading" className={`${field} mt-1`}><option>Less than 6 months</option><option>6–12 months</option><option>1–2 years</option><option>2+ years</option></select>
      </label>
      <label className="text-sm font-medium">Annual turnover (£)<input name="turnover" inputMode="numeric" className={`${field} mt-1`} /></label>
      <label className="text-sm font-medium">Full name *<input name="full_name" required autoComplete="name" className={`${field} mt-1`} /></label>
      <label className="text-sm font-medium">Company name<input name="company" autoComplete="organization" className={`${field} mt-1`} /></label>
      <label className="text-sm font-medium">Email *<input name="email" required type="email" autoComplete="email" className={`${field} mt-1`} /></label>
      <label className="text-sm font-medium">Phone<input name="phone" type="tel" autoComplete="tel" className={`${field} mt-1`} /></label>
      <label className="text-sm font-medium sm:col-span-2">Anything else we should know?<textarea name="message" rows={3} className={`${field} mt-1`} /></label>
      <label className="flex gap-3 text-sm text-muted-foreground sm:col-span-2"><input name="consent" required type="checkbox" className="mt-1" />I agree to FundingCompany using these details to respond to my enquiry, as described in the <Link to="/legal" className="text-signal underline">privacy notice</Link>.</label>
      {state.status === "error" && <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.error}</p>}
      <button disabled={state.status === "sending"} className="btn-primary disabled:opacity-60 sm:col-span-2">{state.status === "sending" ? "Sending…" : "Submit enquiry"}</button>
      <p className="text-xs text-muted-foreground sm:col-span-2">Your details are sent securely and stored only to respond to your enquiry. FundingCompany is not a lender; any finance is subject to status and lender criteria.</p>
    </form>
  );
}
