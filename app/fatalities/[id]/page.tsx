import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { getFatalityById } from "@/lib/supabase";

interface DetailPageProps {
  params: { id: string };
}

const analysisKeys = [
  { label: "Failure Analysis", key: "failure_analysis" },
  { label: "Market Analysis", key: "market_analysis" },
  { label: "Startup Learnings", key: "startup_learnings" },
  { label: "Market Potential", key: "market_potential" },
  { label: "Difficulty", key: "difficulty" },
  { label: "Scalability", key: "scalability" },
] as const;

export default async function FatalityDetailPage({ params }: DetailPageProps) {
  const id = Number(params.id);
  const fatality = await getFatalityById(id);

  if (!fatality) {
    notFound();
  }

  const stats = [
    { label: "Brand", value: fatality.brand },
    { label: "Sector", value: fatality.sector },
    { label: "Type", value: fatality.product_type },
    { label: "Loss", value: fatality.total_loss },
    { label: "Lifecycle", value: `${fatality.start_year} - ${fatality.end_year}` },
  ];

  return (
    <article className="space-y-8">
      <section className="neo-card">
        <p className="inline-block border-2 border-black bg-accent px-2 py-1 text-xs font-black uppercase">
          Forensic Deep-Dive
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase">{fatality.title}</h1>
        <p className="mt-3 max-w-4xl font-medium">{fatality.intro_text}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {stats.map((item) => (
            <div key={item.label} className="border-[3px] border-black bg-white p-3">
              <p className="text-xs font-black uppercase">{item.label}</p>
              <p className="mt-1 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {analysisKeys.map((item) => (
          <div key={item.key} className="neo-yellow">
            <h2 className="text-sm font-black uppercase">{item.label}</h2>
            <p className="mt-2 text-sm font-semibold">
              {fatality[item.key as keyof typeof fatality] as string}
            </p>
          </div>
        ))}
      </section>

      <section className="neo-card">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-black bg-accent">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase">Pivot Concept</h2>
            <p className="font-medium">{fatality.pivot_concept}</p>
          </div>
        </div>
        <div className="ml-8 mt-5 border-l-[3px] border-black pl-6">
          <h3 className="text-lg font-black uppercase">Execution Timeline</h3>
          <div className="mt-3 space-y-3">
            {fatality.execution_plan.map((step, index) => (
              <div key={`${step.step}-${index}`} className="border-2 border-black bg-white p-3">
                <p className="text-xs font-black uppercase">Step {index + 1}</p>
                <p className="mt-1 font-bold">{step.step}</p>
                <p className="text-sm font-medium">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="neo-card space-y-4">
        <h2 className="text-2xl font-black uppercase">Suggested Technology</h2>
        <div className="flex flex-wrap gap-2">
          {fatality.suggested_tech.map((tech) => (
            <span
              key={tech}
              className="border-2 border-black bg-accent px-3 py-1 text-xs font-black uppercase"
            >
              {tech}
            </span>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-black uppercase">Monetization Strategy</h3>
          <p className="mt-1 font-medium">{fatality.monetization_strategy}</p>
        </div>
      </section>

      <CommentForm fatalityId={fatality.id} />
    </article>
  );
}
