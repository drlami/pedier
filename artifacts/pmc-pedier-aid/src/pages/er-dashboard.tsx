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
  X,
  Wind,
  Thermometer,
  FlaskConical,
  Skull,
  Shield,
  Droplets,
  Activity,
  Zap,
  Baby,
  Bone,
  Ear,
  Brain,
  Scissors,
  Fingerprint,
  Users,
} from "lucide-react";
import { useAllProtocols } from "@/contexts/protocols-context";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { PinnedWorkspace } from "@/components/pinned-workspace";
import { CALCULATOR_SHORTCUTS } from "@/lib/clinical-dashboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── PALS Algorithms (hardcoded — pre-diagnosis resuscitation frameworks) ──────
const PALS_ACTIVE: Array<{ label: string; desc: string; href: string }> = [
  { label: 'Systematic Approach',  desc: 'PAT · ABCDE · Evaluate-Identify-Intervene',             href: '/diseases/pals-systematic-approach'  },
  { label: 'Hypovolemic Shock',    desc: 'Most common · fluid resuscitation · 20 mL/kg bolus',     href: '/diseases/pals-hypovolemic-shock'    },
  { label: 'Cardiogenic Shock',    desc: 'Pulmonary oedema · milrinone · cautious 5–10 mL/kg',     href: '/diseases/pals-cardiogenic-shock'    },
  { label: 'Shock Framework',      desc: 'Recognition & first-hour management',                    href: '/diseases/shock-management'          },
  { label: 'Septic Shock',         desc: 'First-hour bundle · ACCM guidelines',                    href: '/diseases/septic-shock'              },
  { label: 'Anaphylaxis',          desc: 'Epinephrine · airway · fluid resuscitation',             href: '/diseases/anaphylactic-shock'        },
  { label: 'Bradycardia',          desc: 'HR <60 with cardiopulmonary compromise',                 href: '/diseases/bradycardia'               },
  { label: 'Tachycardia / SVT',    desc: 'Adenosine · cardioversion · VT approach',               href: '/diseases/tachycardia-svt'           },
];

const PALS_SOON = [
  'Respiratory Failure',
] as const;

// ─── PALS protocol IDs — shown in strip above, excluded from category browser ─
const PALS_STRIP_IDS = new Set([
  'pals-systematic-approach',
  'pals-hypovolemic-shock',
  'pals-cardiogenic-shock',
  'shock-management',
  'septic-shock',
  'anaphylactic-shock',
  'bradycardia',
  'tachycardia-svt',
]);

