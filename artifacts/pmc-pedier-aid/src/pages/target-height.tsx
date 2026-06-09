import { useState, useMemo } from "react";
import { TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function cmToFtIn(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}′${inches}″`;
}

export default function TargetHeightPage() {
  const [fatherCm, setFatherCm] = useState("");
  const [motherCm, setMotherCm] = useState("");
  const [sex, setSex] = useState<"male" | "female" | null>(null);

  const result = useMemo(() => {
    const f = parseFloat(fatherCm);
    const m = parseFloat(motherCm);
    if (!sex || isNaN(f) || isNaN(m) || f <= 0 || m <= 0) return null;

    const mph = sex === "male"
      ? (f + m + 13) / 2
      : (f + m - 13) / 2;

    return {
      mph: +mph.toFixed(1),
      low: +(mph - 8.5).toFixed(1),
      high: +(mph + 8.5).toFixed(1),
    };
  }, [fatherCm, motherCm, sex]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-orange-100 text-orange-700">
          <TrendingUp className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Mid-Parental Target Height</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Estimates a child's genetic height potential from parental heights (Tanner 1970 method).
          </p>
        </div>
      </div>

      {/* Sex selector */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Child's Sex</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["male", "female"] as const).map(s => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={cn(
                  "flex-1 py-3 rounded-2xl font-black text-sm border-2 transition-all capitalize",
                  sex === s
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-primary/30"
                )}
              >
                {s === "male" ? "Boy" : "Girl"}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Height inputs */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Parental Heights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Father's Height</Label>
            <div className="relative">
              <Input
                type="number" min={100} max={220}
                placeholder="e.g. 175"
                value={fatherCm}
                onChange={e => setFatherCm(e.target.value)}
                className="pr-12 h-11 rounded-xl font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">cm</span>
            </div>
            {fatherCm && !isNaN(parseFloat(fatherCm)) && (
              <p className="text-xs text-muted-foreground">{cmToFtIn(parseFloat(fatherCm))}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Mother's Height</Label>
            <div className="relative">
              <Input
                type="number" min={100} max={220}
                placeholder="e.g. 162"
                value={motherCm}
                onChange={e => setMotherCm(e.target.value)}
                className="pr-12 h-11 rounded-xl font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">cm</span>
            </div>
            {motherCm && !isNaN(parseFloat(motherCm)) && (
              <p className="text-xs text-muted-foreground">{cmToFtIn(parseFloat(motherCm))}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-black uppercase tracking-widest text-orange-600/70 mb-1">Mid-Parental Height</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black text-orange-800">{result.mph}</span>
              <span className="text-xl font-semibold text-orange-600 mb-1">cm</span>
              <span className="text-sm text-orange-500 mb-1.5">{cmToFtIn(result.mph)}</span>
            </div>

            <div className="rounded-2xl border-2 border-orange-200 bg-white/60 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-orange-600/70 mb-2">
                Target Height Range <span className="font-normal normal-case">(±8.5 cm, ≈95% genetic range)</span>
              </p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-black text-orange-700">{result.low} cm</p>
                  <p className="text-xs text-muted-foreground">{cmToFtIn(result.low)}</p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-orange-300" />
                <Badge className="bg-orange-100 text-orange-700 font-black text-sm px-3">
                  {result.mph} cm
                </Badge>
                <div className="flex-1 border-t-2 border-dashed border-orange-300" />
                <div className="text-center">
                  <p className="text-2xl font-black text-orange-700">{result.high} cm</p>
                  <p className="text-xs text-muted-foreground">{cmToFtIn(result.high)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-orange-800/80 space-y-1">
              <p className="font-bold">Formula ({sex === "male" ? "Boys" : "Girls"}):</p>
              <p className="font-mono text-xs bg-white/60 rounded-xl p-2 border border-orange-200">
                {sex === "male"
                  ? "MPH = (Father + Mother + 13 cm) ÷ 2"
                  : "MPH = (Father + Mother − 13 cm) ÷ 2"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical notes */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Clinical Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            The target height range represents the 95% confidence interval for the child's adult height based solely on parental heights. Children growing outside this range warrant investigation for endocrine or systemic causes.
          </p>
          <div className="space-y-1.5">
            <p className="font-bold text-foreground">Conditions to consider if height is below target range:</p>
            <ul className="list-disc list-inside space-y-0.5 pl-2">
              <li>Growth hormone deficiency</li>
              <li>Hypothyroidism</li>
              <li>Coeliac disease / inflammatory bowel disease</li>
              <li>Turner syndrome (girls)</li>
              <li>Constitutional delay of growth (track velocity over time)</li>
            </ul>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-foreground">Conditions to consider if above target range:</p>
            <ul className="list-disc list-inside space-y-0.5 pl-2">
              <li>Growth hormone excess (rare)</li>
              <li>Precocious puberty (tall initially, short final height)</li>
              <li>Marfan / Klinefelter syndrome</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-2xl border-orange-200 bg-orange-50">
        <AlertDescription className="text-orange-800 text-sm">
          <strong>Note:</strong> This tool estimates <em>genetic potential only</em>. Actual adult height is also determined by nutrition, chronic illness, timing of puberty, and other environmental factors. Always plot serial measurements on a growth chart.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Reference: Tanner JM et al. <em>Arch Dis Child</em> 1970;45:755–62 · Grote FK et al. <em>Horm Res</em> 2008;70:20–27
      </p>
    </div>
  );
}
