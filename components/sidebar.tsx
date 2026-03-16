import { Skull } from "lucide-react";
import { NavLink } from "@/components/nav-link";

const links = [
  { href: "/top-10", label: "Top 10" },
  { href: "/ai-death-watch", label: "AI Death Watch" },
  { href: "/", label: "Deep Dives" },
  { href: "/database-view", label: "Database View" },
  { href: "/submit", label: "Submit" },
  { href: "/admin/review", label: "Admin Review" },
  { href: "/faq", label: "FAQ" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r-[3px] border-black bg-white p-5 lg:block">
      <div className="mb-8 flex items-center gap-2 border-2 border-black bg-accent p-3 shadow-brutal">
        <Skull className="h-5 w-5" />
        <div>
          <p className="text-xs font-black uppercase">Feature Fatality</p>
          <p className="text-xs font-semibold">Startup Forensics</p>
        </div>
      </div>
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>
    </aside>
  );
}
