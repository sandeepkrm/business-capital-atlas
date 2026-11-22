import { Link } from "@tanstack/react-router";
import { ExternalLink, Star } from "lucide-react";
import type { Lender } from "@/lib/cms.functions";
import { getService } from "@/lib/services";

export function LenderList({ lenders, showProducts }: { lenders: Lender[]; showProducts?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lenders.map((l) => (
        <article key={l.id} className="flex flex-col rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-3">
            {l.logo_url ? <img src={l.logo_url} alt={`${l.name} logo`} loading="lazy" className="h-12 w-12 rounded-xl border object-contain p-1" /> : <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent font-display text-lg font-semibold">{l.name.slice(0, 1)}</span>}
            <div>
              <h3 className="font-semibold">{l.name}</h3>
              {l.featured && l.relationship === "partner" && <p className="flex items-center gap-1 text-xs text-signal"><Star className="h-3 w-3" />Featured partner</p>}
            </div>
          </div>
          {l.description && <p className="mt-3 text-sm text-muted-foreground">{l.description}</p>}
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[["Published rate", l.rate_from], ["Amounts", [l.min_amount, l.max_amount].filter(Boolean).join(" – ") || null], ["Terms", l.term], ["Speed", l.speed]].map(([k, v]) => v ? (
              <div key={k as string}><dt className="text-xs uppercase text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
            ) : null)}
          </dl>
          {l.source_url && <p className="mt-4 text-xs text-muted-foreground"><a href={l.source_url} target="_blank" rel="noopener noreferrer" className="text-signal underline">Official lender source</a>{l.checked_at ? ` · Checked ${new Date(l.checked_at).toLocaleDateString("en-GB")}` : ""}</p>}
          {l.relationship !== "partner" && <p className="mt-2 text-xs text-muted-foreground">Public information listing. No FundingCompany partnership is confirmed.</p>}
          {showProducts && l.products.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {l.products.map((p) => { const s = getService(p); return s ? <Link key={p} to="/$slug" params={{ slug: p }} className="rounded-full bg-secondary px-2.5 py-1 text-xs hover:text-signal">{s.name}</Link> : null; })}
            </div>
          )}
          <div className="mt-auto pt-5">
            {l.apply_url ? (
              <a href={l.apply_url} target="_blank" rel="noopener sponsored" className="btn-primary w-full justify-center !py-2.5 text-sm">Apply with {l.name}<ExternalLink className="h-4 w-4" /></a>
            ) : <Link to="/contact" className="btn-primary w-full justify-center !py-2.5 text-sm">Enquire</Link>}
          </div>
        </article>
      ))}
    </div>
  );
}
