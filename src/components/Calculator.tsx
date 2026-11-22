import { useState } from "react";
import { calcAsset, calcInvoice, calcRepayment, gbp } from "@/lib/finance";

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; fmt: (n: number) => string }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm font-medium"><span>{label}</span><span className="font-display text-lg">{fmt(value)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[var(--signal)]" />
    </label>
  );
}

const pct = (n: number) => `${n}%`;
const mo = (n: number) => `${n} months`;

function Shell({ inputs, headline, headlineLabel, stats, note }: { inputs: React.ReactNode; headline: string; headlineLabel: string; stats: [string, string][]; note: string }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6 p-8">{inputs}</div>
      <div className="hero-glow flex flex-col justify-center gap-6 p-8">
        <div><p className="text-sm opacity-70">{headlineLabel}</p><p className="font-display text-5xl font-semibold text-accent">{headline}</p></div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {stats.map(([l, v]) => <div key={l}><p className="opacity-70">{l}</p><p className="font-display text-xl">{v}</p></div>)}
        </div>
        <p className="text-xs opacity-60">{note}</p>
      </div>
    </div>
  );
}

export function Calculator({ mode = "loan" }: { mode?: "loan" | "invoice" | "asset" }) {
  if (mode === "invoice") return <InvoiceCalc />;
  if (mode === "asset") return <AssetCalc />;
  return <LoanCalc />;
}

function LoanCalc() {
  const [amount, setAmount] = useState(50000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(36);
  const [fee, setFee] = useState(0);
  const r = calcRepayment(amount, rate, months, fee);
  return (
    <Shell
      inputs={<>
        <Slider label="Loan amount" value={amount} min={1000} max={500000} step={1000} onChange={setAmount} fmt={gbp} />
        <Slider label="Interest rate (annual)" value={rate} min={1} max={30} step={0.5} onChange={setRate} fmt={pct} />
        <Slider label="Term" value={months} min={3} max={120} step={3} onChange={setMonths} fmt={mo} />
        <Slider label="Fees" value={fee} min={0} max={10000} step={100} onChange={setFee} fmt={gbp} />
      </>}
      headlineLabel="Estimated monthly repayment" headline={gbp(r.monthly)}
      stats={[["Total repayable", gbp(r.totalRepaid)], ["Cost of borrowing", gbp(r.totalCost)]]}
      note="Illustrative only. Assumes a fixed rate and equal monthly repayments. Actual rates, fees and terms depend on your circumstances and the provider."
    />
  );
}

function InvoiceCalc() {
  const [invoice, setInvoice] = useState(20000);
  const [adv, setAdv] = useState(85);
  const [svc, setSvc] = useState(1);
  const [disc, setDisc] = useState(8);
  const [days, setDays] = useState(60);
  const r = calcInvoice(invoice, adv, svc, disc, days);
  return (
    <Shell
      inputs={<>
        <Slider label="Invoice value" value={invoice} min={1000} max={250000} step={1000} onChange={setInvoice} fmt={gbp} />
        <Slider label="Advance rate" value={adv} min={50} max={95} step={1} onChange={setAdv} fmt={pct} />
        <Slider label="Service fee (% of invoice)" value={svc} min={0} max={5} step={0.25} onChange={setSvc} fmt={pct} />
        <Slider label="Discount charge (annual)" value={disc} min={0} max={20} step={0.5} onChange={setDisc} fmt={pct} />
        <Slider label="Days until customer pays" value={days} min={7} max={120} step={1} onChange={setDays} fmt={(n) => `${n} days`} />
      </>}
      headlineLabel="Cash released upfront" headline={gbp(r.advance)}
      stats={[["Estimated fees", gbp(r.fees)], ["Balance when paid", gbp(r.balance)]]}
      note="Illustrative only. Real facilities may include minimum fees, audit fees and other charges, and advance rates depend on your customers and sector."
    />
  );
}

function AssetCalc() {
  const [price, setPrice] = useState(40000);
  const [deposit, setDeposit] = useState(4000);
  const [rate, setRate] = useState(8);
  const [months, setMonths] = useState(48);
  const [balloon, setBalloon] = useState(0);
  const r = calcAsset(price, Math.min(deposit, price), rate, months, balloon);
  return (
    <Shell
      inputs={<>
        <Slider label="Asset price" value={price} min={1000} max={500000} step={1000} onChange={setPrice} fmt={gbp} />
        <Slider label="Deposit" value={deposit} min={0} max={Math.max(price / 2, 1000)} step={500} onChange={setDeposit} fmt={gbp} />
        <Slider label="Interest rate (annual)" value={rate} min={1} max={25} step={0.5} onChange={setRate} fmt={pct} />
        <Slider label="Term" value={months} min={12} max={84} step={6} onChange={setMonths} fmt={mo} />
        <Slider label="Balloon payment" value={balloon} min={0} max={Math.max(price / 2, 1000)} step={500} onChange={setBalloon} fmt={gbp} />
      </>}
      headlineLabel="Estimated monthly payment" headline={gbp(r.monthly)}
      stats={[["Amount financed", gbp(r.financed)], ["Total cost of finance", gbp(r.totalCost)]]}
      note="Illustrative only, based on a hire purchase style agreement. Excludes VAT, documentation and option-to-purchase fees."
    />
  );
}
