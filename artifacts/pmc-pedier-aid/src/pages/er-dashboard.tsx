import { useState, useMemo } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import {
  Calculator,
  ChevronRight,
  HeartPulse,
  Pin,
  Search,
  BookOpen,
  LayoutGrid,
  Stethoscope,
  X,
  Wind,
  Thermometer,
  Brain,
  FlaskConical,
  Skull,
  Shield,
  Droplets,
  Activity,
  Zap,
} from "lucide-react";
import { useAllProtocols } from "@/contexts/protocols-context";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { PinnedWorkspace } from "@/components/pinned-workspace";
import { CALCULATOR_SHORTCUTS } from "@/lib/clinical-dashboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Category mapping ────────────────────────────────────────────────────────
// Maps protocol ID → ER presentation category.
// Protocols not listed here fall back to "Other".
const ER_CATEGORY_MAP: Record<string, string> = {
  // Breathing Difficulty
  asthma:                        'Breathing Difficulty',
  bronchiolitis:                 'Breathing Difficulty',
  croup:                         'Breathing Difficulty',
  pneumonia:                     'Breathing Difficulty',
  epiglottitis:                  'Breathing Difficulty',
  fba:                           'Breathing Difficulty',
  tracheitis:                    'Breathing Difficulty',

  // Fever & Infections
  'fever-without-source':        'Fever & Infections',
  'fever-neutropenia':           'Fever & Infections',
  'fever-rash':                  'Fever & Infections',
  'meningitis-encephalitis':     'Fever & Infections',
  'septic-shock':                'Fever & Infections',
  ssti:                          'Fever & Infections',
  mastoiditis:                   'Fever & Infections',
  'orbital-cellulitis':          'Fever & Infections',
  'periorbital-cellulitis':      'Fever & Infections',
  'cervical-lymphadenitis':      'Fever & Infections',

  // Shock & Cardiovascular
  'shock-management':            'Shock & Cardiovascular',
  'anaphylactic-shock':          'Shock & Cardiovascular',
  'tachycardia-svt':             'Shock & Cardiovascular',
  bradycardia:                   'Shock & Cardiovascular',
  'heart-failure-myocarditis':   'Shock & Cardiovascular',
  'chest-pain-in-children':      'Shock & Cardiovascular',
  syncope:                       'Shock & Cardiovascular',
  palpitations:                  'Shock & Cardiovascular',
  'murmur-with-symptoms':        'Shock & Cardiovascular',

  // Seizures & Neurology
  'status-epilepticus':          'Seizures & Neurology',
  'febrile-seizure':             'Seizures & Neurology',
  'first-afebrile-seizure':      'Seizures & Neurology',
  'altered-mental-status':       'Seizures & Neurology',
  'headache-red-flags':          'Seizures & Neurology',
  'raised-icp-suspicion':        'Seizures & Neurology',
  'peds-stroke':                 'Seizures & Neurology',
  'acute-flaccid-weakness':      'Seizures & Neurology',
  'acute-ataxia':                'Seizures & Neurology',
  'vp-shunt-malfunction':        'Seizures & Neurology',

  // Abdominal
  'abdominal-pain':              'Abdominal',
  'bilious-vomiting':            'Abdominal',
  'abdominal-distention-constipation': 'Abdominal',
  intussusception:               'Abdominal',
  'gi-bleeding':                 'Abdominal',
  'persistent-vomiting':         'Abdominal',
  'dehydration-gastroenteritis': 'Abdominal',

  // Metabolic & Endocrine
  dka:                           'Metabolic & Endocrine',
  hypoglycemia:                  'Metabolic & Endocrine',
  'adrenal-crisis':              'Metabolic & Endocrine',
  hyperkalemia:                  'Metabolic & Endocrine',
  hypokalemia:                   'Metabolic & Endocrine',
  hypomagnesemia:                'Metabolic & Endocrine',
  hypernatremia:                 'Metabolic & Endocrine',
  hyponatremia:                  'Metabolic & Endocrine',
  hypercalcemia:                 'Metabolic & Endocrine',
  hypocalcemia:                  'Metabolic & Endocrine',
  'metabolic-crisis':            'Metabolic & Endocrine',

  // Toxicology & Envenomation
  'paracetamol-toxicity':        'Toxicology & Envenomation',
  'iron-toxicity':               'Toxicology & Envenomation',
  'organophosphorus-ingestion':  'Toxicology & Envenomation',
  'co-poisoning':                'Toxicology & Envenomation',
  'chlorine-inhalation':         'Toxicology & Envenomation',
  'snake-bite':                  'Toxicology & Envenomation',
  'scorpion-sting':              'Toxicology & Envenomation',

  // Trauma & Airway
  'head-trauma':                 'Trauma & Airway',
  'smoke-inhalation-burns':      'Trauma & Airway',
  cyanosis:                      'Trauma & Airway',
  apnea:                         'Trauma & Airway',

  // Renal & Urinary
  'urinary-tract-infection':     'Renal & Urinary',
  'acute-renal-failure':         'Renal & Urinary',
};

