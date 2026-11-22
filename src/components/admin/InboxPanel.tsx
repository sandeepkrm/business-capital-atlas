import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { field } from "@/components/EnquiryForm";

type Convo = { id: string; status: string; page: string | null; created_at: string; last_message_at: string };
type Msg = { id: string; conversation_id: string; role: string; content: string; created_at: string };

export function InboxPanel() {
  const [convos, setConvos] = useState<Convo[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");

  const loadConvos = () => supabase.from("chat_conversations").select("id, status, page, created_at, last_message_at").order("last_message_at", { ascending: false }).limit(200).then(({ data }) => setConvos(data ?? []));
  const loadMsgs = (id: string) => supabase.from("chat_messages").select("*").eq("conversation_id", id).order("created_at").then(({ data }) => setMsgs(data ?? []));

  useEffect(() => {
    loadConvos();
    const ch = supabase.channel(`inbox-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, () => loadConvos())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (p) => {
        const m = p.new as Msg;
        setMsgs((cur) => (cur[0]?.conversation_id === m.conversation_id || cur.length === 0) && !cur.some((x) => x.id === m.id) ? [...cur, m].filter((x) => x.conversation_id === m.conversation_id) : cur);
        loadConvos();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  useEffect(() => { if (active) loadMsgs(active); }, [active]);

  const current = convos.find((c) => c.id === active);
  async function setStatus(status: string) { if (active) { await supabase.from("chat_conversations").update({ status }).eq("id", active); loadConvos(); } }
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !reply.trim()) return;
    const { error } = await supabase.from("chat_messages").insert({ conversation_id: active, role: "agent", content: reply.trim() });
    if (!error) { setReply(""); if (current?.status !== "agent") setStatus("agent"); }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="max-h-[70vh] overflow-y-auto rounded-2xl border bg-card">
        <p className="border-b p-4 font-semibold">Funding Inbox · {convos.length} chats <span className="ml-1 text-xs font-normal text-signal">● live</span></p>
        {convos.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`block w-full border-b p-4 text-left text-sm hover:bg-secondary ${active === c.id ? "bg-secondary" : ""}`}>
            <p className="font-medium">Visitor {c.id.slice(0, 6).toUpperCase()} {c.status === "whatsapp" && <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">WhatsApp</span>}</p>
            <p className="text-xs text-muted-foreground">{new Date(c.last_message_at).toLocaleString("en-GB")} · {c.status === "whatsapp" ? "handed to WhatsApp" : c.status}{c.page ? ` · ${c.page}` : ""}</p>
          </button>
        ))}
        {!convos.length && <p className="p-4 text-sm text-muted-foreground">No chats yet.</p>}
      </div>
      <div className="flex max-h-[70vh] flex-col rounded-2xl border bg-card">
        {!current ? <p className="p-6 text-muted-foreground">Select a conversation.</p> : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4 text-sm">
              <span className="font-semibold">Visitor {current.id.slice(0, 6)}</span>
              <div className="flex gap-2">
                <button onClick={() => setStatus(current.status === "agent" ? "open" : "agent")} className="rounded-full border px-3 py-1">{current.status === "agent" ? "Hand back to AI" : "Take over from AI"}</button>
                <button onClick={() => setStatus("closed")} className="rounded-full border px-3 py-1">Close</button>
              </div>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
              {current.status === "whatsapp" && <p className="rounded-xl bg-accent/30 p-3 text-xs">This visitor moved to WhatsApp. Look for a message quoting reference <b>{current.id.slice(0, 6).toUpperCase()}</b> in your WhatsApp Business app — the chat history below gives you the context.</p>}
              {msgs.map((m) => m.role === "system" ? (
                <p key={m.id} className="text-center text-xs text-muted-foreground">— {m.content} —</p>
              ) : (
                <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.role === "user" ? "bg-secondary" : m.role === "agent" ? "ml-auto bg-ink text-ink-foreground" : "ml-auto border"}`}>
                  <p className="mb-1 text-xs opacity-60">{m.role === "user" ? "Visitor" : m.role === "agent" ? "You (team)" : "FundingMate AI"} · {new Date(m.created_at).toLocaleTimeString("en-GB")}</p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t p-3">
              <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply as the FundingCompany team (pauses the AI)…" className={field} />
              <button className="btn-primary">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
