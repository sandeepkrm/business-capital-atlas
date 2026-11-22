import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/lib/services";
import { uploadMedia } from "./MediaPanel";

type Row = { id?: string; name: string; logo_url: string | null; description: string | null; products: string[]; rate_from: string | null; min_amount: string | null; max_amount: string | null; term: string | null; speed: string | null; apply_url: string | null; featured: boolean; visible: boolean; sort_order: number; source_url: string | null; checked_at: string | null; relationship: string };
const input = "w-full rounded-lg border bg-background px-3 py-2 text-sm";
const empty: Row = { name: "", logo_url: "", description: "", products: [], rate_from: "", min_amount: "", max_amount: "", term: "", speed: "", apply_url: "", featured: false, visible: true, sort_order: 0, source_url: "", checked_at: null, relationship: "unconfirmed" };

export function LendersPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("lenders").select("*").order("sort_order");
    setRows((data ?? []) as Row[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!edit) return;
    if (!edit.name.trim()) { setMsg("Lender name is required."); return; }
    if (edit.apply_url && !/^https:\/\//.test(edit.apply_url)) { setMsg("Application link must start with https://"); return; }
    const row = { ...edit };
    for (const k of ["logo_url", "description", "rate_from", "min_amount", "max_amount", "term", "speed", "apply_url", "source_url", "checked_at"] as const) if (!row[k]) row[k] = null;
    const { data, error } = row.id ? await supabase.from("lenders").update(row).eq("id", row.id).select().single() : await supabase.from("lenders").insert(row).select().single();
    if (error) { setMsg(error.message); return; }
    setEdit(data as Row); setMsg("Saved."); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this lender?")) return;
    await supabase.from("lenders").delete().eq("id", id); setEdit(null); load();
  }
  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !edit) return;
    try { setEdit({ ...edit, logo_url: await uploadMedia(f) }); } catch (err) { setMsg(err instanceof Error ? err.message : "Upload failed"); }
  }
  const toggle = (slug: string) => edit && setEdit({ ...edit, products: edit.products.includes(slug) ? edit.products.filter((p) => p !== slug) : [...edit.products, slug] });

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="self-start rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b p-4"><p className="font-semibold">Lenders</p><button onClick={() => { setEdit({ ...empty, sort_order: rows.length }); setMsg(null); }} className="btn-primary !px-3 !py-1.5 text-sm">New</button></div>
        <ul className="divide-y text-sm">
          {rows.map((r) => <li key={r.id}><button onClick={() => { setEdit(r); setMsg(null); }} className="w-full p-3 text-left hover:bg-secondary"><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.products.length} products · {r.visible ? "Visible" : "Hidden"}</p></button></li>)}
          {!rows.length && <li className="p-4 text-muted-foreground">No lenders yet.</li>}
        </ul>
      </div>
      {edit ? (
        <div className="space-y-4 rounded-2xl border bg-card p-6">
          {msg && <p className="text-sm">{msg}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">Lender name *<input className={`${input} mt-1`} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <div className="text-sm font-medium">Logo<div className="mt-1 flex items-center gap-3">{edit.logo_url && <img src={edit.logo_url} alt="" className="h-10 w-10 rounded object-contain" />}<label className="cursor-pointer rounded-full border px-3 py-1.5 hover:bg-secondary">Upload<input type="file" accept="image/*" className="hidden" onChange={onLogo} /></label></div></div>
            <label className="text-sm font-medium md:col-span-2">Short description<textarea rows={2} className={`${input} mt-1`} value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
            <label className="text-sm font-medium">Rates from (e.g. "From 6.9% APR")<input className={`${input} mt-1`} value={edit.rate_from ?? ""} onChange={(e) => setEdit({ ...edit, rate_from: e.target.value })} /></label>
            <label className="text-sm font-medium">Terms (e.g. "3–60 months")<input className={`${input} mt-1`} value={edit.term ?? ""} onChange={(e) => setEdit({ ...edit, term: e.target.value })} /></label>
            <label className="text-sm font-medium">Minimum amount<input className={`${input} mt-1`} value={edit.min_amount ?? ""} onChange={(e) => setEdit({ ...edit, min_amount: e.target.value })} /></label>
            <label className="text-sm font-medium">Maximum amount<input className={`${input} mt-1`} value={edit.max_amount ?? ""} onChange={(e) => setEdit({ ...edit, max_amount: e.target.value })} /></label>
            <label className="text-sm font-medium">Typical speed<input className={`${input} mt-1`} value={edit.speed ?? ""} onChange={(e) => setEdit({ ...edit, speed: e.target.value })} /></label>
            <label className="text-sm font-medium">Application link (https://)<input className={`${input} mt-1`} value={edit.apply_url ?? ""} onChange={(e) => setEdit({ ...edit, apply_url: e.target.value })} /></label>
            <label className="text-sm font-medium">Official source URL<input type="url" className={`${input} mt-1`} value={edit.source_url ?? ""} onChange={(e) => setEdit({ ...edit, source_url: e.target.value })} /></label>
            <label className="text-sm font-medium">Figures last checked<input type="date" className={`${input} mt-1`} value={edit.checked_at ?? ""} onChange={(e) => setEdit({ ...edit, checked_at: e.target.value })} /></label>
            <label className="text-sm font-medium">Relationship<select className={`${input} mt-1`} value={edit.relationship} onChange={(e) => setEdit({ ...edit, relationship: e.target.value })}><option value="unconfirmed">Unconfirmed</option><option value="public_listing">Public information listing</option><option value="partner">Confirmed partner</option></select></label>
            <label className="text-sm font-medium">Display order<input type="number" className={`${input} mt-1`} value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} /></label>
            <div className="flex items-end gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} />Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={edit.visible} onChange={(e) => setEdit({ ...edit, visible: e.target.checked })} />Visible on site</label></div>
          </div>
          <div>
            <p className="text-sm font-medium">Show on these loan pages</p>
            <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => <label key={s.slug} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.products.includes(s.slug)} onChange={() => toggle(s.slug)} />{s.name}</label>)}
            </div>
          </div>
          <div className="flex gap-3 border-t pt-4"><button onClick={save} className="btn-primary !py-2">Save</button>{edit.id && <button onClick={() => { if (edit.id) remove(edit.id); }} className="ml-auto text-sm text-destructive">Delete</button>}</div>
        </div>
      ) : <div className="rounded-2xl border border-dashed p-10 text-muted-foreground">Select a lender or add a new one. Rates and terms you enter appear on the matching loan pages.</div>}
    </div>
  );
}
