"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { allProtocols } from "@/lib/protocols";
import { cn } from "@/lib/utils";
import { Stethoscope } from "lucide-react";

export function SidebarNav() {
  const searchParams = useSearchParams();
  const currentSystem = searchParams.get("system");

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const defaultSystem = systems[0];
  const activeSystem = currentSystem || defaultSystem;

  return (
    <nav className="flex flex-col gap-1 p-2 pt-4">
      <h3 className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider">
        Clinical Systems
      </h3>
      {systems.map((system) => (
        <Link
          key={system}
          href={`/?system=${encodeURIComponent(system)}`}
          scroll={false}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            activeSystem === system
              ? "bg-primary/10 text-primary font-semibold"
              : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          <Stethoscope className="h-4 w-4" />
          {system}
        </Link>
      ))}
    </nav>
  );
}
