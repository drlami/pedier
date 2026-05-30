import { useState, useMemo } from "react";
import { 
  Activity, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, FlaskConical, Stethoscope
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const CRITERIA = {
  bilirubin: [
    { label: "< 2.0 mg/dL", value: 1 },
    { label: "2.0 - 3.0 mg/dL", value: 2 },
    { label: "> 3.0 mg/dL", value: 3 },
  ],
  albumin: [
    { label: "> 3.5 g/dL", value: 1 },
    { label: "2.8 - 3.5 g/dL", value: 2 },
    { label: "< 2.8 g/dL", value: 3 },
  ],
  inr: [
    { label: "< 1.7", value: 1 },
    { label: "1.7 - 2.3", value: 2 },
    { label: "> 2.3", value: 3 },
  ],
  ascites: [
    { label: "None", value: 1 },
    { label: "Mild / Controlled by medication", value: 2 },
    { label: "Moderate to Severe / Refractory", value: 3 },
  ],
  encephalopathy: [
    { label: "None", value: 1 },
    { label: "Grade 1-2 (Sleepy, confused)", value: 2 },
    { label: "Grade 3-4 (Stupor, coma)", value: 3 },
  ]
};

export default function ChildPughCalc() {
  const [scores, setScores] = useState<Record<string, string>>({
    bilirubin: "",
    albumin: "",
    inr: "",
    ascites: "",
    encephalopathy: ""
  });

  const totalScore = useMemo(() => {
    const values = Object.values(scores);
    if (values.some(v => v === "")) return null;
    return values.reduce((sum, v) => sum + parseInt(v), 0);
  }, [scores]);

  const interpretation = useMemo(() => {
    if (totalScore === null) return null;
    if (totalScore <= 6) return { class: "A", label: "Least Severe Liver Disease", color: "text-green-600", bg: "bg-green-50", survival: "100% (1yr) / 85% (2yr)" };
    if (totalScore <= 9) return { class: "B", label: "Moderately Severe Liver Disease", color: "text-amber-600", bg: "bg-amber-50", survival: "80% (1yr) / 60% (2yr)" };
    return { class: "C", label: "Most Severe Liver Disease", color: "text-red-600", bg: "bg-red-50", survival: "45% (1yr) / 35% (2yr)" };
  }, [totalScore]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 pb-20">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Child-Pugh Score</h1>
          <p className="text-muted-foreground text-sm font-medium">Severity of Liver Disease (Hepatic Reserve)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">Clinical & Lab Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {Object.entries(CRITERIA).map(([key, options]) => (
                <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                        {key === 'inr' ? 'INR' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <Select value={scores[key]} onValueChange={(v) => setScores(prev => ({ ...prev, [key]: v }))}>
                        <SelectTrigger className="h-11 border-2 focus:ring-primary">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
            {totalScore !== null && interpretation ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg, interpretation.class === 'C' ? "border-red-200" : "border-emerald-100")}>
                        <CardHeader className="pb-2 text-center">
                            <Badge className={cn("w-fit mx-auto mb-2 uppercase font-black", 
                                interpretation.class === 'A' ? "bg-green-600" : 
                                interpretation.class === 'B' ? "bg-amber-600" : "bg-red-600"
                            )}>
                                Child-Pugh Class {interpretation.class}
                            </Badge>
                            <CardTitle className="text-6xl font-black font-mono text-slate-800 tracking-tighter">
                                {totalScore} <span className="text-2xl font-normal opacity-30">/ 15</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-background/60 border border-muted shadow-sm text-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</span>
                                <span className={cn("font-bold text-lg", interpretation.color)}>{interpretation.label}</span>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-white/50 border border-muted text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Survival</p>
                                <p className="text-sm font-bold text-slate-700">{interpretation.survival}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                                <Info className="h-3.5 w-3.5" /> Clinical Context
                            </div>
                            <div className="space-y-2 text-[11px] leading-relaxed text-muted-foreground">
                                <p>• <strong>Class A:</strong> Good operative risk.</p>
                                <p>• <strong>Class B:</strong> Moderate operative risk.</p>
                                <p>• <strong>Class C:</strong> Poor operative risk (Contraindication for major surgery).</p>
                                <p className="pt-2 italic">Note: For younger children (&lt; 12 years), consider the <strong>PELD (Pediatric End-stage Liver Disease)</strong> score for transplant prioritization.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Stethoscope className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Liver Assessment</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                        Complete all clinical and laboratory parameters to calculate the Child-Pugh score.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
