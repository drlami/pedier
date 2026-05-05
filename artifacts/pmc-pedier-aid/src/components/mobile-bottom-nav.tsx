import { useState, useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import {
  Stethoscope, Search, Pill, Brain, HeartPulse, ChevronRight,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { SearchModal } from "@/components/search-modal";
import { useAllProtocols } from "@/contexts/protocols-context";

const EXTRA_SYSTEMS = ["Metabolic Diseases"] as const;

export function MobileBottomNav() {
  const [pathname, setLocation] = useLocation();
  const search = useSearch();
  const allProtocols = useAllProtocols();

  const [systemSheetOpen, setSystemSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ── Derived data ────────────────────────────────────────────────────────────

  const systems = useMemo(() => {
    const set = new Set([
      ...allProtocols.map((p) => p.system),
      ...EXTRA_SYSTEMS,
    ]);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProtocols]);

  const countBySystem = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProtocols) {
      counts[p.system] = (counts[p.system] ?? 0) + 1;
    }
    return counts;
  }, [allProtocols]);

  const searchParams = new URLSearchParams(search);
  const activeSystem =
    pathname === "/" ? (searchParams.get("system") ?? systems[0] ?? "") : "";

  // ── Active state per tab ────────────────────────────────────────────────────

  const isProtocols  = pathname === "/" || pathname.startsWith("/diseases/");
  const isDrugDoses  = pathname === "/drug-doses";
  const isAIDx       = pathname === "/differential-diagnosis";
  const isArrest     = pathname === "/cardiac-arrest";

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSystemSelect = (system: string) => {
    setLocation(`/?system=${encodeURIComponent(system)}`);
    setSystemSheetOpen(false);
  };

  // ── Shared class helpers ────────────────────────────────────────────────────

  const tabCls = (active: boolean, emergency = false) =>
    cn(
      "relative flex flex-1 flex-col items-center justify-center gap-1 select-none transition-colors",
      active
        ? emergency ? "text-red-600" : "text-primary"
        : "text-muted-foreground",
    );

  const iconCls = (active: boolean, emergency = false) =>
    cn(
      "h-5 w-5 transition-colors",
      active ? (emergency ? "text-red-600" : "text-primary") : "opacity-40",
    );

  const labelCls = (active: boolean, emergency = false) =>
    cn(
      "text-[10px] font-semibold leading-none tracking-wide",
      active
        ? emergency ? "text-red-600" : "text-primary"
        : "text-muted-foreground/70",
    );

  const Indicator = ({ emergency = false }: { emergency?: boolean }) => (
    <span
      className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-t-full",
        emergency ? "bg-red-600" : "bg-primary",
      )}
    />
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-stretch h-16">

        {/* Protocols — opens bottom sheet */}
        <button
          type="button"
          onClick={() => setSystemSheetOpen(true)}
          className={tabCls(isProtocols)}
        >
          <Stethoscope className={iconCls(isProtocols)} />
          <span className={labelCls(isProtocols)}>Protocols</span>
          {isProtocols && <Indicator />}
        </button>

        {/* Search — opens SearchModal */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={tabCls(false)}
        >
          <Search className={iconCls(false)} />
          <span className={labelCls(false)}>Search</span>
        </button>

        {/* Drug Doses — direct nav */}
        <Link href="/drug-doses" className={tabCls(isDrugDoses)}>
          <Pill className={iconCls(isDrugDoses)} />
          <span className={labelCls(isDrugDoses)}>Drug Doses</span>
          {isDrugDoses && <Indicator />}
        </Link>

        {/* AI Dx — direct nav */}
        <Link href="/differential-diagnosis" className={tabCls(isAIDx)}>
          <Brain className={iconCls(isAIDx)} />
          <span className={labelCls(isAIDx)}>AI Dx</span>
          {isAIDx && <Indicator />}
        </Link>

        {/* Cardiac Arrest — direct nav, red theme */}
        <Link href="/cardiac-arrest" className={tabCls(isArrest, true)}>
          <HeartPulse className={iconCls(isArrest, true)} />
          <span className={labelCls(isArrest, true)}>Arrest</span>
          {isArrest && <Indicator emergency />}
        </Link>
      </nav>

      {/* ── Protocols bottom sheet ──────────────────────────────────────────── */}
      <Sheet open={systemSheetOpen} onOpenChange={setSystemSheetOpen}>
        <SheetContent
          side="bottom"
          className="px-0 pt-0 pb-safe max-h-[80vh] flex flex-col rounded-t-2xl"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>

          <SheetHeader className="px-4 pb-3 border-b border-border shrink-0">
            <SheetTitle className="text-base font-bold text-left">
              Clinical Protocols
            </SheetTitle>
            <SheetDescription className="text-left text-sm text-muted-foreground">
              Select a system to view its protocols
            </SheetDescription>
          </SheetHeader>

          {/* System list */}
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
                  <span
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                      active ? "bg-primary/10" : "bg-muted",
                    )}
                  >
                    <Stethoscope
                      className={cn(
                        "h-4 w-4",
                        active ? "text-primary" : "text-muted-foreground/60",
                      )}
                    />
                  </span>

                  <span
                    className={cn(
                      "flex-1 text-sm font-semibold leading-snug",
                      active ? "text-primary" : "text-foreground",
                    )}
                  >
                    {system}
                  </span>

                  {count > 0 && (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                      {count}
                    </span>
                  )}

                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-primary" : "text-muted-foreground/30",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Search modal ────────────────────────────────────────────────────── */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
