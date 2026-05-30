import { useState, useMemo } from "react";
import { 
  Calculator, Search, Droplets, Activity, Brain, 
  Baby, Thermometer, FlaskConical, Flame, ArrowRight,
  Info, AlertCircle, Wind, Stethoscope, TrendingUp, HeartPulse, ShieldAlert, Ruler,
  Clock, Syringe, Calendar, Zap, Scale, Scissors
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// --- Calculator Definitions ---

interface CalcTool {
  id: string;
  name: string;
  description: string;
  category: "Emergency" | "Fluids" | "Renal" | "Endocrine" | "Visual" | "Gastrointestinal" | "Neonatal";
  icon: any;
  href?: string;
  tags: string[];
}

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
    category: "Neonatal",
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
    icon: HeartPulse,
    href: "/calculators/bp-percentiles",
    tags: ["cardiology", "hypertension", "bp"]
  }
];

export default function CalculatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCalculators = useMemo(() => {
    return CALCULATORS.filter(calc => {
      const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          calc.tags.some(t => t.includes(searchQuery.toLowerCase()));
      const matchesTab = activeTab === "all" || calc.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight mb-1">PediCalc Engine</h1>
          <p className="text-muted-foreground">Validated clinical calculators and visual decision support tools.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search calculators..." 
            className="pl-9 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-8 w-full max-w-full" onValueChange={setActiveTab}>
        <div className="w-full overflow-x-auto scrollbar-hide pb-2">
          <TabsList className="bg-muted/50 p-1 flex w-max min-w-full flex-nowrap md:flex-wrap justify-start md:justify-center h-auto">
            <TabsTrigger value="all" className="shrink-0 active:scale-95 transition-transform">All Tools</TabsTrigger>
            <TabsTrigger value="Emergency" className="shrink-0 active:scale-95 transition-transform">Emergency</TabsTrigger>
            <TabsTrigger value="Fluids" className="shrink-0 active:scale-95 transition-transform">Fluids & Lytes</TabsTrigger>
            <TabsTrigger value="Renal" className="shrink-0 active:scale-95 transition-transform">Renal</TabsTrigger>
            <TabsTrigger value="Visual" className="shrink-0 active:scale-95 transition-transform">Visual Tools</TabsTrigger>
            <TabsTrigger value="Gastrointestinal" className="shrink-0 active:scale-95 transition-transform">Gastrointestinal</TabsTrigger>
            <TabsTrigger value="Neonatal" className="shrink-0 active:scale-95 transition-transform">Neonatal</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCalculators.map((calc) => (
            <CalculatorCard key={calc.id} tool={calc} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed rounded-2xl">
          <Calculator className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
          <h3 className="text-lg font-semibold">No calculators found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
        <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-primary">About PediCalc Data</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            All formulas are derived from standard medical sources (AAP, PALS, Harriet Lane). 
            Results are for clinical decision support only and must be verified against institutional protocols.
          </p>
        </div>
      </div>
    </div>
  );
}

function CalculatorCard({ tool }: { tool: CalcTool }) {
  const Icon = tool.icon;
  
  const content = (
    <Card className="h-full active:scale-[0.98] transition-all border-2 hover:border-primary/50 group cursor-pointer overflow-hidden shadow-sm hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className={cn(
            "p-2.5 rounded-xl transition-colors",
            "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-wider">
            {tool.category}
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{tool.name}</CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed text-xs">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm font-bold text-primary">
          <span className="group-hover:translate-x-1 transition-transform flex items-center">
            Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (tool.href) {
    return <Link href={tool.href}>{content}</Link>;
  }

  return (
    <div onClick={() => alert(`${tool.name} calculator coming soon!`)}>
      {content}
    </div>
  );
}
