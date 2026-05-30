import { useState, useMemo } from "react";
import { 
  FlaskConical, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Droplets, Zap, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const TARGETS = {
  kcal: { min: 90, max: 120, label: "90-120" },
  npcn: { min: 150, max: 200, label: "150-200" },
  gir: { min: 4, max: 12, label: "4-12" },
  protein: { min: 3.0, max: 4.5, label: "3.0-4.5" },
  lipid: { min: 2.0, max: 3.5, label: "2.0-3.5" },
};

export default function NeonatalTpnCalc() {
  const [weight, setWeight] = useState<string>("");
  const [totalFluid, setTotalFluid] = useState<string>("");
  const [gir, setGir] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [lipid, setLipid] = useState<string>("");
  const [na, setNa] = useState<string>("");
  const [k, setK] = useState<string>("");

  const results = useMemo(() => {
    const w = parseFloat(weight);
    const tf = parseFloat(totalFluid);
    const g = parseFloat(gir);
    const p = parseFloat(protein);
    const l = parseFloat(lipid);
    const naVal = parseFloat(na) || 0;
    const kVal = parseFloat(k) || 0;

    if (isNaN(w) || isNaN(tf) || isNaN(g) || isNaN(p) || isNaN(l)) return null;

    const totalDailyVolume = tf * w;
    const proteinVol = (p * w * 100) / 10; // Assuming 10% Amino Acids
    const lipidVol = (l * w * 100) / 20;   // Assuming 20% Intralipid
    
    const lipidRate = lipidVol / 24;
    const mainIvDailyVol = totalDailyVolume - lipidVol;
    const mainIvRate = mainIvDailyVol / 24;

    const dextroseRequired = (g * 6 * w) / mainIvRate;

    // Mixing Calculation (using D50 as base)
    const d50Vol = (dextroseRequired / 50) * mainIvDailyVol;
    const sterileWaterAndAdditives = mainIvDailyVol - proteinVol - d50Vol;

    // Nutritional Calculations
    const proteinKcal = p * w * 4;
    const dextroseGrams = (dextroseRequired / 100) * mainIvDailyVol;
    const dextroseKcal = dextroseGrams * 3.4;
    const lipidKcal = lipidVol * 2; // 20% Intralipid = 2 kcal/mL
    
    const totalKcal = proteinKcal + dextroseKcal + lipidKcal;
    const kcalPerKg = totalKcal / w;
    
    const nitrogen = (p * w) / 6.25;
    const nonProteinKcal = dextroseKcal + lipidKcal;
    const npcNRatio = nitrogen > 0 ? nonProteinKcal / nitrogen : 0;

    return {
      totalDailyVolume,
      mainIvRate,
      lipidRate,
      proteinVol,
      lipidVol,
      mainIvDailyVol,
      d50Vol,
      sterileWaterAndAdditives,
      dextroseRequired: Math.min(dextroseRequired, 30),
      kcalPerKg,
      totalKcal,
      nitrogen,
      npcNRatio,
      naTotal: naVal * w,
      kTotal: kVal * w,
      caloricSplit: {
        dextrose: (dextroseKcal / totalKcal) * 100,
        protein: (proteinKcal / totalKcal) * 100,
        lipid: (lipidKcal / totalKcal) * 100
      }
    };
  }, [weight, totalFluid, gir, protein, lipid, na, k]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
          <FlaskConical className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Neonatal TPN</h1>
          <p className="text-muted-foreground text-sm font-medium">Nutritional & Electrolyte Titration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-2 shadow-sm h-fit">
            <CardHeader className="bg-muted/20 pb-4">
                <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground">TPN Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Weight (kg)</label>
                  <Input type="number" inputMode="decimal" placeholder="e.g. 1.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Fluid Quota (mL/kg/d)</label>
                  <Input type="number" inputMode="decimal" placeholder="e.g. 150" value={totalFluid} onChange={(e) => setTotalFluid(e.target.value)} className="h-11" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">GIR</label>
                    <span className="text-[9px] font-bold text-muted-foreground/60">{TARGETS.gir.label}</span>
                  </div>
                  <Input type="number" inputMode="decimal" placeholder="4-8" value={gir} onChange={(e) => setGir(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Protein</label>
                    <span className="text-[9px] font-bold text-muted-foreground/60">{TARGETS.protein.label}</span>
                  </div>
                  <Input type="number" inputMode="decimal" placeholder="g/kg" value={protein} onChange={(e) => setProtein(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Lipids</label>
                    <span className="text-[9px] font-bold text-muted-foreground/60">{TARGETS.lipid.label}</span>
                  </div>
                  <Input type="number" inputMode="decimal" placeholder="g/kg" value={lipid} onChange={(e) => setLipid(e.target.value)} className="h-11" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">Sodium (mEq/kg/d)</label>
                  <Input type="number" inputMode="decimal" placeholder="2-4" value={na} onChange={(e) => setNa(e.target.value)} className="h-11 border-blue-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-600 tracking-tighter">Potassium (mEq/kg/d)</label>
                  <Input type="number" inputMode="decimal" placeholder="1-2" value={k} onChange={(e) => setK(e.target.value)} className="h-11 border-emerald-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          {results && (
            <Card className="border-2 border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b pb-3">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5" /> Pharmacy Mixing Guide (Daily)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y text-[11px]">
                        <div className="p-3 flex justify-between items-center bg-violet-50/30">
                            <span className="font-bold text-violet-900">1. Amino Acids (10%)</span>
                            <span className="font-mono font-black text-violet-700 bg-white px-2 py-0.5 rounded border border-violet-100">{results.proteinVol.toFixed(1)} mL</span>
                        </div>
                        <div className="p-3 flex justify-between items-center bg-amber-50/30">
                            <span className="font-bold text-amber-900">2. Dextrose (50%)</span>
                            <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-100">{results.d50Vol.toFixed(1)} mL</span>
                        </div>
                        <div className="p-3 flex justify-between items-center bg-blue-50/30">
                            <span className="font-bold text-blue-900">3. Sodium (Daily mEq)</span>
                            <span className="font-mono font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-100">{results.naTotal.toFixed(1)} mEq</span>
                        </div>
                        <div className="p-3 flex justify-between items-center bg-emerald-50/30">
                            <span className="font-bold text-emerald-900">4. Potassium (Daily mEq)</span>
                            <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-100">{results.kTotal.toFixed(1)} mEq</span>
                        </div>
                        <div className="p-3 flex justify-between items-center bg-slate-50/50">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">5. Water + Electrolytes</span>
                              <span className="text-[9px] text-muted-foreground italic">Add water/lytes until bag reaches total vol</span>
                            </div>
                            <span className="font-mono font-black text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-100">Fill to {results.mainIvDailyVol.toFixed(1)} mL</span>
                        </div>
                        <div className="p-3 flex justify-between items-center font-black bg-slate-100 text-slate-800 border-t-2">
                            <span>TOTAL MAIN IV BAG VOLUME</span>
                            <span className="font-mono text-sm">{results.mainIvDailyVol.toFixed(1)} mL</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}

          {results && (
            <Card className="border-2 border-primary/20 shadow-sm">
                <CardHeader className="bg-primary/5 border-b pb-3">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Info className="h-3.5 w-3.5" /> Preparation Procedure
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-[11px] leading-relaxed">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">1</div>
                        <p><strong>Prepare Main Bag:</strong> In a sterile environment, draw the calculated volumes of <strong>Amino Acids ({results.proteinVol.toFixed(1)} mL)</strong> and <strong>Dextrose 50% ({results.d50Vol.toFixed(1)} mL)</strong> into a single IV bag.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">2</div>
                        <p><strong>Add Electrolytes:</strong> Draw your daily <strong>Sodium ({results.naTotal.toFixed(1)} mEq)</strong> and <strong>Potassium ({results.kTotal.toFixed(1)} mEq)</strong>. Inject them into the bag.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">3</div>
                        <p><strong>Top Up Fluid:</strong> Add Sterile Water for Injection until the bag reaches exactly <strong>{results.mainIvDailyVol.toFixed(1)} mL</strong>. Label this as "Main TPN".</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">4</div>
                        <p><strong>Setup Pumps:</strong> Set pump A (Main TPN) to <strong>{results.mainIvRate.toFixed(1)} mL/hr</strong>. Set pump B (Lipids 20%) to <strong>{results.lipidRate.toFixed(1)} mL/hr</strong> using a separate syringe.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">5</div>
                        <p><strong>Y-Site Connection:</strong> Connect the lipid line to the main IV line as close to the patient as possible (Y-site) and start infusion.</p>
                      </div>
                    </div>
                </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
            {results ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className={cn("border-2 shadow-md transition-colors", 
                        results.kcalPerKg >= TARGETS.kcal.min && results.kcalPerKg <= TARGETS.kcal.max ? "border-green-500 bg-green-50" : "border-primary/20 bg-primary/5")}>
                        <CardHeader className="pb-2 text-center">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest block mb-1">Total Calories</span>
                            <CardTitle className="text-4xl font-black font-mono text-slate-800 tracking-tighter">
                                {results.kcalPerKg.toFixed(1)}
                            </CardTitle>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">kcal/kg/day</span>
                            <Badge variant="outline" className="mt-2 mx-auto text-[9px] border-slate-300">Target: {TARGETS.kcal.label}</Badge>
                        </CardHeader>
                    </Card>
                    <Card className={cn("border-2 shadow-md transition-colors", 
                        results.npcNRatio >= TARGETS.npcn.min && results.npcNRatio <= TARGETS.npcn.max ? "border-green-500 bg-green-50" : "border-indigo-200 bg-indigo-50")}>
                        <CardHeader className="pb-2 text-center relative group">
                            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-widest block mb-1 flex items-center justify-center gap-1">
                              NPC : N Ratio <Info className="h-3 w-3 opacity-50" />
                            </span>
                            <CardTitle className="text-4xl font-black font-mono text-slate-800 tracking-tighter">
                                {results.npcNRatio.toFixed(0)}:1
                            </CardTitle>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Growth Efficiency</span>
                            <Badge variant="outline" className="mt-2 mx-auto text-[9px] border-slate-300">Target: {TARGETS.npcn.label}</Badge>
                            
                            {/* In-UI Explanation */}
                            <div className="absolute top-full left-0 right-0 z-10 mt-2 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left leading-relaxed">
                              <strong>What is NPC:N?</strong><br/>
                              The ratio of Non-Protein Calories (Dextrose + Lipids) to Nitrogen (from Protein). 
                              A ratio of <strong>150-200:1</strong> ensures protein is used for <strong>growth</strong> rather than being burned for energy.
                            </div>
                        </CardHeader>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <TpnResultCard title="Main IV" value={results.mainIvRate} unit="mL/hr" color="violet" />
                    <TpnResultCard title="Lipids" value={results.lipidRate} unit="mL/hr" color="blue" />
                    <TpnResultCard title="Dextrose" value={results.dextroseRequired} unit="%" color="amber" />
                    <TpnResultCard title="Nitrogen" value={results.nitrogen} unit="g/kg" color="emerald" />
                  </div>

                  <Card className="border-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Caloric Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-4 w-full flex rounded-full overflow-hidden bg-muted">
                            <div style={{ width: `${results.caloricSplit.dextrose}%` }} className="h-full bg-amber-400" />
                            <div style={{ width: `${results.caloricSplit.lipid}%` }} className="h-full bg-blue-400" />
                            <div style={{ width: `${results.caloricSplit.protein}%` }} className="h-full bg-emerald-400" />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-400" /> Dextrose ({results.caloricSplit.dextrose.toFixed(0)}%)</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-blue-400" /> Lipids ({results.caloricSplit.lipid.toFixed(0)}%)</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-400" /> Protein ({results.caloricSplit.protein.toFixed(0)}%)</div>
                        </div>
                    </CardContent>
                  </Card>

                  <Alert className={cn("border-none shadow-md", results.dextroseRequired > 12.5 ? "bg-amber-500 text-white" : "bg-slate-800 text-white")}>
                    <Zap className="h-4 w-4" />
                    <div className="ml-2">
                        <AlertDescription className="text-[11px] leading-relaxed font-bold">
                          {results.dextroseRequired > 12.5 
                            ? `⚠️ Dextrose ${results.dextroseRequired.toFixed(1)}% REQUIRES CENTRAL LINE access.`
                            : `Dextrose ${results.dextroseRequired.toFixed(1)}% is safe for peripheral administration.`}
                        </AlertDescription>
                    </div>
                  </Alert>

                  <Card className="bg-muted/30 border-dashed">
                      <CardContent className="pt-6 text-center">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Summary of Daily Requirements</div>
                          <div className="grid grid-cols-3 gap-4">
                              <div>
                                  <span className="text-[9px] font-bold text-muted-foreground block mb-1">CALORIES</span>
                                  <span className="text-sm font-black font-mono">90-120</span>
                              </div>
                              <div>
                                  <span className="text-[9px] font-bold text-muted-foreground block mb-1">PROTEIN</span>
                                  <span className="text-sm font-black font-mono">3.0-4.5</span>
                              </div>
                              <div>
                                  <span className="text-[9px] font-bold text-muted-foreground block mb-1">LIPIDS</span>
                                  <span className="text-sm font-black font-mono">2.0-3.5</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                </>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Droplets className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Prescription Ready</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                      Enter weight and daily targets to calculate hourly rates, concentrations, and nutritional balance.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function TpnResultCard({ title, value, unit, color, subValue }: { title: string, value: number, unit: string, color: string, subValue?: string }) {
  const colors: Record<string, string> = {
    violet: "bg-violet-50 border-violet-100 text-violet-900",
    amber: "bg-amber-50 border-amber-100 text-amber-900",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-900",
    blue: "bg-blue-50 border-blue-100 text-blue-900"
  };

  return (
    <Card className={cn("border-2 shadow-sm", colors[color])}>
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase opacity-60 tracking-widest block">{title}</span>
          {subValue && <span className="text-[9px] font-bold opacity-40 uppercase">{subValue}</span>}
        </div>
        <div className="text-right">
          <span className="text-2xl font-black font-mono">{value.toFixed(1)}</span>
          <span className="text-xs font-bold ml-1 opacity-60 italic">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}
