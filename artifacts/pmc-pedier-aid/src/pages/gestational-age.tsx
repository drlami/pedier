import { useState, useMemo } from "react";
import { 
  Calendar, Calculator, Info, 
  ArrowLeft, CheckCircle2, AlertTriangle, Baby, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format, differenceInWeeks, differenceInDays, addWeeks, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";

export default function GestationalAgeCalc() {
  const [method, setMethod] = useState<"lmp" | "edd" | "ga">("lmp");
  const [lmpDate, setLmpDate] = useState<string>("");
  const [eddDate, setEddDate] = useState<string>("");
  const [gaWeeks, setGaWeeks] = useState<string>("");
  const [gaDays, setGaDays] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const results = useMemo(() => {
    const today = new Date();
    const bd = parseISO(birthDate);
    if (!isValid(bd)) return null;

    let gaAtBirthTotalDays = 0;

    if (method === "lmp") {
      const lmp = parseISO(lmpDate);
      if (!isValid(lmp)) return null;
      gaAtBirthTotalDays = differenceInDays(bd, lmp);
    } else if (method === "edd") {
      const edd = parseISO(eddDate);
      if (!isValid(edd)) return null;
      const conception = addWeeks(edd, -40);
      gaAtBirthTotalDays = differenceInDays(bd, conception);
    } else {
      const w = parseInt(gaWeeks);
      const d = parseInt(gaDays || "0");
      if (isNaN(w)) return null;
      gaAtBirthTotalDays = (w * 7) + d;
    }

    const chronologicalDays = differenceInDays(today, bd);
    const postMenstrualDays = gaAtBirthTotalDays + chronologicalDays;
    
    return {
      gaAtBirth: {
        weeks: Math.floor(gaAtBirthTotalDays / 7),
        days: gaAtBirthTotalDays % 7
      },
      chronological: {
        weeks: Math.floor(chronologicalDays / 7),
        days: chronologicalDays % 7,
        totalDays: chronologicalDays
      },
      pma: {
        weeks: Math.floor(postMenstrualDays / 7),
        days: postMenstrualDays % 7
      },
      corrected: postMenstrualDays > 280 ? {
        weeks: Math.floor((postMenstrualDays - 280) / 7),
        days: (postMenstrualDays - 280) % 7
      } : null
    };
  }, [method, lmpDate, eddDate, gaWeeks, gaDays, birthDate]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/calculators">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to PediCalc
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestational Age</h1>
          <p className="text-muted-foreground text-sm font-medium">Chronological and Corrected Age Calculator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/20 pb-4">
                <CardTitle className="text-base uppercase tracking-widest font-black text-muted-foreground text-xs">Birth Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Date of Birth</label>
                <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">GA Calculation Method</label>
                <div className="flex gap-2">
                  {(["lmp", "edd", "ga"] as const).map(m => (
                    <Button key={m} variant={method === m ? "default" : "outline"} size="sm" onClick={() => setMethod(m)} className="flex-1 uppercase text-[10px] font-bold">
                      {m === "ga" ? "Known GA" : m.toUpperCase()}
                    </Button>
                  ))}
                </div>

                {method === "lmp" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Last Menstrual Period (LMP)</label>
                    <Input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} className="h-11" />
                  </div>
                )}
                {method === "edd" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Estimated Due Date (EDD)</label>
                    <Input type="date" value={eddDate} onChange={(e) => setEddDate(e.target.value)} className="h-11" />
                  </div>
                )}
                {method === "ga" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Weeks</label>
                      <Input type="number" inputMode="decimal" placeholder="Weeks" value={gaWeeks} onChange={(e) => setGaWeeks(e.target.value)} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Days</label>
                      <Input type="number" inputMode="decimal" placeholder="Days" value={gaDays} onChange={(e) => setGaDays(e.target.value)} className="h-11" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            {results ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <AgeCard title="Chronological Age" w={results.chronological.weeks} d={results.chronological.days} description="Time since birth" color="slate" />
                    <AgeCard title="GA at Birth" w={results.gaAtBirth.weeks} d={results.gaAtBirth.days} description="Maturity at delivery" color="sky" />
                    <AgeCard title="Post-Menstrual Age (PMA)" w={results.pma.weeks} d={results.pma.days} description="Total maturity today" color="indigo" />
                    {results.corrected && (
                      <AgeCard title="Corrected Age" w={results.corrected.weeks} d={results.corrected.days} description="Developmental age adjustment" color="emerald" />
                    )}
                  </div>

                  <Card className="bg-muted/30 border-dashed">
                      <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3 text-primary font-black text-[10px] uppercase tracking-widest">
                              <Info className="h-3.5 w-3.5" /> Clinical Definitions
                          </div>
                          <div className="space-y-2 text-[11px] leading-relaxed">
                              <p>• <strong>Chronological Age:</strong> Time elapsed since birth (days/weeks/months).</p>
                              <p>• <strong>PMA:</strong> Gestational age at birth plus chronological age.</p>
                              <p>• <strong>Corrected Age:</strong> Used for preterm infants ({'<'} 37 weeks) to track development. Calculated as PMA minus 40 weeks.</p>
                          </div>
                      </CardContent>
                  </Card>
                </>
            ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-4 border-dashed rounded-[40px] p-12 text-center bg-muted/20 border-muted/30">
                    <Clock className="h-16 w-16 text-muted-foreground/20 mb-6" />
                    <h3 className="text-xl font-black text-muted-foreground/80 tracking-tight">Timeline Check</h3>
                    <p className="text-muted-foreground font-medium text-sm mt-3 leading-relaxed max-w-[280px]">
                      Enter the birth date and gestational information to calculate age milestones.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function AgeCard({ title, w, d, description, color }: { title: string, w: number, d: number, description: string, color: string }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-50 border-sky-100 text-sky-900",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-900",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-900",
    slate: "bg-slate-50 border-slate-100 text-slate-900"
  };

  return (
    <Card className={cn("border-2 shadow-sm", colors[color])}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase opacity-60 tracking-widest block">{title}</span>
          <p className="text-[10px] font-medium opacity-80">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black font-mono">{w}</span>
          <span className="text-xs font-bold mr-2 opacity-60">w</span>
          <span className="text-3xl font-black font-mono">{d}</span>
          <span className="text-xs font-bold opacity-60">d</span>
        </div>
      </CardContent>
    </Card>
  );
}
