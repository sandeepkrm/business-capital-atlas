CREATE TABLE public.lenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  description text,
  products text[] NOT NULL DEFAULT '{}',
  rate_from text,
  min_amount text,
  max_amount text,
  term text,
  speed text,
  apply_url text,
  featured boolean NOT NULL DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lenders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lenders TO authenticated;
GRANT ALL ON public.lenders TO service_role;
ALTER TABLE public.lenders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon read visible lenders" ON public.lenders FOR SELECT TO anon USING (visible);
CREATE POLICY "Auth read lenders" ON public.lenders FOR SELECT TO authenticated USING (visible OR public.is_staff(auth.uid()));
CREATE POLICY "Staff insert lenders" ON public.lenders FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update lenders" ON public.lenders FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete lenders" ON public.lenders FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER lenders_touch BEFORE UPDATE ON public.lenders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();