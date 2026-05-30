import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import {
  AlertTriangle,
  Calculator,
  ChevronRight,
  HeartPulse,
  Pin,
  PinOff,
  Search,
  Star,
} from "lucide-react";
import { useAllProtocols } from "@/contexts/protocols-context";
import {
  CALCULATOR_SHORTCUTS,
  EMERGENCY_SHORTCUTS,
  type DashboardAccent,
} from "@/lib/clinical-dashboard";
import { cn } from "@/lib/utils";

const PINNED_PROTOCOLS_KEY = "pmc-pinned-protocols-v1";

const accentStyles: Record<DashboardAccent, { card: string; icon: string; bar: string; text: string }> = {
  red: {
    card: "border-red-200 bg-red-50/70 hover:border-red-300 hover:bg-red-50",
    icon: "bg-red-100 text-red-700",
    bar: "bg-red-500",
    text: "text-red-800",
  },
  orange: {
    card: "border-orange-200 bg-orange-50/70 hover:border-orange-300 hover:bg-orange-50",
    icon: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
    text: "text-orange-800",
  },
  blue: {
    card: "border-blue-200 bg-blue-50/60 hover:border-blue-300 hover:bg-blue-50",
    icon: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
    text: "text-blue-800",
  },
  emerald: {
    card: "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300 hover:bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
    text: "text-emerald-800",
  },
  violet: {
    card: "border-violet-200 bg-violet-50/60 hover:border-violet-300 hover:bg-violet-50",
    icon: "bg-violet-100 text-violet-700",
    bar: "bg-violet-500",
    text: "text-violet-800",
  },
  slate: {
    card: "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50",
    icon: "bg-slate-100 text-slate-700",
    bar: "bg-slate-500",
    text: "text-slate-800",
  },
};

