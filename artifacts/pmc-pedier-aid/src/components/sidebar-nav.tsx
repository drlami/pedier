"use client";

import { Link, useLocation, useSearch } from "wouter";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  UserCog, HeartPulse, Pill, Users,
  Baby, BookOpen, Calculator, Building2, LayoutDashboard, LayoutGrid,
  Search, Activity
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchModal } from "@/components/search-modal";
import { Kbd } from "@/components/ui/kbd";
import { useAuth } from "@/contexts/auth-context";
import { useAllProtocols } from "@/contexts/protocols-context";
import { useSidebar } from "@/contexts/sidebar-context";

const CLINICAL_TOOLS = [
  { href: "/er", label: "ER Dashboard", icon: LayoutDashboard, emergency: false },
  { href: "/ward", label: "Ward Dashboard", icon: Building2, emergency: false },
  { href: "/cardiac-arrest", label: "Cardiac Arrest", icon: HeartPulse, emergency: true },
  { href: "/neonatology/hyperbilirubinemia", label: "Hyperbilirubinemia", icon: Baby, emergency: false },
  { href: "/drug-doses", label: "PediaDose", icon: Pill, emergency: false },
  { href: "/calculators", label: "Calculators", icon: Calculator, emergency: false },
] as const;

const ADMIN_LINKS = [
  { href: "/admin/protocols", label: "Protocol Management", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin", label: "Admin Panel", icon: UserCog },
] as const;

export function SidebarNav() {
  const [pathname, setLocation] = useLocation();
  const search = useSearch();
  const { isAdmin } = useAuth();
  const allProtocols = useAllProtocols();
  const { closeAll } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

  const currentUnit = useMemo(() => {
    if (pathname.startsWith("/ward")) return "ward";
    if (pathname.startsWith("/picu")) return "picu";
    if (pathname.startsWith("/nicu")) return "nicu";
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
    const counts = new Map<string, number>();
    for (const p of filteredProtocols) {
      counts.set(p.system, (counts.get(p.system) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredProtocols]);

  const defaultSystem = systems[0]?.name ?? "";
  const isAdminPage = pathname.startsWith("/admin");
  const isNeoPage = pathname.startsWith("/neonatology");
  const isToolPage = CLINICAL_TOOLS.some(
    (t) => pathname === t.href || (isNeoPage && t.href.startsWith("/neonatology")),
  );
  const isProtocolPage = !isAdminPage && !isToolPage;
  const activeSystem = isProtocolPage ? (currentSystem ?? defaultSystem) : undefined;

  const handleSystemChange = (system: string) => {
    let targetPath = "/er";
    if (currentUnit === "ward") targetPath = "/ward";
    if (currentUnit === "picu") targetPath = "/picu";
    if (currentUnit === "nicu") targetPath = "/nicu";
    setLocation(`${targetPath}?system=${encodeURIComponent(system)}`);
    closeAll();
  };

  // On the main landing page, we want a simplified sidebar
  const isLandingPage = pathname === "/";

  return (
    <nav className="flex flex-col h-full select-none overflow-hidden bg-sidebar shadow-inner">
      <div className="px-3 pt-4 pb-3 shrink-0 space-y-4">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center w-full gap-2 px-3 py-2 text-xs text-muted-foreground bg-muted/50 border border-border/50 rounded-lg hover:bg-muted hover:text-foreground transition-all group"
        >
          <Search className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
          <span className="flex-1 text-left">Quick Search...</span>
          <Kbd className="bg-background/50 border-none shadow-none text-[10px] opacity-40 group-hover:opacity-100">⌘K</Kbd>
        </button>

        <div>
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
            <NavItem
              href="/picu"
              label="PICU Dashboard"
              icon={Activity}
              active={pathname === "/picu"}
              emergency={false}
              onNavigate={closeAll}
            />
            <NavItem
              href="/nicu"
              label="NICU Dashboard"
              icon={Baby}
              active={pathname === "/nicu"}
              emergency={false}
              onNavigate={closeAll}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 pb-4">
        <Accordion type="multiple" defaultValue={["protocols", "tools"]} className="w-full">
          {!isLandingPage && (
            <>
              <AccordionItem value="tools" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2">
                  <SectionLabel className="mb-0">Clinical Tools</SectionLabel>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
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
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="protocols" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2">
                  <SectionLabel className="mb-0">
                    {currentUnit === "ward" ? "Ward Protocols" : 
                     currentUnit === "picu" ? "PICU Protocols" : 
                     currentUnit === "nicu" ? "NICU Protocols" : 
                     "ER Protocols"}
                  </SectionLabel>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  {systems.length === 0 ? (
                    <p className="px-1 text-[11px] text-muted-foreground/50 italic">No protocols loaded</p>
                  ) : (
                    <div className="space-y-0.5">
                      {systems.map(({ name, count }) => (
                        <SystemRow
                          key={name}
                          system={name}
                          count={count}
                          active={isProtocolPage && activeSystem === name}
                          onClick={() => handleSystemChange(name)}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </>
          )}

          {isAdmin && !isLandingPage && (
            <AccordionItem value="admin" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2">
                <SectionLabel className="mb-0">Administration</SectionLabel>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-0.5">
                  {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href === "/admin/protocols" && isAdminPage && pathname !== "/admin/users" && pathname !== "/admin");
                    return <NavItem key={href} href={href} label={label} icon={Icon} active={active} emergency={false} onNavigate={closeAll} />;
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </ScrollArea>
      
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={cn("px-1 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 text-left w-full", className)}>{children}</p>;
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

interface SystemRowProps {
  system: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function SystemRow({ system, count, active, onClick }: SystemRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full gap-2 rounded-md px-2.5 py-2 text-xs font-medium transition-colors relative group text-left",
        active
          ? "bg-primary/10 text-primary border border-primary/15 font-semibold"
          : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
      )}
      <span className="truncate">{system}</span>
      <span
        className={cn(
          "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
          active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/70",
        )}
      >
        {count}
      </span>
    </button>
  );
}
