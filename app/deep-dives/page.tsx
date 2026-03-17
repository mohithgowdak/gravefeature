import { Skull } from "lucide-react";
import { FatalitySearchGrid } from "@/components/fatality-search-grid";
import { getFatalities, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DeepDivesPage() {
  const fatalities = await getFatalities();
  const dbLabel = isSupabaseConfigured() ? "Supabase connected" : "Demo mode";

  return (
    <section className="space-y-6">
      <header className="neo-card">
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-black bg-accent px-3 py-1 text-sm font-black uppercase">
          <Skull className="h-4 w-4" />
          Startup Graveyard
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight">
          FeatureGrave
        </h1>
        <p className="mt-2 max-w-3xl text-base font-medium">
          Loot failed startup features for insights, market gaps, and pivot
          strategies. Inspired by
          {" "}
          <a
            className="underline"
            href="https://www.loot-drop.io/"
            rel="noreferrer"
            target="_blank"
          >
            Loot Drop
          </a>
          .
        </p>
        <p className="mt-3 inline-block border-2 border-black px-2 py-1 text-xs font-black uppercase">
          {dbLabel}
        </p>
      </header>

      <FatalitySearchGrid fatalities={fatalities} />
    </section>
  );
}