// ─── Category config: display order, icon, accent colour ────────────────────
type CategoryConfig = {
  icon: React.ElementType;
  color: string;       // Tailwind bg class for icon container
  textColor: string;   // Tailwind text class for icon
};

const CATEGORY_ORDER = [
  'Shock & Cardiovascular',
  'Breathing Difficulty',
  'Fever & Infections',
  'Seizures & Neurology',
  'Abdominal',
  'Metabolic & Endocrine',
  'Trauma & Airway',
  'Toxicology & Envenomation',
  'Renal & Urinary',
  'Other',
];

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  'Shock & Cardiovascular':   { icon: HeartPulse,   color: 'bg-red-50',    textColor: 'text-red-600'    },
  'Breathing Difficulty':     { icon: Wind,          color: 'bg-sky-50',    textColor: 'text-sky-600'    },
  'Fever & Infections':       { icon: Thermometer,   color: 'bg-orange-50', textColor: 'text-orange-600' },
  'Seizures & Neurology':     { icon: Zap,           color: 'bg-violet-50', textColor: 'text-violet-600' },
  'Abdominal':                { icon: Activity,      color: 'bg-emerald-50',textColor: 'text-emerald-600'},
  'Metabolic & Endocrine':    { icon: FlaskConical,  color: 'bg-teal-50',   textColor: 'text-teal-600'   },
  'Trauma & Airway':          { icon: Shield,        color: 'bg-slate-100', textColor: 'text-slate-600'  },
  'Toxicology & Envenomation':{ icon: Skull,         color: 'bg-yellow-50', textColor: 'text-yellow-700' },
  'Renal & Urinary':          { icon: Droplets,      color: 'bg-blue-50',   textColor: 'text-blue-600'   },
  'Other':                    { icon: BookOpen,      color: 'bg-muted',     textColor: 'text-muted-foreground' },
};

function getCategory(p: DiseaseProtocol): string {
  return ER_CATEGORY_MAP[p.id] ?? 'Other';
}

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

