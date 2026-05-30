import { useState, useMemo } from "react";
import { 
  Droplets, Calculator, Info, 
  ArrowLeft, ChevronRight, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { calculateMaintenanceFluids } from "@/lib/calculators/formulas";

export default function MaintenanceFluidsCalc() {
  const [weight, setWeight] = useState<string>("");

  const weightNum = parseFloat(weight);
  const isValid = !isNaN(weightNum) && weightNum > 0 && weightNum <= 150;

  const result = useMemo(() => {
    if (!isValid) return null;
    const hourly = calculateMaintenanceFluids(weightNum);
    return {
      hourly: hourly,
      daily: hourly * 24,
      bolus: weightNum * 20,
      bolusDose: "20 mL/kg"
    };
  }, [weightNum, isValid]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <Droplets className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Maintenance Fluids</h1>
          <p className="text-muted-foreground text-sm">4-2-1 Rule for Pediatric IV Fluid Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Inputs */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Patient Parameters</CardTitle>
            <CardDescription>Enter weight for calculation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Weight (kg)
              </Label>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="e.g. 15" 
                  className="h-12 text-lg font-mono pl-4 pr-12"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">kg</span>
              </div>
              {weightNum > 100 && (
                <p className="text-[10px] text-amber-600 font-medium">⚠ Note: Maintenance usually caps at 2500mL/day for adults.</p>
              )}
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase">The 4-2-1 Rule:</p>
                  <ul className="text-[11px] space-y-1 text-muted-foreground">
                    <li>• 4 mL/kg/hr for first 10 kg</li>
                    <li>• 2 mL/kg/hr for next 10 kg</li>
                    <li>• 1 mL/kg/hr for each kg {'>'} 20 kg</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isValid && result ? (
          <div className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-2">
                <Badge className="w-fit mb-2 bg-blue-600">Calculated Rate</Badge>
                <CardTitle className="text-4xl font-black font-mono text-blue-700">
                  {result.hourly.toFixed(1)} <span className="text-lg font-normal">mL/hr</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm py-2 border-t border-blue-100">
                  <span className="text-muted-foreground">Daily Total (24h)</span>
                  <span className="font-bold">{result.daily.toFixed(0)} mL</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-t border-blue-100">
                  <span className="text-muted-foreground">Isotonic Bolus (20 mL/kg)</span>
                  <Badge variant="destructive" className="font-mono">{result.bolus.toFixed(0)} mL</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">Fluid Type Suggestion</span>
                </div>
                <p className="text-sm leading-relaxed mb-4">
                  Standard recommendation is <strong>Isotonic Fluids</strong> (e.g., 0.9% NS or Lactated Ringer's) with 5% Dextrose.
                </p>
                <div className="grid grid-cols-2 gap-2">
                   <div className="p-2 bg-background border rounded-lg text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Dextrose</p>
                      <p className="text-xs font-bold">5%</p>
                   </div>
                   <div className="p-2 bg-background border rounded-lg text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Potassium</p>
                      <p className="text-xs font-bold">20 mEq/L</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center bg-muted/20">
            <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">Enter a valid patient weight to see maintenance fluid recommendations.</p>
          </div>
        )}
      </div>

      <div className="mt-12 text-[10px] text-muted-foreground border-t pt-4">
        <p>Formula: Holliday-Segar Method (4-2-1 Rule). For neonates or complex cardiac/renal patients, use specific clinical protocols. Fluid types should be adjusted based on clinical status and electrolyte monitoring.</p>
      </div>
    </div>
  );
}
