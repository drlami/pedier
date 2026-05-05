"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  Copy,
  AlertTriangle,
  Syringe,
  HeartPulse,
  Zap,
  Wind,
  Droplets,
  BookOpen,
  Info,
  Activity,
  Stethoscope,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const round = (value: number, decimals = 1) => {
  return Number(value.toFixed(decimals));
};

const estimateWeight = (age: number, unit: "months" | "years"): number => {
  if (!age || age <= 0) return 0;

  if (unit === "months") {
    if (age <= 12) return round(age / 2 + 4, 1);
    return 0;
  }

  if (unit === "years") {
    if (age < 1) return 0;
    if (age <= 5) return round(age * 2 + 8, 1);
    if (age <= 12) return round(age * 3 + 7, 1);
    return round(age * 3 + 7, 1);
  }

  return 0;
};

const getAgeCategory = (
  ageInYears: number
): "neonate" | "infant" | "toddler" | "child" | "adolescent" => {
  if (ageInYears < 1 / 12) return "neonate";
  if (ageInYears < 1) return "infant";
  if (ageInYears < 3) return "toddler";
  if (ageInYears < 13) return "child";
  return "adolescent";
};

const getBlade = (ageInYears?: number) => {
  if (ageInYears === undefined || ageInYears < 0) return "Prepare age/size appropriate blade";

  const category = getAgeCategory(ageInYears);

  if (category === "neonate") return "Miller 0–1";
  if (category === "infant") return "Miller 1";
  if (category === "toddler") return "Miller 1.5–2";
  if (category === "child") return "Mac 2–3";
  return "Mac 3";
};

const getEtt = (ageInYears?: number, weight?: number) => {
  if (!weight) {
    return {
      uncuffed: "N/A",
      cuffed: "N/A",
      depth: "N/A",
      note: "Enter weight or age.",
    };
  }

  if (ageInYears === undefined) {
    return {
      uncuffed: "Prepare by length/clinical estimate",
      cuffed: "Prepare by length/clinical estimate",
      depth: "3 × ETT size",
      note: "Age not available; use Broselow/length tape if possible.",
    };
  }

  const category = getAgeCategory(ageInYears);

  if (category === "neonate") {
    let size = 3.5;
    if (weight < 1) size = 2.5;
    else if (weight < 2) size = 3.0;
    else if (weight < 3) size = 3.0;
    else size = 3.5;

    return {
      uncuffed: size.toFixed(1),
      cuffed: "Usually uncuffed / neonatal tube",
      depth: `${round(weight + 6, 1)} cm`,
      note: "Neonate estimate: depth ≈ weight + 6 cm. Confirm clinically + ETCO₂ + CXR.",
    };
  }

  if (category === "infant") {
    return {
      uncuffed: "3.5–4.0",
      cuffed: "3.0–3.5",
      depth: "10–12 cm",
      note: "Prepare chosen tube + 0.5 smaller + 0.5 larger.",
    };
  }

  const uncuffed = ageInYears / 4 + 4;
  const cuffed = ageInYears / 4 + 3.5;
  const depth = cuffed * 3;

  return {
    uncuffed: round(uncuffed, 1).toFixed(1),
    cuffed: round(cuffed, 1).toFixed(1),
    depth: `${round(depth, 1)} cm`,
    note: "Prepare selected tube + 0.5 smaller + 0.5 larger. Confirm with ETCO₂ and CXR.",
  };
};

const ResultCard = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn("print-no-break-inside", className)}>
    <CardHeader className="pb-2 pt-4 px-4">
      <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-primary uppercase tracking-wide">
        <Icon className="h-4 w-4 shrink-0" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm px-4 pb-4">{children}</CardContent>
  </Card>
);

const ResultRow = ({
  label,
  value,
  unit = "",
  className = "",
}: {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}) => (
  <div className="flex justify-between gap-3 items-center py-2 border-b last:border-b-0">
    <p className="text-foreground/70 text-sm">{label}</p>
    <p className={cn("font-bold text-base text-right tabular-nums", className)}>
      {value}{" "}
      {unit && (
        <span className="font-normal text-muted-foreground text-sm">{unit}</span>
      )}
    </p>
  </div>
);

