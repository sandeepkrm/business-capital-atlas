import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { field } from "@/components/EnquiryForm";

const fields = [
  ["company_name", "Registered company name"], ["trading_name", "Trading name"], ["company_number", "Company number"],
  ["registered_address", "Registered office address"], ["fca_status", "FCA status (e.g. Authorised and regulated)"],
  ["fca_number", "FCA firm reference number"], ["principal_firm", "Principal firm (if appointed representative)"],
  ["phone", "Phone"], ["email", "Email"],
  ["company_history", "Company history"], ["company_services", "Our services"],
] as const;
const socials = [["linkedin", "LinkedIn"], ["x", "X (Twitter)"], ["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"]] as const;

export function CompanyPanel() {
  const [v, setV] = useState<Record<string, string>>({});
  const [social, setSocial] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (!data) return;
      const { social: s, ...rest } = data as Record<string, unknown>;
      setV(Object.fromEntries(Object.entries(rest).map(([k, x]) => [k, (x as string) ?? ""])));
      setSocial((s as Record<string, string>) ?? {});
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const row: Record<string, unknown> = { id: 1, social, updated_at: new Date().toISOString() };
    for (const [k] of fields) row[k] = v[k]?.trim() || null;
    const { error } = await supabase.from("site_settings").upsert(row as never);
    setMsg(error ? error.message : "Saved. Company information appears on Legal and About; history and services appear on About.");
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6 rounded-2xl border bg-card p-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Company & legal details</h2>
        <p className="text-sm text-muted-foreground">Shown in the footer and on the Legal page. To write your own Legal or About page, create a page in "Pages" with the slug <code>legal</code> or <code>about</code> — it replaces the default.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map(([k, l]) => <label key={k} className="text-sm font-medium">{l}<input value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} className={`${field} mt-1`} /></label>)}
      </div>
      <div>
        <h3 className="font-semibold">Social media links</h3>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {socials.map(([k, l]) => <label key={k} className="text-sm font-medium">{l}<input type="url" value={social[k] ?? ""} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} placeholder="https://" className={`${field} mt-1`} /></label>)}
        </div>
      </div>
      <div>
        <h3 className="font-semibold">WhatsApp Connect</h3>
        <label className="mt-2 block text-sm font-medium">WhatsApp Business number (international format, e.g. 447700900123)
          <input inputMode="numeric" value={social["whatsapp"] ?? ""} onChange={(e) => setSocial({ ...social, whatsapp: e.target.value.replace(/\D/g, "") })} placeholder="44…" className={`${field} mt-1`} />
        </label>
        <p className="mt-1 text-xs text-muted-foreground">Visitors chatting with FundingMate AI can hand over to this number. Handovers appear in the Funding Inbox.</p>
      </div>
      {msg && <p className="text-sm text-muted-foreground" role="status">{msg}</p>}
      <button className="btn-primary">Save details</button>
    </form>
  );
}
