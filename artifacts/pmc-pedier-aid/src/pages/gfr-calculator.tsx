import { useState, useMemo } from "react";
import { 
  Activity, Calculator, Info, 
  ArrowLeft, ChevronRight, CheckCircle2, AlertTriangle, FlaskConical, Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { calculateSchwartzGFR } from "@/lib/calculators/formulas";
import { cn } from "@/lib/utils";

type PatientCategory = "preterm" | "term" | "child";
type AssayType = "enzymatic" | "jaffe";
type UnitType = "mgdL" | "umolL";

export default function GfrCalc() {
  const [height, setHeight] = useState<string>("");
  const [creatinine, setCreatinine] = useState<string>("");
  const [category, setCategory] = useState<PatientCategory>("child");
  const [assay, setAssay] = useState<AssayType>("enzymatic");
  const [unit, setUnit] = useState<UnitType>("mgdL");

  const hNum = parseFloat(height);
  const crNum = parseFloat(creatinine);
  const isValid = !isNaN(hNum) && hNum > 0 && !isNaN(crNum) && crNum > 0;

  // Determine constant (k) based on age and assay
  // Ref: Harriet Lane / Schwartz 2009
  const constant = useMemo(() => {
    if (category === "preterm") return 0.33;
    if (category === "term") return 0.45;
    
    // For children 1-16y:
    // Enzymatic (IDMS-traceable) = 0.413
    // Traditional Jaffe = 0.55
    return assay === "enzymatic" ? 0.413 : 0.55;
  }, [category, assay]);

  const gfr = useMemo(() => {
    if (!isValid) return null;
    return calculateSchwartzGFR(hNum, crNum, constant, unit === "umolL");
  }, [hNum, crNum, constant, unit, isValid]);

  const interpretation = useMemo(() => {
    if (gfr === null) return null;
    if (gfr >= 90) return { label: "Normal / Stage 1", color: "text-green-600", bg: "bg-green-50" };
    if (gfr >= 60) return { label: "Mild Decrease / Stage 2", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (gfr >= 30) return { label: "Moderate Decrease / Stage 3", color: "text-orange-600", bg: "bg-orange-50" };
    if (gfr >= 15) return { label: "Severe Decrease / Stage 4", color: "text-red-600", bg: "bg-red-50" };
    return { label: "Kidney Failure / Stage 5", color: "text-red-800", bg: "bg-red-100" };
  }, [gfr]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">GFR Calculator</h1>
          <p className="text-muted-foreground text-sm">Latest Bedside Schwartz Formula (KDIGO 2024/2025)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" /> Patient & Lab Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age / Maturity</Label>
                <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="preterm" className="text-xs">Preterm</TabsTrigger>
                        <TabsTrigger value="term" className="text-xs">Term Infant</TabsTrigger>
                        <TabsTrigger value="child" className="text-xs">Child (1-16y)</TabsTrigger>
                    </TabsList>
                </Tabs>
              </div>

              {category === "child" && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Creatinine Assay Method</Label>
                    <Select value={assay} onValueChange={(v: any) => setAssay(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="enzymatic">Enzymatic / IDMS (Modern)</SelectItem>
                            <SelectItem value="jaffe">Traditional Jaffe (Older)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Creatinine Units</Label>
                <Tabs value={unit} onValueChange={(v: any) => setUnit(v)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="mgdL" className="text-xs">mg/dL</TabsTrigger>
                        <TabsTrigger value="umolL" className="text-xs">µmol/L (SI)</TabsTrigger>
                    </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary" /> Measurements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Height (cm)</Label>
                <Input 
                  type="number" 
                  placeholder="e.g. 110" 
                  className="h-11 font-mono text-lg"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Serum Creatinine</Label>
                <div className="relative">
                    <Input 
                    type="number" 
                    step="0.01"
                    placeholder={unit === "mgdL" ? "e.g. 0.6" : "e.g. 53"} 
                    className="h-11 font-mono text-lg pr-16"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">
                        {unit === "mgdL" ? "mg/dL" : "µmol/L"}
                    </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {isValid && gfr && interpretation ? (
            <>
              <Card className={cn("border-2 border-orange-200 shadow-md", interpretation.bg)}>
                <CardHeader className="pb-2 text-center">
                  <Badge className="w-fit mx-auto mb-2 bg-orange-600 uppercase font-black tracking-tighter">Calculated eGFR</Badge>
                  <CardTitle className="text-6xl font-black font-mono text-orange-700 tracking-tighter">
                    {gfr.toFixed(1)}
                  </CardTitle>
                  <p className="text-[10px] font-black text-orange-800/60 uppercase mt-1 tracking-widest">mL/min/1.73m²</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-1 p-4 rounded-xl bg-background/60 border border-orange-100 shadow-sm">
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clinical Staging</span>
                     <span className={cn("font-bold text-lg", interpretation.color)}>{interpretation.label}</span>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-orange-100/50 flex justify-between items-center text-[11px]">
                      <span className="font-bold text-orange-800/70">Selected Constant (k):</span>
                      <span className="font-mono font-black text-orange-900">{constant.toFixed(3)}</span>
                  </div>
                </CardContent>
              </Card>

              {gfr < 90 && (
                  <Alert className="bg-destructive/5 border-destructive/20">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <AlertDescription className="text-destructive text-xs font-medium leading-relaxed">
                          <strong>Note:</strong> In children &gt; 2 years, eGFR &lt; 90 is considered the threshold for potential renal impairment (KDIGO 2024). Adjust renally-cleared medications.
                      </AlertDescription>
                  </Alert>
              )}

              <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Scoring Reference</h4>
                    <div className="space-y-2">
                        {[
                            { r: "> 90", m: "Stage 1 (Normal)" },
                            { r: "60 - 89", m: "Stage 2 (Mild ↓)" },
                            { r: "30 - 59", m: "Stage 3 (Mod ↓)" },
                            { r: "15 - 29", m: "Stage 4 (Severe ↓)" },
                            { r: "< 15", m: "Stage 5 (Failure)" },
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between text-[11px] py-1 border-b border-border/50 last:border-0">
                                <span className="font-mono font-bold text-primary">{row.r}</span>
                                <span className="text-muted-foreground">{row.m}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center bg-muted/20">
              <Calculator className="h-12 w-11 text-muted-foreground/20 mb-4" />
              <h3 className="font-bold text-muted-foreground/80">Awaiting Inputs</h3>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed max-w-[240px]">
                Please complete the patient profile and measurements to see the GFR calculation.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-[10px] text-muted-foreground leading-relaxed border-t pt-4">
        <p><strong>Clinical Note:</strong> The Schwartz formula is an estimate. It may be inaccurate in children with extreme muscle mass (e.g. neuromuscular disease) or those with rapid weight changes. For chronic kidney disease (CKD) monitoring, consider Cystatin C-based equations or the new CKiD U25 formula (KDIGO 2024).</p>
      </div>
    </div>
  );
}
