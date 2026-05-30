import { useState, useMemo } from "react";
import { 
  Stethoscope, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Thermometer, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function KocherCriteriaCalc() {
  const [fever, setFever] = useState(false);
  const [nonWeightBearing, setNonWeightWeightBearing] = useState(false);
  const [esr, setEsr] = useState<string>("");
  const [wbc, setWbc] = useState<string>("");

  const esrNum = parseFloat(esr);
  const wbcNum = parseFloat(wbc);

  const score = useMemo(() => {
    let total = 0;
    if (fever) total += 1;
    if (nonWeightBearing) total += 1;
    if (!isNaN(esrNum) && esrNum > 40) total += 1;
    if (!isNaN(wbcNum) && wbcNum > 12000) total += 1;
    return total;
  }, [fever, nonWeightBearing, esrNum, wbcNum]);

  const probability = useMemo(() => {
    const map = [
      { prob: "< 0.2%", text: "Extremely Low" },
      { prob: "3%", text: "Low Probability" },
      { prob: "40%", text: "Intermediate Probability" },
      { prob: "93%", text: "High Probability" },
      { prob: "99%", text: "Definite Septic Arthritis" },
    ];
    return map[score];
  }, [score]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Kocher Criteria</h1>
          <p className="text-muted-foreground text-sm">Septic Arthritis vs. Transient Synovitis in the Limping Child</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical & Lab Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/30">
              <Checkbox id="fever" checked={fever} onCheckedChange={(v) => setFever(!!v)} />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="fever" className="text-sm font-bold leading-none cursor-pointer">History of Fever</label>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">&gt; 38.5°C (101.3°F)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/30">
              <Checkbox id="weight" checked={nonWeightBearing} onCheckedChange={(v) => setNonWeightWeightBearing(!!v)} />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="weight" className="text-sm font-bold leading-none cursor-pointer">Non-Weight Bearing</label>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Inability to walk even with a limp</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">ESR (mm/hr)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 45" className="font-mono h-11" value={esr} onChange={(e) => setEsr(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">WBC Count (cells/µL)</Label>
              <Input type="number" inputMode="decimal" placeholder="e.g. 14000" className="font-mono h-11" value={wbc} onChange={(e) => setWbc(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={cn(
            "border-2 transition-all",
            score >= 3 ? "border-red-200 bg-red-50/30" : "border-green-200 bg-green-50/30"
          )}>
            <CardHeader className="pb-2">
              <Badge className={cn("w-fit mb-2", score >= 3 ? "bg-red-600" : "bg-green-600")}>
                {score} of 4 Criteria Present
              </Badge>
              <CardTitle className="text-5xl font-black font-mono tracking-tighter">
                {probability.prob}
              </CardTitle>
              <p className="text-xs font-bold uppercase text-muted-foreground">Risk of Septic Arthritis</p>
            </CardHeader>
            <CardContent>
                <div className="p-3 rounded-xl bg-background/50 border border-muted font-bold text-sm">
                    Clinical Meaning: {probability.text}
                </div>
            </CardContent>
          </Card>

          {score >= 3 && (
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-bold">
                      URGENT: High probability of Septic Arthritis. Consult Orthopedics for joint aspiration.
                  </AlertDescription>
              </Alert>
          )}

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Scoring Guide</h4>
                <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between border-b pb-1"><span>0/4 Criteria</span><span className="font-bold">&lt; 0.2%</span></div>
                    <div className="flex justify-between border-b pb-1"><span>1/4 Criteria</span><span className="font-bold">3%</span></div>
                    <div className="flex justify-between border-b pb-1"><span>2/4 Criteria</span><span className="font-bold">40%</span></div>
                    <div className="flex justify-between border-b pb-1"><span>3/4 Criteria</span><span className="font-bold">93%</span></div>
                    <div className="flex justify-between"><span>4/4 Criteria</span><span className="font-bold">99%</span></div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
