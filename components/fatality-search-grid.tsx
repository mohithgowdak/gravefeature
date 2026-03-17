"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Fatality, FatalityType } from "@/lib/types";

interface FatalitySearchGridProps {
  fatalities: Fatality[];
}

type FilterValue = "all" | FatalityType;

export function FatalitySearchGrid({ fatalities }: FatalitySearchGridProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return fatalities.filter((item) => {
      const matchesFilter = filter === "all" ? true : item.type === filter;
      if (!matchesFilter) return false;
      if (!normalized) return true;

      const haystack = `${item.title} ${item.brand} ${item.sector} ${item.product_type}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [fatalities, filter, query]);

  return (
    <section className="space-y-4">
      <div className="neo-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="neo-input"
            placeholder="Search by title, brand, sector, product..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              className={`border-[3px] border-black px-3 py-2 text-xs font-black uppercase ${
                filter === "all" ? "bg-accent shadow-brutal" : "bg-white"
              }`}
              onClick={() => setFilter("all")}
              type="button"
            >
              All
            </button>
            <button
              className={`border-[3px] border-black px-3 py-2 text-xs font-black uppercase ${
                filter === "feature" ? "bg-accent shadow-brutal" : "bg-white"
              }`}
              onClick={() => setFilter("feature")}
              type="button"
            >
              Feature
            </button>
            <button
              className={`border-[3px] border-black px-3 py-2 text-xs font-black uppercase ${
                filter === "project" ? "bg-accent shadow-brutal" : "bg-white"
              }`}
              onClick={() => setFilter("project")}
              type="button"
            >
              Confessional
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/fatalities/${item.id}`}
            className="neo-card transition-all hover:-translate-y-1 hover:bg-accent"
          >
            <p className="text-xs font-black uppercase">{item.sector}</p>
            <h2 className="mt-2 text-2xl font-black uppercase">{item.brand}</h2>
            <p className="mt-1 text-sm font-semibold">{item.title}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase">
                  {item.type === "project" ? "Confessional" : "Feature"}
                </span>
                <span className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase">
                  Total Loss: {item.total_loss}
                </span>
              </div>
              {item.is_ai_victim && (
                <span className="border-2 border-black bg-black px-2 py-1 text-xs font-black uppercase text-white">
                  AI Victim
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="neo-card">
          <p className="font-bold">No results for your current search/filter.</p>
        </div>
      )}
    </section>
  );
}
