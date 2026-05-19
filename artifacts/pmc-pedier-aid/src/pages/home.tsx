import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import {
  Activity,
  AlertTriangle,
  Baby,
  Calculator,
  ChevronRight,
  HeartPulse,
  Pill,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useAllProtocols } from "@/contexts/protocols-context";
import {
  CALCULATOR_SHORTCUTS,
  EMERGENCY_SHORTCUTS,
  PRESENTATION_GROUPS,
  type DashboardAccent,
} from "@/lib/clinical-dashboard";
import { cn } from "@/lib/utils";

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
}: {
  protocol: DiseaseProtocol;
  compact?: boolean;
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
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 shrink-0 transition-colors" />
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
    <Link href={shortcut.href} className={cn("group block rounded-xl border p-4 shadow-sm transition-all hover:shadow-md", styles.card)}>
      <div className="flex items-start gap-3">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", styles.icon)}>
          <AlertTriangle className="h-4.5 w-4.5" />
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

function PresentationCard({
  group,
  protocols,
}: {
  group: (typeof PRESENTATION_GROUPS)[number];
  protocols: DiseaseProtocol[];
}) {
  const styles = accentStyles[group.accent];
  const primaryProtocol = protocols[0];
  const href = primaryProtocol ? `/diseases/${primaryProtocol.id}` : "/";
  return (
    <Link href={href} className="group block">
      <div className="h-full rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
        <div className="flex items-start gap-3">
          <span className={cn("mt-0.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0", styles.icon)}>
            <Stethoscope className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold leading-tight text-foreground group-hover:text-primary">{group.title}</h3>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                {protocols.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">{group.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {protocols.slice(0, 3).map((protocol) => (
                <span key={protocol.id} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {protocol.name}
                </span>
              ))}
              {protocols.length > 3 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{protocols.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CalculatorCard({ shortcut }: { shortcut: (typeof CALCULATOR_SHORTCUTS)[number] }) {
  const styles = accentStyles[shortcut.accent];
  return (
    <Link href={shortcut.href} className="group block">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 h-full">
        <div className="flex items-start gap-3">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", styles.icon)}>
            <Calculator className="h-4.5 w-4.5" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {systems.map((system) => {
        const count = allProtocols.filter((p) => p.system === system).length;
        return (
          <Link key={system} href={`/?system=${encodeURIComponent(system)}`} className="group block">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
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
  const allProtocols = useAllProtocols();

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

  const emergencyAvailability = useMemo(() => {
    return new Map(EMERGENCY_SHORTCUTS.map((shortcut) => [
      shortcut.label,
      shortcut.protocolId ? protocolById.has(shortcut.protocolId) : true,
    ]));
  }, [protocolById]);

  const presentationGroups = useMemo(() => {
    return PRESENTATION_GROUPS.map((group) => ({
      group,
      protocols: group.protocolIds
        .map((id) => protocolById.get(id))
        .filter((protocol): protocol is DiseaseProtocol => Boolean(protocol)),
    })).filter(({ protocols }) => protocols.length > 0);
  }, [protocolById]);

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <section className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background p-5 md:p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Bedside ER dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight text-foreground">
              Find the right pediatric ER protocol fast.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Start with a symptom, emergency pathway, calculator, drug dose, or presentation group.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-card border border-border p-3">
              <HeartPulse className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{EMERGENCY_SHORTCUTS.length}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase">Emergency</div>
            </div>
            <div className="rounded-xl bg-card border border-border p-3">
              <Activity className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{allProtocols.length}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase">Protocols</div>
            </div>
            <div className="rounded-xl bg-card border border-border p-3">
              <Pill className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{CALCULATOR_SHORTCUTS.length}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase">Tools</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search disease, symptom, drug, emergency, or system..."
            className="w-full pl-12 pr-4 py-6 text-base rounded-xl bg-card border-border shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {searchTerm.trim() ? (
        <section className="space-y-4">
          <SectionHeader title="Search Results" description={`${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchTerm}"`} />
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {searchResults.map((protocol) => (
                <ProtocolCard key={protocol.id} protocol={protocol} />
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
        <>
          <section className="space-y-4">
            <SectionHeader title="Emergency Shortcuts" description="One-tap access to time-critical pathways." />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {EMERGENCY_SHORTCUTS.map((shortcut) => (
                <EmergencyShortcutCard
                  key={shortcut.label}
                  shortcut={shortcut}
                  available={emergencyAvailability.get(shortcut.label) ?? true}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader title="Common ER Presentations" description="Browse the way residents think during duty." />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {presentationGroups.map(({ group, protocols }) => (
                <PresentationCard key={group.id} group={group} protocols={protocols} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader title="Calculators & Bedside Tools" description="Fast access to dosing, resuscitation, bilirubin, and safety tools." />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {CALCULATOR_SHORTCUTS.map((shortcut) => (
                <CalculatorCard key={shortcut.label} shortcut={shortcut} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader title="Browse by System" description="Keep the original system-based library available." />
            <SystemBrowse allProtocols={allProtocols} />
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <Link href="/neonatology/hyperbilirubinemia" className="group block rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <Baby className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-emerald-800">Neonatal Hyperbilirubinemia</h3>
                  <p className="text-xs text-muted-foreground mt-1">AAP threshold calculator and management support.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-700/50 group-hover:text-emerald-700" />
              </div>
            </Link>
            <Link href="/differential-diagnosis" className="group block rounded-xl border border-violet-200 bg-violet-50/60 p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700 shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-violet-800">AI Differential Diagnosis</h3>
                  <p className="text-xs text-muted-foreground mt-1">Use as a cognitive aid after stabilization and assessment.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-violet-700/50 group-hover:text-violet-700" />
              </div>
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
