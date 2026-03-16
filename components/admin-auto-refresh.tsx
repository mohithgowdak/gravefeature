"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminAutoRefreshProps {
  intervalMs?: number;
}

export function AdminAutoRefresh({ intervalMs = 4000 }: AdminAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, router]);

  return null;
}
