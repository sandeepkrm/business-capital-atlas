CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, anon;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_first_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  funding_purpose text,
  amount text,
  business_type text,
  time_trading text,
  turnover text,
  message text,
  source_page text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new'
);
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admin delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text NOT NULL,
  website text,
  partner_type text,
  fca_number text,
  message text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new'
);
GRANT SELECT, UPDATE, DELETE ON public.partner_applications TO authenticated;
GRANT ALL ON public.partner_applications TO service_role;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read partners" ON public.partner_applications FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update partners" ON public.partner_applications FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admin delete partners" ON public.partner_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL DEFAULT 'page',
  slug text NOT NULL,
  title text NOT NULL,
  seo_title text,
  seo_description text,
  eyebrow text,
  excerpt text,
  body text NOT NULL DEFAULT '',
  hero_image_url text,
  category text,
  author text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  UNIQUE (kind, slug)
);
GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON public.cms_pages FOR SELECT TO anon, authenticated USING (published OR public.is_staff(auth.uid()));
CREATE POLICY "Staff insert pages" ON public.cms_pages FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update pages" ON public.cms_pages FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete pages" ON public.cms_pages FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER cms_pages_touch BEFORE UPDATE ON public.cms_pages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu text NOT NULL,
  section text,
  label text NOT NULL,
  href text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read nav" ON public.nav_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff write nav" ON public.nav_items FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update nav" ON public.nav_items FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete nav" ON public.nav_items FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.seo_overrides (
  path text PRIMARY KEY,
  title text,
  description text,
  og_image_url text,
  noindex boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_overrides TO authenticated;
GRANT ALL ON public.seo_overrides TO service_role;
ALTER TABLE public.seo_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seo" ON public.seo_overrides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff insert seo" ON public.seo_overrides FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update seo" ON public.seo_overrides FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete seo" ON public.seo_overrides FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER seo_touch BEFORE UPDATE ON public.seo_overrides FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Staff read cms media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'cms-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff upload cms media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff update cms media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete cms media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-media' AND public.is_staff(auth.uid()));

INSERT INTO public.cms_pages (kind, slug, title, seo_title, seo_description, excerpt, body, category, author, published, published_at) VALUES
('post', 'welcome-to-the-fundingcompany-blog', 'Welcome to the FundingCompany blog',
 'Welcome to the FundingCompany Blog | Business Finance Insights',
 'Practical, plain-English insights on UK business finance, cash flow and growth funding from FundingCompany.',
 'Practical, plain-English insights on business finance for UK owners.',
E'## Why we started this blog\n\nUK business owners make funding decisions under pressure, often with little time to research. This blog shares practical guidance on loans, cash flow, asset finance and growth funding.\n\n## What you can expect\n\n- Plain-English explainers on finance products\n- Checklists to prepare for lender conversations\n- Updates on government-backed schemes\n\nInformation on this blog is general guidance, not financial advice.',
 'News', 'FundingCompany team', true, now());

INSERT INTO public.nav_items (menu, section, label, href, sort_order) VALUES
('Loans','Business loans','Business Loans','/business-loans',0),
('Loans','Business loans','Unsecured Business Loans','/unsecured-business-loans',1),
('Loans','Business loans','Secured Business Loans','/secured-business-loans',2),
('Loans','Business loans','Working Capital Finance','/working-capital-finance',3),
('Loans','Business loans','Short-Term Business Loans','/short-term-business-loans',4),
('Loans','Business loans','Bad Credit Business Loans','/bad-credit-business-loans',5),
('Loans','Business loans','Limited Company Business Loans','/limited-company-business-loans',6),
('Loans','Business loans','Business Loans for Women','/business-loans-for-women',7),
('Loans','Business loans','Business Loans for Sole Traders','/business-loans-for-sole-traders',8),
('Loans','Business loans','Small Business Loans','/small-business-loans',9),
('Loans','Business loans','Start-Up Business Loans','/start-up-loans',10),
('Loans','Asset & property','Asset Finance','/asset-finance',11),
('Loans','Asset & property','Finance Leasing','/finance-leasing',12),
('Loans','Asset & property','Alternative Finance','/alternative-finance',13),
('Loans','Asset & property','Construction Finance','/construction-finance',14),
('Loans','Asset & property','Growth Guarantee Scheme','/growth-guarantee-scheme',15),
('Loans','Asset & property','Property Finance','/property-finance',16),
('Loans','Asset & property','Bridging Loans','/bridging-loans',17),
('Loans','Asset & property','Business Expansion Finance','/business-expansion-finance',18),
('Loans','Asset & property','SME Funding','/sme-funding',19),
('Loans','Cash flow','Cash Flow Solutions','/cash-flow-solutions',20),
('Loans','Cash flow','Business Credit Cards','/business-credit-cards',21),
('Loans','Cash flow','Invoice Finance','/invoice-finance',22),
('Loans','Cash flow','Invoice Discounting','/invoice-discounting',23),
('Loans','Cash flow','Invoice Factoring','/invoice-factoring',24),
('Loans','Cash flow','Merchant Cash Advance','/merchant-cash-advance',25),
('Loans','Cash flow','Revolving Credit Facility','/revolving-credit-facility',26),
('Calculators',NULL,'Business loan calculator','/business-loan-calculator',27),
('Calculators',NULL,'Invoice finance calculator','/invoice-finance-calculator',28),
('Calculators',NULL,'Asset finance calculator','/asset-finance-calculator',29),
('Resources',NULL,'Blog','/blog',30),
('Resources',NULL,'Funding guides','/guides',31),
('Resources',NULL,'AI Funding Advisor','/funding-advisor',32),
('Resources',NULL,'Eligibility guide','/eligibility-guide',33),
('Resources',NULL,'Finance glossary','/glossary',34),
('Resources',NULL,'FAQs','/faqs',35),
('Company',NULL,'About us','/about',36),
('Company',NULL,'How it works','/how-it-works',37),
('Company',NULL,'Become a partner','/partners',38),
('Company',NULL,'Contact','/contact',39),
('Company',NULL,'Legal & regulatory','/legal',40);