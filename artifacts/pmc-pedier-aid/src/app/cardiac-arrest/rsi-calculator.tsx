"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  Copy,
  AlertTriangle,
  Syringe,
  Wind,
  Brain,
  CheckSquare,
  HeartCrack,
  BookOpen,
  ShieldAlert,
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const round = (value: number, decimals = 1) => Number(value.toFixed(decimals));

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

const getVentilatorSettings = (
  ageCategory: "neonate" | "infant" | "toddler" | "child" | "adolescent"
) => {
  switch (ageCategory) {
    case "neonate":
      return {
        rr: "30–40",
        volume: "4–6 mL/kg",
        peep: "5",
        notes: "Neonates often require pressure-controlled ventilation. Confirm with neonatology/PICU.",
      };
    case "infant":
      return { rr: "25–30", volume: "6–8 mL/kg", peep: "5", notes: "" };
    case "toddler":
      return { rr: "20–25", volume: "6–8 mL/kg", peep: "5", notes: "" };
    case "child":
      return { rr: "16–20", volume: "6–8 mL/kg", peep: "5", notes: "" };
    case "adolescent":
      return { rr: "12–16", volume: "6–8 mL/kg", peep: "5", notes: "" };
    default:
      return { rr: "N/A", volume: "N/A", peep: "N/A", notes: "" };
  }
};

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
      cuffed: "3.0–3.5",
      uncuffed: "3.5–4.0",
      depth: "10–12 cm",
      blade: "Miller 1",
      note: "Prepare selected tube + 0.5 smaller + 0.5 larger.",
    };
  }

  const uncuffed = ageInYears / 4 + 4;
  const cuffed = ageInYears / 4 + 3.5;
  const depth = cuffed * 3;

  let blade = "Mac 2";
  if (ageInYears < 3) blade = "Miller 1.5–2";
  else if (ageInYears < 8) blade = "Mac 2";
  else blade = "Mac 3";

  return {
    cuffed: round(cuffed, 1).toFixed(1),
    uncuffed: round(uncuffed, 1).toFixed(1),
    depth: `${round(depth, 1)} cm`,
    blade,
    note: "Prepare selected tube + 0.5 smaller + 0.5 larger.",
  };
};

const ResultCard = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn("print-no-break-inside", className)}>
    <CardHeader className="pb-2 pt-4 px-4">
      <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-primary uppercase tracking-wide">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm space-y-2 px-4 pb-4">{children}</CardContent>
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

const SoapMeDialog = () => (
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="font-headline text-primary">RSI Checklist: SOAPME</DialogTitle>
    </DialogHeader>
    <div className="space-y-3 text-sm">
      <p>
        <strong className="text-primary">S</strong> - Suction: Yankauer and suction
        catheters checked.
      </p>
      <p>
        <strong className="text-primary">O</strong> - Oxygen: BVM, 100% oxygen,
        nasal cannula for apneic oxygenation.
      </p>
      <p>
        <strong className="text-primary">A</strong> - Airway: Laryngoscope checked,
        primary blade + backup, ETT correct size + 0.5 smaller + 0.5 larger, stylet,
        syringe, LMA.
      </p>
      <p>
        <strong className="text-primary">P</strong> - Pharmacy: Induction,
        paralytic, sedation, emergency drugs drawn and labeled.
      </p>
      <p>
        <strong className="text-primary">M</strong> - Monitors: SpO₂, ECG, BP,
        ETCO₂ ready.
      </p>
      <p>
        <strong className="text-primary">E</strong> - Emergency: Failed airway plan,
        call senior help, surgical airway plan if appropriate.
      </p>
    </div>
  </DialogContent>
);

