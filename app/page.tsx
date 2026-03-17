import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldAlert, Users } from "lucide-react";

const coreFeatures = [
  {
    title: "Reverse Roadmap Archive",
    description:
      "Study failed features, pivot mistakes, and execution traps before they become your mistakes.",
  },
  {
    title: "Two-Pillar Intelligence",
    description:
      "Feature Fatalities for product autopsies, plus Founder's Confessionals for startup-level failure patterns.",
  },
  {
    title: "AI Death Watch",
    description:
      "Track products and features distorted by AI hype, bad positioning, or fragile automation assumptions.",
  },
  {
    title: "Actionable Pivots",
    description:
      "Every case emphasizes what to build next, what to skip, and how to de-risk go-to-market decisions.",
  },
];

const howItWorks = [
  "Open Deep Dives and filter by feature or confessional to inspect real failure stories.",
  "Read market analysis, execution breakdowns, and startup learnings to spot repeatable red flags.",
  "Use Submit to add your own case, then publish through Admin Review once the narrative is ready.",
];

export default function LandingPage() {
  return (
    <section className="space-y-8">
      <header className="neo-card">
        <p className="inline-block border-2 border-black bg-accent px-3 py-1 text-xs font-black uppercase">
          Product Intelligence for 2026
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">
          Build Less Noise.
          <br />
          Build More Signal.
        </h1>
        <p className="mt-4 max-w-4xl text-base font-medium md:text-lg">
          We are living in the age of Software Pollution. In 2026, shipping a
          feature takes a prompt, but building a product takes a soul. Most
          apps don&apos;t die from a lack of code; they die from a surplus of bad
          decisions.
        </p>
        <p className="mt-3 max-w-4xl text-base font-medium md:text-lg">
          FeatureGrave documents the Reverse Roadmap: toxic features,
          pivot-fails, and AI victims so founders and product teams can build on
          solid ground.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="neo-button inline-flex items-center gap-2" href="/deep-dives">
            Explore Deep Dives
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase hover:bg-black hover:text-white"
            href="/submit"
          >
            Submit a Case
          </Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="neo-card">
          <p className="text-xs font-black uppercase">Why this is necessary</p>
          <h2 className="mt-2 text-2xl font-black uppercase">
            Speed is cheap. Judgment is scarce.
          </h2>
          <p className="mt-3 font-medium">
            Product teams now ship faster than they learn. This platform slows
            down decisions at the right moment by making failure patterns
            visible, searchable, and practical.
          </p>
        </article>

        <article className="neo-card">
          <p className="text-xs font-black uppercase">Target audience</p>
          <h2 className="mt-2 text-2xl font-black uppercase">
            For builders who care about survival
          </h2>
          <ul className="mt-3 space-y-2 font-medium">
            <li className="inline-flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4" />
              Startup founders and indie hackers validating what not to build.
            </li>
            <li className="inline-flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4" />
              Product managers de-risking roadmaps before committing resources.
            </li>
            <li className="inline-flex items-start gap-2">
              <BrainCircuit className="mt-0.5 h-4 w-4" />
              Operators and researchers mapping pattern-level failure signals.
            </li>
          </ul>
        </article>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-black uppercase">Core Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {coreFeatures.map((feature) => (
            <article key={feature.title} className="neo-card">
              <h3 className="text-lg font-black uppercase">{feature.title}</h3>
              <p className="mt-2 font-medium">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="neo-card">
        <h2 className="text-2xl font-black uppercase">How to use</h2>
        <ol className="mt-3 space-y-2 font-medium">
          {howItWorks.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </section>
  );
}
