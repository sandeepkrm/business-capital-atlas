import { useEffect, useState } from 'react';
import { ArrowDown, BookOpen, Bot, MessageCircle, Save, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { field } from '@/components/EnquiryForm';
const knowledgeOptions: [string, string][] = [['faq', 'FAQs / approved answers'], ['guide', 'Funding guides'], ['settings', 'Bot behaviour']];

export function WhatsAppPanel() {
  const [flow, setFlow] = useState({ ai_enabled: true, knowledge_kinds: ['faq', 'guide', 'settings'], handover_message: 'Continue on WhatsApp with our team', team_message: 'Thank you. Our team will follow up on your enquiry.' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.from('whatsapp_flow_settings').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error) setMessage(error.message);
      if (data) setFlow({ ai_enabled: data.ai_enabled, knowledge_kinds: data.knowledge_kinds, handover_message: data.handover_message, team_message: data.team_message });
    });
  }, []);
  async function save() {
    setBusy(true);
    const { error } = await supabase.from('whatsapp_flow_settings').upsert({ id: 1, ...flow, updated_at: new Date().toISOString() });
    setMessage(error ? error.message : 'Flow saved. Applies to the next website chat message.');
    setBusy(false);
  }
  return <div className="max-w-3xl space-y-6">
    <div><h2 className="font-display text-2xl font-semibold">WhatsApp Connect</h2><p className="mt-2 text-sm text-muted-foreground">Not connected · Incoming WhatsApp messages and in-app WhatsApp replies are unavailable.</p></div>
    <div className="border-y py-4 text-sm text-muted-foreground">WhatsApp Business must be connected in Lovable before live WhatsApp messaging can be activated. Your website chat and Funding Inbox continue to work.</div>
    <div className="space-y-4">
      <section className="border-l-2 border-signal pl-5"><h3 className="flex items-center gap-2 font-semibold"><Bot className="h-5 w-5 text-signal" />1. FundingMate AI</h3><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={flow.ai_enabled} onChange={(e) => setFlow({ ...flow, ai_enabled: e.target.checked })} />Enable AI answers before team handover</label></section>
      <ArrowDown className="ml-4 h-5 w-5 text-muted-foreground" />
      <section className="border-l-2 border-signal pl-5"><h3 className="flex items-center gap-2 font-semibold"><BookOpen className="h-5 w-5 text-signal" />2. Funding Knowledge Hub</h3><div className="mt-3 flex flex-wrap gap-4">{knowledgeOptions.map(([kind, label]) => <label key={kind} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flow.knowledge_kinds.includes(kind)} onChange={(e) => setFlow({ ...flow, knowledge_kinds: e.target.checked ? [...flow.knowledge_kinds, kind] : flow.knowledge_kinds.filter((k) => k !== kind) })} />{label}</label>)}</div></section>
      <ArrowDown className="ml-4 h-5 w-5 text-muted-foreground" />
      <section className="border-l-2 border-signal pl-5"><h3 className="flex items-center gap-2 font-semibold"><MessageCircle className="h-5 w-5 text-signal" />3. Visitor chooses WhatsApp</h3><label className="mt-3 block text-sm">Handover button label<input maxLength={100} value={flow.handover_message} onChange={(e) => setFlow({ ...flow, handover_message: e.target.value })} className={`${field} mt-1`} /></label></section>
      <ArrowDown className="ml-4 h-5 w-5 text-muted-foreground" />
      <section className="border-l-2 border-signal pl-5"><h3 className="flex items-center gap-2 font-semibold"><Users className="h-5 w-5 text-signal" />4. Funding Inbox team</h3><label className="mt-3 block text-sm">Website acknowledgement when AI is paused<textarea rows={3} maxLength={1000} value={flow.team_message} onChange={(e) => setFlow({ ...flow, team_message: e.target.value })} className={`${field} mt-1`} /></label></section>
    </div>
    {message && <p role="status" className="text-sm">{message}</p>}
    <Button onClick={save} disabled={busy || !flow.handover_message.trim() || !flow.team_message.trim()}><Save />{busy ? 'Saving…' : 'Save flow'}</Button>
  </div>;
}