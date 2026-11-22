import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Table = "enquiries" | "partner_applications";
type Row = { id: string; full_name: string; company: string | null; email: string; created_at: string; status: string; funding_purpose?: string | null; partner_type?: string | null; amount?: string | null; [k: string]: unknown };

const statuses = ["new", "contacted", "in progress", "closed"];

export function LeadsPanel({ table }: { table: Table }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) setError(error.message); else setRows(data ?? []);
  }
  useEffect(() => {
    load();
    if (table !== "enquiries") return;
    const ch = supabase.channel(`leads-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "enquiries" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table]);

  async function setStatus(id: string, status: string) {
    await supabase.from(table).update({ status }).eq("id", id);
    load();
  }

  function exportCsv() {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]!);
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${table}.csv`;
    a.click();
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <p className="font-semibold">{rows.length} {table === "enquiries" ? "enquiries" : "partner applications"}</p>
        <button onClick={exportCsv} className="rounded-full border px-3 py-1.5 text-sm hover:bg-secondary">Export CSV</button>
      </div>
      {error && <p className="p-4 text-sm text-destructive">{error}</p>}
      <div className="divide-y">
        {rows.map((r) => (
          <div key={r.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => setOpen(open === r.id ? null : r.id)} className="text-left">
                <p className="font-semibold">{r.full_name} <span className="font-normal text-muted-foreground">· {r.company ?? ""}</span></p>
                <p className="text-sm text-muted-foreground">{r.email} · {new Date(r.created_at).toLocaleString("en-GB")} · {r.funding_purpose ?? r.partner_type ?? ""} {r.amount ? `· £${r.amount}` : ""}</p>
              </button>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-lg border bg-background px-3 py-1.5 text-sm">
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {open === r.id && (
              <dl className="mt-3 grid gap-2 rounded-xl bg-secondary p-4 text-sm sm:grid-cols-2">
                {Object.entries(r).filter(([k]) => !["id"].includes(k)).map(([k, v]) => (
                  <div key={k}><dt className="text-xs uppercase text-muted-foreground">{k.replace(/_/g, " ")}</dt><dd className="break-words">{String(v ?? "—")}</dd></div>
                ))}
              </dl>
            )}
          </div>
        ))}
        {!rows.length && !error && <p className="p-6 text-sm text-muted-foreground">Nothing yet.</p>}
      </div>
    </div>
  );
}
