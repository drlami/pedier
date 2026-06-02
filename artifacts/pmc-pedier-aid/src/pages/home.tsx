import { useState, useMemo, useEffect } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import {
  Calculator,
  ChevronRight,
  HeartPulse,
  Pin,
  PinOff,
  Search,
  Star,
  BookOpen,
  LayoutGrid,
  Stethoscope,
  X,
} from "lucide-react";
import { useAllProtocols } from "@/contexts/protocols-context";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { PinnedWorkspace } from "@/components/pinned-workspace";
import {
  CALCULATOR_SHORTCUTS,
} from "@/lib/clinical-dashboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function SectionHeader({ title, icon: Icon, description }: { title: string; icon?: any; description?: string }) {
  return (
    <div className="px-2 mb-4">
      <div className="flex items-center gap-2 mb-0.5">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/60" />}
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</h3>
      </div>
      {description && <p className="text-[11px] text-muted-foreground font-medium">{description}</p>}
    </div>
  );
}

export default function HomePage() {
  const routeSearch = useSearch();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { togglePin, isPinned } = usePinnedItems();
  const allProtocols = useAllProtocols();

  const selectedSystem = useMemo(() => {
    const params = new URLSearchParams(routeSearch);
    return params.get("system") || "";
  }, [routeSearch]);

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return { protocols: [], calculators: [] };
    
    return {
      protocols: allProtocols.filter(p => 
        p.name.toLowerCase().includes(q) || p.system.toLowerCase().includes(q)
      ).sort((a,b) => a.name.localeCompare(b.name)),
      calculators: CALCULATOR_SHORTCUTS.filter(c => 
        c.label.toLowerCase().includes(q)
      )
    };
  }, [searchTerm, allProtocols]);

  const systems = useMemo(() => {
    const set = new Set(allProtocols.map(p => p.system));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allProtocols]);

  const systemProtocols = useMemo(() => {
    if (!selectedSystem) return [];
    return allProtocols
      .filter(p => p.system === selectedSystem)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSystem, allProtocols]);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-2 sm:px-4">
      {/* 1. EMERGENCY HERO */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Link href="/cardiac-arrest" className="md:col-span-5 group relative overflow-hidden rounded-[32px] bg-red-600 p-6 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
          <div className="relative z-10 h-full flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                <HeartPulse className="h-7 w-7 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none font-black tracking-widest text-[10px]">CRITICAL</Badge>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter leading-none">ARREST</h1>
              <p className="text-red-100 text-sm font-medium mt-2">Drugs • Equipment • RSI</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Link>

        <div className="md:col-span-7 flex flex-col justify-center space-y-4 p-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground">PediER Aid</h2>
            <p className="text-muted-foreground text-sm font-medium">Search protocols, calculators, and clinical tools.</p>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search e.g. DKA, Seizure, Dose..."
              className="w-full pl-12 pr-4 h-14 text-base rounded-[20px] bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 shadow-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {searchTerm.trim() ? (
        /* SEARCH RESULTS */
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Search Results</h3>
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs font-bold underline">Clear Search</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchResults.calculators.map(calc => (
              <div key={calc.href} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                <Link href={calc.href} className="flex items-center gap-4 flex-1">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-sm">{calc.label}</span>
                </Link>
                <button onClick={() => togglePin({ type: "calculator", href: calc.href })} className={cn("p-2 rounded-lg transition-colors", isPinned({ type: "calculator", href: calc.href }) ? "text-amber-500 bg-amber-50" : "text-muted-foreground/30 hover:bg-muted")}>
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            ))}
            {searchResults.protocols.map(p => (
              <div key={p.id} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                <Link href={`/diseases/${p.id}`} className="flex items-center gap-4 flex-1">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{p.system}</span>
                  </div>
                </Link>
                <button onClick={() => togglePin({ type: "protocol", id: p.id })} className={cn("p-2 rounded-lg transition-colors", isPinned({ type: "protocol", id: p.id }) ? "text-amber-500 bg-amber-50" : "text-muted-foreground/30 hover:bg-muted")}>
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : selectedSystem ? (
        /* SYSTEM VIEW */
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="text-xl font-black tracking-tight">{selectedSystem}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="text-xs font-bold text-muted-foreground">
              <X className="mr-2 h-3.5 w-3.5" /> Close
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {systemProtocols.map(p => (
              <div key={p.id} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                <Link href={`/diseases/${p.id}`} className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-full bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">{p.name}</span>
                </Link>
                <button onClick={() => togglePin({ type: "protocol", id: p.id })} className={cn("p-2 rounded-lg transition-colors", isPinned({ type: "protocol", id: p.id }) ? "text-amber-500 bg-amber-50" : "text-muted-foreground/30 hover:bg-muted")}>
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* 2. PINNED FAVORITES */}
          <PinnedWorkspace />

          {/* 3. SYSTEMS BROWSER */}
          <section className="space-y-6">
            <SectionHeader title="Browse Protocols by System" icon={LayoutGrid} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {systems.map(system => {
                const count = allProtocols.filter(p => p.system === system).length;
                return (
                  <button 
                    key={system}
                    onClick={() => setLocation(`/?system=${encodeURIComponent(system)}`)}
                    className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 hover:bg-primary/[0.02] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm block">{system}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{count} subjects</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-all" />
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
