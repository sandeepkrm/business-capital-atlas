import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { shouldUseAI } from "@/lib/chat-flow";

const postSchema = z.object({
  conversationId: z.string().uuid().optional(),
  token: z.string().min(20).max(100),
  message: z.string().trim().min(1).max(2000),
  page: z.string().max(300).optional(),
});

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function ownedConversation(id: string, token: string) {
  const db = await admin();
  const { data } = await db.from("chat_conversations").select("id, status, visitor_token").eq("id", id).maybeSingle();
  return data && data.visitor_token === token ? data : null;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      // Visitor polls for new messages (e.g. agent replies)
      GET: async ({ request }) => {
        const u = new URL(request.url);
        const id = u.searchParams.get("id") ?? "";
        const token = u.searchParams.get("token") ?? "";
        if (!z.string().uuid().safeParse(id).success) return Response.json({ messages: [] });
        const convo = await ownedConversation(id, token);
        if (!convo) return Response.json({ messages: [] }, { status: 404 });
        const db = await admin();
        const { data } = await db.from("chat_messages").select("id, role, content, created_at").eq("conversation_id", id).order("created_at");
        const { data: flow } = await db.from("whatsapp_flow_settings").select("handover_message").eq("id", 1).maybeSingle();
        return Response.json({ status: convo.status, messages: data ?? [], handoverLabel: flow?.handover_message ?? "Continue on WhatsApp with our team" }, { headers: { "Cache-Control": "no-store" } });
      },
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        // Visitor chooses to continue on WhatsApp
        if (body?.action === "whatsapp") {
          const h = z.object({ conversationId: z.string().uuid(), token: z.string().min(20).max(100) }).safeParse(body);
          if (!h.success) return Response.json({ error: "Start a chat first." }, { status: 400 });
          const c = await ownedConversation(h.data.conversationId, h.data.token);
          if (!c) return Response.json({ error: "Chat not found." }, { status: 404 });
          const db = await admin();
          await db.from("chat_conversations").update({ status: "whatsapp", last_message_at: new Date().toISOString() }).eq("id", c.id);
          await db.from("chat_messages").insert({ conversation_id: c.id, role: "system", content: "Visitor chose to continue on WhatsApp." });
          return Response.json({ ok: true, ref: c.id.slice(0, 6).toUpperCase() });
        }
        const parsed = postSchema.safeParse(body);
        if (!parsed.success) return Response.json({ error: "Please type a message." }, { status: 400 });
        const { token, message, page } = parsed.data;
        const db = await admin();
        let convoId = parsed.data.conversationId;
        let status = "open";
        if (convoId) {
          const c = await ownedConversation(convoId, token);
          if (!c) convoId = undefined; else status = c.status;
        }
        if (!convoId) {
          const { data, error } = await db.from("chat_conversations").insert({ visitor_token: token, page: page ?? null }).select("id").single();
          if (error || !data) return Response.json({ error: "Couldn't start the chat. Please try again." }, { status: 500 });
          convoId = data.id;
        }
        const ins = await db.from("chat_messages").insert({ conversation_id: convoId, role: "user", content: message });
        if (ins.error) return Response.json({ error: "Couldn't save your message." }, { status: 500 });
        await db.from("chat_conversations").update({ last_message_at: new Date().toISOString() }).eq("id", convoId);

        const headers = { "X-Conversation-Id": convoId };
        const { data: flow, error: flowError } = await db.from("whatsapp_flow_settings").select("ai_enabled, knowledge_kinds, handover_message, team_message").eq("id", 1).maybeSingle();
        if (flowError) return Response.json({ error: "Couldn't load the chat flow." }, { status: 500, headers });
        // A team member has taken over: don't let the AI answer.
        if (status === "agent") return new Response("", { headers });
        if (!shouldUseAI(status, flow?.ai_enabled ?? true)) {
          const acknowledgement = flow?.team_message || "Thank you. Our team will follow up on your enquiry.";
          const saved = await db.from("chat_messages").insert({ conversation_id: convoId, role: "system", content: acknowledgement });
          if (saved.error) return Response.json({ error: "Couldn't save the acknowledgement." }, { status: 500, headers });
          return new Response(acknowledgement, { headers });
        }

        const [{ data: history }, { data: knowledge }] = await Promise.all([
          db.from("chat_messages").select("role, content").eq("conversation_id", convoId).order("created_at").limit(40),
          db.from("chatbot_knowledge").select("kind, title, content").eq("active", true).in("kind", flow?.knowledge_kinds ?? ["faq", "guide", "settings"]),
        ]);
        try {
          const { streamChatReply } = await import("@/lib/chat.server");
          const savedConversationId = convoId;
          const result = streamChatReply(request, history ?? [], knowledge ?? [], async (text) => {
            const r = await db.from("chat_messages").insert({ conversation_id: savedConversationId, role: "assistant", content: text });
            if (r.error) console.error("save assistant message failed", r.error);
          }, flow?.handover_message);
          const res = result.toTextStreamResponse({ headers });
          return res;
        } catch (e: unknown) {
          const s = (e as { statusCode?: number })?.statusCode ?? 500;
          console.error("chat failed", e);
          return Response.json({ error: (e as Error)?.message ?? "FundingMate is unavailable right now." }, { status: s, headers });
        }
      },
    },
  },
});
