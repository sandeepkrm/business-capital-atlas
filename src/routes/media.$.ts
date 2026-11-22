import { createFileRoute } from "@tanstack/react-router";

// Serves CMS media from the private storage bucket (all files in it are intended to be public site images).
export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("cms-media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: { "Content-Type": data.type || "application/octet-stream", "Cache-Control": "public, max-age=86400" },
        });
      },
    },
  },
});