// ─── Category mapping (one home per topic — entry point = chief complaint) ────
const ER_CATEGORY_MAP: Record<string, string> = {
  // Breathing Difficulty
  asthma:                                   'Breathing Difficulty',
  bronchiolitis:                            'Breathing Difficulty',
  croup:                                    'Breathing Difficulty',
  pneumonia:                                'Breathing Difficulty',
  epiglottitis:                             'Breathing Difficulty',
  fba:                                      'Breathing Difficulty',
  tracheitis:                               'Breathing Difficulty',
  cyanosis:                                 'Breathing Difficulty',
  apnea:                                    'Breathing Difficulty',

  // The Febrile Child
  'fever-neonate':                          'The Febrile Child',
  'fever-1-2-months':                       'The Febrile Child',
  'fever-2-3-months':                       'The Febrile Child',
  'Fever Without Source (3–36 months)': 'The Febrile Child',
  'fever-without-source':                   'The Febrile Child',
  'fever-neutropenia':                      'The Febrile Child',
  'fever-rash':                             'The Febrile Child',
  'meningitis-encephalitis':                'The Febrile Child',
  'cervical-lymphadenitis':                 'The Febrile Child',
  'viral-vs-bacterial':                     'The Febrile Child',

  // Crying and the Unwell Infant
  'neonatal-jaundice':                      'Crying and the Unwell Infant',
  'neonatal-sepsis':                        'Crying and the Unwell Infant',

  // Seizure and Altered Consciousness
  'acute-seizure':                          'Seizure and Altered Consciousness',
  'febrile-seizure':                        'Seizure and Altered Consciousness',
  'first-afebrile-seizure':                 'Seizure and Altered Consciousness',
  'altered-mental-status':                  'Seizure and Altered Consciousness',

  // Headache and Neurology
  'headache-red-flags':                     'Headache and Neurology',
  'raised-icp-suspicion':                   'Headache and Neurology',
  'peds-stroke':                            'Headache and Neurology',
  'acute-flaccid-weakness':                 'Headache and Neurology',
  'acute-ataxia':                           'Headache and Neurology',
  'vp-shunt-malfunction':                   'Headache and Neurology',

  // Gastrointestinal and Surgical Emergencies
  'abdominal-pain':                         'Gastrointestinal and Surgical Emergencies',
  'bilious-vomiting':                       'Gastrointestinal and Surgical Emergencies',
  'abdominal-distention-constipation':      'Gastrointestinal and Surgical Emergencies',
  'gi-bleeding':                            'Gastrointestinal and Surgical Emergencies',
  'persistent-vomiting':                    'Gastrointestinal and Surgical Emergencies',
  'dehydration-gastroenteritis':            'Gastrointestinal and Surgical Emergencies',
  'constipation-vs-obstruction':            'Gastrointestinal and Surgical Emergencies',
  intussusception:                          'Gastrointestinal and Surgical Emergencies',

  // Rash and Skin
  ssti:                                     'Rash and Skin',

  // ENT and Eye
  mastoiditis:                              'ENT and Eye',
  'orbital-cellulitis':                     'ENT and Eye',
  'periorbital-cellulitis':                 'ENT and Eye',
  'otitis-media':                           'ENT and Eye',

  // Urinary and Renal
  'urinary-tract-infection':                'Urinary and Renal',
  'acute-renal-failure':                    'Urinary and Renal',
  'nephrotic-syndrome':                     'Urinary and Renal',
  'nephritic-syndrome':                     'Urinary and Renal',

  // Cardiac Presentations
  'heart-failure-myocarditis':              'Cardiac Presentations',
  'chest-pain-in-children':                 'Cardiac Presentations',
  syncope:                                  'Cardiac Presentations',
  palpitations:                             'Cardiac Presentations',
  'murmur-with-symptoms':                   'Cardiac Presentations',

  // Metabolic, Endocrine and Electrolyte
  'metabolic-crisis':                       'Metabolic, Endocrine and Electrolyte',
  dka:                                      'Metabolic, Endocrine and Electrolyte',
  hypoglycemia:                             'Metabolic, Endocrine and Electrolyte',
  'adrenal-crisis':                         'Metabolic, Endocrine and Electrolyte',
  hyperkalemia:                             'Metabolic, Endocrine and Electrolyte',
  hypokalemia:                              'Metabolic, Endocrine and Electrolyte',
  hypomagnesemia:                           'Metabolic, Endocrine and Electrolyte',
  hypernatremia:                            'Metabolic, Endocrine and Electrolyte',
  hyponatremia:                             'Metabolic, Endocrine and Electrolyte',
  hypercalcemia:                            'Metabolic, Endocrine and Electrolyte',
  hypocalcemia:                             'Metabolic, Endocrine and Electrolyte',

  // Poisoning and Envenomation
  'paracetamol-toxicity':                   'Poisoning and Envenomation',
  'iron-toxicity':                          'Poisoning and Envenomation',
  'organophosphorus-ingestion':             'Poisoning and Envenomation',
  'co-poisoning':                           'Poisoning and Envenomation',
  'chlorine-inhalation':                    'Poisoning and Envenomation',
  'snake-bite':                             'Poisoning and Envenomation',
  'scorpion-sting':                         'Poisoning and Envenomation',
  'toxic-assessment':                       'Poisoning and Envenomation',

  // Trauma
  'head-trauma':                            'Trauma',
  'smoke-inhalation-burns':                 'Trauma',
};

