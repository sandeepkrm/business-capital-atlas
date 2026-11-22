import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, Page, PageHero, seo } from "@/components/SiteShell";

const crumbs = [{ name: "How it works", path: "/how-it-works" }];

export const Route = createFileRoute("/how-it-works")({
  head: ({ matches }) => seo({ matches,
    title: "How It Works | Business Funding Enquiries | FundingCompany",
    description: "See how FundingCompany helps UK businesses go from a funding question to suitable options — in three clear steps, with no obligation.",
    path: "/how-it-works",
    crumbs,
  }),
  component: HIW,
});

const steps = [
  ["Tell us what you need", "Complete a short enquiry: your funding goal, the amount, how long you've been trading and a few business details. It takes a few minutes."],
  ["We review your funding route", "We consider which finance types and providers may fit your situation, and may ask a few follow-up questions or for supporting documents."],
  ["Explore potential options", "Where suitable, we'll present options with clear information on costs, terms and security. You decide whether to proceed — there's no obligation."],
  ["Application and decision", "If you choose to proceed, the provider completes its own checks and makes the lending decision. Any agreement is between you and the provider."],
];

function HIW() {
  return (
    <Page>
      <PageHero eyebrow="How it works" title="From funding question to clear options" intro="A guided, transparent process designed around busy business owners." crumbs={crumbs} />
      <ol className="container-x grid gap-6 py-16 md:grid-cols-2">
        {steps.map(([t, d], i) => (
          <li key={t} className="rounded-3xl border bg-card p-8">
            <span className="font-display text-6xl font-semibold text-signal">0{i + 1}</span>
            <h2 className="mt-4 text-2xl font-semibold">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>
      <CtaBand />
    </Page>
  );
}
