"use client";

import { Link, useLocation, useSearch } from "wouter";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Stethoscope, UserCog, HeartPulse, Brain, Pill, Users,
  FlaskConical, Baby, BookOpen, Calculator, Building2, LayoutDashboard, LayoutGrid
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useAllProtocols } from "@/contexts/protocols-context";
import { useSidebar } from "@/contexts/sidebar-context";

const CLINICAL_TOOLS = [
  { href: "/er", label: "ER Dashboard", icon: LayoutDashboard, emergency: false },
  { href: "/ward", label: "Ward Dashboard", icon: Building2, emergency: false },
  { href: "/cardiac-arrest", label: "Cardiac Arrest", icon: HeartPulse, emergency: true },
  { href: "/neonatology/hyperbilirubinemia", label: "Hyperbilirubinemia", icon: Baby, emergency: false },
  { href: "/drug-doses", label: "Drug Dosing", icon: Pill, emergency: false },
  { href: "/calculators", label: "Calculators", icon: Calculator, emergency: false },
] as const;

const ADMIN_LINKS = [
  { href: "/admin/protocols", label: "Protocol Management", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin", label: "Admin Panel", icon: UserCog },
] as const;

const EXTRA_SYSTEMS = ["Metabolic Diseases", "Neonatology"] as const;

const WARD_SYSTEMS = [
  "Respiratory System",
  "Cardiovascular System",
  "Gastrointestinal & Hepatology",
  "Neurological System",
  "Renal & Urinary System",
  "Hematology & Oncology",
  "Endocrinology",
  "Metabolic Diseases",
  "Infectious Diseases",
  "Immunology & Rheumatology",
  "Dermatology",
  "Nutrition & Growth"
] as const;

export function SidebarNav() {
  const [pathname, setLocation] = useLocation();
  const search = useSearch();
  const { isAdmin } = useAuth();
  const allProtocols = useAllProtocols();
  const { closeAll } = useSidebar();

  const currentUnit = useMemo(() => {
    if (pathname.startsWith("/ward")) return "ward";
    return "er"; // Default to ER for existing protocols and routes
  }, [pathname]);

  const filteredProtocols = useMemo(() => {
    return allProtocols.filter(p => {
      const protocolUnit = p.unit || "er";
      return protocolUnit === currentUnit;
    });
  }, [allProtocols, currentUnit]);

  const searchParams = new URLSearchParams(search);
  const currentSystem = searchParams.get("system");

  const systems = useMemo(() => {
    const systemSet = new Set([
      ...filteredProtocols.map((p) => p.system),
      ...(currentUnit === "er" ? EXTRA_SYSTEMS : WARD_SYSTEMS),
    ]);
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, [filteredProtocols, currentUnit]);

  const defaultSystem = systems[0] ?? "";
  const isAdminPage = pathname.startsWith("/admin");
  const isNeoPage = pathname.startsWith("/neonatology");
  const isToolPage = CLINICAL_TOOLS.some(
    (t) => pathname === t.href || (isNeoPage && t.href.startsWith("/neonatology")),
  );
  const isProtocolPage = !isAdminPage && !isToolPage;
  const activeSystem = isProtocolPage ? (currentSystem ?? defaultSystem) : undefined;

  const handleSystemChange = (system: string) => {
    const targetPath = currentUnit === "ward" ? "/ward" : "/er";
    setLocation(`${targetPath}?system=${encodeURIComponent(system)}`);
    closeAll();
  };

  // On the main landing page, we want a simplified sidebar
  const isLandingPage = pathname === "/";

  return (
    <nav className="flex flex-col h-full select-none overflow-hidden">
      <div className="px-3 pt-4 pb-3 shrink-0">
        <SectionLabel>Navigation</SectionLabel>
        <div className="space-y-0.5">
          <NavItem
            href="/"
            label="Home Portal"
            icon={LayoutGrid}
            active={isLandingPage}
            emergency={false}
            onNavigate={closeAll}
          />
          <NavItem
            href="/er"
            label="ER Dashboard"
            icon={LayoutDashboard}
            active={pathname === "/er"}
            emergency={false}
            onNavigate={closeAll}
          />
          <NavItem
            href="/ward"
            label="Ward Dashboard"
            icon={Building2}
            active={pathname === "/ward"}
            emergency={false}
            onNavigate={closeAll}
          />
        </div>
      </div>

      {!isLandingPage && (
        <>
          <Divider />
          <div className="px-3 py-3 shrink-0">
            <SectionLabel>Clinical Tools</SectionLabel>
            <div className="space-y-0.5">
              {CLINICAL_TOOLS.filter(t => t.href !== "/er" && t.href !== "/ward").map(({ href, label, icon: Icon, emergency }) => {
                const active = pathname === href || (isNeoPage && href.startsWith("/neonatology") && pathname.startsWith(href));
                return (
                  <NavItem
                    key={href}
                    href={href}
                    label={label}
                    icon={Icon}
                    active={active}
                    emergency={emergency}
                    onNavigate={closeAll}
                  />
                );
              })}
            </div>
          </div>

          <Divider />

          <div className="px-3 py-3 shrink-0">
            <SectionLabel>{currentUnit === "ward" ? "Ward Protocols" : "ER Protocols"}</SectionLabel>
            {systems.length === 0 ? (
              <p className="px-1 text-[11px] text-muted-foreground/50 italic">No protocols loaded</p>
            ) : (
              <>
                <Select value={activeSystem ?? ""} onValueChange={handleSystemChange}>
                  <SelectTrigger className={cn("h-8 text-xs w-full", isProtocolPage ? "border-primary/30 text-primary font-medium" : "text-muted-foreground") }>
                    <Stethoscope className="h-3.5 w-3.5 shrink-0 mr-1.5 opacity-60" />
                    <SelectValue placeholder="Select a system…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {systems.map((system) => (
                      <SelectItem key={system} value={system} className="text-xs">{system}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isProtocolPage && activeSystem && (
                  <p className="mt-1.5 px-1 text-[10px] text-primary/70 font-medium truncate">Viewing: {activeSystem}</p>
                )}
              </>
            )}
          </div>

          <Divider />

          <div className="px-3 py-3 shrink-0">
            <SectionLabel>Calculators</SectionLabel>
            <NavItem href="/calculators" label="Open Calculators" icon={Calculator} active={pathname === "/calculators"} emergency={false} onNavigate={closeAll} />
          </div>
        </>
      )}

      <div className="flex-1" />

      {isAdmin && (
        <>
          <Divider />
          <div className="px-3 py-3 shrink-0">
            <SectionLabel>Administration</SectionLabel>
            <div className="space-y-0.5">
              {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href === "/admin/protocols" && isAdminPage && pathname !== "/admin/users" && pathname !== "/admin");
                return <NavItem key={href} href={href} label={label} icon={Icon} active={active} emergency={false} onNavigate={closeAll} />;
              })}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-1 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{children}</p>;
}

function Divider() {
  return <div className="mx-3 border-t border-sidebar-border shrink-0" />;
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  emergency: boolean;
  onNavigate?: () => void;
}

function NavItem({ href, label, icon: Icon, active, emergency, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
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
      {active && (
        <span className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full", emergency ? "bg-red-500" : "bg-primary")} />
      )}
      <Icon className={cn("h-4 w-4 shrink-0", active ? (emergency ? "text-red-600" : "text-primary") : "opacity-50 group-hover:opacity-80")} />
      <span className="leading-none">{label}</span>
    </Link>
  );
}
