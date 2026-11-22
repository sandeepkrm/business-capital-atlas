import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { field } from "@/components/EnquiryForm";

type K = { id: string; kind: string; title: string; content: string; active: boolean };

export function KnowledgePanel() {
  const [rows, setRows] = useState<K[]>([]);
  const [draft, setDraft] = useState({ kind: "faq", title: "", content: "" });
  const load = () => supabase.from("chatbot_knowledge").select("id, kind, title, content, active").order("created_at").then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.content.trim()) return;
    await supabase.from("chatbot_knowledge").insert(draft);
    setDraft({ kind: "faq", title: "", content: "" }); load();
  }
  async function update(r: K) { await supabase.from("chatbot_knowledge").update({ title: r.title, content: r.content, active: r.active, updated_at: new Date().toISOString() }).eq("id", r.id); load(); }
  async function remove(id: string) { if (confirm("Delete this entry?")) { await supabase.from("chatbot_knowledge").delete().eq("id", id); load(); } }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-display text-xl font-semibold">Funding Knowledge Hub</h2>
        <p className="text-sm text-muted-foreground">Teach FundingMate AI. "Bot behaviour" entries set tone and rules; FAQs and approved answers are facts it should use. Changes apply to the next message.</p>
        <form onSubmit={add} className="mt-4 grid gap-3">
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })} className={field}>
            <option value="faq">FAQ / approved answer</option><option value="settings">Bot behaviour</option><option value="guide">Funding guide / notes</option>
          </select>
          <input placeholder="Title or question" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={field} />
          <textarea rows={4} placeholder="Answer or instructions" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} className={field} />
          <button className="btn-primary justify-self-start">Add to knowledge</button>
        </form>
      </div>
      {rows.map((r) => (
        <div key={r.id} className="space-y-2 rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between text-xs uppercase text-muted-foreground"><span>{r.kind === "settings" ? "Bot behaviour" : r.kind}</span>
            <label className="flex items-center gap-1 normal-case"><input type="checkbox" checked={r.active} onChange={(e) => update({ ...r, active: e.target.checked })} />Active</label></div>
          <input defaultValue={r.title} onBlur={(e) => e.target.value !== r.title && update({ ...r, title: e.target.value })} className={field} />
          <textarea rows={3} defaultValue={r.content} onBlur={(e) => e.target.value !== r.content && update({ ...r, content: e.target.value })} className={field} />
          <button onClick={() => remove(r.id)} className="text-sm text-destructive">Delete</button>
        </div>
      ))}
    </div>
  );
}
