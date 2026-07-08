import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Stethoscope, Search, Calculator, Building2, LayoutGrid, HeartPulse, Baby } from "lucide-react";
import { SearchModal } from "@/components/search-modal";
import { useProtocolById } from "@/contexts/protocols-context";

export function MobileBottomNav() {
  const [pathname] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const diseaseIdFromPath = pathname.startsWith("/diseases/")
    ? pathname.replace(/^\/diseases\//, "").split("/")[0]
    : "";
  const diseaseProtocol = useProtocolById(diseaseIdFromPath);

  const isHome        = pathname === "/";
  const isER          = pathname === "/er" || (pathname.startsWith("/diseases/") && (diseaseProtocol?.unit || "er") === "er");
  const isWard        = pathname === "/ward" || (pathname.startsWith("/diseases/") && diseaseProtocol?.unit === "ward");
  const isNicu        = pathname.startsWith("/nicu") || (pathname.startsWith("/diseases/") && diseaseProtocol?.unit === "nicu");
  const isCalculators = pathname.startsWith("/calculators");
  const isArrest      = pathname === "/cardiac-arrest";

  const tabCls = (active: boolean, emergency = false) =>
    cn(
      "relative flex flex-1 flex-col items-center justify-center gap-1.5 transition-all duration-300 ease-out active:scale-95",
      active 
        ? (emergency ? "text-red-600" : "text-primary") 
        : "text-slate-400 dark:text-slate-500",
    );

  const iconCls = (active: boolean, emergency = false) =>
    cn(
      "h-5 w-5 transition-transform duration-300",
      active ? "scale-110" : "scale-100",
      active
        ? (emergency ? "text-red-600" : "text-primary")
        : (emergency ? "text-red-400/60" : "opacity-50"),
    );

  const labelCls = (active: boolean, emergency = false) =>
    cn(
      "text-[10px] font-bold leading-none tracking-tight transition-colors duration-300",
      active
        ? (emergency ? "text-red-600" : "text-primary")
        : (emergency ? "text-red-400/70" : "text-slate-400 dark:text-slate-500"),
    );

  const Indicator = ({ active, emergency = false }: { active: boolean, emergency?: boolean }) => (
    <div className={cn(
      "absolute -top-px left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-300 ease-in-out",
      active ? (emergency ? "w-8 bg-red-600" : "w-8 bg-primary") : "w-0 bg-transparent"
    )} />
  );

  return (
    <>
      <nav 
        className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-t border-border/50 flex items-stretch shadow-[0_-4px_12px_rgba(0,0,0,0.03)]" 
        style={{ paddingBottom: "env(safe-area-inset-bottom)", minHeight: "4.25rem" }}
      >
        <Link href="/" className={tabCls(isHome)}>
          <Indicator active={isHome} />
          <LayoutGrid className={iconCls(isHome)} />
          <span className={labelCls(isHome)}>Home</span>
        </Link>

        <Link href="/er" className={tabCls(isER)}>
          <Indicator active={isER} />
          <Stethoscope className={iconCls(isER)} />
          <span className={labelCls(isER)}>ER Unit</span>
        </Link>

        <Link href="/ward" className={tabCls(isWard)}>
          <Indicator active={isWard} />
          <Building2 className={iconCls(isWard)} />
          <span className={labelCls(isWard)}>Ward</span>
        </Link>

        <Link href="/nicu" className={tabCls(isNicu)}>
          <Indicator active={isNicu} />
          <Baby className={iconCls(isNicu)} />
          <span className={labelCls(isNicu)}>NICU</span>
        </Link>

        <Link href="/calculators" className={tabCls(isCalculators)}>
          <Indicator active={isCalculators} />
          <Calculator className={iconCls(isCalculators)} />
          <span className={labelCls(isCalculators)}>PediCalc</span>
        </Link>

        <Link href="/cardiac-arrest" className={tabCls(isArrest, true)}>
          <Indicator active={isArrest} emergency />
          <HeartPulse className={iconCls(isArrest, true)} />
          <span className={labelCls(isArrest, true)}>Arrest</span>
        </Link>
      </nav>

      {/* Quick Search FAB */}
      <div 
        className="no-print lg:hidden fixed right-4 z-50 transition-all duration-300 ease-in-out"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
      >
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Quick Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
