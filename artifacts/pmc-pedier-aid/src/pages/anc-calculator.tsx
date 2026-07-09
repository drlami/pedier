import { useState, useMemo } from "react";
import { Shield, ArrowLeft, Calculator, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

function ancSeverity(anc: number) {
  if (anc >= 1500) return { label: "Normal", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-300", badge: "bg-emerald-600" };
  if (anc >= 1000) return { label: "Mild Neutropenia", color: "text-amber-700", bg: "bg-amber-50 border-amber-300", badge: "bg-amber-500" };
  if (anc >= 500)  return { label: "Moderate Neutropenia", color: "text-orange-700", bg: "bg-orange-50 border-orange-300", badge: "bg-orange-600" };
  if (anc >= 100)  return { label: "Severe Neutropenia", color: "text-red-700", bg: "bg-red-50 border-red-300", badge: "bg-red-600" };
  return { label: "Profound Neutropenia", color: "text-red-800", bg: "bg-red-100 border-red-400", badge: "bg-red-700" };
}

const NEUTROPENIA_CAUSES = [
  { cause: "Post-infectious (viral)", detail: "Most common cause of transient neutropenia in children — resolves within days to a few weeks." },
  { cause: "Chemotherapy / marrow suppression", detail: "Predictable nadir 7–14 days after cytotoxic therapy; highest infection risk." },
  { cause: "Drug-induced", detail: "Antibiotics (e.g. TMP-SMX, penicillins), antiepileptics (carbamazepine), antithyroid drugs." },
  { cause: "Autoimmune / chronic benign neutropenia of infancy", detail: "Usually well-appearing child with isolated neutropenia; often resolves by age 2–4." },
  { cause: "Congenital marrow failure syndromes", detail: "Severe congenital neutropenia (Kostmann), cyclic neutropenia, Shwachman-Diamond." },
  { cause: "Marrow infiltration", detail: "Leukemia, lymphoma, neuroblastoma metastases, myelofibrosis." },
  { cause: "Nutritional deficiency", detail: "Severe B12, folate, or copper deficiency." },
];

export default function ANCCalculatorPage() {
  const [wbc, setWbc] = useState("");
  const [segs, setSegs] = useState("");
  const [bands, setBands] = useState("");

  const wbcNum = parseFloat(wbc);
  const segsNum = parseFloat(segs);
  const bandsNum = parseFloat(bands) || 0;

  const isValid = isFinite(wbcNum) && wbcNum > 0 && isFinite(segsNum) && segsNum >= 0;

  const result = useMemo(() => {
    if (!isValid) return null;
    const anc = wbcNum * (segsNum + bandsNum) / 100;
    return { anc };
  }, [isValid, wbcNum, segsNum, bandsNum]);

  const severity = result ? ancSeverity(result.anc) : null;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 pb-32">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary active:scale-95">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-100">
          <Shield className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Absolute Neutrophil Count</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest mt-1">
            ANC · Febrile Neutropenia Risk Stratification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inputs + Formula */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" /> CBC with Differential
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  WBC Count <span className="opacity-50 font-normal normal-case">(cells/µL)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 4200"
                  className="font-mono h-11 border-2 focus:border-red-500"
                  value={wbc} onChange={(e) => setWbc(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Segmented Neutrophils <span className="opacity-50 font-normal normal-case">(%)</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 30"
                  className="font-mono h-11 border-2 focus:border-red-500"
                  value={segs} onChange={(e) => setSegs(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Bands <span className="font-normal normal-case text-muted-foreground opacity-60">(%) — optional</span>
                </Label>
                <Input type="number" inputMode="decimal" placeholder="e.g. 2"
                  className="font-mono h-10 border border-dashed border-red-300 bg-red-50/10 focus:border-red-500"
                  value={bands} onChange={(e) => setBands(e.target.value)} />
                <p className="text-[9px] text-muted-foreground font-medium leading-snug">
                  Include bands if reported separately — most labs count segs + bands together as "polys".
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border">
            <CardContent className="pt-5 pb-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Formula
              </p>
              <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                <p className="text-foreground font-black">ANC = WBC × (% segs + % bands) / 100</p>
              </div>
              <Separator />
              <p className="text-[10px] text-muted-foreground font-medium">
                Normal ANC: <strong>≥ 1500/µL</strong>. Severe neutropenia (ANC &lt; 500) carries the highest risk of serious bacterial infection.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Result + Causes */}
        <div className="lg:col-span-7 space-y-5">
          {result && severity ? (
            <Card className={cn("border-2", severity.bg)}>
              <CardContent className="pt-6 pb-5 px-6">
                <Badge className={cn("mb-3 text-xs font-black px-3 py-1", severity.badge)}>
                  {severity.label}
                </Badge>
                <div className="flex items-end gap-4 mb-3">
                  <p className="text-7xl font-black font-mono tracking-tighter leading-none">
                    {result.anc.toFixed(0)}
                  </p>
                  <p className="text-sm font-bold text-muted-foreground mb-2">cells/µL</p>
                </div>
                <div className="p-3 rounded-xl bg-background/60 border font-mono text-xs font-bold text-center">
                  <p>{wbcNum} × ({segsNum} + {bandsNum}) / 100 = <span className={severity.color}>{result.anc.toFixed(0)}</span></p>
                </div>
                {result.anc < 500 && (
                  <p className="mt-3 text-xs font-black text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    ANC &lt; 500 with fever = oncologic emergency. Blood cultures, broad-spectrum IV antibiotics within 1 hour, isolation precautions.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-center bg-muted/20">
              <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm font-medium">Enter WBC and % neutrophils to calculate</p>
            </div>
          )}

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                Common Causes of Neutropenia in Children
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {NEUTROPENIA_CAUSES.map(({ cause, detail }) => (
                <div key={cause} className="p-3 rounded-xl border bg-muted/20">
                  <p className="text-[12px] font-black leading-tight mb-1">{cause}</p>
                  <p className="text-[11px] font-medium text-muted-foreground leading-snug">{detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-[10px] text-muted-foreground font-medium text-center pb-2">
            Reference: Freifeld AG et al. Clinical Practice Guideline for the Use of Antimicrobial Agents in Neutropenic Patients. Clin Infect Dis. 2011.
          </p>
        </div>
      </div>
    </div>
  );
}
