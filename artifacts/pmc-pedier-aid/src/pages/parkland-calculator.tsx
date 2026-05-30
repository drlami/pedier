import { useState, useMemo } from "react";
import { 
  Flame, Calculator, Info, 
  ArrowLeft, ChevronRight, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { calculateParklandResuscitation } from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

export default function ParklandCalc() {
  const [weight, setWeight] = useState<string>("");
  const [bsa, setBsa] = useState<string>("");

  const wNum = parseFloat(weight);
  const bNum = parseFloat(bsa);
  const isValid = !isNaN(wNum) && wNum > 0 && !isNaN(bNum) && bNum > 0 && bNum <= 100;

  const results = useMemo(() => {
    if (!isValid) return null;
    const total = calculateParklandResuscitation(wNum, bNum);
    return {
      total: total,
      first8h: total / 2,
      next16h: total / 2,
      hourlyFirst8: total / 2 / 8,
      hourlyNext16: total / 2 / 16
    };
  }, [wNum, bNum, isValid]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100">
          <Flame className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Parkland Formula</h1>
          <p className="text-muted-foreground text-sm">Fluid Resuscitation for Pediatric Burns (First 24h)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Burn Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weight (kg)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 20" 
                className="h-12 text-lg font-mono"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">% BSA Burned (Total)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 15" 
                className="h-12 text-lg font-mono"
                value={bsa}
                onChange={(e) => setBsa(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Include only 2nd and 3rd degree burns.</p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2">
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Formula: <strong>4 mL × Weight(kg) × %BSA</strong>. 
                    </p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground font-bold">
                    Important: Children also require separate maintenance fluids (with dextrose) in addition to Parkland resuscitation fluids.
                    </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isValid && results ? (
          <div className="space-y-4">
            <Card className="border-2 border-red-200 bg-red-50/30">
              <CardHeader className="pb-2">
                <Badge className="w-fit mb-2 bg-red-600 uppercase font-black">24h Total (Lactated Ringer's)</Badge>
                <CardTitle className="text-4xl font-black font-mono text-red-700">
                  {results.total.toFixed(0)} <span className="text-lg font-normal">mL</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background border border-red-100">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">First 8 Hours</p>
                        <p className="font-bold text-red-700">{results.first8h.toFixed(0)} mL</p>
                        <p className="text-[10px] font-medium text-muted-foreground">({results.hourlyFirst8.toFixed(1)} mL/hr)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-red-100">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Next 16 Hours</p>
                        <p className="font-bold text-red-700">{results.next16h.toFixed(0)} mL</p>
                        <p className="text-[10px] font-medium text-muted-foreground">({results.hourlyNext16.toFixed(1)} mL/hr)</p>
                    </div>
                </div>
                
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-900 leading-relaxed">
                        The 8-hour clock starts <strong>at the time of the burn injury</strong>, not arrival in the ER.
                    </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center bg-muted/20">
            <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">Enter weight and burn percentage to calculate resuscitation volumes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
