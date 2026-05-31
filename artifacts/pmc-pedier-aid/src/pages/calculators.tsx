import { useState, useMemo, useEffect } from "react";
import { 
  Calculator, Search, Droplets, Activity, Brain, 
  Baby, Thermometer, FlaskConical, Flame, ArrowRight,
  Info, Wind, Stethoscope, TrendingUp, HeartPulse, ShieldAlert, Ruler,
  Clock, Scissors, Scale, Calendar, Pin, PinOff, Pill, Apple, TrendingDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const PINNED_ITEMS_KEY = "pmc-pinned-items-v2";

type PinnedItem = 
  | { type: "protocol"; id: string }
  | { type: "calculator"; href: string };

// --- Calculator Definitions ---

interface CalcTool {
  id: string;
  name: string;
  description: string;
  category: "Emergency" | "Fluids" | "Renal" | "Endocrine" | "Visual" | "Gastrointestinal" | "Neonatal" | "Growth";
  icon: any;
  href?: string;
  tags: string[];
}

const CATEGORY_METADATA: Record<string, { label: string, icon: any, color: string }> = {
  "Emergency": { label: "Emergency & Critical Care", icon: ShieldAlert, color: "red" },
  "Neonatal": { label: "Neonatal Intensive Care", icon: Baby, color: "blue" },
  "Fluids": { label: "Fluids & Electrolytes", icon: Droplets, color: "sky" },
  "Endocrine": { label: "Endocrine & Diabetes", icon: Flame, color: "orange" },
  "Growth": { label: "Growth & Nutrition", icon: Apple, color: "emerald" },
  "Gastrointestinal": { label: "Gastrointestinal", icon: Activity, color: "amber" },
  "Renal": { label: "Renal & Urology", icon: Activity, color: "indigo" },
  "Visual": { label: "Visual & Radiology Aids", icon: Ruler, color: "slate" },
};

const CALCULATORS: CalcTool[] = [
  {
    id: "resus-dosing",
    name: "Resuscitation Dosing",
    description: "High-precision emergency IV doses with mL volume calculation.",
    category: "Emergency",
    icon: ShieldAlert,
    href: "/calculators/resuscitation-doses",
    tags: ["code", "arrest", "adrenaline", "pals"]
  },
  {
    id: "suspension-dosing",
    name: "Suspension Dosing",
    description: "Calculate oral suspension volumes (mL) based on concentration and weight.",
    category: "Emergency",
    icon: Pill,
    href: "/calculators/suspension-dosing",
    tags: ["dosing", "suspension", "liquid", "oral"]
  },
  {
    id: "drug-tapering",
    name: "Drug Tapering",
    description: "Generate professional weaning schedules for steroids and chronic medications.",
    category: "Emergency",
    icon: TrendingDown,
    href: "/calculators/tapering-calculator",
    tags: ["taper", "weaning", "steroid", "prednisolone"]
  },
  {
    id: "bili",
    name: "Hyperbilirubinemia",
    description: "AAP 2022 Phototherapy & Exchange Transfusion thresholds with interactive chart.",
    category: "Neonatal",
    icon: Baby,
    href: "/calculators/hyperbilirubinemia",
    tags: ["neonatal", "jaundice", "chart"]
  },
  {
    id: "ballard",
    name: "Ballard Score",
    description: "Assess neuromuscular and physical maturity to estimate gestational age.",
    category: "Neonatal",
    icon: Activity,
    href: "/calculators/ballard-score",
    tags: ["neonatal", "maturity", "gestational-age"]
  },
  {
    id: "ga-calc",
    name: "Gestational Age",
    description: "Calculate current gestational and corrected age for premature infants.",
    category: "Neonatal",
    icon: Calendar,
    href: "/calculators/gestational-age",
    tags: ["neonatal", "pregnancy", "corrected-age"]
  },
  {
    id: "nrp-timer",
    name: "NRP Timer & Log",
    description: "Interactive resuscitation timer with APGAR prompts and event logging.",
    category: "Neonatal",
    icon: Clock,
    href: "/calculators/nrp-timer",
    tags: ["neonatal", "resuscitation", "nrp", "code"]
  },
  {
    id: "oi",
    name: "Oxygenation Index (OI)",
    description: "Severity of hypoxemic respiratory failure for iNO/ECMO consideration.",
    category: "Neonatal",
    icon: Wind,
    href: "/calculators/oxygenation-index",
    tags: ["neonatal", "respiratory", "ventilation", "ino"]
  },
  {
    id: "map-calc",
    name: "Mean Airway Pressure",
    description: "Calculate MAP from ventilation parameters (PIP, PEEP, Ti).",
    category: "Neonatal",
    icon: Activity,
    href: "/calculators/map-calculator",
    tags: ["neonatal", "ventilation", "respiratory"]
  },
  {
    id: "ett-depth",
    name: "ETT Depth",
    description: "Estimated endotracheal tube insertion depth by weight or Tuen's rule.",
    category: "Neonatal",
    icon: Ruler,
    href: "/calculators/ett-depth",
    tags: ["neonatal", "intubation", "airway"]
  },
  {
    id: "tpn-calc",
    name: "Neonatal TPN",
    description: "Comprehensive parenteral nutrition with GIR, protein, and lipid titration.",
    category: "Neonatal",
    icon: FlaskConical,
    href: "/calculators/tpn-calculator",
    tags: ["neonatal", "nutrition", "tpn", "fluids"]
  },
  {
    id: "weight-loss",
    name: "Birth Weight Loss %",
    description: "Track percentage weight change from birth to guide nutritional support.",
    category: "Neonatal",
    icon: Scale,
    href: "/calculators/weight-loss",
    tags: ["neonatal", "nutrition", "weight"]
  },
  {
    id: "fenton",
    name: "Fenton Growth Charts",
    description: "Growth monitoring for preterm infants (Weight, Length, HC).",
    category: "Growth",
    icon: TrendingUp,
    href: "/calculators/fenton-charts",
    tags: ["neonatal", "growth", "preterm"]
  },
  {
    id: "uac-uvc",
    name: "UAC/UVC Length",
    description: "Umbilical catheter insertion depth based on body weight or length.",
    category: "Neonatal",
    icon: Scissors,
    href: "/calculators/uac-uvc-length",
    tags: ["neonatal", "procedure", "catheter"]
  },
  {
    id: "eos-risk",
    name: "EOS Risk Calculator",
    description: "Kaiser Permanente Early-Onset Sepsis risk assessment.",
    category: "Neonatal",
    icon: ShieldAlert,
    href: "/calculators/eos-risk",
    tags: ["neonatal", "sepsis", "infection"]
  },
  {
    id: "child-pugh",
    name: "Child-Pugh Score",
    description: "Assess the severity and prognosis of chronic liver disease.",
    category: "Gastrointestinal",
    icon: Stethoscope,
    href: "/calculators/child-pugh",
    tags: ["liver", "cirrhosis", "hepatic"]
  },
  {
    id: "gfr",
    name: "GFR (Bedside Schwartz)",
    description: "Estimated GFR based on height and creatinine for children and adolescents.",
    category: "Renal",
    icon: Activity,
    href: "/calculators/gfr",
    tags: ["renal", "creatinine", "kidney"]
  },
  {
    id: "fluids",
    name: "Advanced Dehydration Engine",
    description: "Multi-phase management for iso/hypo/hypernatremic dehydration.",
    category: "Fluids",
    icon: Droplets,
    href: "/calculators/advanced-fluids",
    tags: ["bolus", "iv", "dehydration", "sodium", "electrolyte"]
  },
  {
    id: "parkland",
    name: "Parkland (Burn Fluids)",
    description: "Fluid resuscitation volumes for pediatric thermal burns.",
    category: "Emergency",
    icon: Flame,
    href: "/calculators/parkland",
    tags: ["burn", "resuscitation"]
  },
  {
    id: "gcs",
    name: "Glasgow Coma Scale",
    description: "Pediatric-adjusted GCS score with clinical interpretation.",
    category: "Emergency",
    icon: Brain,
    href: "/calculators/gcs",
    tags: ["neuro", "trauma", "consciousness"]
  },
  {
    id: "sod-corr",
    name: "Sodium Correction",
    description: "Correction of sodium levels for hyperglycemia in DKA.",
    category: "Endocrine",
    icon: Thermometer,
    href: "/calculators/sodium-correction",
    tags: ["dka", "diabetes", "sodium"]
  },
  {
    id: "dka-transition",
    name: "DKA Insulin Transition",
    description: "Physiological Basal-Bolus transition roadmap from IV to Subcutaneous insulin.",
    category: "Endocrine",
    icon: Activity,
    href: "/calculators/dka-transition",
    tags: ["dka", "diabetes", "insulin", "transition"]
  },
  {
    id: "anion-gap",
    name: "Anion Gap",
    description: "Serum anion gap calculator with albumin adjustment.",
    category: "Fluids",
    icon: Activity,
    href: "/calculators/anion-gap",
    tags: ["acid-base", "electrolytes", "gap"]
  },
  {
    id: "abg",
    name: "ABG Interpreter",
    description: "Blood gas analysis with compensation check and primary findings.",
    category: "Emergency",
    icon: Wind,
    href: "/calculators/abg-interpreter",
    tags: ["acid-base", "respiratory", "blood-gas"]
  },
  {
    id: "kocher",
    name: "Kocher Criteria",
    description: "Differentiate septic arthritis from transient synovitis.",
    category: "Emergency",
    icon: Stethoscope,
    href: "/calculators/kocher-criteria",
    tags: ["ortho", "limping", "joint"]
  },
  {
    id: "apgar",
    name: "APGAR Score",
    description: "Standardized neonatal assessment tool for 1 & 5 minutes.",
    category: "Neonatal",
    icon: Baby,
    href: "/calculators/apgar",
    tags: ["neonate", "newborn", "delivery"]
  },
  {
    id: "bsa",
    name: "Body Surface Area",
    description: "Mosteller formula for precise clinical calculations.",
    category: "Visual",
    icon: Ruler,
    href: "/calculators/bsa",
    tags: ["surface", "area", "drug-dose"]
  },
  {
    id: "qtc",
    name: "Corrected QT (QTc)",
    description: "Bazett formula with visual ECG measurement guide.",
    category: "Visual",
    icon: Activity,
    href: "/calculators/qtc",
    tags: ["ecg", "cardiology", "torsades"]
  },
  {
    id: "ca-corr",
    name: "Calcium Correction",
    description: "Adjusted total calcium for hypoalbuminemia.",
    category: "Fluids",
    icon: FlaskConical,
    href: "/calculators/calcium-correction",
    tags: ["electrolytes", "albumin", "calcium"]
  },
  {
    id: "growth",
    name: "WHO Growth Charts",
    description: "Interactive Weight/Height charts for children 0-5 years.",
    category: "Visual",
    icon: TrendingUp,
    href: "/calculators/growth-charts",
    tags: ["growth", "who", "percentile"]
  },
  {
    id: "bp",
    name: "BP Percentiles",
    description: "Screen for pediatric hypertension by age and sex.",
    category: "Visual",
    icon: TrendingUp,
    href: "/calculators/bp-percentiles",
    tags: ["cardiology", "hypertension", "bp"]
  },
  {
    id: "nutritional-recovery",
    name: "Nutritional Recovery",
    description: "Exhaustive catch-up growth roadmap with Waterlow calculations and food matrix.",
    category: "Growth",
    icon: Apple,
    href: "/calculators/nutritional-recovery",
    tags: ["nutrition", "growth", "faltering", "calories"]
  }
];

export default function CalculatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PINNED_ITEMS_KEY);
      if (raw) setPinnedItems(JSON.parse(raw));
    } catch {
      setPinnedItems([]);
    }
  }, []);

  const togglePin = (href: string) => {
    const item: PinnedItem = { type: "calculator", href };
    setPinnedItems((prev) => {
      const isPinned = prev.some(p => p.type === "calculator" && p.href === href);
      const next = isPinned 
        ? prev.filter(p => !(p.type === "calculator" && p.href === href))
        : [item, ...prev];
      localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isPinned = (href: string) => {
    return pinnedItems.some(p => p.type === "calculator" && p.href === href);
  };

  const pinnedTools = useMemo(() => {
    return CALCULATORS.filter(calc => calc.href && isPinned(calc.href));
  }, [pinnedItems]);

  const filteredCalculators = useMemo(() => {
    return CALCULATORS.filter(calc => {
      const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          calc.tags.some(t => t.includes(searchQuery.toLowerCase()));
      const matchesTab = activeTab === "all" || calc.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const groupedCalculators = useMemo(() => {
    const groups: Record<string, CalcTool[]> = {};
    filteredCalculators.forEach(calc => {
      if (!groups[calc.category]) groups[calc.category] = [];
      groups[calc.category].push(calc);
    });
    return groups;
  }, [filteredCalculators]);

  // Order categories for display
  const categoryOrder: CalcTool["category"][] = [
    "Emergency", "Neonatal", "Fluids", "Endocrine", "Growth", "Gastrointestinal", "Renal", "Visual"
  ];

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-10">
      
      {/* 1. Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter mb-1">PediCalc Engine</h1>
          <p className="text-muted-foreground text-sm font-medium">Validated clinical calculators and professional decision tools.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
          <Input 
            placeholder="Search by name or clinical tag..." 
            className="pl-11 h-12 rounded-2xl bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 shadow-none transition-all text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Pinned Section (Only on 'all' or if searched) */}
      {pinnedTools.length > 0 && activeTab === "all" && !searchQuery && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 shadow-sm">
              <Pin className="h-4 w-4 fill-current" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Your Workspace</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedTools.map((calc) => (
              <CalculatorCard 
                key={`pinned-${calc.id}`} 
                tool={calc} 
                isPinned={true}
                onTogglePin={() => togglePin(calc.href!)}
              />
            ))}
          </div>
          <div className="border-b border-dashed pt-4" />
        </section>
      )}

      {/* 3. Category Tabs */}
      <div className="space-y-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="w-full overflow-x-auto scrollbar-hide pb-2">
            <TabsList className="bg-muted/30 p-1.5 flex w-max min-w-full flex-nowrap justify-start gap-1 h-auto rounded-[20px] border border-muted-foreground/5">
              <TabsTrigger value="all" className="rounded-[14px] font-black text-[10px] uppercase tracking-widest px-5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md">
                All Systems
              </TabsTrigger>
              {categoryOrder.map(cat => {
                const meta = CATEGORY_METADATA[cat];
                const Icon = meta.icon;
                return (
                  <TabsTrigger 
                    key={cat} 
                    value={cat} 
                    className="rounded-[14px] font-black text-[10px] uppercase tracking-widest px-5 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md group"
                  >
                    <Icon className={cn("h-3.5 w-3.5 opacity-50 group-data-[state=active]:opacity-100", 
                      meta.color === 'red' ? "text-red-500" :
                      meta.color === 'blue' ? "text-blue-500" :
                      meta.color === 'sky' ? "text-sky-500" :
                      meta.color === 'orange' ? "text-orange-500" :
                      meta.color === 'emerald' ? "text-emerald-500" :
                      meta.color === 'amber' ? "text-amber-500" :
                      meta.color === 'indigo' ? "text-indigo-500" : "text-slate-500"
                    )} />
                    {cat}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* 4. Grouped Result View */}
          <div className="pt-6">
            {filteredCalculators.length > 0 ? (
              <div className="space-y-12">
                {categoryOrder.map(cat => {
                  const tools = groupedCalculators[cat];
                  if (!tools || tools.length === 0) return null;
                  const meta = CATEGORY_METADATA[cat];
                  const Icon = meta.icon;

                  return (
                    <div key={cat} className="space-y-6 animate-in fade-in duration-500">
                      {activeTab === "all" && (
                        <div className="flex items-center gap-3 px-2">
                          <div className={cn("p-2 rounded-xl text-white shadow-lg", 
                            meta.color === 'red' ? "bg-red-600 shadow-red-200" :
                            meta.color === 'blue' ? "bg-blue-600 shadow-blue-200" :
                            meta.color === 'sky' ? "bg-sky-500 shadow-sky-200" :
                            meta.color === 'orange' ? "bg-orange-500 shadow-orange-200" :
                            meta.color === 'emerald' ? "bg-emerald-600 shadow-emerald-200" :
                            meta.color === 'amber' ? "bg-amber-500 shadow-amber-200" :
                            meta.color === 'indigo' ? "bg-indigo-600 shadow-indigo-200" : "bg-slate-600 shadow-slate-200"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black tracking-tight">{meta.label}</h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tools.length} Tools available</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tools.map((calc) => (
                          <CalculatorCard 
                            key={calc.id} 
                            tool={calc} 
                            isPinned={calc.href ? isPinned(calc.href) : false}
                            onTogglePin={calc.href ? () => togglePin(calc.href!) : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center border-4 border-dashed rounded-[48px] bg-muted/20">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground/10" />
                <h3 className="text-2xl font-black text-muted-foreground/40 tracking-tight">No clinical tools found</h3>
                <p className="text-sm text-muted-foreground/30 mt-1">Try searching for a different system or tag</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function CalculatorCard({ tool, isPinned, onTogglePin }: { tool: CalcTool, isPinned: boolean, onTogglePin?: () => void }) {
  const Icon = tool.icon;
  const meta = CATEGORY_METADATA[tool.category];
  
  return (
    <Card className="group relative h-full transition-all border-2 rounded-[32px] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 bg-card overflow-hidden">
      <CardHeader className="pb-4 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-3 rounded-2xl transition-all duration-300",
            "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-[0.15em] bg-muted/50 border-none px-2.5">
              {tool.category}
            </Badge>
            {onTogglePin && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  isPinned ? "bg-amber-50 text-amber-500 shadow-sm" : "bg-muted/30 text-muted-foreground/30 hover:bg-muted"
                )}
              >
                {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
        <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight mb-2">{tool.name}</CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed text-[13px] font-medium text-muted-foreground/80">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        <Link href={tool.href || "#"} className="flex items-center justify-between w-full p-3 rounded-2xl bg-muted/30 hover:bg-primary/[0.03] transition-all group/link border border-transparent hover:border-primary/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Launch Tool</span>
          <ArrowRight className="h-4 w-4 text-primary group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
