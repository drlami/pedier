import { useState, useMemo } from "react";
import { Droplets, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Calyx = "none" | "central" | "peripheral";
type Ureter = "none" | "lt7" | "ge7";
type Binary = "normal" | "abnormal";
type Grade = "normal" | "P1" | "P2" | "P3";

function classify(apd: number | null, calyx: Calyx, parenchymaThickness: Binary, parenchymaAppearance: Binary, ureter: Ureter, bladder: Binary): Grade {
  const hasP3Feature = parenchymaThickness === "abnormal" || parenchymaAppearance === "abnormal" || bladder === "abnormal" || ureter !== "none";
  if (hasP3Feature) return "P3";
  if ((apd !== null && apd >= 15) || calyx === "peripheral") return "P2";
  if ((apd !== null && apd >= 10) || calyx === "central") return "P1";
  return "normal";
}

const GRADE_META: Record<Grade, { label: string; color: string; risk: string }> = {
  normal: { label: "Normal",  color: "emerald", risk: "No urinary tract dilation" },
  P1:     { label: "UTD P1", color: "sky",     risk: "Low risk of postnatal uropathy" },
  P2:     { label: "UTD P2", color: "amber",   risk: "Intermediate risk of postnatal uropathy" },
  P3:     { label: "UTD P3", color: "red",     risk: "High risk of postnatal uropathy" },
};

const colorMap: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  sky:     "text-sky-700 border-sky-200 bg-sky-50",
  amber:   "text-amber-700 border-amber-200 bg-amber-50",
  red:     "text-red-700 border-red-200 bg-red-50",
};

const badgeFromColor: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  sky:     "bg-sky-100 text-sky-800",
  amber:   "bg-amber-100 text-amber-800",
  red:     "bg-red-100 text-red-800",
};

const MANAGEMENT: Record<Grade, string[]> = {
  normal: [
    "No further postnatal imaging required for an isolated, resolved antenatal finding",
    "Routine well-child follow-up",
  ],
  P1: [
    "Repeat renal-bladder ultrasound (RBUS) in 3–6 months",
    "VCUG / contrast-enhanced voiding urosonography (ceVUS) — not recommended",
    "Antibiotic prophylaxis — not recommended",
    "Nephrology/urology referral — not routinely required unless dilation worsens on follow-up",
    "Obtain a minimum of 2 postnatal ultrasounds before discontinuing surveillance",
  ],
  P2: [
    "Repeat RBUS in 1–3 months",
    "VCUG/ceVUS — consider on an individualized basis (shared decision-making with family)",
    "Antibiotic prophylaxis — consider; if started, reassess stopping at 12 months unless VUR is confirmed or ureteral dilation ≥7 mm persists",
    "Early nephrology and/or urology referral recommended",
    "Renal functional imaging (e.g. MAG3 diuretic renogram) — consider individually; defer to ≥6–12 weeks of age",
  ],
  P3: [
    "Repeat RBUS in 1 month",
    "VCUG/ceVUS recommended",
    "Antibiotic prophylaxis recommended",
    "Early nephrology and/or urology referral recommended",
    "Renal functional imaging (MAG3 diuretic renogram) usually obtained at 6–12 weeks of age if UTD P3 persists",
  ],
};

