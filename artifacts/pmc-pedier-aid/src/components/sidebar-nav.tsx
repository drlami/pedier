"use client";

import { Link, useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  UserCog, HeartPulse, Pill, Users,
  Baby, BookOpen, Calculator, Building2, LayoutDashboard, LayoutGrid,
  Search, Activity, Syringe, FlaskConical
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
import { useSidebar } from "@/contexts/sidebar-context";

export const MAIN_SECTIONS = [
  { href: "/er", label: "ER", icon: LayoutDashboard },
  { href: "/ward", label: "Ward", icon: Building2 },
  { href: "/nicu", label: "NICU", icon: Baby },
  { href: "/picu", label: "PICU", icon: Activity },
  { href: "/nicu/drugs", label: "Neodose", icon: Syringe },
  { href: "/drug-doses", label: "PediaDose", icon: Pill },
  { href: "/pedialab", label: "PediaLab", icon: FlaskConical },
  { href: "/calculators", label: "Calculators", icon: Calculator },
] as const;

const ADMIN_LINKS = [
  { href: "/admin/protocols", label: "Protocol Management", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin", label: "Admin Panel", icon: UserCog },
] as const;

export function SidebarNav() {
  const [pathname] = useLocation();
  const { isAdmin } = useAuth();
  const { closeAll } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

  const isAdminPage = pathname.startsWith("/admin");
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

        <NavItem
          href="/"
          label="Home Portal"
          icon={LayoutGrid}
          active={isLandingPage}
          emergency={false}
          onNavigate={closeAll}
        />

        <NavItem
          href="/cardiac-arrest"
          label="Cardiac Arrest"
          icon={HeartPulse}
          active={pathname === "/cardiac-arrest"}
          emergency
          onNavigate={closeAll}
        />

        <div>
          <SectionLabel>Main Sections</SectionLabel>
          <div className="space-y-0.5">
            {MAIN_SECTIONS.map(({ href, label, icon: Icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={Icon}
                active={pathname === href}
                emergency={false}
                onNavigate={closeAll}
              />
            ))}
          </div>
        </div>
      </div>

      {isAdmin && (
        <ScrollArea className="flex-1 px-3 pb-4">
          <Accordion type="multiple" defaultValue={["admin"]} className="w-full">
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
          </Accordion>
        </ScrollArea>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={cn("px-1 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 text-left w-full", className)}>{children}</p>;
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
