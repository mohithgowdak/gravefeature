import Link from "next/link";
import { Skull } from "lucide-react";
import { getFatalities, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
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
          Feature Fatality
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fatalities.map((item) => (
          <Link
            key={item.id}
            href={`/fatalities/${item.id}`}
            className="neo-card transition-all hover:-translate-y-1 hover:bg-accent"
          >
            <p className="text-xs font-black uppercase">{item.sector}</p>
            <h2 className="mt-2 text-2xl font-black uppercase">{item.brand}</h2>
            <p className="mt-1 text-sm font-semibold">{item.title}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase">
                Total Loss: {item.total_loss}
              </span>
              {item.is_ai_victim && (
                <span className="border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
                  AI Victim
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
      {fatalities.length === 0 && (
        <div className="neo-card">
          <p className="font-bold">No fatalities published yet.</p>
        </div>
      )}
    </section>
  );
}
