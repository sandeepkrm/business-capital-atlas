import { useLocation } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/CmsArticle";
import { useSiteSettings } from "@/components/SiteShell";

type Msg = { id: string; role: string; content: string };
const KEY = "fundingmate-chat";

function loadState(): { id?: string; token: string } {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (s?.token) return s;
  } catch { /* ignore */ }
  const s = { token: crypto.randomUUID() + crypto.randomUUID() };
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

export function ChatWidget() {
  const loc = useLocation();
  const waNumber = useSiteSettings()?.social?.["whatsapp"]?.replace(/\D/g, "") || null;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [handoverLabel, setHandoverLabel] = useState("Continue on WhatsApp with our team");
  const state = useRef<{ id?: string; token: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function sync() {
    const s = state.current;
    if (!s?.id) return;
    const r = await fetch(`/api/chat?id=${s.id}&token=${encodeURIComponent(s.token)}`);
    if (r.ok) { const j = await r.json(); setMsgs(j.messages); if (j.handoverLabel) setHandoverLabel(j.handoverLabel); }
  }

  useEffect(() => { state.current = loadState(); sync(); }, []);
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const t = setInterval(() => { if (!busy) sync(); }, 6000);
    return () => clearInterval(t);
  }, [open, busy]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs, open]);

  if (loc.pathname.startsWith("/admin")) return null;

  async function toWhatsApp() {
    const s = state.current;
    if (!s?.id || !waNumber) return;
    // Open the window synchronously so mobile browsers don't block it
    const win = window.open("", "_blank");
    let ref = s.id.slice(0, 6).toUpperCase();
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "whatsapp", conversationId: s.id, token: s.token }) });
      const j = await r.json().catch(() => ({}));
      if (j.ref) ref = j.ref;
    } catch { /* still open WhatsApp */ }
    const firstAsk = msgs.find((m) => m.role === "user")?.content.slice(0, 200) ?? "";
    const text = `Hi FundingCompany, I've been chatting with FundingMate on your website (ref ${ref}). ${firstAsk}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    if (win) win.location.href = url; else window.location.href = url;
    setMsgs((m) => [...m, { id: `s${Date.now()}`, role: "assistant", content: `Opening WhatsApp… Your reference is **${ref}** so our team can pick up where you left off.` }]);
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy || !state.current) return;
    setInput(""); setErr(null); setBusy(true);
    setMsgs((m) => [...m, { id: `u${Date.now()}`, role: "user", content: text }, { id: "pending", role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ conversationId: state.current.id, token: state.current.token, message: text, page: loc.pathname }) });
      const cid = res.headers.get("X-Conversation-Id");
      if (cid) { state.current.id = cid; localStorage.setItem(KEY, JSON.stringify(state.current)); }
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? "FundingMate is unavailable right now."); }
      if (!res.body) throw new Error("Chat response was empty. Please try again.");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => m.map((x) => (x.id === "pending" ? { ...x, content: acc } : x)));
      }
      if (!acc) setMsgs((m) => m.filter((x) => x.id !== "pending"));
      else setMsgs((m) => m.map((x) => (x.id === "pending" ? { ...x, id: `a${Date.now()}` } : x)));
    } catch (e) {
      setMsgs((m) => m.filter((x) => x.id !== "pending"));
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Chat with FundingMate AI" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-ink-foreground shadow-xl ring-2 ring-accent">
          <MessageCircle className="h-5 w-5 text-accent" />Ask FundingMate
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(600px,85vh)] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl">
          <div className="flex items-center justify-between bg-ink p-4 text-ink-foreground">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-display font-bold text-accent-foreground">FM</span>
              <div><p className="font-display font-semibold">FundingMate AI</p><p className="text-xs opacity-70">Funding guidance · not financial advice</p></div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.length === 0 && <p className="text-muted-foreground">Hi! I'm FundingMate. Tell me what your business needs funding for and I'll point you to options worth exploring.</p>}
            {msgs.map((m) => m.role === "user" ? (
              <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2 text-ink-foreground">{m.content}</div>
            ) : (
              <div key={m.id} className="max-w-[90%]">
                {m.role === "agent" && <p className="mb-1 text-xs font-semibold text-signal">FundingCompany team</p>}
                {m.content ? <Markdown>{m.content}</Markdown> : <p className="animate-pulse text-muted-foreground">FundingMate is typing…</p>}
              </div>
            ))}
            {err && <p role="alert" className="text-destructive">{err}</p>}
            <div ref={endRef} />
          </div>
          {waNumber && msgs.some((m) => m.role === "user") && (
            <button onClick={toWhatsApp} className="mx-3 mb-1 flex items-center justify-center gap-2 rounded-xl border border-signal/40 bg-secondary px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground">
              <MessageCircle className="h-4 w-4" />{handoverLabel}
            </button>
          )}
          <form onSubmit={send} className="flex items-end gap-2 border-t p-3">
            <textarea ref={inputRef} rows={1} value={input} maxLength={2000} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Type your question…" className="max-h-32 flex-1 resize-none rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
            <button disabled={busy || !input.trim()} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