// ─── Coming soon per category ─────────────────────────────────────────────────
const ER_COMING_SOON_MAP: Record<string, string[]> = {
  'Breathing Difficulty':               ['Stridor — Approach', 'Pneumothorax'],
  'The Febrile Child':                  [],
  'Crying and the Unwell Infant':       ['Inconsolable Crying — Approach', 'Neonatal Seizure', 'Bilious Vomiting in the Newborn', 'Poor Feeding / Failure to Thrive'],
  'Seizure and Altered Consciousness':  ['Breath-Holding Spells'],
  'Headache and Neurology':             ['Neck Stiffness — Approach'],
  'Gastrointestinal and Surgical Emergencies': ['Appendicitis', 'Ovarian Torsion', 'Incarcerated Hernia', 'Malrotation / Volvulus', 'Pancreatitis', 'Mesenteric Lymphadenitis', 'Bloody Vomitus / Haematemesis'],
  'Rash and Skin':                      ['Rash Without Fever — Approach', 'Stevens-Johnson Syndrome / TEN', 'Urticaria / Angioedema', 'Purpura / Petechiae — Approach'],
  'Musculoskeletal':                    ['Limp — Approach', 'Acute Joint Pain / Septic Arthritis', 'Back Pain — Approach', 'Osteomyelitis', 'Transient Synovitis vs Septic Arthritis'],
  'ENT and Eye':                        ['Peritonsillar Abscess', 'Foreign Body — Ear / Nose', 'Acute Sinusitis', 'Sore Throat / Tonsillitis', 'Epistaxis', 'Red Eye — Approach'],
  'Urinary and Renal':                  ['Testicular Torsion / Acute Scrotum', 'Haematuria — Approach', 'Proteinuria — Approach'],
  'Cardiac Presentations':              ['Pericarditis / Pericardial Effusion', 'Hypertensive Emergency'],
  'Metabolic, Endocrine and Electrolyte': ['Thyroid Storm / Thyrotoxicosis', 'Congenital Adrenal Hyperplasia — Salt-Wasting', 'Hyperglycaemic Hyperosmolar State', 'Diabetes Insipidus'],
  'Poisoning and Envenomation':         ['General Approach to Poisoning', 'Button Battery Ingestion', 'Caustic Ingestion', 'Salicylate Toxicity'],
  'Trauma':                             ['Major Trauma Approach', 'Abdominal Trauma', 'Drowning / Near-Drowning', 'Chest Trauma'],
  'Behavioral Health and Safeguarding': ['Deliberate Self-Harm', 'Deliberate Ingestion / Overdose', 'Acute Anxiety / Panic Attack', 'Acute Psychiatric Emergency', 'Non-Accidental Injury', 'Child Neglect Recognition'],
};

// ─── Category display config ──────────────────────────────────────────────────
type CategoryConfig = {
  icon: React.ElementType;
  color: string;
  textColor: string;
};

const CATEGORY_ORDER = [
  'Breathing Difficulty',
  'The Febrile Child',
  'Crying and the Unwell Infant',
  'Seizure and Altered Consciousness',
  'Headache and Neurology',
  'Gastrointestinal and Surgical Emergencies',
  'Rash and Skin',
  'Musculoskeletal',
  'ENT and Eye',
  'Urinary and Renal',
  'Cardiac Presentations',
  'Metabolic, Endocrine and Electrolyte',
  'Poisoning and Envenomation',
  'Trauma',
  'Behavioral Health and Safeguarding',
  'Other',
];

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  'Breathing Difficulty':                { icon: Wind,        color: 'bg-sky-50',     textColor: 'text-sky-600'      },
  'The Febrile Child':                   { icon: Thermometer, color: 'bg-orange-50',  textColor: 'text-orange-600'   },
  'Crying and the Unwell Infant':        { icon: Baby,        color: 'bg-blue-50',    textColor: 'text-blue-600'     },
  'Seizure and Altered Consciousness':   { icon: Zap,         color: 'bg-violet-50',  textColor: 'text-violet-600'   },
  'Headache and Neurology':              { icon: Brain,       color: 'bg-purple-50',  textColor: 'text-purple-600'   },
  'Gastrointestinal and Surgical Emergencies': { icon: Scissors, color: 'bg-emerald-50', textColor: 'text-emerald-600' },
  'Rash and Skin':                       { icon: Fingerprint, color: 'bg-pink-50',    textColor: 'text-pink-600'     },
  'Musculoskeletal':                     { icon: Bone,        color: 'bg-amber-50',   textColor: 'text-amber-700'    },
  'ENT and Eye':                         { icon: Ear,         color: 'bg-indigo-50',  textColor: 'text-indigo-600'   },
  'Urinary and Renal':                   { icon: Droplets,    color: 'bg-cyan-50',    textColor: 'text-cyan-600'     },
  'Cardiac Presentations':               { icon: HeartPulse,  color: 'bg-rose-50',    textColor: 'text-rose-600'     },
  'Metabolic, Endocrine and Electrolyte':{ icon: FlaskConical,color: 'bg-teal-50',    textColor: 'text-teal-600'     },
  'Poisoning and Envenomation':          { icon: Skull,       color: 'bg-yellow-50',  textColor: 'text-yellow-700'   },
  'Trauma':                              { icon: Shield,      color: 'bg-slate-100',  textColor: 'text-slate-600'    },
  'Behavioral Health and Safeguarding':  { icon: Users,       color: 'bg-fuchsia-50', textColor: 'text-fuchsia-600'  },
  'Other':                               { icon: BookOpen,    color: 'bg-muted',      textColor: 'text-muted-foreground' },
};

function getCategory(p: DiseaseProtocol): string {
  return ER_CATEGORY_MAP[p.id] ?? 'Other';
}