export function RsiCalculator() {
  const [weight, setWeight] = useState<number | string>("");
  const [age, setAge] = useState<number | string>("");
  const [ageUnit, setAgeUnit] = useState<"months" | "years">("years");
  const [inputType, setInputType] = useState<"weight" | "age">("weight");
  const [patientType, setPatientType] = useState("infant-child");
  const [pretreatment, setPretreatment] = useState(false);
  const [difficultAirway, setDifficultAirway] = useState(false);
  const [inShock, setInShock] = useState(false);
  const [asthmatic, setAsthmatic] = useState(false);
  const [tbi, setTbi] = useState(false);
  const [activeArrest, setActiveArrest] = useState(false);
  const [inductionAgent, setInductionAgent] = useState("ketamine");

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
      if (finalWeight <= 10) return 0.5;
      if (finalWeight <= 14) return 2;
      if (finalWeight <= 40) return 7;
      return 13;
    }

    return undefined;
  }, [age, ageUnit, inputType, finalWeight]);

  const ageCategory = useMemo(() => {
    if (patientType === "neonate") return "neonate";
    if (ageInYears !== undefined) return getAgeCategory(ageInYears);
    return undefined;
  }, [ageInYears, patientType]);

  const ventSettings = useMemo(
    () => getVentilatorSettings(ageCategory ?? "child"),
    [ageCategory]
  );

  const ett = useMemo(() => {
    if (!finalWeight) return undefined;
    return getEtt(ageInYears, finalWeight, patientType);
  }, [ageInYears, finalWeight, patientType]);

  const preferredInduction = useMemo(() => {
    if (activeArrest) return "Usually no RSI induction/paralysis during active arrest";
    if (asthmatic) return "Ketamine";
    if (inShock) return "Ketamine or Etomidate; reduce dose if unstable";
    if (tbi) return "Etomidate or Ketamine";
    return "Ketamine or Etomidate";
  }, [activeArrest, inShock, asthmatic, tbi]);

  const handleCopy = useCallback(() => {
    if (!summaryRef.current) return;
    navigator.clipboard.writeText(summaryRef.current.innerText);
    toast({
      title: "Copied",
      description: "RSI summary copied to clipboard.",
    });
  }, [toast]);

  if (!finalWeight || finalWeight <= 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Patient Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Patient Type</Label>
              <RadioGroup
                value={patientType}
                onValueChange={setPatientType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="infant-child" id="type-child" />
                  <Label htmlFor="type-child" className="font-normal">
                    Infant / Child
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neonate" id="type-neonate" />
                  <Label htmlFor="type-neonate" className="font-normal">
                    Neonate
                  </Label>
                </div>
              </RadioGroup>
            </div>

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
              Enter weight or age to generate RSI parameters.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const atropineMax = ageCategory === "adolescent" ? 1 : 0.5;
  const atropineDose = Math.max(0.1, Math.min(0.02 * finalWeight, atropineMax));

  const succDose =
    ageCategory === "infant" || ageCategory === "neonate"
      ? 2 * finalWeight
      : 1.5 * finalWeight;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Patient Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Patient Type</Label>
            <RadioGroup
              value={patientType}
              onValueChange={setPatientType}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="infant-child" id="type-child" />
                <Label htmlFor="type-child" className="font-normal">
                  Infant / Child
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neonate" id="type-neonate" />
                <Label htmlFor="type-neonate" className="font-normal">
                  Neonate
                </Label>
              </div>
            </RadioGroup>
          </div>

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
                Estimated weight:{" "}
                <span className="font-bold">{finalWeight.toFixed(1)} kg</span>
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-bold font-headline tracking-tight">
            Rapid Sequence Intubation Summary
          </h2>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CheckSquare className="mr-2 h-4 w-4" /> SOAPME
                </Button>
              </DialogTrigger>
              <SoapMeDialog />
            </Dialog>

            <Button onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
          </div>
        </div>

        <Alert variant="destructive" className="bg-destructive/10">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Critical RSI warning</AlertTitle>
          <AlertDescription className="text-sm">
            RSI is high risk in children. Use this as a bedside dose aid only. Always prepare
            backup airway, suction, BVM, ETCO₂, and senior help.
          </AlertDescription>
        </Alert>

        {ageCategory === "neonate" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Neonatal airway warning</AlertTitle>
            <AlertDescription>
              Neonatal intubation differs from standard pediatric RSI. Use experienced personnel
              whenever possible.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 p-4 border rounded-lg bg-secondary/30">
          <h3 className="font-semibold text-base text-foreground">Special Considerations</h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active-arrest"
                checked={activeArrest}
                onCheckedChange={setActiveArrest}
              />
              <Label htmlFor="active-arrest">Active arrest?</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="difficult-airway"
                checked={difficultAirway}
                onCheckedChange={setDifficultAirway}
              />
              <Label htmlFor="difficult-airway">Difficult airway?</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="shock-mode" checked={inShock} onCheckedChange={setInShock} />
              <Label htmlFor="shock-mode">Shock?</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="asthma-mode" checked={asthmatic} onCheckedChange={setAsthmatic} />
              <Label htmlFor="asthma-mode">Asthma?</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="tbi-mode" checked={tbi} onCheckedChange={setTbi} />
              <Label htmlFor="tbi-mode">TBI?</Label>
            </div>
          </div>

          {activeArrest && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Active cardiac arrest</AlertTitle>
              <AlertDescription>
                Do not delay CPR/defibrillation/epinephrine for intubation. Use BVM first.
                Intubation should be done only by skilled provider with minimal interruption.
              </AlertDescription>
            </Alert>
          )}

          {difficultAirway && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Difficult airway</AlertTitle>
              <AlertDescription>
                Call anesthesia/PICU/senior airway support before attempt. Prepare failed airway
                plan and LMA.
              </AlertDescription>
            </Alert>
          )}

          {(inShock || asthmatic || tbi) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Suggested induction choice</AlertTitle>
              <AlertDescription>
                Preferred agent: <span className="font-bold">{preferredInduction}</span>.
                {inShock && " Avoid propofol. Prepare fluids/vasopressor support."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={summaryRef}>
          <ResultCard title="Patient" icon={Stethoscope}>
            <ResultRow label="Working weight" value={finalWeight.toFixed(1)} unit="kg" />
            <ResultRow label="Age category" value={ageCategory ?? "Estimated"} />
            {inputType === "age" && (
              <p className="text-xs text-muted-foreground">
                Weight is age-estimated. Use measured weight or length tape if available.
              </p>
            )}
          </ResultCard>

          <ResultCard title="Pre-oxygenation" icon={Wind}>
            <ul className="list-disc list-inside space-y-1">
              <li>100% oxygen for 3 minutes if time allows.</li>
              <li>Use BVM with PEEP for hypoxic child.</li>
              <li>Use nasal cannula for apneic oxygenation.</li>
              <li>Prepare suction and backup airway before drugs.</li>
            </ul>

            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="pretreatment-mode"
                checked={pretreatment}
                onCheckedChange={setPretreatment}
              />
              <Label htmlFor="pretreatment-mode">Show atropine pretreatment</Label>
            </div>

            {pretreatment && (
              <div className="mt-2">
                <ResultRow label="Atropine" value={atropineDose.toFixed(2)} unit="mg IV" />
                <p className="text-xs text-muted-foreground mt-1">
                  Consider in infants, bradycardia risk, vagal stimulation, or repeated attempt.
                </p>
              </div>
            )}
          </ResultCard>

          <ResultCard title="Airway Equipment" icon={Wind}>
            {ett && (
              <>
                <ResultRow label="Cuffed ETT" value={ett.cuffed} />
                <ResultRow label="Uncuffed ETT" value={ett.uncuffed} />
                <ResultRow label="Depth estimate" value={ett.depth} />
                <ResultRow label="Blade" value={ett.blade} />
                <p className="text-xs text-muted-foreground">{ett.note}</p>
              </>
            )}
          </ResultCard>

          <ResultCard title="Induction" icon={Syringe}>
            <Label htmlFor="induction-agent">Induction Agent</Label>
            <Select value={inductionAgent} onValueChange={setInductionAgent}>
              <SelectTrigger id="induction-agent" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ketamine">Ketamine</SelectItem>
                <SelectItem value="etomidate">Etomidate</SelectItem>
                <SelectItem value="propofol" disabled={ageCategory === "neonate" || inShock}>
                  Propofol {ageCategory === "neonate" || inShock ? "(avoid)" : ""}
                </SelectItem>
                <SelectItem value="midazolam">Midazolam</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-2 space-y-1 text-sm">
              {inductionAgent === "ketamine" && (
                <>
                  <p>
                    Ketamine 1–2 mg/kg:{" "}
                    <span className="font-bold">
                      {finalWeight.toFixed(1)}–{(2 * finalWeight).toFixed(1)} mg IV
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Useful in asthma/bronchospasm and many shock states; reduce dose if profoundly
                    unstable.
                  </p>
                </>
              )}

              {inductionAgent === "etomidate" && (
                <p>
                  Etomidate 0.3 mg/kg:{" "}
                  <span className="font-bold">{(0.3 * finalWeight).toFixed(1)} mg IV</span>
                </p>
              )}

              {inductionAgent === "propofol" && (
                <p>
                  Propofol 1–2 mg/kg:{" "}
                  <span className="font-bold">
                    {finalWeight.toFixed(1)}–{(2 * finalWeight).toFixed(1)} mg IV
                  </span>
                </p>
              )}

              {inductionAgent === "midazolam" && (
                <p>
                  Midazolam 0.1 mg/kg:{" "}
                  <span className="font-bold">{(0.1 * finalWeight).toFixed(1)} mg IV</span>
                </p>
              )}
            </div>
          </ResultCard>

          <ResultCard title="Paralysis" icon={HeartCrack}>
            <ResultRow
              label="Rocuronium"
              value={(1.2 * finalWeight).toFixed(1)}
              unit="mg IV"
            />
            <ResultRow label="Succinylcholine" value={succDose.toFixed(1)} unit="mg IV" />

            <Alert variant="destructive" className="mt-2">
              <HeartCrack className="h-4 w-4" />
              <AlertTitle>Succinylcholine contraindications</AlertTitle>
              <AlertDescription className="text-xs">
                Neuromuscular disease, muscular dystrophy risk, burns &gt;48h, crush injury,
                hyperkalemia, significant renal failure with hyperkalemia risk.
              </AlertDescription>
            </Alert>
          </ResultCard>

          <ResultCard title="Post-Intubation Confirmation" icon={Brain}>
            <ul className="list-disc list-inside space-y-1">
              <li>Sustained waveform ETCO₂.</li>
              <li>Bilateral chest rise.</li>
              <li>Bilateral breath sounds.</li>
              <li>No epigastric sounds.</li>
              <li>Improving SpO₂ and heart rate.</li>
              <li>CXR confirmation after stabilization.</li>
            </ul>
          </ResultCard>

          <ResultCard title="Initial Ventilator Settings" icon={Wind}>
            <ResultRow label="Respiratory rate" value={ventSettings.rr} unit="/min" />
            <ResultRow label="Tidal volume" value={ventSettings.volume} />
            <ResultRow label="PEEP" value={ventSettings.peep} unit="cm H₂O" />
            <ResultRow label="FiO₂" value="100" unit="%, then titrate" />
            {ventSettings.notes && (
              <p className="text-xs text-muted-foreground">{ventSettings.notes}</p>
            )}
          </ResultCard>

          <ResultCard title="Post-Intubation Sedation / Analgesia" icon={Syringe}>
            <ResultRow
              label="Fentanyl"
              value={`${(1 * finalWeight).toFixed(1)}–${(2 * finalWeight).toFixed(1)}`}
              unit="mcg IV"
            />
            <ResultRow
              label="Midazolam"
              value={(0.05 * finalWeight).toFixed(2)}
              unit="mg IV starting dose"
            />
            <ResultRow
              label="Ketamine"
              value={(1 * finalWeight).toFixed(1)}
              unit="mg IV"
            />
            <p className="text-xs text-muted-foreground">
              Titrate sedation to blood pressure, diagnosis, and ventilation needs.
            </p>
          </ResultCard>

          <div className="md:col-span-2">
            <ResultCard title="References" icon={BookOpen}>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Pediatric Advanced Life Support airway principles.</li>
                <li>Pediatric RSI emergency medicine references.</li>
                <li>Neonatal airway references / NRP principles.</li>
              </ul>
            </ResultCard>
          </div>
        </div>
      </div>
    </div>
  );
}
