import { useState, useMemo } from "react";
import { 
  Thermometer, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { calculateCorrectedSodium } from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

export default function SodiumCorrectionCalc() {
  const [sodium, setSodium] = useState<string>("");
  const [glucose, setGlucose] = useState<string>("");

  const naNum = parseFloat(sodium);
  const gluNum = parseFloat(glucose);
  const isValid = !isNaN(naNum) && naNum > 0 && !isNaN(gluNum) && gluNum > 0;

  const correctedNa = useMemo(() => {
    if (!isValid) return null;
    return calculateCorrectedSodium(naNum, gluNum);
  }, [naNum, gluNum, isValid]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
          <Thermometer className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Sodium Correction</h1>
          <p className="text-muted-foreground text-sm">Corrected Sodium for Hyperglycemia (DKA/HHS)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laboratory Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Measured Sodium (mEq/L)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 132" 
                className="h-12 text-lg font-mono"
                value={sodium}
                onChange={(e) => setSodium(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Serum Glucose (mg/dL)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 450" 
                className="h-12 text-lg font-mono"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Formula: <strong>Corrected Na = Measured Na + 1.6 × ([Glucose - 100] / 100)</strong>. 
                  High glucose causes an osmotic shift of water into the extracellular space, artificially lowering the measured sodium concentration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isValid && correctedNa ? (
          <div className="space-y-4">
            <Card className="border-2 border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-2">
                <Badge className="w-fit mb-2 bg-amber-600">Corrected Sodium</Badge>
                <CardTitle className="text-4xl font-black font-mono text-amber-700">
                  {correctedNa.toFixed(1)}
                </CardTitle>
                <p className="text-xs font-bold text-amber-800/60 uppercase">mEq/L</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-background border-amber-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-xs">
                        Use this <strong>Corrected Sodium</strong> value when determining the patient's hydration status and fluid type in DKA management.
                    </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {gluNum >= 600 && (
                <div className="p-4 rounded-xl bg-orange-600 text-white flex gap-4">
                    <AlertCircle className="h-6 w-6 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">HHS SUSPECTED</p>
                        <p className="text-xs opacity-90">Glucose ≥ 600 mg/dL may indicate Hyperglycemic Hyperosmolar State. Check serum osmolality.</p>
                    </div>
                </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center bg-muted/20">
            <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">Enter sodium and glucose to calculate corrected sodium level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
