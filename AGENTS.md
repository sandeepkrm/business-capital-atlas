<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- CMS content (cms_pages, nav_items, seo_overrides) is read publicly via public-db.server and written only from /admin by staff (user_roles); admin roles are granted manually, never by signup triggers — prevents privilege escalation.
- Public form submissions insert via server functions with the admin client after Zod validation — keeps tables closed to anon.
- CMS images live in the private cms-media bucket and are served through /media/* — workspace blocks public buckets.
- Website chat (FundingMate) goes through /api/chat with a per-browser visitor token; messages stored server-side so staff see them live in admin — visitors never get direct table access.
- Loan-page numeric summaries and comparisons derive from visible product-matched lender directory rows, never static market ranges; preserves provenance and avoids invented figures.
- Public bank directory listings are distinct from confirmed commercial partners; only staff-confirmed relationships may be labelled partners.
- Staff-only WhatsApp flow settings govern website AI knowledge selection, handover labels and paused-AI acknowledgements; live WhatsApp integration requires a linked Business connection before receiver/send implementation.
- Legal and About render saved company identity even alongside CMS articles; company history and service copy come from Company settings rather than fabricated history.
