"use client";

import { Link, useLocation, useSearch } from "wouter";
import { useMemo } from "react";
import { allProtocols } from "@/lib/protocols";
import { cn } from "@/lib/utils";
import { Stethoscope, UserCog, HeartPulse, Brain, Pill } from "lucide-react";

export function SidebarNav() {
  const [pathname] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const currentSystem = searchParams.get("system");

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const defaultSystem = systems[0];
  const activeSystem = currentSystem || defaultSystem;
  const isAdminPage = pathname.startsWith('/admin');
  const isProtocolPage = !isAdminPage && !['/cardiac-arrest', '/differential-diagnosis', '/drug-safety'].includes(pathname);

  return (
    <nav className="flex flex-col h-full">
      {/* Quick Access Tools */}
      <div className="px-3 pt-3 pb-2 space-y-0.5">
        <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Quick Access</p>
        <Link
          href="/cardiac-arrest"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors text-[11px] font-semibold relative",
            pathname === '/cardiac-arrest'
              ? "bg-red-50 text-red-700 border border-red-200"
              : "text-red-600 hover:bg-red-50 hover:text-red-700"
          )}
        >
          {pathname === '/cardiac-arrest' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-r-full" />
          )}
          <HeartPulse className="h-3.5 w-3.5 shrink-0" />
          Cardiac Arrest
        </Link>

        <Link
          href="/differential-diagnosis"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors text-[11px] font-semibold relative",
            pathname === '/differential-diagnosis'
              ? "bg-primary/8 text-primary border border-primary/20"
              : "text-primary hover:bg-primary/8 hover:text-primary"
          )}
        >
          {pathname === '/differential-diagnosis' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
          )}
          <Brain className="h-3.5 w-3.5 shrink-0" />
          AI Diff. Diagnosis
        </Link>

        <Link
          href="/drug-safety"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors text-[11px] font-semibold relative",
            pathname === '/drug-safety'
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          )}
        >
          {pathname === '/drug-safety' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-500 rounded-r-full" />
          )}
          <Pill className="h-3.5 w-3.5 shrink-0" />
          Drug Safety Checker
        </Link>
      </div>

      <div className="mx-3 border-t border-sidebar-border" />

      {/* Clinical Systems */}
      <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Clinical Systems</p>
        {systems.map((system) => {
          const isActive = isProtocolPage && activeSystem === system;
          return (
            <Link
              key={system}
              href={`/?system=${encodeURIComponent(system)}`}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors relative",
                isActive
                  ? "bg-primary/8 text-primary font-semibold border border-primary/15"
                  : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
              )}
              <Stethoscope className="h-3 w-3 shrink-0 opacity-60" />
              {system}
            </Link>
          );
        })}
      </div>

      {/* Bottom admin link */}
      <div className="px-3 pb-3 border-t border-sidebar-border pt-2">
        <Link
          href="/admin/protocols"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors relative",
            isAdminPage
              ? "bg-primary/8 text-primary font-semibold border border-primary/15"
              : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          {isAdminPage && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
          )}
          <UserCog className="h-3.5 w-3.5 shrink-0" />
          Management
        </Link>
      </div>
    </nav>
  );
}
