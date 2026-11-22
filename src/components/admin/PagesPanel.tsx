import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Markdown } from "@/components/CmsArticle";
import { services, type Service } from "@/lib/services";
import { facts } from "@/lib/menu";
import { uploadMedia } from "./MediaPanel";

type Row = {
  id?: string; kind: "page" | "post"; slug: string; title: string; seo_title: string | null; seo_description: string | null;
  eyebrow: string | null; excerpt: string | null; body: string; hero_image_url: string | null; category: string | null;
  author: string | null; published: boolean; published_at: string | null;
};
const input = "w-full rounded-lg border bg-background px-3 py-2 text-sm";
const empty = (kind: Row["kind"]): Row => ({ kind, slug: "", title: "", seo_title: "", seo_description: "", eyebrow: "", excerpt: "", body: "", hero_image_url: "", category: "", author: kind === "post" ? "FundingCompany team" : "", published: false, published_at: null });
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function serviceToMarkdown(s: Service) {
  const f = facts[s.slug];
  return [
    s.intro, "",
    f ? `**Typical amounts:** ${f[0]} · **Typical terms:** ${f[1]} · **Security:** ${f[2]} · **Speed:** ${f[3]}` : "", "",
    `## What can ${s.name.toLowerCase()} be used for?`, ...s.uses.map((u) => `- ${u}`), "",
    `## Types of ${s.name.toLowerCase()}`, ...s.types.map((t) => `### ${t.t}\n\n${t.d}\n`),
    "## What lenders consider", ...s.considerations.map((c) => `- **${c.t}:** ${c.d}`), "",
    "## Costs, repayments and risks", s.costs, "",
    "## Frequently asked questions", ...s.faqs.map((q) => `### ${q.q}\n\n${q.a}\n`),
  ].join("\n");
}

