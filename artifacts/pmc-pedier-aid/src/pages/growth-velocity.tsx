import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Reference weight velocity by age (g/day)
const WEIGHT_REF: { ageRange: string; minAge: number; maxAge: number; minVel: number; maxVel: number }[] = [
  { ageRange: "0–3 months",  minAge: 0,  maxAge: 3,  minVel: 25, maxVel: 35 },
  { ageRange: "3–6 months",  minAge: 3,  maxAge: 6,  minVel: 15, maxVel: 20 },
  { ageRange: "6–12 months", minAge: 6,  maxAge: 12, minVel: 10, maxVel: 13 },
  { ageRange: "1–2 years",   minAge: 12, maxAge: 24, minVel: 7,  maxVel: 10 },
  { ageRange: "2–3 years",   minAge: 24, maxAge: 36, minVel: 5,  maxVel: 8 },
  { ageRange: "3–5 years",   minAge: 36, maxAge: 60, minVel: 4,  maxVel: 7 },
  { ageRange: "5–10 years",  minAge: 60, maxAge: 120, minVel: 3, maxVel: 5 },
];

// Reference height velocity (cm/year) — rough norms
const HEIGHT_REF: { ageRange: string; minAge: number; maxAge: number; minVel: number; maxVel: number }[] = [
  { ageRange: "0–12 months", minAge: 0,  maxAge: 12, minVel: 23, maxVel: 28 },
  { ageRange: "1–2 years",   minAge: 12, maxAge: 24, minVel: 10, maxVel: 14 },
  { ageRange: "2–3 years",   minAge: 24, maxAge: 36, minVel: 7,  maxVel: 10 },
  { ageRange: "3–5 years",   minAge: 36, maxAge: 60, minVel: 6,  maxVel: 8 },
  { ageRange: "5–10 years",  minAge: 60, maxAge: 120, minVel: 5, maxVel: 7 },
  { ageRange: "10–15 years", minAge: 120, maxAge: 180, minVel: 5, maxVel: 12 },
];

function getRef<T extends { minAge: number; maxAge: number }>(refs: T[], ageMo: number): T | null {
  return refs.find(r => ageMo >= r.minAge && ageMo < r.maxAge) ?? null;
}

function classifyVelocity(velocity: number, min: number, max: number) {
  if (velocity < min * 0.5) return { label: "Markedly Low", color: "red" };
  if (velocity < min) return { label: "Below Normal", color: "orange" };
  if (velocity > max * 1.5) return { label: "Markedly High", color: "violet" };
  if (velocity > max) return { label: "Above Normal", color: "blue" };
  return { label: "Normal", color: "emerald" };
}

const colorMap: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-200 bg-emerald-50",
  orange:  "text-orange-700 border-orange-200 bg-orange-50",
  red:     "text-red-700 border-red-200 bg-red-50",
  blue:    "text-blue-700 border-blue-200 bg-blue-50",
  violet:  "text-violet-700 border-violet-200 bg-violet-50",
};
const badgeMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  orange:  "bg-orange-100 text-orange-800",
  red:     "bg-red-100 text-red-800",
  blue:    "bg-blue-100 text-blue-800",
  violet:  "bg-violet-100 text-violet-800",
};

