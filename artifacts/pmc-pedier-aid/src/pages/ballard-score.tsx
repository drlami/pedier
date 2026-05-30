import { useState, useMemo } from "react";
import { 
  Baby, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Activity, Ruler
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Criterion {
  name: string;
  icon: any;
  howTo: string;
  image: string;
  values: {
    score: number;
    desc: string;
  }[];
}

const NEUROMUSCULAR_CRITERIA: Criterion[] = [
  { 
    name: "Posture", 
    icon: Baby,
    howTo: "Observe infant quiet and supine. Score based on degree of flexion of arms and legs.",
    image: "https://placehold.co/400x300/indigo/white?text=Posture+Diagram",
    values: [
      { score: -1, desc: "Limp, flaccid" },
      { score: 0, desc: "Arms/legs extended" },
      { score: 1, desc: "Slight flexion of hips/knees" },
      { score: 2, desc: "Moderate flexion" },
      { score: 3, desc: "Arms flexed, legs flexed" },
      { score: 4, desc: "Full flexion (all four)" }
    ] 
  },
  { 
    name: "Square Window", 
    icon: Ruler,
    howTo: "Flex hand on forearm between thumb and index finger. Measure angle between hypothenar eminence and ventral forearm.",
    image: "https://placehold.co/400x300/indigo/white?text=Square+Window+Diagram",
    values: [
      { score: -1, desc: "> 90° angle" },
      { score: 0, desc: "90° angle" },
      { score: 1, desc: "60° angle" },
      { score: 2, desc: "45° angle" },
      { score: 3, desc: "30° angle" },
      { score: 4, desc: "0° angle" }
    ] 
  },
  { 
    name: "Arm Recoil", 
    icon: Activity,
    howTo: "Flex forearms for 5 seconds, then fully extend by pulling on hands and release. Measure angle of recoil.",
    image: "https://placehold.co/400x300/indigo/white?text=Arm+Recoil+Diagram",
    values: [
      { score: 0, desc: "No recoil (180°)" },
      { score: 1, desc: "Slight recoil (140-180°)" },
      { score: 2, desc: "Moderate recoil (110-140°)" },
      { score: 3, desc: "Good recoil (90-110°)" },
      { score: 4, desc: "Full recoil (< 90°)" }
    ] 
  },
  { 
    name: "Popliteal Angle", 
    icon: Ruler,
    howTo: "With hips on bed, flex leg on thigh then thigh on abdomen. Extend leg until resistance is felt.",
    image: "https://placehold.co/400x300/indigo/white?text=Popliteal+Angle+Diagram",
    values: [
      { score: -1, desc: "180° angle" },
      { score: 0, desc: "160° angle" },
      { score: 1, desc: "140° angle" },
      { score: 2, desc: "120° angle" },
      { score: 3, desc: "100° angle" },
      { score: 4, desc: "90° angle" },
      { score: 5, desc: "< 90° angle" }
    ] 
  },
  { 
    name: "Scarf Sign", 
    icon: Activity,
    howTo: "Pull infant's hand across chest towards opposite shoulder until resistance. Observe position of elbow.",
    image: "https://placehold.co/400x300/indigo/white?text=Scarf+Sign+Diagram",
    values: [
      { score: -1, desc: "Crosses opposite axillary line" },
      { score: 0, desc: "Crosses opposite shoulder line" },
      { score: 1, desc: "Crosses midline" },
      { score: 2, desc: "Reaches midline" },
      { score: 3, desc: "Does not reach midline" },
      { score: 4, desc: "Does not reach nipple line" }
    ] 
  },
  { 
    name: "Heel to Ear", 
    icon: Baby,
    howTo: "Pull foot as near to head as possible without forcing it. Keep pelvis flat on bed.",
    image: "https://placehold.co/400x300/indigo/white?text=Heel+to+Ear+Diagram",
    values: [
      { score: -1, desc: "Ear level, no resistance" },
      { score: 0, desc: "Face level" },
      { score: 1, desc: "Neck level" },
      { score: 2, desc: "Upper chest level" },
      { score: 3, desc: "Mid chest level" },
      { score: 4, desc: "Leg flexed, far from head" }
    ] 
  }
];

const PHYSICAL_CRITERIA: Criterion[] = [
  { 
    name: "Skin", 
    icon: Info,
    howTo: "Inspect skin for transparency, peeling, and thickness.",
    image: "https://placehold.co/400x300/indigo/white?text=Skin+Maturity+Diagram",
    values: [
      { score: -1, desc: "Sticky, friable, transparent" },
      { score: 0, desc: "Gelatinous, red, translucent" },
      { score: 1, desc: "Smooth, pink; visible veins" },
      { score: 2, desc: "Superficial peeling/rash; few veins" },
      { score: 3, desc: "Cracking, pale areas; rare veins" },
      { score: 4, desc: "Parchment; deep cracking; no vessels" },
      { score: 5, desc: "Leathery, cracked, wrinkled" }
    ] 
  },
  { 
    name: "Lanugo", 
    icon: Info,
    howTo: "Examine back and shoulders for fine hair.",
    image: "https://placehold.co/400x300/indigo/white?text=Lanugo+Diagram",
    values: [
      { score: -1, desc: "None" },
      { score: 0, desc: "Sparse" },
      { score: 1, desc: "Abundant" },
      { score: 2, desc: "Thinning" },
      { score: 3, desc: "Bald areas" },
      { score: 4, desc: "Mostly bald" }
    ] 
  },
  { 
    name: "Plantar Surface", 
    icon: Ruler,
    howTo: "Measure length from heel to toe or observe creases on sole.",
    image: "https://placehold.co/400x300/indigo/white?text=Plantar+Surface+Diagram",
    values: [
      { score: -1, desc: "Heel-toe 40-50mm" },
      { score: 0, desc: "> 50mm, no crease" },
      { score: 1, desc: "Faint red marks" },
      { score: 2, desc: "Anterior transverse crease only" },
      { score: 3, desc: "Creases anterior 2/3" },
      { score: 4, desc: "Creases over entire sole" }
    ] 
  },
  { 
    name: "Breast", 
    icon: Info,
    howTo: "Palpate breast bud and observe areola.",
    image: "https://placehold.co/400x300/indigo/white?text=Breast+Maturity+Diagram",
    values: [
      { score: -1, desc: "Imperceptible" },
      { score: 0, desc: "Barely perceptible" },
      { score: 1, desc: "Flat areola, no bud" },
      { score: 2, desc: "Stippled areola, 1-2mm bud" },
      { score: 3, desc: "Raised areola, 3-4mm bud" },
      { score: 4, desc: "Full areola, 5-10mm bud" }
    ] 
  },
  { 
    name: "Eye/Ear", 
    icon: Info,
    howTo: "Check if eyelids are fused and assess cartilage/recoil of pinna.",
    image: "https://placehold.co/400x300/indigo/white?text=Eye+Ear+Diagram",
    values: [
      { score: -1, desc: "Ear flat, stays folded" },
      { score: 0, desc: "Lids open; flat pinna" },
      { score: 1, desc: "Slightly curved pinna; slow recoil" },
      { score: 2, desc: "Well curved pinna; ready recoil" },
      { score: 3, desc: "Formed & firm pinna; instant recoil" },
      { score: 4, desc: "Thick cartilage; ear stiff" }
    ] 
  }
];

const MALE_GENITALS: Criterion = { 
  name: "Genitals (Male)", 
  icon: Info,
  howTo: "Assess testicular descent and rugation of scrotum.",
  image: "https://placehold.co/400x300/indigo/white?text=Male+Genitals+Diagram",
  values: [
    { score: -1, desc: "Scrotum flat, smooth" },
    { score: 0, desc: "Scrotum empty, faint rugae" },
    { score: 1, desc: "Testes in upper canal, rare rugae" },
    { score: 2, desc: "Testes descending, few rugae" },
    { score: 3, desc: "Testes down, good rugae" },
    { score: 4, desc: "Testes pendulous, deep rugae" }
  ] 
};

const FEMALE_GENITALS: Criterion = { 
  name: "Genitals (Female)", 
  icon: Info,
  howTo: "Assess prominence of clitoris and labia.",
  image: "https://placehold.co/400x300/indigo/white?text=Female+Genitals+Diagram",
  values: [
    { score: -1, desc: "Clitoris prominent, labia flat" },
    { score: 0, desc: "Prominent clitoris, small minora" },
    { score: 1, desc: "Prominent clitoris, enlarging minora" },
    { score: 2, desc: "Majora & minora equally prominent" },
    { score: 3, desc: "Majora large, minora small" },
    { score: 4, desc: "Majora cover clitoris & minora" }
  ] 
};

export default function BallardScoreCalc() {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [hovered, setHovered] = useState<{ name: string, score: number, desc: string } | null>(null);

  const totalScore = useMemo(() => {
    const values = Object.values(selections);
    if (values.length === 0) return null;
    return values.reduce((sum, v) => sum + v, 0);
  }, [selections]);

  const gestAge = useMemo(() => {
    if (totalScore === null) return null;
    const mapping: Record<number, string> = {
      [-10]: "20", [-5]: "22", [0]: "24", [5]: "26", [10]: "28",
      [15]: "30", [20]: "32", [25]: "34", [30]: "36", [35]: "38",
      [40]: "40", [45]: "42", [50]: "44"
    };
    if (totalScore in mapping) return mapping[totalScore];
    const weeks = (0.4 * totalScore) + 24;
    return weeks.toFixed(1);
  }, [totalScore]);

  const toggleSelection = (name: string, val: number) => {
    setSelections(prev => {
      if (prev[name] === val) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: val };
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-48 lg:pb-8">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Baby className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">New Ballard Score</h1>
            <p className="text-muted-foreground text-sm font-medium">Gestational Age Estimation</p>
          </div>
        </div>

        <div className="flex p-1 bg-muted rounded-xl w-fit">
          <Button 
            variant={sex === "male" ? "default" : "ghost"} 
            size="sm" 
            className="rounded-lg px-6"
            onClick={() => setSex("male")}
          >
            Male
          </Button>
          <Button 
            variant={sex === "female" ? "default" : "ghost"} 
            size="sm" 
            className="rounded-lg px-6"
            onClick={() => setSex("female")}
          >
            Female
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <TooltipProvider>
            <section>
              <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                Neuromuscular Maturity
              </h2>
              <div className="space-y-8">
                {NEUROMUSCULAR_CRITERIA.map(c => (
                  <div key={c.name} className="space-y-4 p-4 rounded-2xl border bg-card/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                          <c.icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-sm tracking-tight">{c.name}</h3>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[240px] p-0 overflow-hidden bg-card border shadow-xl">
                          <div className="w-full h-32 bg-slate-50 flex items-center justify-center p-2 border-b">
                            {c.illustration}
                          </div>
                          <div className="p-3 text-[11px] leading-snug">
                            <span className="font-black uppercase tracking-widest text-[9px] text-primary block mb-1">How to Assessment</span>
                            {c.howTo}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 flex flex-wrap gap-2">
                        {c.values.map(v => (
                          <button
                            key={v.score}
                            onClick={() => toggleSelection(c.name, v.score)}
                            onMouseEnter={() => setHovered({ name: c.name, score: v.score, desc: v.desc })}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "flex-1 min-w-[48px] h-12 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-0.5",
                              selections[c.name] === v.score 
                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 z-10" 
                                : "bg-background border-muted hover:border-primary/30 text-muted-foreground"
                            )}
                          >
                            <span className="text-lg font-black">{v.score}</span>
                          </button>
                        ))}
                      </div>
                      <div className="hidden md:flex items-center justify-center p-2 w-24 h-24 rounded-xl border overflow-hidden bg-muted/50 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                        {c.illustration}
                      </div>
                    </div>
                    {selections[c.name] !== undefined && (
                      <p className="text-[10px] font-bold text-primary animate-in fade-in slide-in-from-left-2">
                        {c.values.find(v => v.score === selections[c.name])?.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                Physical Maturity
              </h2>
              <div className="space-y-8">
                {[...PHYSICAL_CRITERIA, ...(sex === "male" ? [MALE_GENITALS] : sex === "female" ? [FEMALE_GENITALS] : [])].map(c => (
                  <div key={c.name} className="space-y-4 p-4 rounded-2xl border bg-card/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                          <c.icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-sm tracking-tight">{c.name}</h3>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[240px] p-0 overflow-hidden bg-card border shadow-xl">
                          <div className="w-full h-32 bg-slate-50 flex items-center justify-center p-2 border-b">
                            {c.illustration}
                          </div>
                          <div className="p-3 text-[11px] leading-snug">
                            <span className="font-black uppercase tracking-widest text-[9px] text-primary block mb-1">How to Assessment</span>
                            {c.howTo}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 flex flex-wrap gap-2">
                        {c.values.map(v => (
                          <button
                            key={v.score}
                            onClick={() => toggleSelection(c.name, v.score)}
                            onMouseEnter={() => setHovered({ name: c.name, score: v.score, desc: v.desc })}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "flex-1 min-w-[48px] h-12 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-0.5",
                              selections[c.name] === v.score 
                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 z-10" 
                                : "bg-background border-muted hover:border-primary/30 text-muted-foreground"
                            )}
                          >
                            <span className="text-lg font-black">{v.score}</span>
                          </button>
                        ))}
                      </div>
                      <div className="hidden md:flex items-center justify-center p-2 w-24 h-24 rounded-xl border overflow-hidden bg-muted/50 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                        {c.illustration}
                      </div>
                    </div>
                    {selections[c.name] !== undefined && (
                      <p className="text-[10px] font-bold text-primary animate-in fade-in slide-in-from-left-2">
                        {c.values.find(v => v.score === selections[c.name])?.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </TooltipProvider>
        </div>

        <div className="relative">
          <div className="sticky top-8 space-y-6">
            {totalScore !== null ? (
              <div className="space-y-6">
                <Card className="border-2 shadow-2xl bg-primary text-primary-foreground overflow-hidden">
                  <div className="p-6 text-center space-y-2">
                    <Badge variant="outline" className="text-white border-white/20">Maturity Estimation</Badge>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-7xl font-black font-mono tracking-tighter">{gestAge}</span>
                      <span className="text-xl font-medium opacity-70 uppercase tracking-widest">Weeks</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                      <div className="text-left">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block">Total Score</span>
                        <span className="text-xl font-black font-mono">{totalScore}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block">Criteria</span>
                        <span className="text-xl font-black font-mono">
                          {Object.keys(selections).length} / 12
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4 text-primary font-black text-[10px] uppercase tracking-widest">
                      <Info className="h-3.5 w-3.5" /> Clinical Reference
                    </div>
                    <div className="space-y-4 text-[11px] leading-relaxed">
                      <p>Accurate within 2 weeks of gestational age. Best performed within 12h of life for infants &lt; 26w, and up to 96h for others.</p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                        {[-10, 0, 10, 20, 30, 40, 50].map(s => (
                          <div key={s} className="flex justify-between p-2 rounded bg-background border">
                            <span className="opacity-50 font-bold">{s} pts</span>
                            <span className="font-black">GA {(0.4 * s + 24).toFixed(0)}w</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30 min-h-[400px]">
                <Activity className="h-16 w-16 text-muted-foreground/10 mb-6" />
                <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Maturity Check</h3>
                <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                  Complete the neuromuscular and physical assessment to estimate gestational age.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Result */}
      {totalScore !== null && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t z-50 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. Gestational Age</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary font-mono">{gestAge}</span>
                <span className="text-xs font-bold text-primary opacity-70">WEEKS</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Score</span>
              <span className="text-xl font-black font-mono">{totalScore}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
             {selections[c.name] !== undefined && (
                      <p className="text-[10px] font-bold text-primary animate-in fade-in slide-in-from-left-2">
                        {c.values.find(v => v.score === selections[c.name])?.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </TooltipProvider>
        </div>

        <div className="relative">
          <div className="sticky top-8 space-y-6">
            {totalScore !== null ? (
              <div className="space-y-6">
                <Card className="border-2 shadow-2xl bg-primary text-primary-foreground overflow-hidden">
                  <div className="p-6 text-center space-y-2">
                    <Badge variant="outline" className="text-white border-white/20">Maturity Estimation</Badge>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-7xl font-black font-mono tracking-tighter">{gestAge}</span>
                      <span className="text-xl font-medium opacity-70 uppercase tracking-widest">Weeks</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                      <div className="text-left">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block">Total Score</span>
                        <span className="text-xl font-black font-mono">{totalScore}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block">Criteria</span>
                        <span className="text-xl font-black font-mono">
                          {Object.keys(selections).length} / 12
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4 text-primary font-black text-[10px] uppercase tracking-widest">
                      <Info className="h-3.5 w-3.5" /> Clinical Reference
                    </div>
                    <div className="space-y-4 text-[11px] leading-relaxed">
                      <p>Accurate within 2 weeks of gestational age. Best performed within 12h of life for infants &lt; 26w, and up to 96h for others.</p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                        {[-10, 0, 10, 20, 30, 40, 50].map(s => (
                          <div key={s} className="flex justify-between p-2 rounded bg-background border">
                            <span className="opacity-50 font-bold">{s} pts</span>
                            <span className="font-black">GA {(0.4 * s + 24).toFixed(0)}w</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30 min-h-[400px]">
                <Activity className="h-16 w-16 text-muted-foreground/10 mb-6" />
                <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Maturity Check</h3>
                <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                  Complete the neuromuscular and physical assessment to estimate gestational age.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Result */}
      {totalScore !== null && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t z-50 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. Gestational Age</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary font-mono">{gestAge}</span>
                <span className="text-xs font-bold text-primary opacity-70">WEEKS</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Score</span>
              <span className="text-xl font-black font-mono">{totalScore}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
