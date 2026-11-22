ALTER TABLE public.lenders ADD COLUMN IF NOT EXISTS source_url text, ADD COLUMN IF NOT EXISTS checked_at date, ADD COLUMN IF NOT EXISTS relationship text NOT NULL DEFAULT 'unconfirmed';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS company_history text, ADD COLUMN IF NOT EXISTS company_services text;
CREATE TABLE public.whatsapp_flow_settings (id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1), ai_enabled boolean NOT NULL DEFAULT true, knowledge_kinds text[] NOT NULL DEFAULT ARRAY['faq','guide','settings'], handover_message text NOT NULL DEFAULT 'Continue on WhatsApp with our team', team_message text NOT NULL DEFAULT 'Thank you. Our team will follow up on your enquiry.', updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.whatsapp_flow_settings TO authenticated;
GRANT ALL ON public.whatsapp_flow_settings TO service_role;
ALTER TABLE public.whatsapp_flow_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage flow" ON public.whatsapp_flow_settings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));