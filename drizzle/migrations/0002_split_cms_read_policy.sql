DROP POLICY "Public read published" ON public.cms_pages;
CREATE POLICY "Anon read published" ON public.cms_pages FOR SELECT TO anon USING (published);
CREATE POLICY "Auth read published or staff" ON public.cms_pages FOR SELECT TO authenticated USING (published OR public.is_staff(auth.uid()));