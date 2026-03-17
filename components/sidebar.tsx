import { Skull } from "lucide-react";
import Link from "next/link";
import { NavLink } from "@/components/nav-link";

const forensicLinks = [
  { href: "/top-10", label: "Top 10" },
  { href: "/ai-death-watch", label: "AI Death Watch" },
  { href: "/deep-dives", label: "Deep Dives" },
  { href: "/database-view", label: "Database View" },
];

const confessionalLinks = [
  { href: "/submit", label: "Submit" },
  { href: "/admin/review", label: "Admin Review" },
  { href: "/faq", label: "FAQ" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r-[3px] border-black bg-white p-5 lg:block">
      <Link
        className="mb-8 flex items-center gap-2 border-2 border-black bg-accent p-3 shadow-brutal transition-transform hover:-translate-y-0.5"
        href="/"
      >
        <Skull className="h-5 w-5" />
        <div>
          <p className="text-xs font-black uppercase">FeatureGrave</p>
          <p className="text-xs font-semibold">Startup Forensics</p>
        </div>
      </Link>
      <nav className="space-y-5">
        <div className="space-y-2">
          <p className="border-2 border-black bg-black px-2 py-1 text-[10px] font-black uppercase text-accent">
            🛠️ Feature Forensics
          </p>
          {forensicLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>
        <div className="space-y-2">
          <p className="border-2 border-black bg-black px-2 py-1 text-[10px] font-black uppercase text-accent">
            🕯️ The Confessional
          </p>
          {confessionalLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
