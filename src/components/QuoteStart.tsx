import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { amountError, parseAmount, reasons } from "@/lib/quote-flow";

export function QuoteStart({ defaultReason = "", compact = false }: { defaultReason?: string; compact?: boolean }) {
  const nav = useNavigate();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(defaultReason);
  const [tried, setTried] = useState(false);
  const aErr = tried ? amountError(amount) : null;
  const rErr = tried && !reason ? "This field is required" : null;

  function go(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (amountError(amount) || !reason) return;
    nav({ to: "/get-funding", search: { amount: String(parseAmount(amount)), reason } });
  }

  return (
    <form onSubmit={go} noValidate className="rounded-2xl bg-card p-5 text-card-foreground shadow-2xl md:p-6">
      <p className="font-display text-lg font-semibold">Start your funding search</p>
      <div className={`mt-4 grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label className="block text-sm font-medium">Amount you need
          <div className={`mt-1 flex items-center rounded-xl border bg-background px-4 ${aErr ? "border-destructive" : ""}`}>
            <span className="text-muted-foreground">£</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d,]/g, ""))} inputMode="numeric" placeholder="e.g. 50,000" aria-invalid={!!aErr} className="w-full bg-transparent px-2 py-3 outline-none" />
          </div>
          {aErr && <span className="mt-1 block text-xs text-destructive">{aErr}</span>}
        </label>
        <label className="block text-sm font-medium">Reason
          <select value={reason} onChange={(e) => setReason(e.target.value)} aria-invalid={!!rErr} className={`mt-1 w-full rounded-xl border bg-background px-4 py-3 ${rErr ? "border-destructive" : ""}`}>
            <option value="">Select</option>
            {reasons.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          {rErr && <span className="mt-1 block text-xs text-destructive">{rErr}</span>}
        </label>
      </div>
      <button type="submit" className="btn-primary mt-5 w-full justify-center sm:w-auto">Secure funding <ArrowRight className="h-4 w-4" /></button>
      <p className="mt-3 text-xs text-muted-foreground">Free, no obligation. Checking your options won't affect your credit score. FundingCompany is a credit broker, not a lender.</p>
    </form>
  );
}
