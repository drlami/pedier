"use client";

import { useMemo } from "react";
import { Wind, Syringe, Ruler, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface UnifiedAirwayPanelProps {
  weight: number;
  ageInYears?: number;
  ageCategory?: string;
  patientType: string;
}

const round = (value: number, decimals = 1) => Number(value.toFixed(decimals));

const roundToHalf = (num: number) => (Math.round(num * 2) / 2).toFixed(1);

const getEtt = (
  ageInYears: number | undefined,
  weight: number,
  patientType: string
) => {
  if (patientType === "neonate" || (ageInYears !== undefined && ageInYears < 1 / 12)) {
    let size = 3.5;
    if (weight < 1) size = 2.5;
    else if (weight < 2) size = 3.0;
    else if (weight < 3) size = 3.0;
    else size = 3.5;

    return {
      cuffed: "Usually uncuffed",
      uncuffed: size.toFixed(1),
      depth: `${round(weight + 6, 1)} cm`,
      blade: "Miller 0–1",
      note: "Neonate estimate: depth ≈ weight + 6 cm.",
    };
  }

  if (ageInYears === undefined || ageInYears < 1) {
    return {
      cuffed: "3.0 or 3.5",
      uncuffed: "3.5 or 4.0",
      depth: "10–12 cm",
      blade: "Miller 1",
      note: "Prepare selected tube + 0.5 smaller + 0.5 larger.",
    };
  }

  const uncuffed = ageInYears / 4 + 4;
  const cuffed = ageInYears / 4 + 3.5;
  const depth = Math.round(Number(roundToHalf(cuffed)) * 3);

  let blade = "Mac 2";
  if (ageInYears < 3) blade = "Miller 1.5–2";
  else if (ageInYears < 8) blade = "Mac 2";
  else blade = "Mac 3";

  return {
    cuffed: roundToHalf(cuffed),
    uncuffed: roundToHalf(uncuffed),
    depth: `${depth} cm`,
    blade,
    note: "Prepare selected tube + 0.5 smaller + 0.5 larger.",
  };
};

export function UnifiedAirwayPanel({ weight, ageInYears, ageCategory, patientType }: UnifiedAirwayPanelProps) {
  const ett = useMemo(() => getEtt(ageInYears, weight, patientType), [ageInYears, weight, patientType]);

  const drugs = useMemo(() => {
    return {
      ketamine: {
        dose: `${weight.toFixed(1)}–${(2 * weight).toFixed(1)} mg`,
        label: "Ketamine (1–2 mg/kg)"
      },
      rocuronium: {
        dose: `${(1.2 * weight).toFixed(1)} mg`,
        label: "Rocuronium (1.2 mg/kg)"
      },
      atropine: {
        dose: `${Math.max(0.1, Math.min(0.02 * weight, ageCategory === "adolescent" ? 1 : 0.5)).toFixed(2)} mg`,
        label: "Atropine (0.02 mg/kg)"
      }
    };
  }, [weight, ageCategory]);

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-blue-800 uppercase tracking-wide">
          <Wind className="h-4 w-4" />
          Airway & RSI Essentials
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
              <Ruler className="h-3 w-3" /> ETT Sizing
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Cuffed</span>
                <span className="font-bold">{ett.cuffed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Uncuffed</span>
                <span className="font-bold">{ett.uncuffed}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-blue-50 mt-1">
                <span className="text-slate-500">Depth</span>
                <span className="font-bold text-blue-700">{ett.depth}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Equipment</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Blade</span>
                <span className="font-bold">{ett.blade}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">LMA</span>
                <span className="font-bold">{weight < 5 ? "1" : weight < 10 ? "1.5" : weight < 20 ? "2" : "2.5+"}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{ett.note}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
          <p className="text-[10px] font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
            <Syringe className="h-3 w-3" /> Critical RSI Doses
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
              <span className="text-slate-600">Ketamine <span className="text-[10px] opacity-70">(1-2mg/kg)</span></span>
              <span className="font-bold text-blue-700">{drugs.ketamine.dose}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-50 last:border-0">
              <span className="text-slate-600">Rocuronium <span className="text-[10px] opacity-70">(1.2mg/kg)</span></span>
              <span className="font-bold text-blue-700">{drugs.rocuronium.dose}</span>
            </div>
          </div>
        </div>

        <Alert className="bg-blue-100/50 border-blue-200 py-2">
          <ShieldAlert className="h-3.5 w-3.5 text-blue-700" />
          <AlertDescription className="text-[11px] text-blue-800 leading-tight">
            Prepare backup airway, suction, and BVM. Confirm ETT position with ETCO₂ and bilateral sounds.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
