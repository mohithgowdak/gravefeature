import { SubmitWizard } from "@/components/submit-wizard";

export default function SubmitPage() {
  return (
    <section className="space-y-4">
      <div className="neo-card">
        <h1 className="text-3xl font-black uppercase">Submission Form</h1>
        <p className="mt-2 max-w-3xl font-medium">
          A multi-step submission flow for PMs and students to document failed
          features, extract market signal, and propose better rebuild paths.
        </p>
      </div>
      <SubmitWizard />
    </section>
  );
}
