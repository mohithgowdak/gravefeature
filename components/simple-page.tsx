interface SimplePageProps {
  title: string;
  description: string;
}

export function SimplePage({ title, description }: SimplePageProps) {
  return (
    <section className="neo-card">
      <h1 className="text-3xl font-black uppercase">{title}</h1>
      <p className="mt-3 max-w-3xl font-medium">{description}</p>
    </section>
  );
}
