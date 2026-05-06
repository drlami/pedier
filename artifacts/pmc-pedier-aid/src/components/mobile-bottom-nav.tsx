import { useState, useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import { Stethoscope, Search, Pill, Brain, HeartPulse, ChevronRight, Baby } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SearchModal } from "@/components/search-modal";
import { useAllProtocols, useProtocolById } from "@/contexts/protocols-context";

export function MobileBottomNav() {
  const [pathname, setLocation] = useLocation();
  const search = useSearch();
  const allProtocols = useAllProtocols();

  const [systemSheetOpen, setSystemSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const systems = useMemo(() => {
    const set = new Set(allProtocols.map((p) => p.system));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProtocols]);

  const countBySystem = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProtocols) {
      counts[p.system] = (counts[p.system] ?? 0) + 1;
    }
    return counts;
  }, [allProtocols]);

  const diseaseIdFromPath = pathname.startsWith("/diseases/")
    ? pathname.replace(/^\/diseases\//, "").split("/")[0]
    : "";
  const diseaseProtocol = useProtocolById(diseaseIdFromPath);

  const searchParams = new URLSearchParams(search);
  const activeSystem =
    pathname === "/"
      ? (searchParams.get("system") ?? systems[0] ?? "")
      : (diseaseProtocol?.system ?? "");

  const isProtocols = pathname === "/" || pathname.startsWith("/diseases/");
  const isDrugDoses = pathname === "/drug-doses";
  const isAIDx      = pathname === "/differential-diagnosis";
  const isBili      = pathname === "/neonatology/hyperbilirubinemia";
  const isArrest    = pathname === "/cardiac-arrest";

  const handleSystemSelect = (system: string) => {
    setLocation(`/?system=${encodeURIComponent(system)}`);
    setSystemSheetOpen(false);
  };

  const tabCls = (active: boolean, emergency = false) =>
    cn(
      "relative flex flex-1 flex-col items-center justify-center gap-1 select-none transition-colors",
      active ? (emergency ? "text-red-600" : "text-primary") : "text-muted-foreground",
    );

  const iconCls = (active: boolean, emergency = false) =>
    cn(
      "h-5 w-5 transition-colors",
      active
        ? emergency ? "text-red-600" : "text-primary"
        : emergency ? "text-red-400/70" : "opacity-40",
    );

  const labelCls = (active: boolean, emergency = false) =>
    cn(
      "text-[10px] font-semibold leading-none tracking-wide",
      active
        ? emergency ? "text-red-600" : "text-primary"
        : emergency ? "text-red-400/70" : "text-muted-foreground/70",
    );

  const Indicator = ({ emergency = false }: { emergency?: boolean }) => (
    <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-t-full", emergency ? "bg-red-600" : "bg-primary")} />
  );

  return (
    <>
      <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-stretch" style={{ paddingBottom: "env(safe-area-inset-bottom)", minHeight: "4rem" }}>
        <button type="button" onClick={() => setSearchOpen(true)} className={tabCls(searchOpen)}>
          <Search className={iconCls(searchOpen)} />
          <span className={labelCls(searchOpen)}>Search</span>
          {searchOpen && <Indicator />}
        </button>

        <Link href="/drug-doses" className={tabCls(isDrugDoses)}>
          <Pill className={iconCls(isDrugDoses)} />
          <span className={labelCls(isDrugDoses)}>Drugs</span>
          {isDrugDoses && <Indicator />}
        </Link>

        <button
          type="button"
          onClick={() => setSystemSheetOpen(true)}
          className={cn(
            "relative flex flex-1 flex-col items-center justify-center gap-1 select-none transition-transform -translate-y-2",
            isProtocols ? "text-primary" : "text-muted-foreground",
          )}
        >
          <span className={cn("flex h-12 w-12 items-center justify-center rounded-full shadow-md border border-primary/20 bg-primary text-primary-foreground", isProtocols && "ring-4 ring-primary/10")}> 
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-semibold leading-none tracking-wide text-primary">Protocols</span>
          {isProtocols && <Indicator />}
        </button>

        <Link href="/differential-diagnosis" className={tabCls(isAIDx)}>
          <Brain className={iconCls(isAIDx)} />
          <span className={labelCls(isAIDx)}>AI Dx</span>
          {isAIDx && <Indicator />}
        </Link>

        <Link href="/neonatology/hyperbilirubinemia" className={tabCls(isBili)}>
          <Baby className={iconCls(isBili)} />
          <span className={labelCls(isBili)}>Bili</span>
          {isBili && <Indicator />}
        </Link>

        <Link href="/cardiac-arrest" className={tabCls(isArrest, true)}>
          <HeartPulse className={iconCls(isArrest, true)} />
          <span className={labelCls(isArrest, true)}>Arrest</span>
          {isArrest && <Indicator emergency />}
        </Link>
      </nav>

      <Sheet open={systemSheetOpen} onOpenChange={setSystemSheetOpen}>
        <SheetContent side="bottom" className="px-0 pt-0 pb-safe max-h-[80vh] flex flex-col rounded-t-2xl">
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>
          <SheetHeader className="px-4 pb-3 border-b border-border shrink-0">
            <SheetTitle className="text-base font-bold text-left">Clinical Protocols</SheetTitle>
            <SheetDescription className="text-left text-sm text-muted-foreground">
              Select a system to view its protocols
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto flex-1">
            {systems.map((system) => {
              const count = countBySystem[system] ?? 0;
              const active = system === activeSystem;
              return (
                <button
                  key={system}
                  type="button"
                  onClick={() => handleSystemSelect(system)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-4 border-b border-border/40 transition-colors text-left",
                    active ? "bg-primary/5" : "hover:bg-muted/40 active:bg-muted/60",
                  )}
                >
                  <span className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0", active ? "bg-primary/10" : "bg-muted")}> 
                    <Stethoscope className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground/60")} />
                  </span>
                  <span className={cn("flex-1 text-sm font-semibold leading-snug", active ? "text-primary" : "text-foreground") }>
                    {system}
                  </span>
                  {count > 0 && (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                      {count}
                    </span>
                  )}
                  <ChevronRight className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground/30")} />
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