export function ResuscitationCalculator() {
  const [weight, setWeight] = useState<number | string>("");
  const [age, setAge] = useState<number | string>("");
  const [ageUnit, setAgeUnit] = useState<"months" | "years">("years");
  const [inputType, setInputType] = useState<"weight" | "age">("weight");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const summaryRef = useRef<HTMLDivElement>(null);

  const finalWeight = useMemo(() => {
    if (inputType === "weight") {
      const w = Number(weight);
      return w > 0 ? w : undefined;
    }

    const estimated = estimateWeight(Number(age), ageUnit);
    return estimated > 0 ? estimated : undefined;
  }, [weight, age, ageUnit, inputType]);

  const ageInYears = useMemo(() => {
    if (inputType === "age") {
      const a = Number(age);
      if (!a || a <= 0) return undefined;
      return ageUnit === "months" ? a / 12 : a;
    }

    if (inputType === "weight" && finalWeight) {
      if (finalWeight <= 10) return Math.max((finalWeight - 4) * 2, 1) / 12;
      if (finalWeight <= 20) return (finalWeight - 8) / 2;
      return (finalWeight - 7) / 3;
    }

    return undefined;
  }, [weight, age, ageUnit, inputType, finalWeight]);

  const ageCategory = useMemo(() => {
    if (ageInYears === undefined) return undefined;
    return getAgeCategory(ageInYears);
  }, [ageInYears]);

  const ett = useMemo(() => getEtt(ageInYears, finalWeight), [ageInYears, finalWeight]);

  const handleCopy = useCallback(() => {
    if (!summaryRef.current) return;
    navigator.clipboard.writeText(summaryRef.current.innerText);
    toast({
      title: "Copied",
      description: "Resuscitation summary copied to clipboard.",
    });
  }, [toast]);

  if (!finalWeight || finalWeight <= 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Patient Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="age">Age</TabsTrigger>
              </TabsList>

              <TabsContent value="weight" className="pt-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-lg"
                  />
                  <Label className="text-lg">kg</Label>
                </div>
              </TabsContent>

              <TabsContent value="age" className="pt-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as any)}>
                    <SelectTrigger className="w-[120px] text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">Years</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              Enter weight or age to generate pediatric arrest parameters.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const epinephrineMg = Math.min(0.01 * finalWeight, 1);
  const epinephrineMl = epinephrineMg / 0.1;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Patient Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="age">Age</TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="pt-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-lg"
                />
                <Label className="text-lg">kg</Label>
              </div>
            </TabsContent>

            <TabsContent value="age" className="pt-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-lg"
                />
                <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as any)}>
                  <SelectTrigger className="w-[120px] text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Estimated weight: <span className="font-bold">{finalWeight.toFixed(1)} kg</span>
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4" ref={summaryRef}>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <h2 className="text-xl font-bold font-headline tracking-tight">
              Pediatric Arrest Summary
            </h2>
          </div>
          <Button onClick={handleCopy} variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>

        <Alert variant="destructive" className="bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>During cardiac arrest</AlertTitle>
          <AlertDescription className="text-sm">
            Prioritize high-quality CPR, oxygenation with BVM, rhythm check every 2 minutes,
            defibrillation if shockable, and epinephrine. Do not delay CPR for intubation.
          </AlertDescription>
        </Alert>

        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-300">
          <Info className="h-4 w-4" />
          <AlertTitle>Weight warning</AlertTitle>
          <AlertDescription className="text-sm">
            Use actual measured weight when available. Age-based weight is only an estimate.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive" className="bg-destructive/10">
          <Info className="h-4 w-4" />
          <AlertTitle>Adrenaline / Epinephrine Preparation</AlertTitle>
          <AlertDescription className="text-xs">
            If stock is <strong>1 mg/mL 1:1,000</strong>, dilute 1 mL adrenaline with 9 mL
            normal saline to make <strong>10 mL of 0.1 mg/mL 1:10,000</strong>. Arrest IV/IO dose:
            <strong> 0.01 mg/kg = 0.1 mL/kg</strong> of 1:10,000, maximum 1 mg. Repeat every
            3–5 minutes.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard title="Patient" icon={Stethoscope}>
            <ResultRow label="Working weight" value={finalWeight.toFixed(1)} unit="kg" />
            <ResultRow label="Age category" value={ageCategory ?? "Estimated"} />
            {inputType === "age" && (
              <p className="text-xs text-muted-foreground mt-2">
                Weight estimated from age. Confirm with actual weight/length tape if possible.
              </p>
            )}
          </ResultCard>

          <ResultCard title="CPR Quality" icon={HeartPulse}>
            {ageCategory === "neonate" ? (
              <>
                <ResultRow label="Compression:Ventilation" value="3:1" />
                <ResultRow label="Compressions" value="90" unit="/min" />
                <ResultRow label="Ventilations" value="30" unit="/min" />
                <ResultRow label="Depth" value="1/3 AP chest diameter" />
              </>
            ) : (
              <>
                <ResultRow label="Compression rate" value="100–120" unit="/min" />
                <ResultRow label="Depth" value="1/3 AP chest diameter" />
                <ResultRow label="1 rescuer" value="30:2" />
                <ResultRow label="2 rescuers" value="15:2" />
                <ResultRow label="Advanced airway" value="1 breath every 2–3 sec" />
              </>
            )}
          </ResultCard>

          <ResultCard title="Shockable Rhythm VF / pulseless VT" icon={Zap}>
            <ResultRow
              label="First shock"
              value={(2 * finalWeight).toFixed(0)}
              unit="J"
              className="text-amber-600"
            />
            <ResultRow
              label="Second shock"
              value={(4 * finalWeight).toFixed(0)}
              unit="J"
              className="text-orange-600"
            />
            <ResultRow
              label="Subsequent shocks"
              value={`${(4 * finalWeight).toFixed(0)}–${(10 * finalWeight).toFixed(0)}`}
              unit="J"
              className="text-red-600"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Continue CPR immediately after shock. Rhythm check every 2 minutes.
            </p>
          </ResultCard>

          <ResultCard title="Non-shockable Rhythm PEA / Asystole" icon={Activity}>
            <ResultRow label="CPR" value="Continue high-quality CPR" />
            <ResultRow label="Epinephrine" value="Give ASAP" />
            <ResultRow label="Rhythm check" value="Every 2 min" />
            <p className="text-xs text-muted-foreground mt-2">
              Search and treat reversible causes: Hs & Ts.
            </p>
          </ResultCard>

          <ResultCard title="Arrest Medications" icon={Syringe}>
            <ResultRow
              label="Epinephrine 1:10,000"
              value={epinephrineMl.toFixed(2)}
              unit="mL IV/IO"
              className="text-primary font-black"
            />
            <ResultRow label="Epinephrine dose" value={epinephrineMg.toFixed(2)} unit="mg" />
            <ResultRow
              label="Repeat epinephrine"
              value="Every 3–5 min"
              className="text-destructive"
            />
            <ResultRow
              label="Amiodarone"
              value={Math.min(5 * finalWeight, 300).toFixed(1)}
              unit="mg IV/IO"
            />
            <ResultRow
              label="Lidocaine alternative"
              value={(1 * finalWeight).toFixed(1)}
              unit="mg IV/IO"
            />

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Advanced / special indication medications
                </p>
                <ResultRow
                  label="Atropine"
                  value={Math.max(0.02 * finalWeight, 0.1).toFixed(2)}
                  unit="mg"
                />
                <ResultRow
                  label="Sodium bicarbonate"
                  value={(1 * finalWeight).toFixed(1)}
                  unit="mEq"
                />
                <ResultRow
                  label="Calcium gluconate 10%"
                  value={Math.min(0.5 * finalWeight, 20).toFixed(1)}
                  unit="mL"
                />
              </div>
            )}
          </ResultCard>

          <ResultCard title="Airway Equipment" icon={Wind}>
            <ResultRow label="Uncuffed ETT" value={ett.uncuffed} />
            <ResultRow label="Cuffed ETT" value={ett.cuffed} />
            <ResultRow label="Oral depth estimate" value={ett.depth} />
            <ResultRow label="Blade" value={getBlade(ageInYears)} />
            <p className="text-xs text-muted-foreground mt-2">{ett.note}</p>
          </ResultCard>

          <ResultCard title="Fluids & Glucose" icon={Droplets}>
            <ResultRow label="NS / RL bolus" value={(20 * finalWeight).toFixed(0)} unit="mL" />
            <ResultRow label="D10 bolus" value={(5 * finalWeight).toFixed(0)} unit="mL" />
            <ResultRow
              label="Dextrose dose"
              value={(0.5 * finalWeight).toFixed(1)}
              unit="g"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Give fluids if hypovolemia/shock suspected. Check glucose early.
            </p>
          </ResultCard>

          <ResultCard title="Hs & Ts Reminder" icon={AlertTriangle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <ul className="list-disc list-inside">
                <li>Hypoxia</li>
                <li>Hypovolemia</li>
                <li>Hydrogen ion / acidosis</li>
                <li>Hypo-/hyperkalemia</li>
                <li>Hypothermia</li>
              </ul>
              <ul className="list-disc list-inside">
                <li>Tension pneumothorax</li>
                <li>Tamponade</li>
                <li>Toxins</li>
                <li>Thrombosis pulmonary</li>
                <li>Thrombosis coronary</li>
              </ul>
            </div>
          </ResultCard>

          <div className="md:col-span-2">
            <ResultCard title="Post-ROSC Checklist" icon={HeartPulse}>
              <ul className="list-disc list-inside space-y-1">
                <li>Airway and oxygenation: avoid hypoxia; titrate oxygen after stabilization.</li>
                <li>Ventilation: avoid severe hyperventilation.</li>
                <li>Blood pressure/perfusion: treat shock, consider vasoactive support.</li>
                <li>Glucose and temperature control.</li>
                <li>12-lead ECG, labs, CXR, and search for cause of arrest.</li>
              </ul>
            </ResultCard>
          </div>

          <div className="md:col-span-2">
            <ResultCard title="References" icon={BookOpen}>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>American Heart Association Pediatric Cardiac Arrest Algorithm / PALS.</li>
                <li>Pediatric Advanced Life Support Provider Manual.</li>
                <li>Neonatal Resuscitation Program principles for neonatal arrest.</li>
              </ul>
            </ResultCard>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="advanced-mode"
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
          />
          <Label htmlFor="advanced-mode">
            Show advanced medications: atropine, bicarbonate, calcium
          </Label>
        </div>
      </div>
    </div>
  );
}
