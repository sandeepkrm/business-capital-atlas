import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";
import { services } from "./services";

export const advisorOutput = z.object({
  summary: z.string(),
  recommendations: z.array(z.object({ slug: z.string(), reason: z.string() })),
  lender_factors: z.array(z.object({ factor: z.string(), explanation: z.string() })),
  questions_to_ask: z.array(z.string()),
});
export type AdvisorResult = z.infer<typeof advisorOutput>;

export type AdvisorInput = { needs: string; amount: string; situation: string };

const catalogue = () => services.map((s) => `- ${s.slug}: ${s.name} — ${s.description}`).join("\n");

const instructions = () => `You are the FundingCompany funding guide for UK business owners. FundingCompany is not a lender and does not give regulated financial advice.
Given the user's description, amount and situation:
- summary: 2-3 plain-English sentences reflecting their need.
- recommendations: 2-4 of the most relevant pages, chosen ONLY from the catalogue slugs below, each with a one-sentence reason.
- lender_factors: 4-6 factors UK lenders may consider for this case (e.g. trading history, turnover, affordability, credit profile, security) with a short explanation tailored to them.
- questions_to_ask: 5-7 practical questions they should ask lenders (total cost, fees, early repayment, guarantees, security, timescales).
Never promise approval, rates or outcomes. Never invent lender names, rates or figures. Keep wording clear, fair and not misleading.

Catalogue:
${catalogue()}`;

export async function runAdvisor(request: Request, input: AdvisorInput): Promise<AdvisorResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: instructions(),
    messages: [{ role: "user", content: `Funding needs: ${input.needs}\nDesired amount: ${input.amount || "not stated"}\nBusiness situation: ${input.situation || "not stated"}` }],
    output: Output.object({ schema: advisorOutput }),
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  let out: AdvisorResult;
  try {
    out = (await result.output) as AdvisorResult;
  } catch (e) {
    if (NoObjectGeneratedError.isInstance(e) && e.text) out = advisorOutput.parse(JSON.parse(e.text));
    else throw e;
  }
  const valid = new Set(services.map((s) => s.slug));
  return {
    summary: out.summary,
    recommendations: out.recommendations.filter((r) => valid.has(r.slug)).slice(0, 4),
    lender_factors: out.lender_factors.slice(0, 6),
    questions_to_ask: out.questions_to_ask.slice(0, 7),
  };
}
