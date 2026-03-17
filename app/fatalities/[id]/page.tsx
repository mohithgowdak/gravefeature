import { BadgeAlert, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { CaseActions } from "@/components/case-actions";
import { CommentForm } from "@/components/comment-form";
import { LessonLearned } from "@/components/lesson-learned";
import { getCommentsByFatalityId, getFatalityById } from "@/lib/supabase";

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
  const comments = await getCommentsByFatalityId(fatality.id);
  const linkedinHref = fatality.author_linkedin?.trim()
    ? fatality.author_linkedin.startsWith("http")
      ? fatality.author_linkedin
      : `https://${fatality.author_linkedin}`
    : null;

  const stats = [
    { label: "Brand", value: fatality.brand },
    { label: "Sector", value: fatality.sector },
    { label: "Type", value: fatality.product_type },
    { label: "Loss", value: fatality.total_loss },
    { label: "Lifecycle", value: `${fatality.start_year} - ${fatality.end_year}` },
  ];

  const crucialLesson = (
    fatality.type === "project"
      ? fatality.reality_check || fatality.startup_learnings
      : fatality.startup_learnings
  )
    .split(".")[0]
    .trim()
    .concat(".");

  if (fatality.type === "project") {
    return (
      <article className="noir-shell min-h-screen space-y-8 p-4 lg:p-6">
        <section className="noir-card">
          <p className="inline-block border-2 border-accent bg-accent px-2 py-1 text-xs font-black uppercase text-black">
            Founder&apos;s Confessional
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="founder-scar inline-flex h-10 w-10 items-center justify-center bg-accent text-black">
              <BadgeAlert className="h-5 w-5" />
            </span>
            <h1 className="text-4xl font-black uppercase">{fatality.title}</h1>
          </div>
          <p className="mt-3 max-w-4xl font-medium text-white/90">{fatality.intro_text}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {stats.map((item) => (
              <div key={item.label} className="border-[3px] border-accent bg-[#1A1A1A] p-3">
                <p className="text-xs font-black uppercase text-accent">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <CaseActions
            caseId={fatality.id}
            title={fatality.title}
            variant="dark"
            className="mt-4"
          />
        </section>

        <section className="noir-card space-y-3">
          <h2 className="text-2xl font-black uppercase text-accent">The Project</h2>
          <p className="font-medium text-white/90">
            {fatality.project_vision || fatality.market_potential}
          </p>
        </section>

        <section className="noir-card">
          <h2 className="text-xl font-black uppercase text-accent">The Burn</h2>
          <p className="mt-2 text-lg font-black">{fatality.resources_burned || fatality.total_loss}</p>
        </section>

        <section className="noir-card">
          <h2 className="text-2xl font-black uppercase text-accent">The Pivot I Missed</h2>
          <p className="mt-2 font-medium text-white/90">
            {fatality.missed_pivot || fatality.pivot_concept}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {analysisKeys.map((item) => (
            <div key={item.key} className="noir-card">
              <h2 className="text-sm font-black uppercase text-accent">{item.label}</h2>
              <p className="mt-2 text-sm font-semibold text-white">
                {fatality[item.key as keyof typeof fatality] as string}
              </p>
            </div>
          ))}
        </section>

        <section className="noir-card">
          <h2 className="text-2xl font-black uppercase text-accent">Execution Timeline</h2>
          <div className="mt-3 space-y-3">
            {fatality.execution_plan.map((step, index) => (
              <div key={`${step.step}-${index}`} className="border-2 border-accent bg-[#1A1A1A] p-3">
                <p className="text-xs font-black uppercase text-accent">Step {index + 1}</p>
                <p className="mt-1 font-bold text-white">{step.step}</p>
                <p className="text-sm font-medium text-white/90">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="noir-card space-y-4">
          <h2 className="text-2xl font-black uppercase text-accent">Rebuild Stack</h2>
          <div className="flex flex-wrap gap-2">
            {fatality.suggested_tech.map((tech) => (
              <span
                key={tech}
                className="border-2 border-accent bg-[#1A1A1A] px-3 py-1 text-xs font-black uppercase text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-accent">Monetization Strategy</h3>
            <p className="mt-1 font-medium text-white/90">{fatality.monetization_strategy}</p>
          </div>
        </section>

        <section className="noir-card">
          <h2 className="text-sm font-black uppercase text-accent">Author</h2>
          <p className="mt-2 text-lg font-black text-white">{fatality.author_name}</p>
          <p className="text-sm font-semibold text-white/90">{fatality.author_role}</p>
          {linkedinHref && (
            <a
              className="mt-2 inline-block text-sm font-black uppercase text-accent underline"
              href={linkedinHref}
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn Profile
            </a>
          )}
        </section>

        <CommentForm fatalityId={fatality.id} initialComments={comments} />
        <LessonLearned lesson={crucialLesson} />
      </article>
    );
  }

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
        <CaseActions caseId={fatality.id} title={fatality.title} className="mt-4" />
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

      <section className="neo-card">
        <h2 className="text-sm font-black uppercase">Author</h2>
        <p className="mt-2 text-lg font-black">{fatality.author_name}</p>
        <p className="text-sm font-semibold">{fatality.author_role}</p>
        {linkedinHref && (
          <a
            className="mt-2 inline-block text-sm font-black uppercase underline"
            href={linkedinHref}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn Profile
          </a>
        )}
      </section>

      <CommentForm fatalityId={fatality.id} initialComments={comments} />
      <LessonLearned lesson={crucialLesson} />
    </article>
  );
}
