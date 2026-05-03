"use client";

import { Link, useLocation, useSearch } from "wouter";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Stethoscope, UserCog, HeartPulse, Brain, Pill, Users,
  FlaskConical, Baby, BookOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useAllProtocols } from "@/contexts/protocols-context";

// ─── All clinical tools in one ordered list ───────────────────────────────────
// Cardiac Arrest stays first (emergency convention). Everything else follows
// by logical category. Active state uses a single primary accent throughout,
// except Cardiac Arrest which uses red (universal emergency colour).

const CLINICAL_TOOLS = [
  {
    href: "/cardiac-arrest",
    label: "Cardiac Arrest",
    icon: HeartPulse,
    emergency: true,
  },
  {
    href: "/neonatology/hyperbilirubinemia",
    label: "Hyperbilirubinemia",
    icon: Baby,
    emergency: false,
  },
  {
    href: "/drug-doses",
    label: "Drug Dosing",
    icon: Pill,
    emergency: false,
  },
  {
    href: "/drug-safety",
    label: "Drug Safety",
    icon: FlaskConical,
    emergency: false,
  },
  {
    href: "/differential-diagnosis",
    label: "AI Differential Dx",
    icon: Brain,
    emergency: false,
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

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
  const isNeonatologyPage = pathname.startsWith("/neonatology");
  const isProtocolPage =
    !isAdminPage &&
    !isNeonatologyPage &&
    !CLINICAL_TOOLS.some((t) => t.href === pathname);

  return (
    <nav className="flex flex-col h-full select-none">

      {/* ── Clinical Tools ─────────────────────────────────────────────── */}
      <div className="px-3 pt-4 pb-3">
        <SectionLabel>Clinical Tools</SectionLabel>

        <div className="space-y-0.5">
          {CLINICAL_TOOLS.map(({ href, label, icon: Icon, emergency }) => {
            const active = pathname === href || (isNeonatologyPage && href.startsWith("/neonatology") && pathname.startsWith(href));
            return (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={Icon}
                active={active}
                emergency={emergency}
              />
            );
          })}
        </div>
      </div>

      <Divider />

      {/* ── Clinical Protocols ─────────────────────────────────────────── */}
      <div className="flex-1 px-3 py-3 overflow-y-auto">
        <SectionLabel>Clinical Protocols</SectionLabel>

        {systems.length === 0 ? (
          <p className="px-2 py-1 text-[11px] text-muted-foreground/50 italic">
            No protocols loaded
          </p>
        ) : (
          <div className="space-y-0.5">
            {systems.map((system) => {
              const active = isProtocolPage && activeSystem === system;
              return (
                <NavItem
                  key={system}
                  href={`/?system=${encodeURIComponent(system)}`}
                  label={system}
                  icon={Stethoscope}
                  active={active}
                  emergency={false}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Administration ─────────────────────────────────────────────── */}
      {isAdmin && (
        <>
          <Divider />
          <div className="px-3 py-3">
            <SectionLabel>Administration</SectionLabel>
            <div className="space-y-0.5">
              {[
                { href: "/admin/protocols", label: "Protocol Management", icon: BookOpen },
                { href: "/admin/users", label: "User Management", icon: Users },
                { href: "/admin", label: "Admin Panel", icon: UserCog },
              ].map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href === "/admin/protocols" && isAdminPage && pathname !== "/admin/users" && pathname !== "/admin");
                return (
                  <NavItem
                    key={href}
                    href={href}
                    label={label}
                    icon={Icon}
                    active={active}
                    emergency={false}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="mx-3 border-t border-sidebar-border" />;
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  emergency: boolean;
}

function NavItem({ href, label, icon: Icon, active, emergency }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors relative group",
        active && emergency
          ? "bg-red-50 text-red-700 border border-red-200"
          : active
          ? "bg-primary/10 text-primary border border-primary/15 font-semibold"
          : emergency
          ? "text-red-600 hover:bg-red-50 hover:text-red-700"
          : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {/* Left accent bar */}
      {active && (
        <span
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full",
            emergency ? "bg-red-500" : "bg-primary",
          )}
        />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? (emergency ? "text-red-600" : "text-primary") : "opacity-50 group-hover:opacity-80",
        )}
      />
      <span className="leading-none">{label}</span>
    </Link>
  );
}
