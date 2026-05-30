import { useState, useMemo } from "react";
import { 
  Baby, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Timer, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const APGAR_CRITERIA = {
  appearance: [
    { label: "Blue-grey, pale all over", value: 0 },
    { label: "Normal color central, blue extremities (acrocyanosis)", value: 1 },
    { label: "Normal color all over (pink)", value: 2 },
  ],
  pulse: [
    { label: "Absent (no heart rate)", value: 0 },
    { label: "< 100 beats per minute", value: 1 },
    { label: "≥ 100 beats per minute", value: 2 },
  ],
  grimace: [
    { label: "No response to stimulation", value: 0 },
    { label: "Grimace on suction or aggressive stimulation", value: 1 },
    { label: "Cry, cough, or sneeze on stimulation", value: 2 },
  ],
  activity: [
    { label: "None (limp)", value: 0 },
    { label: "Some flexion", value: 1 },
    { label: "Active motion / Flexed limbs", value: 2 },
  ],
  respiration: [
    { label: "Absent (no breathing)", value: 0 },
    { label: "Weak, irregular, or gasping", value: 1 },
    { label: "Strong cry", value: 2 },
  ]
};

export default function ApgarScoreCalc() {
  const [scores, setScores] = useState<Record<string, string>>({
    appearance: "",
    pulse: "",
    grimace: "",
    activity: "",
    respiration: ""
  });

  const totalScore = useMemo(() => {
    const values = Object.values(scores);
    if (values.some(v => v === "")) return null;
    return values.reduce((sum, v) => sum + parseInt(v), 0);
  }, [scores]);

  const interpretation = useMemo(() => {
    if (totalScore === null) return null;
    if (totalScore >= 7) return { label: "Normal / Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (totalScore >= 4) return { label: "Moderately Depressed", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Severely Depressed", color: "text-red-600", bg: "bg-red-50" };
  }, [totalScore]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100">
          <Baby className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">APGAR Score</h1>
          <p className="text-muted-foreground text-sm font-medium">Standardized Neonatal Assessment at 1 & 5 Minutes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">Scoring Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {Object.entries(APGAR_CRITERIA).map(([key, options]) => (
                <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <Select value={scores[key]} onValueChange={(v) => setScores(prev => ({ ...prev, [key]: v }))}>
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select response" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem key={opt.value} value={String(opt.value)}>{opt.label} ({opt.value})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
            {totalScore !== null && interpretation ? (
                <>
                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg, totalScore < 4 ? "border-red-200" : "border-indigo-100")}>
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-slate-700 uppercase font-black">APGAR Result</Badge>
                            <CardTitle className="text-6xl font-black font-mono text-slate-800 tracking-tighter">
                                {totalScore} <span className="text-2xl font-normal opacity-30">/ 10</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-background/60 border border-muted shadow-sm text-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clinical Status</span>
                                <span className={cn("font-bold text-lg", interpretation.color)}>{interpretation.label}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {totalScore < 7 && (
                        <Alert variant="destructive" className="bg-red-600 text-white border-none shadow-lg rounded-2xl">
                            <AlertTriangle className="h-5 w-5" />
                            <div className="ml-2">
                                <AlertTitle className="font-black uppercase text-xs">Action Required</AlertTitle>
                                <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">
                                    {totalScore < 4 ? "Severe depression. Immediate resuscitation required (Neonatal Resuscitation Program - NRP)." : "Moderate depression. May require tactile stimulation and supplemental oxygen."}
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                                <Info className="h-3.5 w-3.5" /> Interpretation Guide
                            </div>
                            <div className="space-y-2 text-[11px] leading-relaxed">
                                <p>• <strong>7 - 10:</strong> Normal. Provide routine neonatal care.</p>
                                <p>• <strong>4 - 6:</strong> Moderately depressed. Re-evaluate frequently.</p>
                                <p>• <strong>0 - 3:</strong> Severely depressed. High mortality risk if no intervention.</p>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Baby className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Neonatal Assessment</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                        Select all five parameters (Appearance, Pulse, Grimace, Activity, Respiration) to calculate the score.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
