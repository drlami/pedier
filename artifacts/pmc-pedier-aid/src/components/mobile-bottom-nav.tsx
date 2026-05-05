import { Link, useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import { Stethoscope, Search, Pill, Brain } from "lucide-react";

interface Tab {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: (pathname: string, search: string) => boolean;
}

const TABS: Tab[] = [
  {
    href: "/",
    label: "Protocols",
    icon: Stethoscope,
    isActive: (pathname) =>
      pathname === "/" || pathname.startsWith("/diseases/"),
  },
  {
    href: "/?focus=search",
    label: "Search",
    icon: Search,
    isActive: (pathname, search) =>
      pathname === "/" && new URLSearchParams(search).get("focus") === "search",
  },
  {
    href: "/drug-doses",
    label: "Drug Doses",
    icon: Pill,
    isActive: (pathname) => pathname === "/drug-doses",
  },
  {
    href: "/differential-diagnosis",
    label: "AI Dx",
    icon: Brain,
    isActive: (pathname) => pathname === "/differential-diagnosis",
  },
];

export function MobileBottomNav() {
  const [pathname] = useLocation();
  const search = useSearch();

  return (
    <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-stretch h-16 safe-area-pb">
      {TABS.map(({ href, label, icon: Icon, isActive }) => {
        const active = isActive(pathname, search);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 transition-colors select-none",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-colors",
                active ? "text-primary" : "opacity-40",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-semibold leading-none tracking-wide",
                active ? "text-primary" : "text-muted-foreground/70",
              )}
            >
              {label}
            </span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-t-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
