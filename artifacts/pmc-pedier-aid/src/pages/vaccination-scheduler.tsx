import { useState, useMemo } from "react";
import { ShieldCheck, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// EPI / WHO standard schedule plus common catch-up guidance
// Based on WHO EPI schedule + Saudi/regional common standard

type VaccineSchedule = {
  vaccine: string;
  doses: string[];
  minAge: string;
  minInterval: string;
  notes: string;
  catchUp: string;
};

const VACCINES: VaccineSchedule[] = [
  {
    vaccine: "BCG",
    doses: ["Birth"],
    minAge: "Birth",
    minInterval: "Single dose",
    notes: "Give at birth. If missed, give up to 5 years (TST negative). Not given if immunocompromised.",
    catchUp: "Single dose any time before 5 years if TST negative and no BCG scar.",
  },
  {
    vaccine: "Hepatitis B (HBV)",
    doses: ["Birth", "1–2 months", "6 months"],
    minAge: "Birth",
    minInterval: "4 weeks (dose 1→2); 8 weeks (dose 2→3); ≥16 weeks (dose 1→3)",
    notes: "Birth dose within 24h (especially if maternal HBsAg+). Monovalent used at birth.",
    catchUp: "3-dose series. Minimum age dose 1: birth. Test anti-HBs after series if at-risk.",
  },
  {
    vaccine: "DTaP / DTP",
    doses: ["2 months", "4 months", "6 months", "15–18 months", "4–6 years"],
    minAge: "6 weeks",
    minInterval: "4 weeks (doses 1→3); 6 months (dose 3→4); 6 months (dose 4→5)",
    notes: "Tdap booster at 11–12 years. Td every 10 years in adults.",
    catchUp: "Catch-up: complete 5 doses before age 7. Ages 7+: only 3 doses Td/Tdap needed.",
  },
  {
    vaccine: "Hib (Haemophilus influenzae b)",
    doses: ["2 months", "4 months", "6 months", "12–15 months"],
    minAge: "6 weeks",
    minInterval: "4 weeks (doses 1→3 if < 12m); 8 weeks (final dose)",
    notes: "Not routinely given after 5 years (unless asplenic/immunocompromised).",
    catchUp: "Age 12–14m: 2 doses 8 weeks apart. Age 15–59m: 1 dose if not vaccinated.",
  },
  {
    vaccine: "IPV (Inactivated Polio)",
    doses: ["2 months", "4 months", "6–18 months", "4–6 years"],
    minAge: "6 weeks",
    minInterval: "4 weeks (all early doses); 6 months (dose 3→4)",
    notes: "OPV used in endemic countries per WHO. IPV standard in non-endemic settings.",
    catchUp: "4 doses total. Minimum interval dose 3→4: 6 months.",
  },
  {
    vaccine: "Pneumococcal (PCV13/15)",
    doses: ["2 months", "4 months", "6 months", "12–15 months"],
    minAge: "6 weeks",
    minInterval: "4 weeks (doses 1→3); 8 weeks (dose 3→4)",
    notes: "PPSV23 for at-risk children ≥ 2 years after PCV series.",
    catchUp: "Age 12–23m unvaccinated: 2 doses 8 weeks apart. Age 24m–5y: 1 dose.",
  },
  {
    vaccine: "Rotavirus (RV)",
    doses: ["2 months", "4 months", "6 months (Rotateq only)"],
    minAge: "6 weeks",
    minInterval: "4 weeks",
    notes: "Max age for dose 1: 14 weeks 6 days. Series must complete by 8 months. Do not start after 15 weeks.",
    catchUp: "No catch-up after 8 months. Strict age limits — do not administer after maximum age.",
  },
  {
    vaccine: "MMR (Measles, Mumps, Rubella)",
    doses: ["12–15 months", "4–6 years"],
    minAge: "12 months",
    minInterval: "28 days (between doses)",
    notes: "Can give dose 1 as early as 6m if travel to endemic area — does not count towards routine schedule.",
    catchUp: "Dose 1 at ≥ 12m; dose 2 at ≥ 13m (≥ 28 days after dose 1). For outbreak: 3rd dose considered.",
  },
  {
    vaccine: "Varicella (VZV)",
    doses: ["12–15 months", "4–6 years"],
    minAge: "12 months",
    minInterval: "3 months (if < 13 years); 4 weeks (if ≥ 13 years)",
    notes: "History of chickenpox = presumptive immunity. Catch-up for susceptible children and adolescents.",
    catchUp: "2 doses for susceptible individuals at any age. ≥ 13y: 4-week minimum interval.",
  },
  {
    vaccine: "Hepatitis A (HepA)",
    doses: ["12–23 months", "18–41 months (6m after dose 1)"],
    minAge: "12 months",
    minInterval: "6 months",
    notes: "Recommended in endemic regions. Catch-up for unvaccinated children ≥ 2 years.",
    catchUp: "2 doses at least 6 months apart, starting at ≥ 12 months.",
  },
  {
    vaccine: "Meningococcal (MenACWY)",
    doses: ["11–12 years", "16 years (booster)"],
    minAge: "2 months (high-risk)",
    minInterval: "8 weeks (if ≥ 2 doses in childhood); 5 years (booster)",
    notes: "High-risk: asplenia, complement deficiency, college freshman, hajj pilgrims.",
    catchUp: "≥ 2y: 1 dose then booster at 16y or 3–5y later.",
  },
  {
    vaccine: "HPV",
    doses: ["11–12 years (2 doses)", "15+ years (3 doses)"],
    minAge: "9 years",
    minInterval: "5 months (2-dose schedule); 1–2 months between doses 1–3 (3-dose)",
    notes: "9–14 years: 2-dose schedule. ≥ 15 years or immunocompromised: 3-dose. Gender-neutral.",
    catchUp: "Catch-up through age 26. Ages 27–45: shared clinical decision making.",
  },
  {
    vaccine: "Influenza",
    doses: ["Annually from 6 months"],
    minAge: "6 months",
    minInterval: "4 weeks (first season, 2 doses if < 9 years); annual thereafter",
    notes: "First-time recipients < 9 years: 2 doses 4 weeks apart. LAIV (live attenuated) 2–49 years if no contraindications.",
    catchUp: "Annual vaccination. Previous influenza vaccination in any season counts — no cumulative count.",
  },
];

const SPECIAL_SITUATIONS = [
  { id: "preterm", label: "Preterm infant (< 37 weeks)", note: "Vaccinate at chronological age (not corrected). Full doses from 2 months chronological age. HBV at birth if ≥ 2 kg, otherwise at 1 month." },
  { id: "immunocomp", label: "Immunocompromised / on immunosuppression", note: "Avoid live vaccines (MMR, Varicella, LAIV, RV). Use inactivated alternatives where available. Increase catch-up urgency." },
  { id: "asplenia", label: "Asplenia / splenectomy / sickle cell", note: "Prioritise: PCV + PPSV23, MenACWY + MenB, Hib. Annual influenza. Additional doses may be needed." },
  { id: "hiv", label: "HIV-infected child", note: "MMR and Varicella can be given if CD4 ≥ 15% (≥ 200 in adolescents). Avoid LAIV. More frequent influenza dosing." },
  { id: "travel", label: "International travel", note: "Consider: Typhoid, Hep A, Yellow Fever (if endemic area, ≥ 9m), Meningococcal, Japanese Encephalitis. Check CDC Travel Health." },
];

export default function VaccinationSchedulerPage() {
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [selectedVaccine, setSelectedVaccine] = useState<string | null>(null);
  const [special, setSpecial] = useState<string[]>([]);

  function toggleSpecial(id: string) {
    setSpecial(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const AGE_BUTTONS = [
    { label: "Birth", months: 0 },
    { label: "2m", months: 2 },
    { label: "4m", months: 4 },
    { label: "6m", months: 6 },
    { label: "9m", months: 9 },
    { label: "12m", months: 12 },
    { label: "15m", months: 15 },
    { label: "18m", months: 18 },
    { label: "2y", months: 24 },
    { label: "4–5y", months: 54 },
    { label: "11–12y", months: 132 },
    { label: "16y", months: 192 },
  ];

  function isDue(vaccine: VaccineSchedule, months: number): boolean {
    // Simplified: if any dose is scheduled around this age
    const scheduleAgesM: number[] = vaccine.doses.map(d => {
      if (d.toLowerCase().includes("birth")) return 0;
      const m = parseInt(d);
      if (d.includes("months")) return m;
      if (d.includes("years")) return m * 12;
      return m; // default assume months
    });
    return scheduleAgesM.some(a => Math.abs(a - months) <= 3);
  }

  const dueVaccines = ageMonths !== null ? VACCINES.filter(v => isDue(v, ageMonths)) : [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Catch-Up Vaccination Scheduler</h1>
          <p className="text-muted-foreground text-sm mt-1">
            WHO/EPI-based schedule reference with catch-up guidance, minimum intervals, and special population notes.
          </p>
        </div>
      </div>

      <Alert className="rounded-2xl border-teal-200 bg-teal-50">
        <Info className="h-4 w-4 text-teal-600" />
        <AlertDescription className="text-teal-800 text-sm">
          Based on WHO EPI and ACIP/AAP 2024 recommended schedule. Always verify against your local national immunisation programme — schedules differ by country. This tool is a reference guide, not a substitute for local guidelines.
        </AlertDescription>
      </Alert>

      {/* Age filter */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black">Quick Look — Vaccines Due At Age</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {AGE_BUTTONS.map(b => (
              <button
                key={b.label}
                onClick={() => setAgeMonths(prev => prev === b.months ? null : b.months)}
                className={cn(
                  "px-3 py-2 rounded-2xl border-2 font-bold text-sm transition-all",
                  ageMonths === b.months ? "bg-primary text-white border-primary shadow-md" : "bg-muted/20 border-transparent hover:border-primary/30"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
          {ageMonths !== null && dueVaccines.length > 0 && (
            <div>
              <p className="text-sm font-black mb-2">Vaccines typically due:</p>
              <div className="flex flex-wrap gap-2">
                {dueVaccines.map(v => (
                  <Badge key={v.vaccine} className="bg-primary/10 text-primary font-bold cursor-pointer hover:bg-primary/20"
                    onClick={() => setSelectedVaccine(selectedVaccine === v.vaccine ? null : v.vaccine)}>
                    {v.vaccine}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {ageMonths !== null && dueVaccines.length === 0 && (
            <p className="text-sm text-muted-foreground">No routine vaccines scheduled at this exact visit — check catch-up requirements below.</p>
          )}
        </CardContent>
      </Card>

      {/* Full vaccine table */}
      <div className="space-y-4">
        <h2 className="text-xl font-black">Full Vaccine Schedule Reference</h2>
        {VACCINES.map(v => (
          <Card
            key={v.vaccine}
            className={cn("rounded-3xl border-2 cursor-pointer transition-all", selectedVaccine === v.vaccine ? "border-primary bg-primary/5" : "hover:border-primary/30")}
            onClick={() => setSelectedVaccine(selectedVaccine === v.vaccine ? null : v.vaccine)}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-black text-base">{v.vaccine}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {v.doses.map(d => (
                      <Badge key={d} className="bg-muted text-muted-foreground font-semibold text-xs">{d}</Badge>
                    ))}
                  </div>
                </div>
                <span className="text-muted-foreground text-lg">{selectedVaccine === v.vaccine ? "▲" : "▼"}</span>
              </div>

              {selectedVaccine === v.vaccine && (
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-1">Minimum Interval</p>
                    <p>{v.minInterval}</p>
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-1">Notes</p>
                    <p>{v.notes}</p>
                  </div>
                  <div className="rounded-2xl bg-teal-50 border border-teal-200 p-3">
                    <p className="font-black text-xs uppercase tracking-widest text-teal-600 mb-1">Catch-Up Guidance</p>
                    <p className="text-teal-800">{v.catchUp}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Special situations */}
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Special Situations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SPECIAL_SITUATIONS.map(s => (
            <button
              key={s.id}
              onClick={() => toggleSpecial(s.id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl border-2 transition-all",
                special.includes(s.id) ? "bg-amber-50 border-amber-300" : "bg-muted/20 border-transparent hover:border-amber-200"
              )}
            >
              <p className="font-black text-sm flex items-center gap-2">
                <span>{special.includes(s.id) ? "▼" : "▶"}</span>
                {s.label}
              </p>
              {special.includes(s.id) && (
                <p className="text-sm text-amber-800 mt-2">{s.note}</p>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Reference: WHO EPI Immunisation Schedule 2024 · ACIP/AAP Recommended Immunisation Schedule 2024 · CDC Catch-Up Immunisation Schedule · Local NIP guidelines take precedence
      </p>
    </div>
  );
}
