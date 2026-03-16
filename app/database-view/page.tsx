import Link from "next/link";
import { getFatalities } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DatabaseViewPage() {
  const rows = await getFatalities();

  return (
    <section className="neo-card space-y-4">
      <h1 className="text-3xl font-black uppercase">Database View</h1>
      <div className="overflow-x-auto border-[3px] border-black">
        <table className="min-w-full bg-white">
          <thead className="bg-accent">
            <tr className="text-left text-xs font-black uppercase">
              <th className="border-r-2 border-black px-3 py-2">Brand</th>
              <th className="border-r-2 border-black px-3 py-2">Sector</th>
              <th className="border-r-2 border-black px-3 py-2">Loss</th>
              <th className="px-3 py-2">Deep Dive</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t-2 border-black text-sm font-semibold">
                <td className="border-r-2 border-black px-3 py-2">{row.brand}</td>
                <td className="border-r-2 border-black px-3 py-2">{row.sector}</td>
                <td className="border-r-2 border-black px-3 py-2">{row.total_loss}</td>
                <td className="px-3 py-2">
                  <Link className="underline" href={`/fatalities/${row.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
