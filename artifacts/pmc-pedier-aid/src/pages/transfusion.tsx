import { useState, useMemo } from "react";
import { Syringe, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BLOOD_PRODUCTS = [
  {
    id: "prbc",
    label: "Packed Red Blood Cells (PRBC)",
    hbProduct: 200, // g/L (Hb of packed cells ~200 g/L = 20 g/dL)
    formula: "Vol (mL) = Weight (kg) × ΔHb (g/dL) × 3",
    formulaDetail: "Factor 3 assumes PRBC Hb ≈ 200 g/L. Adjust for dilute blood (factor 4–5).",
    doseRange: "10–15 mL/kg over 3–4 hours (max 20 mL/kg)",
    maxRate: "5 mL/kg/hr (max 10 mL/kg/hr in severe anaemia)",
    indications: [
      "Hb <7 g/dL in stable patients (WHO transfusion trigger)",
      "Hb <10 g/dL with cardiopulmonary compromise",
      "Symptomatic anaemia at any Hb level",
      "Acute haemorrhage with haemodynamic compromise",
    ],
    color: "red",
    bgColor: "bg-red-50 border-red-200",
  },
  {
    id: "ffp",
    label: "Fresh Frozen Plasma (FFP)",
    doseRange: "10–15 mL/kg IV",
    formulaDetail: "Volume = 10–15 mL/kg. Raises clotting factors by 15–25%.",
    formula: "Vol (mL) = 10–15 × Weight (kg)",
    maxRate: "10 mL/kg/hr (watch for TRALI/volume overload)",
    indications: [
      "Active bleeding with coagulopathy (PT/APTT >1.5× normal)",
      "DIC with active haemorrhage",
      "Urgent reversal of warfarin before procedure",
      "TTP (plasma exchange vehicle)",
    ],
    color: "yellow",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "platelets",
    label: "Platelet Concentrate",
    doseRange: "10–15 mL/kg IV (or 1 apheresis unit per 10 kg)",
    formulaDetail: "Volume = 10–15 mL/kg. Raises platelet count by ~50–100 × 10⁹/L.",
    formula: "Vol (mL) = 10–15 × Weight (kg)",
    maxRate: "Over 20–30 minutes",
    indications: [
      "Platelets <50 × 10⁹/L with active bleeding",
      "Platelets <10 × 10⁹/L (prophylactic threshold)",
      "Platelets <100 × 10⁹/L before CNS surgery",
    ],
    color: "blue",
    bgColor: "bg-blue-50 border-blue-200",
  },
  {
    id: "cryo",
    label: "Cryoprecipitate",
    doseRange: "5–10 mL/kg IV (1 unit per 5–10 kg)",
    formulaDetail: "Volume = 5–10 mL/kg. Rich in fibrinogen, FVIII, vWF, FXIII.",
    formula: "Vol (mL) = 5–10 × Weight (kg)",
    maxRate: "Over 10–15 minutes",
    indications: [
      "Fibrinogen <1.5 g/L with active bleeding (DIC, liver failure)",
      "Haemophilia A (when FVIII concentrate unavailable)",
      "vWF disease (if DDAVP fails and vWF concentrate unavailable)",
    ],
    color: "purple",
    bgColor: "bg-purple-50 border-purple-200",
  },
];

const colorMap: Record<string, string> = {
  red:    "text-red-700 border-red-200 bg-red-50",
  yellow: "text-yellow-700 border-yellow-200 bg-yellow-50",
  blue:   "text-blue-700 border-blue-200 bg-blue-50",
  purple: "text-purple-700 border-purple-200 bg-purple-50",
};

const badgeMap: Record<string, string> = {
  red:    "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  blue:   "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
};

export default function TransfusionPage() {
  const [weight, setWeight] = useState("");
  const [currentHb, setCurrentHb] = useState("");
  const [targetHb, setTargetHb] = useState("");
  const [ffpDose, setFfpDose] = useState("12");
  const [platDose, setPlatDose] = useState("12");
  const [cryoDose, setCryoDose] = useState("7");

  const wt = parseFloat(weight);

  const prbcVol = useMemo(() => {
    const hbDiff = parseFloat(targetHb) - parseFloat(currentHb);
    if (!wt || wt <= 0 || isNaN(hbDiff) || hbDiff <= 0) return null;
    return Math.round(wt * hbDiff * 3);
  }, [weight, currentHb, targetHb]);

  const ffpVol = useMemo(() => {
    const d = parseFloat(ffpDose);
    if (!wt || wt <= 0 || isNaN(d)) return null;
    return Math.round(wt * d);
  }, [weight, ffpDose]);

  const platVol = useMemo(() => {
    const d = parseFloat(platDose);
    if (!wt || wt <= 0 || isNaN(d)) return null;
    return Math.round(wt * d);
  }, [weight, platDose]);

  const cryoVol = useMemo(() => {
    const d = parseFloat(cryoDose);
    if (!wt || wt <= 0 || isNaN(d)) return null;
    return Math.round(wt * d);
  }, [weight, cryoDose]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
          <Syringe className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Transfusion Volume Calculator</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Weight-based volumes for PRBC, FFP, platelets and cryoprecipitate with indications and rates.
          </p>
        </div>
      </div>

      {/* Weight */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Patient Weight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-48">
            <Input
              type="number" min={1} max={150} placeholder="—"
              value={weight} onChange={e => setWeight(e.target.value)}
              className="pr-10 h-11 rounded-xl font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
          </div>
        </CardContent>
      </Card>

      {/* PRBC */}
      <Card className={cn("rounded-3xl border-2", colorMap.red)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <Badge className={badgeMap.red}>PRBC</Badge>
            Packed Red Blood Cells
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Current Hb</Label>
              <div className="relative">
                <Input type="number" min={0} max={25} placeholder="e.g. 6.5"
                  value={currentHb} onChange={e => setCurrentHb(e.target.value)}
                  className="pr-14 h-10 rounded-xl font-semibold bg-white/60" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">g/dL</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Target Hb</Label>
              <div className="relative">
                <Input type="number" min={0} max={25} placeholder="e.g. 10"
                  value={targetHb} onChange={e => setTargetHb(e.target.value)}
                  className="pr-14 h-10 rounded-xl font-semibold bg-white/60" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">g/dL</span>
              </div>
            </div>
          </div>
          {prbcVol !== null && (
            <div className="rounded-2xl bg-white/70 p-4 border border-red-200">
              <p className="text-xs font-black uppercase tracking-widest text-red-600/70 mb-1">Calculated Volume</p>
              <p className="text-4xl font-black text-red-800">{prbcVol} <span className="text-xl font-semibold text-red-500">mL</span></p>
              <p className="text-xs text-red-700/60 mt-1">Infuse over 3–4 hours · max rate 5 mL/kg/hr</p>
            </div>
          )}
          <div className="text-xs text-red-800/70 space-y-0.5">
            {BLOOD_PRODUCTS[0].indications.map((ind, i) => (
              <p key={i}>• {ind}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FFP, Platelets, Cryo in compact cards */}
      {[
        { product: BLOOD_PRODUCTS[1], vol: ffpVol, dose: ffpDose, setDose: setFfpDose, color: "yellow", key: "ffp" },
        { product: BLOOD_PRODUCTS[2], vol: platVol, dose: platDose, setDose: setPlatDose, color: "blue", key: "plat" },
        { product: BLOOD_PRODUCTS[3], vol: cryoVol, dose: cryoDose, setDose: setCryoDose, color: "purple", key: "cryo" },
      ].map(({ product, vol, dose, setDose, color }) => (
        <Card key={product.id} className={cn("rounded-3xl border-2", colorMap[color])}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black">{product.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Dose</Label>
                <div className="relative w-28">
                  <Input type="number" min={1} max={25} placeholder="—"
                    value={dose} onChange={e => setDose(e.target.value)}
                    className="pr-16 h-9 rounded-xl font-semibold text-sm bg-white/60" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">mL/kg</span>
                </div>
              </div>
              {vol !== null && wt > 0 && (
                <div className="rounded-2xl bg-white/70 px-4 py-2 border">
                  <p className="text-2xl font-black">{vol} <span className="text-sm font-semibold opacity-60">mL</span></p>
                  <p className="text-[10px] text-muted-foreground">{product.maxRate}</p>
                </div>
              )}
            </div>
            <div className="text-xs opacity-70 space-y-0.5">
              {product.indications.map((ind, i) => <p key={i}>• {ind}</p>)}
            </div>
          </CardContent>
        </Card>
      ))}

      <Alert className="rounded-2xl border-rose-200 bg-rose-50">
        <AlertTriangle className="h-4 w-4 text-rose-600" />
        <AlertDescription className="text-rose-800 text-sm">
          <strong>Blood safety:</strong> Always confirm ABO/Rh compatibility and complete cross-match before transfusion. Use leucocyte-depleted or irradiated products per institutional protocol. Monitor for transfusion reactions every 15 minutes for the first hour.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: WHO Blood Transfusion Safety 2012 · BCSH Paediatric Transfusion Guidelines 2016
      </p>
    </div>
  );
}
