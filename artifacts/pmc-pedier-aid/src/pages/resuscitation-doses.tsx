import { useState, useMemo } from "react";
import { 
  ArrowLeft, Search, Pill, ShieldAlert, History, Activity, Droplets, Info, Timer, Scale, AlertTriangle
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

// --- Clinical Definitions for PediDose Resus ---
interface ResusDrug {
    id: string;
    name: string;
    indication: string;
    dosePerKg: number;
    maxDose: number;
    concentration: number; // mg/mL
    unit: string;
    dilution?: string;
    caution?: string;
}

const RESUS_DRUGS: ResusDrug[] = [
    {
        id: "adrenaline",
        name: "Adrenaline (1:10,000)",
        indication: "Cardiac Arrest",
        dosePerKg: 0.01,
        maxDose: 1,
        concentration: 0.1, // 0.1 mg/mL
        unit: "mg",
        caution: "IV/IO Only. Do not use 1:1,000 IV."
    },
    {
        id: "adrenaline-im",
        name: "Adrenaline (1:1,000)",
        indication: "Anaphylaxis",
        dosePerKg: 0.01,
        maxDose: 0.5,
        concentration: 1, // 1 mg/mL
        unit: "mg",
        caution: "IM Only (Anterolateral Thigh)."
    },
    {
        id: "amiodarone",
        name: "Amiodarone",
        indication: "Refractory VF / Pulseless VT",
        dosePerKg: 5,
        maxDose: 300,
        concentration: 50, // 50 mg/mL
        unit: "mg",
        dilution: "Dilute in D5W for maintenance infusions."
    },
    {
        id: "atropine",
        name: "Atropine",
        indication: "Bradycardia",
        dosePerKg: 0.02,
        maxDose: 0.5,
        concentration: 0.6, // 0.6 mg/mL
        unit: "mg",
        caution: "Minimum dose 0.1mg to avoid paradoxical bradycardia."
    },
    {
        id: "adenosine-1",
        name: "Adenosine (1st Dose)",
        indication: "SVT",
        dosePerKg: 0.1,
        maxDose: 6,
        concentration: 3, // 3 mg/mL
        unit: "mg",
        caution: "Rapid IV push + Immediate flush."
    },
    {
        id: "adenosine-2",
        name: "Adenosine (2nd Dose)",
        indication: "SVT",
        dosePerKg: 0.2,
        maxDose: 12,
        concentration: 3, // 3 mg/mL
        unit: "mg"
    }
];

export default function ResuscitationDosingPage() {
  const [weight, setWeight] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const wNum = parseFloat(weight);
  const isValid = !isNaN(wNum) && wNum > 0 && wNum <= 150;

  const filteredDrugs = useMemo(() => {
    return RESUS_DRUGS.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.indication.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 pb-20">
      <Link href="/drug-doses">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Drugs
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-100">
                <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-4xl font-black font-headline tracking-tight text-red-700">PediDose: Emergency</h1>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">High-Precision Resuscitation Dosing</p>
            </div>
        </div>
        
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search emergency drugs..." 
                className="pl-9 h-12 border-2 focus:border-red-500 rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* WEIGHT INPUT BAR */}
      <Card className="mb-8 border-4 border-red-600 shadow-xl overflow-hidden animate-pulse-slow">
        <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch">
                <div className="bg-red-600 text-white p-6 flex flex-col justify-center items-center md:w-64 gap-2">
                    <Scale className="h-8 w-8 opacity-50" />
                    <p className="text-xs font-black uppercase tracking-widest">Active Weight</p>
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row items-center gap-6 bg-red-50/50">
                    <div className="w-full md:w-48">
                        <Input 
                            type="number" 
                            inputMode="decimal"
                            placeholder="0.0" 
                            className="h-16 text-4xl font-black font-mono text-center border-none shadow-none bg-transparent focus-visible:ring-0"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            autoFocus
                        />
                        <div className="h-1 bg-red-200 rounded-full overflow-hidden">
                            <div className={cn("h-full bg-red-600 transition-all", isValid ? "w-full" : "w-0")} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-red-200">kg</p>
                    {isValid ? (
                        <div className="flex-1 text-center md:text-left animate-in slide-in-from-left">
                            <p className="text-red-700 font-black text-sm uppercase tracking-tight">System Armed</p>
                            <p className="text-xs text-red-600/70 font-medium">All doses below are now live-calculated for {wNum} kg.</p>
                        </div>
                    ) : (
                        <p className="flex-1 text-muted-foreground text-sm font-bold animate-bounce">Enter patient weight to unlock calculations...</p>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>

      {/* DRUG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} weight={wNum} isValid={isValid} />
        ))}
      </div>

      {/* FOOTER DISCLAIMER */}
      <div className="mt-12 p-8 rounded-[40px] bg-muted/30 border-4 border-dashed border-muted text-center space-y-4">
          <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Emergency Safety Protocol</h4>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
              Calculations are based on standard PALS/APLS concentrations. Always verify the physical vial concentration before administration. Maximum doses are capped at adult limits automatically.
          </p>
      </div>
    </div>
  );
}

function DrugCard({ drug, weight, isValid }: { drug: ResusDrug, weight: number, isValid: boolean }) {
    const calculation = useMemo(() => {
        if (!isValid) return null;
        let doseMg = drug.dosePerKg * weight;
        let capped = false;
        
        if (doseMg > drug.maxDose) {
            doseMg = drug.maxDose;
            capped = true;
        }

        const volume = doseMg / drug.concentration;
        return { doseMg, volume, capped };
    }, [drug, weight, isValid]);

    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 border-2",
            isValid ? "hover:border-red-500 hover:shadow-2xl shadow-red-100" : "opacity-60 bg-muted/20"
        )}>
            {/* Background Decoration */}
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="h-32 w-32" />
            </div>

            <CardHeader className="pb-3 border-b border-muted">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-black tracking-tight group-hover:text-red-600 transition-colors">{drug.name}</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{drug.indication}</CardDescription>
                    </div>
                    {calculation?.capped && (
                        <Badge variant="destructive" className="animate-pulse">MAX CAP</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Total Dose ({drug.unit})</p>
                        <p className="text-2xl font-black font-mono">
                            {isValid ? calculation?.doseMg.toFixed(drug.dosePerKg < 0.1 ? 3 : 2) : "--"}
                            <span className="text-xs font-bold ml-1 opacity-40">{drug.unit}</span>
                        </p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Draw Up (mL)</p>
                        <p className="text-2xl font-black font-mono text-red-600">
                            {isValid ? calculation?.volume.toFixed(2) : "--"}
                            <span className="text-xs font-bold ml-1 opacity-40 text-muted-foreground">mL</span>
                        </p>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-muted space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground uppercase tracking-widest">Base Formula</span>
                        <span>{drug.dosePerKg} {drug.unit}/kg</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground uppercase tracking-widest">Stock Concentration</span>
                        <span>{drug.concentration} {drug.unit}/mL</span>
                    </div>
                </div>

                {drug.caution && (
                    <div className="flex gap-2 items-center p-2 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-800">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {drug.caution}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