export default function GrowthVelocityPage() {
  // Measurement 1
  const [age1Mo, setAge1Mo] = useState("");
  const [wt1, setWt1] = useState("");
  const [ht1, setHt1] = useState("");
  // Measurement 2
  const [age2Mo, setAge2Mo] = useState("");
  const [wt2, setWt2] = useState("");
  const [ht2, setHt2] = useState("");

  const results = useMemo(() => {
    const a1 = parseFloat(age1Mo), a2 = parseFloat(age2Mo);
    const w1 = parseFloat(wt1) * 1000, w2 = parseFloat(wt2) * 1000; // convert to grams
    const h1 = parseFloat(ht1), h2 = parseFloat(ht2);

    if (isNaN(a1) || isNaN(a2) || a2 <= a1) return null;

    const intervalDays = (a2 - a1) * 30.44;
    const midAge = (a1 + a2) / 2;

    const weightVel = (!isNaN(w1) && !isNaN(w2) && w2 > 0 && w1 > 0)
      ? (w2 - w1) / intervalDays : null; // g/day

    const heightVelYear = (!isNaN(h1) && !isNaN(h2) && h2 > 0 && h1 > 0)
      ? ((h2 - h1) / (a2 - a1)) * 12 : null; // cm/year

    const wtRef = getRef(WEIGHT_REF, midAge);
    const htRef = getRef(HEIGHT_REF, midAge);

    return {
      intervalDays: Math.round(intervalDays),
      midAge,
      weightVel,
      heightVelYear,
      wtRef,
      htRef,
    };
  }, [age1Mo, age2Mo, wt1, wt2, ht1, ht2]);

  const weightInterp = results?.weightVel !== null && results?.weightVel !== undefined && results?.wtRef
    ? classifyVelocity(results.weightVel, results.wtRef.minVel, results.wtRef.maxVel)
    : null;
  const heightInterp = results?.heightVelYear !== null && results?.heightVelYear !== undefined && results?.htRef
    ? classifyVelocity(results.heightVelYear, results.htRef.minVel, results.htRef.maxVel)
    : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
          <TrendingUp className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Growth Velocity Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Calculate weight and height velocity from two serial measurements and compare to age-appropriate norms.
          </p>
        </div>
      </div>

      <Tabs defaultValue="measurements">
        <TabsList className="rounded-2xl bg-muted/40 p-1">
          <TabsTrigger value="measurements" className="rounded-xl font-bold text-xs uppercase tracking-widest px-5">Measurements</TabsTrigger>
          <TabsTrigger value="reference" className="rounded-xl font-bold text-xs uppercase tracking-widest px-5">Reference Table</TabsTrigger>
        </TabsList>

        <TabsContent value="measurements" className="mt-4 space-y-6">
          {/* First measurement */}
          {[
            { label: "First Measurement", ageVal: age1Mo, setAge: setAge1Mo, wtVal: wt1, setWt: setWt1, htVal: ht1, setHt: setHt1 },
            { label: "Second Measurement", ageVal: age2Mo, setAge: setAge2Mo, wtVal: wt2, setWt: setWt2, htVal: ht2, setHt: setHt2 },
          ].map(({ label, ageVal, setAge, wtVal, setWt, htVal, setHt }) => (
            <Card key={label} className="rounded-3xl border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-black">{label}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Age</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={1} placeholder="e.g. 6"
                      value={ageVal} onChange={e => setAge(e.target.value)}
                      className="pr-12 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">mo</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Weight</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 7.2"
                      value={wtVal} onChange={e => setWt(e.target.value)}
                      className="pr-10 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">kg</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-sm">Height</Label>
                  <div className="relative">
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 67"
                      value={htVal} onChange={e => setHt(e.target.value)}
                      className="pr-10 h-11 rounded-xl font-semibold" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">cm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              {results.intervalDays > 0 && (
                <div className="text-sm text-muted-foreground px-1">
                  Interval: <strong className="text-foreground">{results.intervalDays} days</strong> ·
                  Mid-age: <strong className="text-foreground">{results.midAge.toFixed(1)} months</strong>
                </div>
              )}

              {/* Weight velocity */}
              {results.weightVel !== null && weightInterp && results.wtRef && (
                <Card className={cn("rounded-3xl border-2", colorMap[weightInterp.color])}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Weight Velocity</p>
                        <p className="text-4xl font-black">
                          {results.weightVel >= 0 ? "+" : ""}
                          {results.weightVel.toFixed(1)}
                          <span className="text-lg font-semibold opacity-60 ml-1">g/day</span>
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          Normal for age: {results.wtRef.minVel}–{results.wtRef.maxVel} g/day ({results.wtRef.ageRange})
                        </p>
                      </div>
                      <Badge className={cn("font-black text-sm px-3", badgeMap[weightInterp.color])}>
                        {weightInterp.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Height velocity */}
              {results.heightVelYear !== null && heightInterp && results.htRef && (
                <Card className={cn("rounded-3xl border-2", colorMap[heightInterp.color])}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Height Velocity</p>
                        <p className="text-4xl font-black">
                          {results.heightVelYear >= 0 ? "+" : ""}
                          {results.heightVelYear.toFixed(1)}
                          <span className="text-lg font-semibold opacity-60 ml-1">cm/yr</span>
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          Normal for age: {results.htRef.minVel}–{results.htRef.maxVel} cm/yr ({results.htRef.ageRange})
                        </p>
                      </div>
                      <Badge className={cn("font-black text-sm px-3", badgeMap[heightInterp.color])}>
                        {heightInterp.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reference" className="mt-4">
          <Card className="rounded-3xl border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Expected Growth Velocity by Age
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-black mb-2">Weight Velocity (g/day)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-bold">Age Range</th>
                        <th className="text-center py-2 font-bold">Expected Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {WEIGHT_REF.map(r => (
                        <tr key={r.ageRange}>
                          <td className="py-2 font-medium">{r.ageRange}</td>
                          <td className="text-center py-2 text-emerald-700 font-semibold">{r.minVel}–{r.maxVel} g/day</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="text-sm font-black mb-2">Height Velocity (cm/year)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-bold">Age Range</th>
                        <th className="text-center py-2 font-bold">Expected Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {HEIGHT_REF.map(r => (
                        <tr key={r.ageRange}>
                          <td className="py-2 font-medium">{r.ageRange}</td>
                          <td className="text-center py-2 text-emerald-700 font-semibold">{r.minVel}–{r.maxVel} cm/yr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert className="rounded-2xl border-emerald-200 bg-emerald-50">
        <AlertTriangle className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 text-sm">
          <strong>Interpretation tip:</strong> Velocity is more sensitive than single-point measurements for detecting growth faltering. A minimum interval of 3 months is needed for reliable height velocity. Measurements taken less than 4 weeks apart may not be reliable. Always compare velocity trends over time rather than a single interval.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference norms derived from WHO Child Growth Standards (2006) and Tanner-Whitehouse curves
      </p>
    </div>
  );
}
