import { useState, useMemo } from "react";
import { 
  Activity, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, FlaskConical, Wind, Stethoscope, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function AbgInterpreter() {
  const [ph, setPh] = useState<string>("");
  const [pco2, setPco2] = useState<string>("");
  const [hco3, setHco3] = useState<string>("");
  const [anionGap, setAnionGap] = useState<string>("");

  const phNum = parseFloat(ph);
  const pco2Num = parseFloat(pco2);
  const hco3Num = parseFloat(hco3);
  const agNum = parseFloat(anionGap);

  const isValid = !isNaN(phNum) && !isNaN(pco2Num) && !isNaN(hco3Num);

  const interpretation = useMemo(() => {
    if (!isValid) return null;

    let primary = "";
    let pathologyType: "Simple" | "Compensated" | "Mixed" = "Simple";
    let compensationStatus = "";
    let differentials: string[] = [];
    let color = "text-primary";
    let bg = "bg-primary/5";

    // 1. Determine Primary Acidemia/Alkalemia
    const isAcidemia = phNum < 7.35;
    const isAlkalemia = phNum > 7.45;
    const isNormalPh = !isAcidemia && !isAlkalemia;

    // 2. Identify Primary Process
    if (isAcidemia) {
        if (pco2Num > 45) {
            primary = "Respiratory Acidosis";
            color = "text-red-700";
            bg = "bg-red-50";
            
            // Compensation for Resp Acidosis (Acute vs Chronic)
            const expectedHco3Acute = 24 + ((pco2Num - 40) / 10);
            if (hco3Num > expectedHco3Acute + 2) {
                pathologyType = "Compensated";
                compensationStatus = "Metabolic Compensation (Likely Chronic)";
            } else if (hco3Num < expectedHco3Acute - 2) {
                pathologyType = "Mixed";
                compensationStatus = "Mixed Respiratory & Metabolic Acidosis";
                differentials.push("Concurrent Shock/Sepsis", "Renal Failure");
            } else {
                compensationStatus = "Acute (Uncompensated)";
            }
            differentials.push("Upper Airway Obstruction (Croup/FBA)", "Severe Asthma", "Opiate Overdose", "Neuromuscular Weakness");
        } else {
            primary = "Metabolic Acidosis";
            color = "text-red-700";
            bg = "bg-red-50";
            
            // Winter's Formula: Expected pCO2 = (1.5 * HCO3) + 8 +/- 2
            const expectedPco2 = (1.5 * hco3Num) + 8;
            if (pco2Num < expectedPco2 - 2) {
                pathologyType = "Mixed";
                compensationStatus = "Mixed Metabolic Acidosis & Respiratory Alkalosis";
                differentials.push("Salicylate Poisoning", "Sepsis + Early ARDS");
            } else if (pco2Num > expectedPco2 + 2) {
                pathologyType = "Mixed";
                compensationStatus = "Mixed Metabolic & Respiratory Acidosis";
                differentials.push("Cardiac Arrest", "Severe Pulmonary Edema");
            } else {
                pathologyType = "Compensated";
                compensationStatus = "Appropriate Respiratory Compensation";
            }
            
            if (agNum > 12) {
                differentials.push("DKA", "Uremia", "Lactic Acidosis (Shock)", "Ingestions (MUDPILES)");
            } else {
                differentials.push("Diarrhea", "RTA", "Early Renal Failure");
            }
        }
    } else if (isAlkalemia) {
        if (pco2Num < 35) {
            primary = "Respiratory Alkalosis";
            color = "text-blue-700";
            bg = "bg-blue-50";
            
            const expectedHco3Acute = 24 - (2 * ((40 - pco2Num) / 10));
            if (hco3Num < expectedHco3Acute - 2) {
                pathologyType = "Compensated";
                compensationStatus = "Metabolic Compensation";
            } else {
                compensationStatus = "Acute (Uncompensated)";
            }
            differentials.push("Anxiety/Pain", "Early Sepsis", "Fever", "Salicylate Toxicity (Early)");
        } else {
            primary = "Metabolic Alkalosis";
            color = "text-blue-700";
            bg = "bg-blue-50";
            
            // Expected pCO2 = (0.7 * HCO3) + 21 +/- 2
            const expectedPco2 = (0.7 * hco3Num) + 21;
            if (pco2Num > expectedPco2 + 2) {
                pathologyType = "Mixed";
                compensationStatus = "Mixed Metabolic Alkalosis & Respiratory Acidosis";
            } else {
                pathologyType = "Compensated";
                compensationStatus = "Appropriate Respiratory Compensation";
            }
            differentials.push("Severe Vomiting (Pyloric Stenosis)", "Diuretic Use", "Nasogastric Suctioning");
        }
    } else {
        primary = "Normal Acid-Base Status";
        color = "text-green-700";
        bg = "bg-green-50";
        if (pco2Num !== 40 || hco3Num !== 24) {
            pathologyType = "Mixed";
            primary = "Compensated Disturbances";
            compensationStatus = "Check for hidden mixed disorder (e.g. DKA + Vomiting)";
        }
    }

    return { primary, pathologyType, compensationStatus, differentials, color, bg };
  }, [phNum, pco2Num, hco3Num, agNum, isValid]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-20">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200">
          <Wind className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight text-slate-800">Advanced ABG Interpreter</h1>
          <p className="text-muted-foreground text-sm font-medium">Mixed disturbance detection and clinical differential engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS SECTION */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-sm h-fit">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Lab Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">pH (Arterial/Venous)</Label>
                    <Input type="number" inputMode="decimal" step="0.01" placeholder="7.40" className="h-11 font-mono text-lg border-2 focus:border-slate-400" value={ph} onChange={(e) => setPh(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">pCO2 (mmHg)</Label>
                    <Input type="number" inputMode="decimal" placeholder="40" className="h-11 font-mono text-lg border-2 focus:border-slate-400" value={pco2} onChange={(e) => setPco2(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">HCO3- (mEq/L)</Label>
                    <Input type="number" inputMode="decimal" placeholder="24" className="h-11 font-mono text-lg border-2 focus:border-slate-400" value={hco3} onChange={(e) => setHco3(e.target.value)} />
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-indigo-700">Anion Gap (Optional)</Label>
                    <Input type="number" inputMode="decimal" placeholder="e.g. 15" className="h-11 font-mono border-dashed" value={anionGap} onChange={(e) => setAnionGap(e.target.value)} />
                    <p className="text-[9px] text-muted-foreground italic">Required for refined metabolic acidosis differentials.</p>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-xl">
              <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Clinical Rule</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                      Always compare the ABG result with the <strong>clinical picture</strong>. If the patient is well-appearing but has a severe acidosis, consider lab error or venous contamination.
                  </p>
              </CardContent>
          </Card>
        </div>

        {/* INTERPRETATION SECTION */}
        <div className="lg:col-span-8 space-y-6">
            {isValid && interpretation ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <Card className={cn("border-2 shadow-md transition-colors", interpretation.bg)}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge className={cn("font-black tracking-tighter uppercase", 
                                    interpretation.pathologyType === "Mixed" ? "bg-red-600" : "bg-slate-700")}>
                                    {interpretation.pathologyType} Disturbance
                                </Badge>
                                {interpretation.pathologyType === "Mixed" && (
                                    <AlertCircle className="h-5 w-5 text-red-600 animate-pulse" />
                                )}
                            </div>
                            <CardTitle className={cn("text-4xl font-black font-headline tracking-tight", interpretation.color)}>
                                {interpretation.primary}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-background/60 border border-muted shadow-sm">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Calculated Compensation</p>
                                <p className="text-base font-bold text-slate-800">{interpretation.compensationStatus}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* DIFFERENTIALS ENGINE */}
                    <Card className="border-2 border-primary/10 shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-3">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> Suspected Primary Diseases
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {interpretation.differentials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {interpretation.differentials.map((diff, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-muted/50">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="text-sm font-bold text-slate-700">{diff}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic text-center py-4">
                                    No specific differentials identified. Correlate with physical exam.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Alert className="bg-muted/30 border-dashed rounded-2xl">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs font-medium leading-relaxed">
                            <strong>Note:</strong> Venous blood gas (VBG) pH is typically 0.03 - 0.04 units lower than arterial, and pCO2 is ~6 mmHg higher. Use caution when interpreting mixed disturbances from a VBG.
                        </AlertDescription>
                    </Alert>
                </div>
            ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Wind className="h-16 w-16 text-slate-200 mb-6" />
                    <h3 className="text-2xl font-black text-muted-foreground/80 tracking-tight text-slate-400 uppercase">ABG Logic Armed</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[320px]">
                        Enter pH, pCO2, and HCO3 to reveal primary disturbances, compensation status, and clinical differentials.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
