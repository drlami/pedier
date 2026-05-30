import { useState, useMemo } from "react";
import { 
  ArrowLeft, Info, HeartPulse, Activity, Scale, ShieldAlert, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { calculateSimplifiedBPPercentile } from "@/lib/calculators/growth-data";
import { cn } from "@/lib/utils";

export default function BpPercentilePage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [ageYears, setAgeYears] = useState<string>("");
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");

  const ageNum = parseFloat(ageYears);
  const sNum = parseFloat(systolic);
  const dNum = parseFloat(diastolic);

  const isValid = !isNaN(ageNum) && ageNum >= 1 && ageNum <= 18 && !isNaN(sNum) && !isNaN(dNum);

  const result = useMemo(() => {
    if (!isValid) return null;

    const { systolic95, diastolic95 } = calculateSimplifiedBPPercentile(ageNum, sex);
    
    let status = "Normal";
    let color = "text-green-600";
    let bg = "bg-green-50";
    let severity: "normal" | "elevated" | "stage1" | "stage2" = "normal";

    // Stage 2: > 95th + 12mmHg or > 140/90
    if (sNum >= systolic95 + 12 || dNum >= diastolic95 + 12 || sNum >= 140 || dNum >= 90) {
        status = "Stage 2 Hypertension";
        color = "text-red-700";
        bg = "bg-red-50";
        severity = "stage2";
    } 
    // Stage 1: > 95th
    else if (sNum >= systolic95 || dNum >= diastolic95) {
        status = "Stage 1 Hypertension";
        color = "text-orange-600";
        bg = "bg-orange-50";
        severity = "stage1";
    }
    // Elevated: > 90th (approx 95th - 5)
    else if (sNum >= systolic95 - 5 || dNum >= diastolic95 - 5) {
        status = "Elevated Blood Pressure";
        color = "text-yellow-600";
        bg = "bg-yellow-50";
        severity = "elevated";
    }

    return { status, color, bg, severity, systolic95, diastolic95 };
  }, [ageNum, sex, sNum, dNum, isValid]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
            <HeartPulse className="h-6 w-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Blood Pressure Percentiles</h1>
            <p className="text-muted-foreground text-sm font-medium">Screening for Pediatric Hypertension (Ages 1-18)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* INPUTS */}
        <Card className="border-2 border-rose-100 shadow-sm h-fit">
            <CardHeader className="bg-rose-50/50 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4 text-rose-600" /> Patient Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">Biological Sex</Label>
                        <Select value={sex} onValueChange={(v: any) => setSex(v)}>
                            <SelectTrigger className="active:scale-95">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">Age (Years)</Label>
                        <Input type="number" inputMode="decimal" placeholder="1-18" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} />
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-rose-700">Systolic (Top)</Label>
                        <Input type="number" inputMode="decimal" placeholder="e.g. 110" className="h-12 font-mono text-xl border-rose-200" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-rose-700">Diastolic (Bottom)</Label>
                        <Input type="number" inputMode="decimal" placeholder="e.g. 70" className="h-12 font-mono text-xl border-rose-200" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* RESULTS */}
        <div className="space-y-6">
            {isValid && result ? (
                <>
                    <Card className={cn("border-2 shadow-md transition-colors", result.bg, "border-rose-200")}>
                        <CardHeader className="pb-2 text-center">
                            <Badge className="w-fit mx-auto mb-2 bg-rose-600 uppercase font-black">BP Classification</Badge>
                            <CardTitle className={cn("text-3xl font-black font-headline tracking-tight", result.color)}>
                                {result.status}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-background/60 border border-rose-100 text-center">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">95th Systolic</p>
                                    <p className="text-lg font-black text-rose-700">{result.systolic95.toFixed(0)}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-background/60 border border-rose-100 text-center">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">95th Diastolic</p>
                                    <p className="text-lg font-black text-rose-700">{result.diastolic95.toFixed(0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {result.severity !== "normal" && (
                        <Alert variant="destructive" className="bg-rose-600 text-white border-none shadow-lg">
                            <ShieldAlert className="h-5 w-5" />
                            <AlertTitle className="font-black uppercase tracking-widest text-xs">Clinical Action Required</AlertTitle>
                            <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">
                                {result.severity === "stage2" 
                                    ? "Urgent evaluation and initiation of therapy required. Assess for target organ damage." 
                                    : "Lifestyle modifications recommended. Repeat BP measurement in 1-2 weeks."}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3 text-rose-700 font-black text-[10px] uppercase tracking-widest">
                                <Info className="h-3.5 w-3.5" /> Classification Guide
                            </div>
                            <div className="space-y-2 text-[11px] leading-relaxed">
                                <p>• <strong>Normal:</strong> &lt; 90th percentile.</p>
                                <p>• <strong>Elevated:</strong> 90th to &lt; 95th percentile.</p>
                                <p>• <strong>Stage 1 HTN:</strong> 95th to &lt; 95th + 12 mmHg.</p>
                                <p>• <strong>Stage 2 HTN:</strong> ≥ 95th + 12 mmHg OR ≥ 140/90.</p>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <HeartPulse className="h-16 w-16 text-rose-200 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">BP Percentile Engine</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                        Enter patient age and measured blood pressure to see the percentile classification.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
