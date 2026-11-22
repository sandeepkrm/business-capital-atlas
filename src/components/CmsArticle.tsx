import ReactMarkdown from "react-markdown";
import { CtaBand, Page, PageHero, RiskNotice, type Crumb } from "@/components/SiteShell";

export type CmsPageRow = {
  slug: string; title: string; eyebrow: string | null; excerpt: string | null; body: string;
  hero_image_url: string | null; category: string | null; author: string | null; published_at: string | null; updated_at: string;
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-fc [&_a]:text-signal [&_a]:underline [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-6 [&_img]:rounded-2xl [&_li]:mt-1 [&_li]:text-muted-foreground [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

export function CmsArticle({ page, crumbs, showRisk, children }: { page: CmsPageRow; crumbs: Crumb[]; showRisk?: boolean; children?: React.ReactNode }) {
  const date = page.published_at ? new Date(page.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  return (
    <Page>
      <PageHero eyebrow={page.eyebrow ?? page.category ?? undefined} title={page.title} intro={page.excerpt ?? undefined} crumbs={crumbs}>
        {(page.author || date) && <p className="mt-6 text-sm opacity-70">{[page.author, date].filter(Boolean).join(" · ")}</p>}
      </PageHero>
      <article className="container-x max-w-3xl py-12">
        {page.hero_image_url && <img src={page.hero_image_url} alt={page.title} className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover" />}
        <Markdown>{page.body}</Markdown>
        {showRisk && <div className="mt-12"><RiskNotice /></div>}
      </article>
      {children}
      <CtaBand />
    </Page>
  );
}