export function PagesPanel({ kind }: { kind: "page" | "post" }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  async function load() {
    const { data } = await supabase.from("cms_pages").select("*").eq("kind", kind).order("updated_at", { ascending: false });
    setRows((data ?? []) as Row[]);
  }
  useEffect(() => { load(); setEdit(null); }, [kind]);

  async function save() {
    if (!edit) return;
    if (!edit.title || !edit.slug) { setMsg("Title and URL slug are required."); return; }
    const row = { ...edit, slug: slugify(edit.slug), published_at: edit.published ? edit.published_at ?? new Date().toISOString() : edit.published_at };
    for (const k of ["seo_title", "seo_description", "eyebrow", "excerpt", "hero_image_url", "category", "author"] as const) if (!row[k]) row[k] = null;
    const { data, error } = row.id ? await supabase.from("cms_pages").update(row).eq("id", row.id).select().single() : await supabase.from("cms_pages").insert(row).select().single();
    if (error) { setMsg(error.message.includes("duplicate") ? "That URL slug is already used." : error.message); return; }
    setEdit(data as Row); setMsg("Saved."); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this permanently?")) return;
    await supabase.from("cms_pages").delete().eq("id", id);
    setEdit(null); load();
  }
  async function onHero(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !edit) return;
    try { const url = await uploadMedia(f); setEdit({ ...edit, hero_image_url: url }); } catch (err) { setMsg(err instanceof Error ? err.message : "Upload failed"); }
  }
  async function onBodyImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !edit) return;
    try { const url = await uploadMedia(f); setEdit({ ...edit, body: `${edit.body}\n\n![${f.name}](${url})\n` }); } catch (err) { setMsg(err instanceof Error ? err.message : "Upload failed"); }
  }
  function importService(slug: string) {
    const s = services.find((x) => x.slug === slug);
    if (!s || !edit) return;
    setEdit({ ...edit, slug: s.slug, title: s.h1, eyebrow: s.eyebrow, excerpt: s.description, seo_title: s.title, seo_description: s.description, body: serviceToMarkdown(s) });
  }

  const publicUrl = (r: Row) => (r.kind === "post" ? `/blog/${r.slug}` : `/${r.slug}`);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="self-start rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <p className="font-semibold">{kind === "post" ? "Blog posts" : "Pages"}</p>
          <button onClick={() => { setEdit(empty(kind)); setMsg(null); }} className="btn-primary !px-3 !py-1.5 text-sm">New</button>
        </div>
        <ul className="max-h-[70vh] divide-y overflow-y-auto text-sm">
          {rows.map((r) => (
            <li key={r.id}><button onClick={() => { setEdit(r); setMsg(null); }} className={`w-full p-3 text-left hover:bg-secondary ${edit?.id === r.id ? "bg-secondary" : ""}`}>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{publicUrl(r)} · {r.published ? "Published" : "Draft"}</p>
            </button></li>
          ))}
          {!rows.length && <li className="p-4 text-muted-foreground">None yet.</li>}
        </ul>
        {kind === "page" && <p className="border-t p-4 text-xs text-muted-foreground">A published page with the same URL as a built-in loan page (e.g. <code>business-loans</code>) replaces its content. Use “Start from built-in page” to copy existing content.</p>}
      </div>

      {edit ? (
        <div className="space-y-4 rounded-2xl border bg-card p-6">
          {msg && <p className="text-sm">{msg}</p>}
          {kind === "page" && !edit.id && (
            <label className="block text-sm font-medium">Start from built-in page (optional)
              <select className={`${input} mt-1`} defaultValue="" onChange={(e) => importService(e.target.value)}>
                <option value="">— Blank page —</option>
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </label>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">Title / H1 *<input className={`${input} mt-1`} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value, slug: edit.id || edit.slug ? edit.slug : slugify(e.target.value) })} /></label>
            <label className="text-sm font-medium">URL slug * <span className="font-normal text-muted-foreground">{publicUrl({ ...edit, slug: slugify(edit.slug) })}</span><input className={`${input} mt-1`} value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></label>
            <label className="text-sm font-medium">Eyebrow label<input className={`${input} mt-1`} value={edit.eyebrow ?? ""} onChange={(e) => setEdit({ ...edit, eyebrow: e.target.value })} /></label>
            {kind === "post" ? (
              <label className="text-sm font-medium">Category<input className={`${input} mt-1`} value={edit.category ?? ""} onChange={(e) => setEdit({ ...edit, category: e.target.value })} /></label>
            ) : <div />}
            <label className="text-sm font-medium md:col-span-2">Intro / excerpt<textarea rows={2} className={`${input} mt-1`} value={edit.excerpt ?? ""} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} /></label>
            <label className="text-sm font-medium">SEO title <span className="text-muted-foreground">({(edit.seo_title ?? "").length}/60)</span><input className={`${input} mt-1`} value={edit.seo_title ?? ""} onChange={(e) => setEdit({ ...edit, seo_title: e.target.value })} /></label>
            <label className="text-sm font-medium">Meta description <span className="text-muted-foreground">({(edit.seo_description ?? "").length}/160)</span><input className={`${input} mt-1`} value={edit.seo_description ?? ""} onChange={(e) => setEdit({ ...edit, seo_description: e.target.value })} /></label>
            {kind === "post" && <label className="text-sm font-medium">Author<input className={`${input} mt-1`} value={edit.author ?? ""} onChange={(e) => setEdit({ ...edit, author: e.target.value })} /></label>}
            <div className="text-sm font-medium">Hero image
              <div className="mt-1 flex items-center gap-3">
                {edit.hero_image_url && <img src={edit.hero_image_url} alt="" className="h-12 w-20 rounded object-cover" />}
                <label className="cursor-pointer rounded-full border px-3 py-1.5 hover:bg-secondary">Upload<input type="file" accept="image/*" className="hidden" onChange={onHero} /></label>
                {edit.hero_image_url && <button onClick={() => setEdit({ ...edit, hero_image_url: "" })} className="text-xs text-muted-foreground">Remove</button>}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Content (Markdown: ## heading, **bold**, - list, [link](/contact))</span>
              <span className="flex gap-2">
                <label className="cursor-pointer rounded-full border px-3 py-1 hover:bg-secondary">Insert image<input type="file" accept="image/*" className="hidden" onChange={onBodyImage} /></label>
                <button onClick={() => setPreview(!preview)} className="rounded-full border px-3 py-1 hover:bg-secondary">{preview ? "Edit" : "Preview"}</button>
              </span>
            </div>
            {preview ? <div className="mt-2 min-h-64 rounded-lg border bg-background p-4"><Markdown>{edit.body}</Markdown></div> : <textarea rows={18} className={`${input} mt-2 font-mono`} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} />}
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t pt-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} />Published</label>
            <button onClick={save} className="btn-primary !py-2">Save</button>
            {edit.id && edit.published && <a href={publicUrl(edit)} target="_blank" rel="noopener" className="rounded-full border px-4 py-2 text-sm hover:bg-secondary">View live</a>}
            {edit.id && <button onClick={() => remove(edit.id!)} className="ml-auto text-sm text-destructive">Delete</button>}
          </div>
        </div>
      ) : <div className="rounded-2xl border border-dashed p-10 text-muted-foreground">Select an item or create a new one.</div>}
    </div>
  );
}
