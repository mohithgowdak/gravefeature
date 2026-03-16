"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block border-2 border-black px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
        isActive ? "bg-accent shadow-brutal" : "bg-white"
      }`}
    >
      {label}
    </Link>
  );
}
