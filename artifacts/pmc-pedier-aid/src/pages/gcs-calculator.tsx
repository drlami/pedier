import { useState, useMemo } from "react";
import { 
  Brain, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const GCS_ADULT = {
  eye: [
    { label: "Spontaneous", value: 4 },
    { label: "To speech", value: 3 },
    { label: "To pain", value: 2 },
    { label: "None", value: 1 },
  ],
  verbal: [
    { label: "Oriented", value: 5 },
    { label: "Confused", value: 4 },
    { label: "Inappropriate words", value: 3 },
    { label: "Incomprehensible sounds", value: 2 },
    { label: "None", value: 1 },
  ],
  motor: [
    { label: "Obeys commands", value: 6 },
    { label: "Localizes pain", value: 5 },
    { label: "Withdraws from pain", value: 4 },
    { label: "Abnormal flexion (decorticate)", value: 3 },
    { label: "Abnormal extension (decerebrate)", value: 2 },
    { label: "None", value: 1 },
  ]
};

const GCS_PEDS = {
  eye: [
    { label: "Spontaneous", value: 4 },
    { label: "To speech/shout", value: 3 },
    { label: "To pain", value: 2 },
    { label: "None", value: 1 },
  ],
  verbal: [
    { label: "Smiles, follows objects, social", value: 5 },
    { label: "Cries but is consolable, inappropriate interactions", value: 4 },
    { label: "Persistently irritable, screams", value: 3 },
    { label: "Restless, agitated", value: 2 },
    { label: "None", value: 1 },
  ],
  motor: [
    { label: "Spontaneous/Normal movement", value: 6 },
    { label: "Withdraws to touch", value: 5 },
    { label: "Withdraws to pain", value: 4 },
    { label: "Abnormal flexion (decorticate)", value: 3 },
    { label: "Abnormal extension (decerebrate)", value: 2 },
    { label: "None", value: 1 },
  ]
};

export default function GcsCalc() {
  const [ageGroup, setAgeGroup] = useState<"peds" | "adult">("peds");
  const [eye, setEye] = useState<string>("");
  const [verbal, setVerbal] = useState<string>("");
  const [motor, setMotor] = useState<string>("");

  const data = ageGroup === "peds" ? GCS_PEDS : GCS_ADULT;
  
  const totalScore = useMemo(() => {
    if (!eye || !verbal || !motor) return null;
    return parseInt(eye) + parseInt(verbal) + parseInt(motor);
  }, [eye, verbal, motor]);

  const interpretation = useMemo(() => {
    if (totalScore === null) return null;
    if (totalScore >= 13) return { label: "Mild Brain Injury", color: "text-green-600", bg: "bg-green-50" };
    if (totalScore >= 9) return { label: "Moderate Brain Injury", color: "text-orange-600", bg: "bg-orange-50" };
    return { label: "Severe Brain Injury (Coma)", color: "text-red-600", bg: "bg-red-50" };
  }, [totalScore]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">Glasgow Coma Scale</h1>
          <p className="text-muted-foreground text-sm">Age-adjusted neurological assessment tool</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Inputs */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient Age Group</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={ageGroup} onValueChange={(v) => {
                  setAgeGroup(v as any);
                  setEye(""); setVerbal(""); setMotor("");
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="peds">Pediatric (&lt; 2 yrs)</TabsTrigger>
                  <TabsTrigger value="adult">Child/Adult (&gt; 2 yrs)</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Eye Opening (E)</label>
                <Select value={eye} onValueChange={setEye}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select best response" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.eye.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>{opt.label} ({opt.value})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Verbal Response (V)</label>
                <Select value={verbal} onValueChange={setVerbal}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select best response" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.verbal.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>{opt.label} ({opt.value})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Motor Response (M)</label>
                <Select value={motor} onValueChange={setMotor}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select best response" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.motor.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>{opt.label} ({opt.value})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {totalScore !== null && interpretation ? (
          <div className="space-y-4">
            <Card className={cn("border-2 border-purple-200 transition-colors", interpretation.bg)}>
              <CardHeader className="pb-2">
                <Badge className="w-fit mb-2 bg-purple-600">Total GCS Score</Badge>
                <CardTitle className="text-5xl font-black font-mono text-purple-700">
                  {totalScore} <span className="text-2xl font-normal opacity-50">/ 15</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-background/50 border border-purple-100">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Severity</span>
                   <span className={cn("font-bold text-sm", interpretation.color)}>{interpretation.label}</span>
                </div>
                
                <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono bg-background">E{eye}</Badge>
                    <Badge variant="outline" className="font-mono bg-background">V{verbal}</Badge>
                    <Badge variant="outline" className="font-mono bg-background">M{motor}</Badge>
                </div>
              </CardContent>
            </Card>

            {totalScore <= 8 && (
                <div className="p-4 rounded-xl bg-red-600 text-white flex gap-4 animate-pulse">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">CRITICAL: AIRWAY RISK</p>
                        <p className="text-xs opacity-90">GCS ≤ 8 is an indication for definitive airway management (intubation).</p>
                    </div>
                </div>
            )}

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3 text-primary font-bold text-xs uppercase">
                  <Info className="h-4 w-4" /> Scoring Table
                </div>
                <table className="w-full text-[11px] border-collapse">
                    <thead>
                        <tr className="border-b text-muted-foreground">
                            <th className="text-left py-1">Range</th>
                            <th className="text-left py-1">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b"><td className="py-1.5 font-bold">13 - 15</td><td>Mild</td></tr>
                        <tr className="border-b"><td className="py-1.5 font-bold">9 - 12</td><td>Moderate</td></tr>
                        <tr><td className="py-1.5 font-bold">3 - 8</td><td>Severe (Coma)</td></tr>
                    </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 text-center bg-muted/20">
            <Calculator className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm font-medium">Complete all three sections (E, V, M) to calculate the GCS score.</p>
          </div>
        )}
      </div>
    </div>
  );
}