function ProtocolCard({
  protocol,
  compact = false,
  pinned = false,
  onTogglePin,
}: {
  protocol: DiseaseProtocol;
  compact?: boolean;
  pinned?: boolean;
  onTogglePin?: (id: string) => void;
}) {
  return (
    <Link
      href={`/diseases/${protocol.id}`}
      className="block group"
    >
      <div className={cn(
        "flex items-center justify-between bg-card border border-border rounded-lg px-4 shadow-sm hover:shadow-md hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-150 group",
        compact ? "py-2.5 min-h-[48px]" : "py-3 min-h-[56px]",
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1 h-8 rounded-full bg-primary/30 group-hover:bg-primary transition-colors shrink-0" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug truncate">
              {protocol.name}
            </span>
            {!compact && (
              <span className="block text-[11px] text-muted-foreground truncate mt-0.5">
                {protocol.system}
              </span>
            )}
          </span>
        </div>
        <span className="flex items-center gap-1 shrink-0">
          {onTogglePin && (
            <button
              type="button"
              className={cn(
                "rounded-md p-1.5 transition-colors hover:bg-muted",
                pinned ? "text-amber-600" : "text-muted-foreground/40 hover:text-amber-600",
              )}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onTogglePin(protocol.id);
              }}
              aria-label={pinned ? "Unpin protocol" : "Pin protocol"}
            >
              {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </button>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
        </span>
      </div>
    </Link>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold font-headline text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

function EmergencyShortcutCard({
  shortcut,
  available,
}: {
  shortcut: (typeof EMERGENCY_SHORTCUTS)[number];
  available: boolean;
}) {
  const styles = accentStyles[shortcut.accent];
  return (
    <Link href={shortcut.href} className={cn("group block rounded-xl border p-3 shadow-sm transition-all hover:shadow-md", styles.card)}>
      <div className="flex items-start gap-3">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", styles.icon)}>
          <AlertTriangle className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block text-sm font-bold leading-tight", styles.text)}>
            {shortcut.label}
          </span>
          <span className="block text-xs text-muted-foreground mt-1 leading-snug">
            {available ? shortcut.description : "Protocol not available yet"}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-foreground/70" />
      </div>
    </Link>
  );
}

function CalculatorCard({ shortcut }: { shortcut: (typeof CALCULATOR_SHORTCUTS)[number] }) {
  const styles = accentStyles[shortcut.accent];
  return (
    <Link href={shortcut.href} className="group block">
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-primary/30 h-full">
        <div className="flex items-start gap-3">
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", styles.icon)}>
            <Calculator className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground group-hover:text-primary leading-tight">{shortcut.label}</span>
            <span className="block text-xs text-muted-foreground mt-1 leading-snug">{shortcut.description}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function SystemBrowse({
  allProtocols,
}: {
  allProtocols: DiseaseProtocol[];
}) {
  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, [allProtocols]);

  return (
    <div className="grid grid-cols-1 gap-2">
      {systems.map((system) => {
        const count = allProtocols.filter((p) => p.system === system).length;
        return (
          <Link key={system} href={`/?system=${encodeURIComponent(system)}`} className="group block">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary truncate">{system}</div>
                <div className="text-[11px] text-muted-foreground">{count} protocol{count !== 1 ? "s" : ""}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function LegacySystemView({
  system,
  allProtocols,
}: {
  system: string;
  allProtocols: DiseaseProtocol[];
}) {
  const protocolsForSystem = useMemo(() => {
    return allProtocols
      .filter((p) => p.system === system)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [system, allProtocols]);

  if (protocolsForSystem.length === 0) return null;

  return (
    <section className="space-y-4">
      <SectionHeader title={system} description="System-based protocol list" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {protocolsForSystem.map((protocol) => (
          <ProtocolCard key={protocol.id} protocol={protocol} compact />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const routeSearch = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedProtocolIds, setPinnedProtocolIds] = useState<string[]>([]);
  const allProtocols = useAllProtocols();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PINNED_PROTOCOLS_KEY);
      setPinnedProtocolIds(raw ? JSON.parse(raw) as string[] : []);
    } catch {
      setPinnedProtocolIds([]);
    }
  }, []);

  const protocolById = useMemo(() => {
    return new Map(allProtocols.map((protocol) => [protocol.id, protocol]));
  }, [allProtocols]);

  const selectedSystem = useMemo(() => {
    const params = new URLSearchParams(routeSearch);
    return params.get("system") || "";
  }, [routeSearch]);

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return allProtocols
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.system.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, allProtocols]);

  const pinnedProtocols = useMemo(() => {
    return pinnedProtocolIds
      .map((id) => protocolById.get(id))
      .filter((protocol): protocol is DiseaseProtocol => Boolean(protocol));
  }, [pinnedProtocolIds, protocolById]);

  const togglePinnedProtocol = (id: string) => {
    setPinnedProtocolIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev];
      localStorage.setItem(PINNED_PROTOCOLS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const emergencyAvailability = useMemo(() => {
    return new Map(EMERGENCY_SHORTCUTS.map((shortcut) => [
      shortcut.label,
      shortcut.protocolId ? protocolById.has(shortcut.protocolId) : true,
    ]));
  }, [protocolById]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <section className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)]">
        <Link href="/cardiac-arrest" className="group block rounded-2xl border border-red-300 bg-red-600 p-5 text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg">
          <div className="flex h-full min-h-[118px] flex-col justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <HeartPulse className="h-6 w-6" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-red-100">Emergency</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">ARREST</h1>
              <p className="mt-1 text-xs font-medium text-red-100">Resuscitation drugs, equipment, RSI</p>
            </div>
          </div>
        </Link>

        <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background p-4 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold font-headline tracking-tight text-foreground">
            Pediatric ER protocols
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Search, open favorites, or use a time-critical shortcut.
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search disease, symptom, drug, emergency, or system..."
              className="w-full pl-12 pr-4 py-5 text-base rounded-xl bg-card border-border shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {searchTerm.trim() ? (
        <section className="space-y-4">
          <SectionHeader title="Search Results" description={`${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchTerm}"`} />
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {searchResults.map((protocol) => (
                <ProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  pinned={pinnedProtocolIds.includes(protocol.id)}
                  onTogglePin={togglePinnedProtocol}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No protocols found for your search.</p>
            </div>
          )}
        </section>
      ) : selectedSystem ? (
        <LegacySystemView system={selectedSystem} allProtocols={allProtocols} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <section className="space-y-3">
            <SectionHeader title="Pinned Favorites" description="Pin commonly used subjects from search results." />
            {pinnedProtocols.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pinnedProtocols.map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
                    compact
                    pinned
                    onTogglePin={togglePinnedProtocol}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
                <Star className="mx-auto h-7 w-7 text-muted-foreground/30" />
                <p className="mt-2 text-sm font-medium text-foreground">No pinned subjects yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Search for a protocol, then press the pin icon.</p>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="space-y-3">
              <SectionHeader title="Emergency" />
              <div className="grid grid-cols-1 gap-2">
                {EMERGENCY_SHORTCUTS.filter((shortcut) => shortcut.href !== "/cardiac-arrest").map((shortcut) => (
                  <EmergencyShortcutCard
                    key={shortcut.label}
                    shortcut={shortcut}
                    available={emergencyAvailability.get(shortcut.label) ?? true}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <SectionHeader title="Tools" />
              <div className="grid grid-cols-1 gap-2">
                {CALCULATOR_SHORTCUTS.filter((shortcut) => shortcut.href !== "/cardiac-arrest").slice(0, 4).map((shortcut) => (
                  <CalculatorCard key={shortcut.label} shortcut={shortcut} />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <SectionHeader title="Browse by System" />
              <SystemBrowse allProtocols={allProtocols} />
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
