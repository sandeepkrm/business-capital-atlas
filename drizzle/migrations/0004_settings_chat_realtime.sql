CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text, trading_name text, company_number text, registered_address text,
  fca_status text, fca_number text, principal_firm text, phone text, email text,
  social jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff write settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
INSERT INTO public.site_settings (id, social) VALUES (1, '{"linkedin":"https://www.linkedin.com/company/fundingcompany","x":"https://x.com/fundingcompany","facebook":"https://www.facebook.com/fundingcompany","instagram":"https://www.instagram.com/fundingcompany","youtube":"https://www.youtube.com/@fundingcompany"}'::jsonb);

CREATE TABLE public.chatbot_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'faq',
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chatbot_knowledge TO authenticated;
GRANT ALL ON public.chatbot_knowledge TO service_role;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage knowledge" ON public.chatbot_knowledge FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
INSERT INTO public.chatbot_knowledge (kind, title, content) VALUES
('settings','Bot behaviour','You are FundingMate AI. Be friendly, concise and use UK English. Point people to relevant pages and calculators and invite them to send an enquiry.'),
('faq','Is FundingCompany a lender?','No. FundingCompany is not a lender. We help businesses explore finance options and may introduce them to finance providers.'),
('faq','Does enquiring cost anything?','Enquiring is free and there is no obligation to proceed.');

CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_token text NOT NULL,
  visitor_name text, visitor_email text,
  status text NOT NULL DEFAULT 'open',
  page text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.chat_messages (conversation_id, created_at);
GRANT SELECT, UPDATE, DELETE ON public.chat_conversations TO authenticated;
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_conversations, public.chat_messages TO service_role;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read convos" ON public.chat_conversations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff update convos" ON public.chat_conversations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff delete convos" ON public.chat_conversations FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff read msgs" ON public.chat_messages FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff reply msgs" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND role = 'agent');

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages, public.chat_conversations, public.enquiries;