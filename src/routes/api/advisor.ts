import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  needs: z.string().trim().min(10).max(2000),
  amount: z.string().trim().max(60).default(""),
  situation: z.string().trim().max(2000).default(""),
});

export const Route = createFileRoute("/api/advisor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Please describe your funding needs in a little more detail." }, { status: 400 });
        try {
          const { runAdvisor } = await import("@/lib/advisor.server");
          return Response.json(await runAdvisor(request, parsed.data));
        } catch (e: unknown) {
          const status = (e as { statusCode?: number })?.statusCode ?? 500;
          if (status === 429) return Response.json({ error: "Lots of people are using the advisor right now — please try again shortly." }, { status });
          if (status === 402) return Response.json({ error: "The AI advisor is temporarily unavailable. Please contact us instead." }, { status });
          console.error("advisor failed", e);
          return Response.json({ error: "Sorry, we couldn't generate suggestions right now. Please try again." }, { status: status >= 400 && status < 600 ? status : 500 });
        }
      },
    },
  },
});
