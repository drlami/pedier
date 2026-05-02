"use client";

import { Link, useLocation, useSearch } from "wouter";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Stethoscope, UserCog, HeartPulse, Brain, Pill, Users, FlaskConical } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useAllProtocols } from "@/contexts/protocols-context";

export function SidebarNav() {
  const [pathname] = useLocation();
  const search = useSearch();
  const { isAdmin } = useAuth();
  const allProtocols = useAllProtocols();
  const searchParams = new URLSearchParams(search);
  const currentSystem = searchParams.get("system");

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, [allProtocols]);

  const defaultSystem = systems[0];
  const activeSystem = currentSystem || defaultSystem;
  const isAdminPage = pathname.startsWith("/admin");
  const isProtocolPage =
    !isAdminPage &&
    !["/cardiac-arrest", "/differential-diagnosis", "/drug-safety", "/drug-doses"].includes(pathname);

  const quickLinks = [
    {
      href: "/cardiac-arrest",
      label: "Cardiac Arrest",
      icon: HeartPulse,
      activeClass: "bg-red-50 text-red-700 border border-red-200",
      inactiveClass: "text-red-600 hover:bg-red-50 hover:text-red-700",
      indicatorClass: "bg-red-500",
    },
    {
      href: "/differential-diagnosis",
      label: "AI Diff. Diagnosis",
      icon: Brain,
      activeClass: "bg-primary/8 text-primary border border-primary/20",
      inactiveClass: "text-primary hover:bg-primary/8 hover:text-primary",
      indicatorClass: "bg-primary",
    },
    {
      href: "/drug-safety",
      label: "Drug Safety Checker",
      icon: FlaskConical,
      activeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      inactiveClass: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
      indicatorClass: "bg-emerald-500",
    },
    {
      href: "/drug-doses",
      label: "Drug Dosing Calc.",
      icon: Pill,
      activeClass: "bg-orange-50 text-orange-700 border border-orange-200",
      inactiveClass: "text-orange-600 hover:bg-orange-50 hover:text-orange-700",
      indicatorClass: "bg-orange-500",
    },
  ];

  return (
    <nav className="flex flex-col h-full">
      {/* Quick Access */}
      <div className="px-3 pt-3 pb-2 space-y-0.5">
        <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
          Quick Access
        </p>
        {quickLinks.map(({ href, label, icon: Icon, activeClass, inactiveClass, indicatorClass }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors text-[11px] font-semibold relative",
                active ? activeClass : inactiveClass,
              )}
            >
              {active && (
                <span className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full", indicatorClass)} />
              )}
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="mx-3 border-t border-sidebar-border" />

      {/* Clinical Systems */}
      <div className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
          Clinical Systems
        </p>
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
                  : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground",
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

      {/* Admin links */}
      {isAdmin && (
        <div className="px-3 pb-3 border-t border-sidebar-border pt-2 space-y-0.5">
          <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Administration
          </p>
          {[
            { href: "/admin/protocols", label: "Protocol Management", icon: UserCog },
            { href: "/admin/users", label: "User Management", icon: Users },
          ].map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/admin/protocols" && isAdminPage && pathname !== "/admin/users");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors relative",
                  active
                    ? "bg-primary/8 text-primary font-semibold border border-primary/15"
                    : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full" />
                )}
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
