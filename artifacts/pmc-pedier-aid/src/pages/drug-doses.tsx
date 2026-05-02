import { useState, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import {
  DRUGS,
  DRUG_CATEGORIES,
  CATEGORY_COLOR,
  type DrugCategory,
} from "@/lib/drug-doses";
import { AlertTriangle, Info, Pill, Weight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_EMOJI: Record<DrugCategory, string> = {
  "Resuscitation": "🚨",
  "Seizure": "⚡",
  "Analgesia & Sedation": "💊",
  "Respiratory": "🫁",
  "Antibiotics": "🦠",
  "Cardiovascular": "❤️",
  "Fluids & Electrolytes": "💧",
  "Allergy & Anaphylaxis": "🔴",
};

export default function DrugDosesPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const targetDrug = params.get("drug");

  const [weight, setWeight] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory>("Resuscitation");
  const drugRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const kg = parseFloat(weight);
  const validWeight = !isNaN(kg) && kg > 0 && kg <= 200;

  const weightWarning =
    !isNaN(kg) && kg > 0 && (kg < 1 || kg > 150)
      ? "Please verify — weight seems unusual for a paediatric patient."
      : null;

  // If a specific drug was linked, jump to it
  useEffect(() => {
    if (targetDrug && drugRefs.current[targetDrug]) {
      const drug = DRUGS.find((d) => d.id === targetDrug);
      if (drug) setActiveCategory(drug.category);
      setTimeout(() => {
        drugRefs.current[targetDrug]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [targetDrug]);

  const drugsInCategory = DRUGS.filter((d) => d.category === activeCategory);
  const colors = CATEGORY_COLOR[activeCategory];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 border border-orange-200 shrink-0">
          <Pill className="h-4.5 w-4.5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground">Drug Dosing Calculator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enter patient weight to calculate weight-based doses for common paediatric ER drugs.
          </p>
        </div>
      </div>

      {/* Weight input */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <label htmlFor="weight" className="text-sm font-semibold text-foreground">
              Patient Weight
            </label>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input
              id="weight"
              type="number"
              min="0.5"
              max="200"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 18"
              className="w-32 px-3 py-1.5 text-lg font-bold text-foreground bg-background border-2 border-primary/40 focus:border-primary rounded-lg outline-none transition-colors"
            />
            <span className="text-sm font-medium text-muted-foreground">kg</span>
            {validWeight && (
              <span className="ml-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-medium">
                Doses calculated for {kg} kg
              </span>
            )}
          </div>
        </div>
        {weightWarning && (
          <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {weightWarning}
          </div>
        )}
        {!weight && (
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Enter weight above to see calculated doses. Formulas are always shown.
          </p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {DRUG_CATEGORIES.map((cat) => {
          const c = CATEGORY_COLOR[cat];
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all",
                active
                  ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
              )}
            >
              {CATEGORY_EMOJI[cat]} {cat}
            </button>
          );
        })}
      </div>

      {/* Drug cards */}
      <div className="space-y-3">
        {drugsInCategory.map((drug) => (
          <div
            key={drug.id}
            ref={(el) => { drugRefs.current[drug.id] = el; }}
            id={`drug-${drug.id}`}
            className={cn(
              "bg-card border rounded-xl shadow-sm overflow-hidden",
              targetDrug === drug.id ? `${colors.border} border-2` : "border-border",
            )}
          >
            {/* Drug header */}
            <div className={cn("px-4 py-3 border-b flex items-start justify-between gap-2", colors.bg, colors.border, "border-b")}>
              <div>
                <h3 className={cn("font-bold text-sm", colors.text)}>{drug.name}</h3>
                {drug.indication && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{drug.indication}</p>
                )}
              </div>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 mt-0.5", colors.bg, colors.text, colors.border)}>
                {activeCategory}
              </span>
            </div>

            {/* Warning */}
            {drug.warning && (
              <div className="flex items-start gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 font-medium">{drug.warning}</p>
              </div>
            )}

            {/* Dose rows */}
            <div className="divide-y divide-border">
              {drug.doses.map((dose, i) => (
                <div key={i} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-muted/50">
                        {dose.route}
                      </span>
                      <span className="text-xs text-muted-foreground">{dose.formula}</span>
                    </div>
                    {dose.caution && (
                      <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                        <Info className="h-3 w-3 shrink-0" />
                        {dose.caution}
                      </p>
                    )}
                  </div>

                  {/* Calculated dose */}
                  <div className="sm:text-right shrink-0">
                    {validWeight ? (
                      <span className={cn(
                        "inline-block text-sm font-bold px-3 py-1 rounded-lg",
                        colors.bg, colors.text,
                      )}>
                        {dose.calculate(kg)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        Enter weight →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Calculated doses are for guidance only. Always verify against current local formulary,
          clinical guidelines, and patient-specific factors before administering. Maximum doses shown
          are standard limits — individual clinical judgement applies.
        </span>
      </div>
    </div>
  );
}
