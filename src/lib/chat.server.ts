import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";
import { services } from "./services";

type Msg = { role: string; content: string };
type Knowledge = { kind: string; title: string; content: string };

function instructions(knowledge: Knowledge[], handoverLabel: string) {
  const settings = knowledge.filter((k) => k.kind === "settings").map((k) => k.content).join("\n");
  const facts = knowledge.filter((k) => k.kind !== "settings").map((k) => `### ${k.title}\n${k.content}`).join("\n\n");
  const pages = services.map((s) => `- /${s.slug}: ${s.name}`).join("\n");
  return `You are FundingMate AI, the website assistant for FundingCompany (UK business funding).
FundingCompany is NOT a lender and does not give regulated financial advice. Never promise approval, rates or outcomes, never call anything an "approved offer", never invent lenders, figures or statistics. Use UK English, short paragraphs and markdown links to site pages.
Useful pages: /business-loan-calculator, /invoice-finance-calculator, /asset-finance-calculator, /eligibility-guide, /funding-advisor, /lenders, /blog, /contact (to send an enquiry).
Funding pages:
${pages}

Owner instructions:
${settings}

Approved knowledge (prefer this over general knowledge):
${facts || "(none)"}

Answer from the approved knowledge first. Once the visitor seems interested in going ahead, or asks to speak to a person, tell them they can tap "${handoverLabel}" if available below the chat to talk to the FundingCompany team, or send an enquiry via /contact.`;
}

export function streamChatReply(request: Request, history: Msg[], knowledge: Knowledge[], onDone: (text: string) => Promise<void>, handoverLabel = "Continue on WhatsApp with our team") {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: instructions(knowledge, handoverLabel),
    messages: history
      .filter((m) => m.role === "user" || m.role === "assistant" || m.role === "agent")
      .map((m) => ({ role: m.role === "user" ? ("user" as const) : ("assistant" as const), content: m.content })),
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
    onFinish: async ({ text }) => { if (text) await onDone(text); },
  });
}
