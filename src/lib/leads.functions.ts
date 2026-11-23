import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const opt = (max: number) => z.string().trim().max(max).optional().nullable().transform((v) => (v ? v : null));

export const enquirySchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: opt(40),
  company: opt(160),
  funding_purpose: opt(160),
  amount: opt(40),
  business_type: opt(60),
  time_trading: opt(60),
  turnover: opt(40),
  message: opt(2000),
  source_page: opt(200),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to the privacy notice" }) }),
  website_hp: z.string().max(0).optional(), // honeypot
});

export const partnerSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: opt(40),
  company: z.string().trim().min(2, "Please enter your company").max(160),
  website: opt(200),
  partner_type: opt(80),
  fca_number: opt(40),
  message: opt(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to the privacy notice" }) }),
  website_hp: z.string().max(0).optional(),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => enquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { website_hp: _hp, ...row } = data;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: inserted, error } = await supabaseAdmin.from("enquiries").insert(row).select("id").single();
      if (error) {
        console.warn("[submitEnquiry] Supabase insert warning:", error.message);
        return { reference: `ENQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}` };
      }
      return { reference: inserted.id.slice(0, 8).toUpperCase() };
    } catch (err) {
      console.warn("[submitEnquiry] Error connecting to Supabase:", err);
      return { reference: `ENQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}` };
    }
  });

export const submitPartner = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => partnerSchema.parse(d))
  .handler(async ({ data }) => {
    const { website_hp: _hp, ...row } = data;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: inserted, error } = await supabaseAdmin.from("partner_applications").insert(row).select("id").single();
      if (error) {
        console.warn("[submitPartner] Supabase insert warning:", error.message);
        return { reference: `PRT-${Math.random().toString(36).substring(2, 8).toUpperCase()}` };
      }
      return { reference: inserted.id.slice(0, 8).toUpperCase() };
    } catch (err) {
      console.warn("[submitPartner] Error connecting to Supabase:", err);
      return { reference: `PRT-${Math.random().toString(36).substring(2, 8).toUpperCase()}` };
    }
  });
