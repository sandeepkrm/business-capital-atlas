import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; menu: string; section: string | null; label: string; href: string; sort_order: number; visible: boolean };
const input = "w-full rounded-lg border bg-background px-2 py-1.5 text-sm";

export function NavPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("nav_items").select("*").order("sort_order");
    setRows((data ?? []) as Row[]);
  }
  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<Row>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  async function save(r: Row) {
    const { error } = await supabase.from("nav_items").update({ menu: r.menu, section: r.section || null, label: r.label, href: r.href, sort_order: r.sort_order, visible: r.visible }).eq("id", r.id);
    setMsg(error ? error.message : `Saved “${r.label}”.`);
  }
  async function add() {
    const max = Math.max(0, ...rows.map((r) => r.sort_order)) + 1;
    await supabase.from("nav_items").insert({ menu: "Resources", label: "New link", href: "/", sort_order: max });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Remove this menu item?")) return;
    await supabase.from("nav_items").delete().eq("id", id);
    load();
  }

  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <p className="text-sm text-muted-foreground">Top-level <b>Menu</b> names become dropdowns. Items with a <b>Column</b> appear as columns in a mega menu. Use links like <code>/business-loans</code>. Changes appear on the site within a minute.</p>
        <button onClick={add} className="btn-primary !py-2 text-sm">Add item</button>
      </div>
      {msg && <p className="px-4 pt-3 text-sm">{msg}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead><tr className="text-xs uppercase text-muted-foreground">{["Order", "Menu", "Column", "Label", "Link", "Visible", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="w-20 p-2"><input type="number" className={input} value={r.sort_order} onChange={(e) => update(r.id, { sort_order: Number(e.target.value) })} /></td>
                <td className="p-2"><input className={input} value={r.menu} onChange={(e) => update(r.id, { menu: e.target.value })} /></td>
                <td className="p-2"><input className={input} value={r.section ?? ""} onChange={(e) => update(r.id, { section: e.target.value })} /></td>
                <td className="p-2"><input className={input} value={r.label} onChange={(e) => update(r.id, { label: e.target.value })} /></td>
                <td className="p-2"><input className={input} value={r.href} onChange={(e) => update(r.id, { href: e.target.value })} /></td>
                <td className="p-2 text-center"><input type="checkbox" checked={r.visible} onChange={(e) => update(r.id, { visible: e.target.checked })} /></td>
                <td className="whitespace-nowrap p-2"><button onClick={() => save(r)} className="rounded-full border px-3 py-1 hover:bg-secondary">Save</button> <button onClick={() => remove(r.id)} className="rounded-full border px-3 py-1 text-destructive hover:bg-secondary">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