export default function ERDashboard() {
  const routeSearch = useSearch();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { togglePin, isPinned } = usePinnedItems();
  const allProtocols = useAllProtocols();

  const erProtocols = useMemo(() => {
    return allProtocols.filter(p => (p.unit || "er") === "er");
  }, [allProtocols]);

  const selectedCategory = useMemo(() => {
    const params = new URLSearchParams(routeSearch);
    return params.get("category") || "";
  }, [routeSearch]);

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return { protocols: [], calculators: [] };
    return {
      protocols: erProtocols.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.system.toLowerCase().includes(q) ||
        (ER_CATEGORY_MAP[p.id] ?? '').toLowerCase().includes(q)
      ).sort((a, b) => a.name.localeCompare(b.name)),
      calculators: CALCULATOR_SHORTCUTS.filter(c =>
        c.label.toLowerCase().includes(q)
      ),
    };
  }, [searchTerm, erProtocols]);

  // Build ordered category list with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of erProtocols) {
      const cat = getCategory(p);
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return CATEGORY_ORDER
      .filter(cat => (counts[cat] ?? 0) > 0)
      .map(cat => ({ name: cat, count: counts[cat] ?? 0, ...CATEGORY_CONFIG[cat] }));
  }, [erProtocols]);

  const categoryProtocols = useMemo(() => {
    if (!selectedCategory) return [];
    return erProtocols
      .filter(p => getCategory(p) === selectedCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, erProtocols]);

  const selectedConfig = selectedCategory ? (CATEGORY_CONFIG[selectedCategory] ?? CATEGORY_CONFIG['Other']) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-2 sm:px-4">
      {/* EMERGENCY HERO */}
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
              placeholder="Search e.g. DKA, Seizure, Fever..."
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
                <button
                  onClick={() => togglePin({ type: "calculator", href: calc.href })}
                  className={cn("p-2 rounded-lg transition-colors", isPinned({ type: "calculator", href: calc.href }) ? "text-amber-500 bg-amber-50" : "text-muted-foreground/30 hover:bg-muted")}
                >
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            ))}
            {searchResults.protocols.map(p => {
              const cat = getCategory(p);
              const cfg = CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG['Other'];
              return (
                <div key={p.id} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                  <Link href={`/diseases/${p.id}`} className="flex items-center gap-4 flex-1">
                    <div className={cn("p-2.5 rounded-xl", cfg.color, cfg.textColor)}>
                      <cfg.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{cat}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => togglePin({ type: "protocol", id: p.id })}
                    className={cn("p-2 rounded-lg transition-colors", isPinned({ type: "protocol", id: p.id }) ? "text-amber-500 bg-amber-50" : "text-muted-foreground/30 hover:bg-muted")}
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {searchResults.protocols.length === 0 && searchResults.calculators.length === 0 && (
              <p className="col-span-2 text-center text-sm text-muted-foreground py-8">No results for "{searchTerm}"</p>
            )}
          </div>
        </section>

      ) : selectedCategory ? (
        /* CATEGORY DRILL-DOWN */
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              {selectedConfig && (
                <div className={cn("p-2 rounded-lg", selectedConfig.color, selectedConfig.textColor)}>
                  <selectedConfig.icon className="h-4 w-4" />
                </div>
              )}
              <h3 className="text-xl font-black tracking-tight">{selectedCategory}</h3>
              <span className="text-sm text-muted-foreground font-medium">{categoryProtocols.length} protocols</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/er")} className="text-xs font-bold text-muted-foreground">
              <X className="mr-2 h-3.5 w-3.5" /> Back
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryProtocols.map(p => (
              <div key={p.id} className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
                <Link href={`/diseases/${p.id}`} className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "p-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity",
                    selectedConfig ? cn(selectedConfig.color, selectedConfig.textColor) : "bg-primary/5 text-primary"
                  )}>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">{p.name}</span>
                    {p.erData && (
                      <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">Interactive</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => togglePin({ type: "protocol", id: p.id })}
                  className={cn("p-2 rounded-lg transition-colors", isPinned({ type: "protocol", id: p.id }) ? "text-amber-500 bg-amber-50" : "text-muted-foreground/30 hover:bg-muted")}
                >
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

      ) : (
        <>
          <PinnedWorkspace />

          {/* CATEGORY BROWSER */}
          <section className="space-y-6">
            <SectionHeader title="Browse by Presentation" icon={LayoutGrid} description="Tap a category to see all protocols" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setLocation(`/er?category=${encodeURIComponent(cat.name)}`)}
                  className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 hover:bg-primary/[0.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl transition-all", cat.color, cat.textColor)}>
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm block">{cat.name}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{cat.count} protocols</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-all" />
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