function SectionHeader({ title, icon: Icon, description }: { title: string; icon?: React.ElementType; description?: string }) {
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

  const erProtocols = useMemo(
    () => allProtocols.filter(p =>
      !PALS_STRIP_IDS.has(p.id) &&
      (p.unit === 'er' || (p.unit == null && ER_CATEGORY_MAP[p.id] !== undefined))
    ),
    [allProtocols]
  );

  const selectedCategory = useMemo(() => {
    const params = new URLSearchParams(routeSearch);
    return params.get("category") || "";
  }, [routeSearch]);

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return { protocols: [], calculators: [] };
    return {
      protocols: erProtocols
        .filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.system.toLowerCase().includes(q) ||
          (ER_CATEGORY_MAP[p.id] ?? '').toLowerCase().includes(q)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
      calculators: CALCULATOR_SHORTCUTS.filter(c =>
        c.label.toLowerCase().includes(q)
      ),
    };
  }, [searchTerm, erProtocols]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of erProtocols) {
      const cat = getCategory(p);
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return CATEGORY_ORDER
      .filter(cat => (counts[cat] ?? 0) > 0 || (ER_COMING_SOON_MAP[cat]?.length ?? 0) > 0)
      .map(cat => ({
        name: cat,
        count: counts[cat] ?? 0,
        comingSoon: ER_COMING_SOON_MAP[cat]?.length ?? 0,
        ...CATEGORY_CONFIG[cat],
      }));
  }, [erProtocols]);

  const categoryProtocols = useMemo(() => {
    if (!selectedCategory) return [];
    return erProtocols
      .filter(p => getCategory(p) === selectedCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, erProtocols]);

  const selectedConfig = selectedCategory
    ? (CATEGORY_CONFIG[selectedCategory] ?? CATEGORY_CONFIG['Other'])
    : null;

  const categoryComingSoon = selectedCategory
    ? (ER_COMING_SOON_MAP[selectedCategory] ?? [])
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 px-2 sm:px-4">

      {/* ── HERO ── */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Link
          href="/cardiac-arrest"
          className="md:col-span-5 group relative overflow-hidden rounded-[32px] bg-red-600 p-6 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
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
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {searchTerm.trim() ? (
        /* ── SEARCH RESULTS ── */
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Search Results</h3>
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs font-bold underline">
              Clear Search
            </Button>
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
        /* ── CATEGORY DRILL-DOWN ── */
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

          {/* Active protocols */}
          {categoryProtocols.length > 0 && (
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
          )}

          {/* Coming soon tiles */}
          {categoryComingSoon.length > 0 && (
            <div className="space-y-2">
              {categoryProtocols.length > 0 && (
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Coming Soon</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoryComingSoon.map(label => (
                  <div
                    key={label}
                    className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-200 cursor-not-allowed"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-[11px] text-slate-400 block truncate">{label}</span>
                      <span className="text-[9px] text-slate-300 font-black uppercase tracking-wide">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      ) : (
        <>
          {/* ── PALS ALGORITHMS ── */}
          <section className="space-y-4">
            <SectionHeader
              title="PALS Algorithms"
              icon={Zap}
              description="Pre-diagnosis resuscitation frameworks for the critically ill child"
            />
            <div className="rounded-3xl border border-red-100 bg-red-50/20 p-4 space-y-3">

              {/* Active algorithms grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {PALS_ACTIVE.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-red-100 hover:border-red-300 hover:shadow-sm transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0 group-hover:bg-red-200 transition-colors">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm block text-slate-900 truncate">{item.label}</span>
                      <span className="text-[10px] text-slate-500 font-medium line-clamp-1">{item.desc}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-300 shrink-0 group-hover:text-red-600 transition-colors" />
                  </Link>
                ))}
              </div>

              {/* Coming soon — compact muted row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {PALS_SOON.map(label => (
                  <div
                    key={label}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-200 cursor-not-allowed"
                  >
                    <Zap className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-[11px] text-slate-400 block truncate">{label}</span>
                      <span className="text-[9px] text-slate-300 font-black uppercase tracking-wide">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          <PinnedWorkspace />

          {/* ── CATEGORY BROWSER ── */}
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
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {cat.count > 0 ? `${cat.count} protocol${cat.count !== 1 ? 's' : ''}` : ''}
                        {cat.count > 0 && cat.comingSoon > 0 ? ' · ' : ''}
                        {cat.comingSoon > 0 ? `${cat.comingSoon} coming soon` : ''}
                        {cat.count === 0 && cat.comingSoon === 0 ? 'Coming soon' : ''}
                      </span>
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
