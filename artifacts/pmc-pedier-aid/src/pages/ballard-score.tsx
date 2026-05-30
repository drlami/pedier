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
  values: {
    score: number;
    desc: string;
  }[];
}

const NEUROMUSCULAR_CRITERIA: Criterion[] = [
  { 
    name: "Posture", 
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
    name: "Square Window (Wrist)", 
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
    values: [
      { score: -1, desc: "Ear flat, stays folded" },
      { score: 0, desc: "Lids open; flat pinna" },
      { score: 1, desc: "Slightly curved pinna; slow recoil" },
      { score: 2, desc: "Well curved pinna; ready recoil" },
      { score: 3, desc: "Formed & firm pinna; instant recoil" },
      { score: 4, desc: "Thick cartilage; ear stiff" }
    ] 
  },
  { 
    name: "Genitals (Male)", 
    values: [
      { score: -1, desc: "Scrotum flat, smooth" },
      { score: 0, desc: "Scrotum empty, faint rugae" },
      { score: 1, desc: "Testes in upper canal, rare rugae" },
      { score: 2, desc: "Testes descending, few rugae" },
      { score: 3, desc: "Testes down, good rugae" },
      { score: 4, desc: "Testes pendulous, deep rugae" }
    ] 
  },
  { 
    name: "Genitals (Female)", 
    values: [
      { score: -1, desc: "Clitoris prominent, labia flat" },
      { score: 0, desc: "Prominent clitoris, small minora" },
      { score: 1, desc: "Prominent clitoris, enlarging minora" },
      { score: 2, desc: "Majora & minora equally prominent" },
      { score: 3, desc: "Majora large, minora small" },
      { score: 4, desc: "Majora cover clitoris & minora" }
    ] 
  }
];

export default function BallardScoreCalc() {
  const [selections, setSelections] = useState<Record<string, number>>({});
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
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">New Ballard Score</h1>
          <p className="text-muted-foreground text-sm font-medium">Gestational Age Estimation by Maturity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <TooltipProvider>
            <section>
              <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                Neuromuscular Maturity
              </h2>
              <div className="grid gap-4">
                {NEUROMUSCULAR_CRITERIA.map(c => (
                  <div key={c.name} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{c.name}</label>
                    <div className="flex flex-wrap gap-1">
                      {c.values.map(v => (
                        <Tooltip key={v.score}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={selections[c.name] === v.score ? "default" : "outline"}
                              size="sm"
                              className="h-9 w-10 p-0 font-bold"
                              onClick={() => toggleSelection(c.name, v.score)}
                              onMouseEnter={() => setHovered({ name: c.name, score: v.score, desc: v.desc })}
                              onMouseLeave={() => setHovered(null)}
                            >
                              {v.score}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white border-none font-bold text-xs p-2 px-3">
                            {v.desc}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                Physical Maturity
              </h2>
              <div className="grid gap-4">
                {PHYSICAL_CRITERIA.map(c => (
                  <div key={c.name} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{c.name}</label>
                    <div className="flex flex-wrap gap-1">
                      {c.values.map(v => (
                        <Tooltip key={v.score}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={selections[c.name] === v.score ? "default" : "outline"}
                              size="sm"
                              className="h-9 w-10 p-0 font-bold"
                              onClick={() => toggleSelection(c.name, v.score)}
                              onMouseEnter={() => setHovered({ name: c.name, score: v.score, desc: v.desc })}
                              onMouseLeave={() => setHovered(null)}
                            >
                              {v.score}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white border-none font-bold text-xs p-2 px-3">
                            {v.desc}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TooltipProvider>
        </div>

        <div className="space-y-6">
            <div className="sticky top-8 space-y-6">
              {(hovered || totalScore !== null) && (
                <Card className="border-2 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <CardContent className="p-4">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest block mb-1">
                      {hovered ? `${hovered.name} (Score ${hovered.score})` : "Current Selection"}
                    </span>
                    {hovered ? (
                      <p className="text-sm font-bold text-slate-800 leading-tight italic">"{hovered.desc}"</p>
                    ) : (
                      <p className="text-xs font-medium text-slate-500 italic">Select or hover over scores to see clinical descriptions.</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {totalScore !== null ? (
                <>
                  <Card className="border-2 shadow-xl bg-primary text-primary-foreground">
                    <CardHeader className="text-center pb-2">
                      <Badge variant="outline" className="mx-auto mb-2 text-white border-white/20">Estimated GA</Badge>
                      <CardTitle className="text-6xl font-black font-mono tracking-tighter">
                        {gestAge}
                        <span className="text-xl font-normal opacity-60 ml-2">weeks</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-6">
                      <div className="bg-white/10 rounded-xl p-3 border border-white/10 shadow-inner">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-70">Maturity Score</span>
                        <span className="text-2xl font-bold">{totalScore}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30 border-dashed">
                      <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                              <Info className="h-3.5 w-3.5" /> Interpretation
                          </div>
                          <div className="space-y-3 text-[11px] leading-relaxed">
                              <p>The Ballard score is valid for newborns as young as 20 weeks gestational age. It is most accurate when performed within the first 12 hours of life.</p>
                              <div className="grid grid-cols-2 gap-2 text-center font-mono text-[9px]">
                                <div className="p-1 border rounded bg-background">Score 10 = 28w</div>
                                <div className="p-1 border rounded bg-background">Score 20 = 32w</div>
                                <div className="p-1 border rounded bg-background">Score 30 = 36w</div>
                                <div className="p-1 border rounded bg-background">Score 40 = 40w</div>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                </>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Activity className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Maturity Check</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                      Hover or select points to see criteria descriptions and estimate gestational age.
                    </p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
