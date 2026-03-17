"use client";

import { useEffect, useState } from "react";
import { Menu, Skull, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <aside className="sticky top-0 z-40 border-b-[3px] border-black bg-white p-3 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <Link
            className="inline-flex items-center gap-2 border-2 border-black bg-accent px-3 py-2 shadow-brutal"
            href="/"
          >
            <Skull className="h-4 w-4" />
            <div>
              <p className="text-[10px] font-black uppercase leading-tight">FeatureGrave</p>
              <p className="text-[10px] font-semibold leading-tight">Startup Forensics</p>
            </div>
          </Link>
          <button
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center border-2 border-black bg-white shadow-brutal"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            type="button"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileOpen && (
          <nav className="mt-3 space-y-4">
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
        )}
      </aside>

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
    </>
  );
}
