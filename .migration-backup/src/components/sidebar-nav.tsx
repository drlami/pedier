"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { allProtocols } from "@/lib/protocols";
import { cn } from "@/lib/utils";
import { Stethoscope, UserCog, HeartPulse, Brain, Pill } from "lucide-react";

export function SidebarNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSystem = searchParams.get("system");

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const defaultSystem = systems[0];
  const activeSystem = currentSystem || defaultSystem;
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <nav className="flex flex-col p-2 pt-2 h-full">
      <div className="space-y-0.5 mb-2">
        <Link
          href="/cardiac-arrest"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1 transition-colors text-xs font-bold text-destructive hover:bg-destructive/10",
            pathname === '/cardiac-arrest' && "bg-destructive/10"
          )}
        >
          <HeartPulse className="h-4 w-4" />
          Cardiac Arrest
        </Link>
        
        <Link
          href="/differential-diagnosis"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1 transition-colors text-xs font-bold text-primary hover:bg-primary/10",
            pathname === '/differential-diagnosis' && "bg-primary/10"
          )}
        >
          <Brain className="h-4 w-4" />
          AI Diff. Diagnosis
        </Link>

        <Link
          href="/drug-safety"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1 transition-colors text-xs font-bold text-emerald-600 hover:bg-emerald-50",
            pathname === '/drug-safety' && "bg-emerald-50"
          )}
        >
          <Pill className="h-4 w-4" />
          Drug Safety Checker
        </Link>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto">
        <h3 className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
          Clinical Systems
        </h3>
        {systems.map((system) => (
          <Link
            key={system}
            href={`/?system=${encodeURIComponent(system)}`}
            scroll={false}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              !isAdminPage && activeSystem === system && !['/cardiac-arrest', '/differential-diagnosis', '/drug-safety'].includes(pathname)
                ? "bg-primary/10 text-primary font-bold"
                : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            {system}
          </Link>
        ))}
      </div>
      
      <div className="mt-auto border-t border-sidebar-border pt-1">
        <Link
          href="/admin/protocols"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
            isAdminPage
              ? "bg-primary/10 text-primary font-bold"
              : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          <UserCog className="h-3.5 w-3.5" />
          Management
        </Link>
      </div>
    </nav>
  );
}
