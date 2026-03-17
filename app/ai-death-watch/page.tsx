import Link from "next/link";
import { getAiDeathWatchFatalities } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AiDeathWatchPage() {
  const rows = await getAiDeathWatchFatalities();

  return (
    <section className="space-y-4">
      <div className="neo-card">
        <h1 className="text-4xl font-black uppercase">AI Death Watch</h1>
        <p className="mt-2 max-w-3xl font-medium">
          Track failed AI-native products and identify where hype outran
          distribution, retention, and unit economics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => (
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
              <span className="border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
                AI Victim
              </span>
            </div>
          </Link>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="neo-card">
          <p className="font-bold">No AI victim cases published yet.</p>
        </div>
      )}
    </section>
  );
}
