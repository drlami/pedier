import { useState, useMemo } from "react";
import { 
  Baby, Info, ArrowLeft, Activity, Ruler, ChevronRight, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Criterion {
  name: string;
  icon: any;
  howTo: string;
  illustration: React.ReactNode;
  values: {
    score: number;
    desc: string;
  }[];
}

const PostureSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-indigo-600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M100 40a15 15 0 100-30 15 15 0 000 30z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M100 40v50 M100 50l-30 20v20 M100 50l30 20v20 M100 90l-20 40h20 M100 90l20 40h-20"/>
  </svg>
);

const SquareWindowSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-blue-600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 100h60l40-60" />
    <path d="M140 40a20 20 0 0120 20v20" />
    <text x="110" y="80" fill="currentColor" fontSize="24" strokeWidth="1">90°</text>
    <path d="M100 100v-20h20" strokeWidth="2"/>
  </svg>
);

const ArmRecoilSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-emerald-600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 80h60" />
    <path d="M100 80l40-40" strokeDasharray="5,5" opacity="0.5" />
    <path d="M100 80l40 40" />
    <path d="M120 60a30 30 0 010 40" strokeWidth="2" opacity="0.5" />
    <path d="M120 100l-5-10m5 10l10-5" strokeWidth="2" opacity="0.5" />
  </svg>
);

const PoplitealAngleSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-cyan-600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 120h40l40-60" />
    <path d="M120 60l40-40" strokeDasharray="5,5" opacity="0.5" />
    <path d="M120 60l40 40" />
    <path d="M140 40a30 30 0 010 40" strokeWidth="2" opacity="0.5" />
  </svg>
);

const ScarfSignSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-purple-600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="100" cy="60" rx="30" ry="40" strokeDasharray="4,4" opacity="0.3" />
    <path d="M100 20v80" strokeDasharray="2,2" opacity="0.3" />
    <path d="M130 50c-20-10-50 10-70 20l-20-20" />
    <circle cx="60" cy="70" r="5" fill="currentColor" />
  </svg>
);

const HeelToEarSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-rose-600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="60" cy="50" r="20" fill="currentColor" fillOpacity="0.2" />
    <path d="M60 70v60h40" />
    <path d="M100 130c0-40-20-80-50-90" />
    <ellipse cx="45" cy="40" rx="8" ry="4" transform="rotate(-30 45 40)" />
  </svg>
);

const SkinSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-orange-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 75 Q100 20 180 75" />
    <path d="M20 75 Q100 130 180 75" opacity="0.5" />
    <path d="M50 75 Q70 60 90 75 T130 75" strokeWidth="1" strokeDasharray="2,2" />
    <circle cx="100" cy="75" r="40" strokeWidth="1" strokeDasharray="1,3" />
  </svg>
);

const LanugoSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 100 Q100 20 170 100" strokeWidth="4"/>
    <path d="M60 80l-10-15 M80 60l-5-15 M100 50v-15 M120 60l5-15 M140 80l10-15" opacity="0.6"/>
    <path d="M70 70l-8-12 M90 55l-3-12 M110 55l3-12 M130 70l8-12" opacity="0.3"/>
  </svg>
);

const PlantarSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-amber-700" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M70 30c-20 0-30 20-30 40s10 60 60 60 60-40 60-60-10-40-30-40-10-20-30-20-10 20-30 20z" />
    <path d="M70 70Q100 80 130 70" opacity="0.6" />
    <path d="M75 90Q100 100 125 90" opacity="0.4" />
    <path d="M85 110Q100 115 115 110" opacity="0.2" />
  </svg>
);

const BreastSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-pink-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 100 Q100 60 160 100" />
    <ellipse cx="100" cy="85" rx="30" ry="10" />
    <circle cx="100" cy="85" r="5" fill="currentColor" />
  </svg>
);

const EyeEarSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-teal-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 75 Q75 50 100 75 T150 75" />
    <path d="M50 75 Q75 100 100 75" opacity="0.5" />
    <circle cx="75" cy="75" r="8" fill="currentColor" opacity="0.8" />
    <path d="M120 40 C160 40 170 80 140 110" />
    <path d="M130 60 C150 60 150 90 140 100" opacity="0.5" />
  </svg>
);

const GenitalsMaleSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-sky-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M100 40v40" strokeWidth="8" strokeLinecap="round" />
    <path d="M70 80 C40 80 60 130 100 130 C140 130 160 80 130 80" />
    <path d="M80 100 Q100 110 120 100" opacity="0.5" />
    <path d="M85 115 Q100 125 115 115" opacity="0.5" />
  </svg>
);

const GenitalsFemaleSvg = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full text-fuchsia-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M80 50 Q100 30 120 50 Q140 90 100 130 Q60 90 80 50 Z" />
    <path d="M90 60 Q100 45 110 60 Q120 90 100 120 Q80 90 90 60 Z" opacity="0.6" />
    <circle cx="100" cy="45" r="4" fill="currentColor" />
  </svg>
);

const NEUROMUSCULAR_CRITERIA: Criterion[] = [
  { 
    name: "Posture", 
    icon: Baby,
    howTo: "Observe infant quiet and supine. Score based on degree of flexion of arms and legs.",
    illustration: <PostureSvg />,
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
    illustration: <SquareWindowSvg />,
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
    illustration: <ArmRecoilSvg />,
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
    illustration: <PoplitealAngleSvg />,
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
    illustration: <ScarfSignSvg />,
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
    illustration: <HeelToEarSvg />,
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
    illustration: <SkinSvg />,
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
    illustration: <LanugoSvg />,
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
    illustration: <PlantarSvg />,
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
    illustration: <BreastSvg />,
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
    illustration: <EyeEarSvg />,
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
  illustration: <GenitalsMaleSvg />,
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
  illustration: <GenitalsFemaleSvg />,
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

  const interpretation = useMemo(() => {
    if (totalScore === null) return null;
    if (totalScore < 0) return { category: "Extremely Preterm", color: "text-rose-600", desc: "Infants scoring below 0 are significantly premature (< 24 weeks). High risk for RDS and NEC." };
    if (totalScore < 15) return { category: "Very Preterm", color: "text-orange-600", desc: "Typically 24-30 weeks. Requires intensive neonatal support and surfactant." };
    if (totalScore < 30) return { category: "Moderate to Late Preterm", color: "text-amber-600", desc: "Typically 30-36 weeks. Risk for feeding issues and jaundice." };
    if (totalScore < 45) return { category: "Full Term", color: "text-emerald-600", desc: "Healthy 37-42 week maturity. Minimal intervention usually required." };
    return { category: "Post-Term", color: "text-blue-600", desc: "Infants > 42 weeks maturity. Monitor for placental insufficiency and meconium aspiration." };
  }, [totalScore]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-48 lg:pb-8">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
            <Baby className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">New Ballard Score</h1>
            <p className="text-muted-foreground text-sm font-medium">Gestational Age Estimation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl border-dashed border-2 hover:bg-muted/50">
                <Info className="mr-2 h-4 w-4 text-primary" /> Review Scoring Guide
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90%] sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black">Scoring Interpretation</SheetTitle>
                <SheetDescription className="font-medium">
                  What each point reflection means for clinical maturity.
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Maturity Milestones
                  </h4>
                  <div className="grid gap-3">
                    {[
                      { s: "-10", w: "20w", label: "Early Viability", color: "bg-rose-50 border-rose-100 text-rose-700" },
                      { s: "10", w: "28w", label: "High Prematurity", color: "bg-orange-50 border-orange-100 text-orange-700" },
                      { s: "20", w: "32w", label: "Moderate Prematurity", color: "bg-amber-50 border-amber-100 text-amber-700" },
                      { s: "30", w: "36w", label: "Late Preterm", color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
                      { s: "40", w: "40w", label: "Term Maturity", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                    ].map(item => (
                      <div key={item.s} className={cn("p-4 rounded-2xl border flex items-center justify-between shadow-sm", item.color)}>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase opacity-70 leading-none mb-1">{item.label}</span>
                          <span className="text-xl font-black font-mono leading-none">{item.w}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase opacity-60 block leading-none mb-1">Score</span>
                          <span className="text-lg font-black font-mono leading-none">{item.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-muted/30 border-2 border-dashed space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-primary" /> Timing is Critical
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                    The Ballard score is most accurate when performed within the **first 12 hours of life** for infants &lt; 26 weeks. For older infants, it remains reliable for up to **96 hours**.
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                    Neuromuscular scores can be affected by infant state, medications (like magnesium), or respiratory distress.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex p-1 bg-muted rounded-xl shadow-inner">
            <Button 
              variant={sex === "male" ? "default" : "ghost"} 
              size="sm" 
              className={cn("rounded-lg px-4 h-8 text-xs font-bold transition-all", sex === "male" && "shadow-lg shadow-primary/20")}
              onClick={() => setSex("male")}
            >
              Male
            </Button>
            <Button 
              variant={sex === "female" ? "default" : "ghost"} 
              size="sm" 
              className={cn("rounded-lg px-4 h-8 text-xs font-bold transition-all", sex === "female" && "shadow-lg shadow-primary/20")}
              onClick={() => setSex("female")}
            >
              Female
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <TooltipProvider>
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-200">1</span>
                Neuromuscular Maturity
              </h2>
              <div className="space-y-6">
                {NEUROMUSCULAR_CRITERIA.map(c => (
                  <div key={c.name} className="space-y-4 p-5 rounded-[24px] border-2 bg-card/40 hover:bg-card hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
                          <c.icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="font-bold text-[15px] tracking-tight">{c.name}</h3>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/50 hover:bg-primary/10">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px] p-0 overflow-hidden bg-card border-2 shadow-2xl rounded-2xl animate-in zoom-in-95">
                          <div className="w-full h-36 bg-slate-50 flex items-center justify-center p-3 border-b-2">
                            {c.illustration}
                          </div>
                          <div className="p-4 text-[12px] leading-relaxed font-medium">
                            <span className="font-black uppercase tracking-widest text-[9px] text-primary block mb-2">How to Assessment</span>
                            {c.howTo}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-1 flex flex-wrap gap-2.5">
                        {c.values.map(v => (
                          <button
                            key={v.score}
                            onClick={() => toggleSelection(c.name, v.score)}
                            onMouseEnter={() => setHovered({ name: c.name, score: v.score, desc: v.desc })}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "flex-1 min-w-[54px] h-14 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-0.5",
                              selections[c.name] === v.score 
                                ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/30 scale-[1.08] z-10" 
                                : "bg-background border-muted/60 hover:border-primary/30 text-muted-foreground/80"
                            )}
                          >
                            <span className="text-xl font-black font-mono leading-none">{v.score}</span>
                          </button>
                        ))}
                      </div>
                      <div className="hidden sm:flex items-center justify-center p-3 w-28 h-28 rounded-2xl border-2 overflow-hidden bg-muted/30 shrink-0 opacity-40 hover:opacity-100 transition-all duration-500 hover:shadow-inner">
                        {c.illustration}
                      </div>
                    </div>
                    {selections[c.name] !== undefined && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-left-2 duration-300">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                        <p className="text-[11px] font-black text-primary leading-none tracking-tight">
                          {c.values.find(v => v.score === selections[c.name])?.desc}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-200">2</span>
                Physical Maturity
              </h2>
              <div className="space-y-6">
                {[...PHYSICAL_CRITERIA, ...(sex === "male" ? [MALE_GENITALS] : sex === "female" ? [FEMALE_GENITALS] : [])].map(c => (
                  <div key={c.name} className="space-y-4 p-5 rounded-[24px] border-2 bg-card/40 hover:bg-card hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
                          <c.icon className="h-4.5 w-4.5" />
                        </div>
                        <h3 className="font-bold text-[15px] tracking-tight">{c.name}</h3>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/50 hover:bg-primary/10">
                            <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px] p-0 overflow-hidden bg-card border-2 shadow-2xl rounded-2xl animate-in zoom-in-95">
                          <div className="w-full h-36 bg-slate-50 flex items-center justify-center p-3 border-b-2">
                            {c.illustration}
                          </div>
                          <div className="p-4 text-[12px] leading-relaxed font-medium">
                            <span className="font-black uppercase tracking-widest text-[9px] text-primary block mb-2">How to Assessment</span>
                            {c.howTo}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-1 flex flex-wrap gap-2.5">
                        {c.values.map(v => (
                          <button
                            key={v.score}
                            onClick={() => toggleSelection(c.name, v.score)}
                            onMouseEnter={() => setHovered({ name: c.name, score: v.score, desc: v.desc })}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "flex-1 min-w-[54px] h-14 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-0.5",
                              selections[c.name] === v.score 
                                ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/30 scale-[1.08] z-10" 
                                : "bg-background border-muted/60 hover:border-primary/30 text-muted-foreground/80"
                            )}
                          >
                            <span className="text-xl font-black font-mono leading-none">{v.score}</span>
                          </button>
                        ))}
                      </div>
                      <div className="hidden sm:flex items-center justify-center p-3 w-28 h-28 rounded-2xl border-2 overflow-hidden bg-muted/30 shrink-0 opacity-40 hover:opacity-100 transition-all duration-500 hover:shadow-inner">
                        {c.illustration}
                      </div>
                    </div>
                    {selections[c.name] !== undefined && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-left-2 duration-300">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                        <p className="text-[11px] font-black text-primary leading-none tracking-tight">
                          {c.values.find(v => v.score === selections[c.name])?.desc}
                        </p>
                      </div>
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
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Card className="border-2 shadow-2xl bg-primary text-primary-foreground overflow-hidden rounded-[32px]">
                  <div className="p-8 text-center space-y-4">
                    <Badge variant="outline" className="text-white border-white/20 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Maturity Estimate</Badge>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-8xl font-black font-mono tracking-tighter leading-none">{gestAge}</span>
                        <span className="text-xl font-bold opacity-70 uppercase tracking-widest">Weeks</span>
                      </div>
                      <p className="mt-2 text-xs font-black uppercase tracking-widest opacity-60">Estimated Gestational Age</p>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-white/10 grid grid-cols-2 gap-8">
                      <div className="text-left">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 block mb-1">Total Score</span>
                        <span className="text-2xl font-black font-mono leading-none">{totalScore}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 block mb-1">Assessments</span>
                        <span className="text-2xl font-black font-mono leading-none">
                          {Object.keys(selections).length}<span className="text-xs opacity-40 ml-1">/12</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {interpretation && (
                  <Card className="rounded-[32px] border-2 border-primary/10 shadow-lg bg-card/80 overflow-hidden">
                    <div className="p-6 space-y-3">
                      <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-muted", interpretation.color)}>
                        <Activity className="h-3 w-3" /> {interpretation.category}
                      </div>
                      <p className="text-xs font-medium leading-relaxed text-muted-foreground italic">
                        "{interpretation.desc}"
                      </p>
                    </div>
                  </Card>
                )}

                <Card className="bg-indigo-50/50 border-2 border-indigo-100 rounded-[32px] overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-indigo-700 font-black text-[10px] uppercase tracking-widest">
                      <Ruler className="h-3.5 w-3.5" /> Quick Scale
                    </div>
                    <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                      {[-10, 0, 10, 20, 30, 40, 50].map(s => (
                        <div key={s} className={cn(
                          "flex justify-between p-2.5 rounded-xl border transition-all duration-300",
                          totalScore !== null && Math.abs(totalScore - s) <= 5 ? "bg-white border-indigo-200 shadow-sm scale-105 z-10" : "bg-white/40 border-transparent opacity-60"
                        )}>
                          <span className="font-bold">{s} pts</span>
                          <span className="font-black text-indigo-700">{(0.4 * s + 24).toFixed(0)}w</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center border-4 border-dashed rounded-[48px] p-12 text-center bg-muted/20 border-muted/30 min-h-[500px]">
                <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-8">
                  <Activity className="h-10 w-10 text-muted-foreground/20 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Assessment Required</h3>
                <p className="text-muted-foreground font-medium text-sm mt-4 leading-relaxed max-w-[280px]">
                  Select scores for both neuromuscular and physical criteria to reflect gestational maturity.
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Result */}
      {totalScore !== null && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background/90 backdrop-blur-2xl border-t-2 border-primary/10 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Est. Maturity</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-primary font-mono tracking-tighter">{gestAge}</span>
                <span className="text-[10px] font-black text-primary opacity-60 uppercase tracking-widest">WEEKS</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-[1px] bg-muted/60" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</span>
                <span className="text-2xl font-black font-mono leading-none">{totalScore}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
