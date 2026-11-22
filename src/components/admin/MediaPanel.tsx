import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export async function uploadMedia(file: File): Promise<string> {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from("cms-media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return `/media/${path}`;
}

export function MediaPanel() {
  const [files, setFiles] = useState<{ name: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.storage.from("cms-media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setFiles((data ?? []).filter((f) => f.name !== ".emptyFolderPlaceholder"));
  }
  useEffect(() => { load(); }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setMsg(null);
    try { await uploadMedia(f); await load(); setMsg("Uploaded."); } catch (err) { setMsg(err instanceof Error ? err.message : "Upload failed"); }
    setBusy(false);
  }

  async function remove(name: string) {
    if (!confirm("Delete this image? Pages using it will show a broken image.")) return;
    await supabase.storage.from("cms-media").remove([name]);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
        <label className="btn-primary cursor-pointer !py-2">{busy ? "Uploading…" : "Upload image"}<input type="file" accept="image/*" className="hidden" onChange={onUpload} /></label>
        <p className="text-sm text-muted-foreground">Copy an image's address and paste it into a page's hero image or body as <code>![alt text](/media/…)</code>.</p>
        {msg && <p className="text-sm">{msg}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {files.map((f) => (
          <div key={f.name} className="overflow-hidden rounded-2xl border bg-card">
            <img src={`/media/${f.name}`} alt={f.name} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="space-y-2 p-3 text-xs">
              <p className="truncate">{f.name}</p>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(`/media/${f.name}`)} className="rounded-full border px-2 py-1 hover:bg-secondary">Copy URL</button>
                <button onClick={() => remove(f.name)} className="rounded-full border px-2 py-1 text-destructive hover:bg-secondary">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