export default function HydronephrosisPage() {
  const [apd, setApd] = useState("");
  const [calyx, setCalyx] = useState<Calyx>("none");
  const [parenchymaThickness, setParenchymaThickness] = useState<Binary>("normal");
  const [parenchymaAppearance, setParenchymaAppearance] = useState<Binary>("normal");
  const [ureter, setUreter] = useState<Ureter>("none");
  const [bladder, setBladder] = useState<Binary>("normal");

  const apdValue = apd === "" ? null : parseFloat(apd);
  const grade = useMemo(
    () => classify(apdValue, calyx, parenchymaThickness, parenchymaAppearance, ureter, bladder),
    [apdValue, calyx, parenchymaThickness, parenchymaAppearance, ureter, bladder]
  );
  const meta = GRADE_META[grade];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700">
          <Droplets className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Postnatal Management of Antenatal Hydronephrosis</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Postnatal Urinary Tract Dilation (UTD) classification and follow-up per the 2025 AAP clinical report.
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black">Postnatal Renal-Bladder Ultrasound Findings</CardTitle>
          <p className="text-xs text-muted-foreground">
            Obtain RBUS after 48 hours of life to avoid false-negative results from physiologic neonatal oliguria.
            Assess each kidney separately; if bilateral involvement differs, classify and manage per the more severely affected side.
          </p>
        </CardHeader>
        <CardContent className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Anterior-Posterior Renal Pelvic Diameter (APRPD)</Label>
            <div className="relative max-w-[220px]">
              <Input type="number" min={0} step={0.5} placeholder="e.g. 12"
                value={apd} onChange={e => setApd(e.target.value)}
                className="pr-12 h-11 rounded-xl font-semibold" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mm</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Calyceal Dilation</Label>
            <div className="flex flex-wrap gap-2">
              {(["none", "central", "peripheral"] as Calyx[]).map(v => (
                <button key={v} type="button" onClick={() => setCalyx(v)}
                  className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize",
                    calyx === v ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                  {v === "none" ? "None" : v === "central" ? "Central only" : "Peripheral"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Parenchymal Thickness</Label>
              <div className="flex gap-2">
                {(["normal", "abnormal"] as Binary[]).map(v => (
                  <button key={v} type="button" onClick={() => setParenchymaThickness(v)}
                    className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize flex-1",
                      parenchymaThickness === v ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-sm">Parenchymal Appearance</Label>
              <p className="text-[10px] text-muted-foreground -mt-1">Echogenicity, cysts, cortico-medullary differentiation</p>
              <div className="flex gap-2">
                {(["normal", "abnormal"] as Binary[]).map(v => (
                  <button key={v} type="button" onClick={() => setParenchymaAppearance(v)}
                    className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize flex-1",
                      parenchymaAppearance === v ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Ureteral Dilation</Label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setUreter("none")}
                className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                  ureter === "none" ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                None
              </button>
              <button type="button" onClick={() => setUreter("lt7")}
                className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                  ureter === "lt7" ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                Present, &lt;7 mm
              </button>
              <button type="button" onClick={() => setUreter("ge7")}
                className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                  ureter === "ge7" ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                Present, ≥7 mm
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Bladder Abnormality</Label>
            <p className="text-[10px] text-muted-foreground -mt-1">Thickened wall, ureterocele, dilated posterior urethra</p>
            <div className="flex gap-2 max-w-xs">
              {(["normal", "abnormal"] as Binary[]).map(v => (
                <button key={v} type="button" onClick={() => setBladder(v)}
                  className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize flex-1",
                    bladder === v ? "bg-cyan-600 text-white border-cyan-600" : "bg-background border-muted text-muted-foreground hover:border-muted-foreground/30")}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cn("rounded-3xl border-2", colorMap[meta.color])}>
        <CardContent className="pt-6 pb-6">
          <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Postnatal Classification</p>
          <div className="flex items-center gap-3 mb-1">
            <p className="text-5xl font-black">{meta.label}</p>
          </div>
          <p className="text-sm opacity-80 mb-4">{meta.risk}</p>
          <p className="font-black text-sm uppercase tracking-widest mb-3">Management</p>
          <div className="space-y-1.5">
            {MANAGEMENT[grade].map((m, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 shrink-0 opacity-50">•</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            UTD Postnatal Classification Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3 font-black">Grade</th>
                  <th className="text-left py-2 font-black">Defining Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-3"><Badge className={cn("font-black text-xs", badgeFromColor.emerald)}>Normal</Badge></td>
                  <td className="py-2 text-muted-foreground">APRPD &lt;10 mm, no calyceal dilation, normal parenchyma/ureters/bladder</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3"><Badge className={cn("font-black text-xs", badgeFromColor.sky)}>P1</Badge></td>
                  <td className="py-2 text-muted-foreground">APRPD 10–&lt;15 mm and/or central calyceal dilation only; all other parameters normal</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3"><Badge className={cn("font-black text-xs", badgeFromColor.amber)}>P2</Badge></td>
                  <td className="py-2 text-muted-foreground">APRPD ≥15 mm or peripheral calyceal dilation; parenchyma, ureters, bladder normal</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3"><Badge className={cn("font-black text-xs", badgeFromColor.red)}>P3</Badge></td>
                  <td className="py-2 text-muted-foreground">Any abnormal parenchymal thickness/appearance, ureteral dilation, or bladder abnormality — regardless of APRPD</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Ureteral dilation ≥7 mm is an independent marker of UTI risk and warrants VCUG/ceVUS and antibiotic prophylaxis; a febrile UTI at any classification also warrants VCUG.
          </p>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-cyan-200 bg-cyan-50">
        <AlertTriangle className="h-4 w-4 text-cyan-600" />
        <AlertDescription className="text-cyan-800 text-sm">
          <strong>First postnatal ultrasound timing:</strong> Defer beyond 48 hours of life — earlier scans can under-call dilation due to physiologic neonatal oliguria. Complete before discharge for antenatally increased-risk (UTD A2-3) dilation; within 6 weeks of life for isolated low-risk (UTD A1) antenatal dilation. A minimum of two postnatal ultrasounds is recommended before discontinuing surveillance.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        References: American Academy of Pediatrics. Perinatal Urinary Tract Dilation: Recommendations on Pre-/Postnatal Imaging, Prophylactic Antibiotics, and Follow-up (Clinical Report). <em>Pediatrics</em> 2025;156(1):e2025071814.
        {" "}Nguyen HT, et al. Multidisciplinary consensus on the classification of prenatal and postnatal urinary tract dilation (UTD classification system). <em>J Pediatr Urol</em> 2014;10(6):982–998.
      </p>
    </div>
  );
}
