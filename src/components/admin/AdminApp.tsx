import { Link } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/SiteShell";
import { field } from "@/components/EnquiryForm";
import { LeadsPanel } from "./LeadsPanel";
import { PagesPanel } from "./PagesPanel";
import { NavPanel } from "./NavPanel";
import { SeoPanel } from "./SeoPanel";
import { MediaPanel } from "./MediaPanel";
import { LendersPanel } from "./LendersPanel";
import { CompanyPanel } from "./CompanyPanel";
import { KnowledgePanel } from "./KnowledgePanel";
import { InboxPanel } from "./InboxPanel";
import { WhatsAppPanel } from "./WhatsAppPanel";

const tabs = ["Enquiries", "Funding Inbox", "FundingMate AI", "WhatsApp Connect", "Company", "Partners", "Pages", "Blog", "Lenders", "Menu", "SEO", "Media"] as const;
type Tab = (typeof tabs)[number];

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("Enquiries");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsStaff(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => setIsStaff((data ?? []).some((r) => r.role === "admin" || r.role === "editor")));
  }, [session]);

  if (!ready) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!session) return <AuthCard />;
  if (isStaff === null) return <div className="p-10 text-muted-foreground">Checking access…</div>;
  if (!isStaff)
    return (
      <Shell email={session.user.email}>
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-display text-xl font-semibold">No admin access</p>
          <p className="mt-2 text-sm text-muted-foreground">Your account is signed in but hasn't been given admin or editor access. Ask an existing admin to grant it.</p>
        </div>
      </Shell>
    );

  return (
    <Shell email={session.user.email}>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-ink text-ink-foreground" : "bg-card border hover:bg-secondary"}`}>{t}</button>
        ))}
      </div>
      {tab === "Enquiries" && <LeadsPanel table="enquiries" />}
      {tab === "Funding Inbox" && <InboxPanel />}
      {tab === "FundingMate AI" && <KnowledgePanel />}
      {tab === "WhatsApp Connect" && <WhatsAppPanel />}
      {tab === "Company" && <CompanyPanel />}
      {tab === "Partners" && <LeadsPanel table="partner_applications" />}
      {tab === "Pages" && <PagesPanel kind="page" />}
      {tab === "Blog" && <PagesPanel kind="post" />}
      {tab === "Lenders" && <LendersPanel />}
      {tab === "Menu" && <NavPanel />}
      {tab === "SEO" && <SeoPanel />}
      {tab === "Media" && <MediaPanel />}
    </Shell>
  );
}

function Shell({ email, children }: { email?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-4"><Link to="/"><Logo className="h-9" /></Link><span className="eyebrow">CMS</span></div>
          <div className="flex items-center gap-3 text-sm"><span className="text-muted-foreground">{email}</span><button onClick={() => supabase.auth.signOut()} className="rounded-full border px-3 py-1.5 hover:bg-secondary">Sign out</button></div>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </div>
  );
}

function AuthCard() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your inbox to confirm your email, then sign in.");
    }
    setBusy(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border bg-card p-8 shadow-xl">
        <Logo className="h-10" />
        <h1 className="font-display text-2xl font-semibold">{mode === "in" ? "Sign in to the CMS" : "Create admin account"}</h1>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" />
        <input type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} autoComplete={mode === "in" ? "current-password" : "new-password"} />
        {msg && <p className="text-sm text-muted-foreground" role="status">{msg}</p>}
        <button disabled={busy} className="btn-primary w-full">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-sm text-signal">{mode === "in" ? "First time? Create an account" : "Have an account? Sign in"}</button>
      </form>
    </div>
  );
}
