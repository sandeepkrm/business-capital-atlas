import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { guides } from "@/lib/guides";
import { services } from "@/lib/services";

type Row = { path: string; title: string | null; description: string | null; og_image_url: string | null; noindex: boolean };
const input = "w-full rounded-lg border bg-background px-3 py-2 text-sm";

const knownPaths = () => [
  "/", "/contact", "/about", "/how-it-works", "/partners", "/funding-advisor", "/lenders", "/blog", "/guides", "/eligibility-guide", "/glossary", "/faqs", "/legal",
  "/business-loan-calculator", "/invoice-finance-calculator", "/asset-finance-calculator",
  ...services.map((s) => `/${s.slug}`), ...guides.map((g) => `/guides/${g.slug}`),
];

export function SeoPanel() {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("seo_overrides").select("path, title, description, og_image_url, noindex");
    setRows(Object.fromEntries((data ?? []).map((r) => [r.path, r as Row])));
  }
  useEffect(() => { load(); }, []);

  const paths = useMemo(() => [...new Set([...knownPaths(), ...Object.keys(rows)])].filter((p) => p.includes(q)), [rows, q]);

  async function save() {
    if (!editing) return;
    const { error } = await supabase.from("seo_overrides").upsert({ ...editing, title: editing.title || null, description: editing.description || null, og_image_url: editing.og_image_url || null });
    setMsg(error ? error.message : `Saved SEO for ${editing.path}`);
    setEditing(null); load();
  }
  async function reset(path: string) {
    await supabase.from("seo_overrides").delete().eq("path", path);
    setMsg(`Reset ${path} to default.`); load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border bg-card">
        <div className="border-b p-4"><input placeholder="Filter pages… (or type a new path like /my-page)" value={q} onChange={(e) => setQ(e.target.value)} className={input} /></div>
        <ul className="max-h-[70vh] divide-y overflow-y-auto text-sm">
          {(q.startsWith("/") && !paths.includes(q) ? [q, ...paths] : paths).map((p) => (
            <li key={p} className="flex items-center justify-between gap-3 p-3">
              <button onClick={() => setEditing(rows[p] ?? { path: p, title: "", description: "", og_image_url: "", noindex: false })} className="text-left">
                <span className="font-medium">{p}</span>
                {rows[p] && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs">custom</span>}
              </button>
              {rows[p] && <button onClick={() => reset(p)} className="text-xs text-muted-foreground hover:text-destructive">Reset</button>}
            </li>
          ))}
        </ul>
      </div>
      <div className="self-start rounded-2xl border bg-card p-6">
        {msg && <p className="mb-3 text-sm">{msg}</p>}
        {editing ? (
          <div className="space-y-4">
            <p className="font-display text-lg font-semibold">{editing.path}</p>
            <label className="block text-sm font-medium">SEO title <span className="text-muted-foreground">({(editing.title ?? "").length}/60)</span><input className={`${input} mt-1`} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Leave blank to use the default" /></label>
            <label className="block text-sm font-medium">Meta description <span className="text-muted-foreground">({(editing.description ?? "").length}/160)</span><textarea rows={3} className={`${input} mt-1`} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
            <label className="block text-sm font-medium">Social share image URL (https://…)<input className={`${input} mt-1`} value={editing.og_image_url ?? ""} onChange={(e) => setEditing({ ...editing, og_image_url: e.target.value })} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.noindex} onChange={(e) => setEditing({ ...editing, noindex: e.target.checked })} />Hide this page from search engines</label>
            <div className="flex gap-2"><button onClick={save} className="btn-primary !py-2">Save</button><button onClick={() => setEditing(null)} className="rounded-full border px-4 py-2 text-sm">Cancel</button></div>
          </div>
        ) : <p className="text-sm text-muted-foreground">Choose a page to edit its search title, description and share image. Blog posts and CMS pages also have their own SEO fields in their editors.</p>}
      </div>
    </div>
  );
}
