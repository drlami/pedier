import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearch } from "wouter";
import {
  getMergedDrugs,
  DRUG_CATEGORIES,
  CATEGORY_COLOR,
  type DrugCategory,
  type DrugEntry,
  type EnhancedDoseRow,
} from "@/lib/drug-doses";
import { deleteCustomDrug, resetBuiltinDrug } from "@/lib/drug-store";
import DrugEditDialog from "@/components/drug-doses/DrugEditDialog";
import {
  AlertTriangle, Info, Pill, Weight, Pencil, Trash2, RotateCcw, Plus,
  FlaskConical, Clock,
} from "lucide-react";
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

// ── Oral concentration ml calculator ─────────────────────────────────────────

function calcMl(dose: EnhancedDoseRow, kg: number, mgPerMl: number): string | null {
  if (!dose.dosePerKgMg || !mgPerMl || mgPerMl <= 0) return null;
  const rawMg = dose.dosePerKgMg * kg;
  const doseMg = dose.maxDoseMg ? Math.min(rawMg, dose.maxDoseMg) : rawMg;
  const roundedMg = Math.round(doseMg);
  const ml = doseMg / mgPerMl;
  return `${roundedMg} mg = ${ml.toFixed(1)} ml`;
}

// ── Oral concentration picker ─────────────────────────────────────────────────

function ConcentrationPicker({
  dose,
  kg,
  drugId,
  doseIndex,
  concentrationMap,
  setConcentrationMap,
  colors,
}: {
  dose: EnhancedDoseRow;
  kg: number;
  drugId: string;
  doseIndex: number;
  concentrationMap: Record<string, string>;
  setConcentrationMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  colors: { bg: string; text: string; border: string };
}) {
  const key = `${drugId}-${doseIndex}`;
  const selected = concentrationMap[key] ?? "";
  const mgPerMl = selected ? parseFloat(selected) : 0;
  const mlResult = kg > 0 && mgPerMl > 0 ? calcMl(dose, kg, mgPerMl) : null;
  const conc = dose.oralConcentrations?.find((c) => String(c.mgPerMl) === selected);

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <FlaskConical className="h-3 w-3 shrink-0" />
          <span className="font-semibold uppercase tracking-wide">Volume calculator</span>
        </div>
        <select
          value={selected}
          onChange={(e) =>
            setConcentrationMap((prev) => ({ ...prev, [key]: e.target.value }))
          }
          className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select concentration…</option>
          {dose.oralConcentrations?.map((c) => (
            <option key={c.label} value={String(c.mgPerMl)}>{c.label}</option>
          ))}
        </select>
      </div>
      {mlResult && conc && (
        <div className={cn(
          "inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg",
          colors.bg, colors.text,
        )}>
          <FlaskConical className="h-3.5 w-3.5 shrink-0" />
          {mlResult} of {conc.label}
        </div>
      )}
      {selected && !mlResult && kg <= 0 && (
        <p className="text-[11px] text-muted-foreground italic">Enter patient weight above to calculate volume.</p>
      )}
    </div>
  );
}

// ── Dose row ──────────────────────────────────────────────────────────────────

function DoseRowDisplay({
  dose,
  index,
  drug,
  kg,
  validWeight,
  colors,
  concentrationMap,
  setConcentrationMap,
}: {
  dose: EnhancedDoseRow;
  index: number;
  drug: DrugEntry;
  kg: number;
  validWeight: boolean;
  colors: { bg: string; text: string; border: string };
  concentrationMap: Record<string, string>;
  setConcentrationMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const isOral = dose.type === "oral" && (dose.oralConcentrations?.length ?? 0) > 0;

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-start gap-2">
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

        {/* Calculated dose result */}
        <div className="sm:text-right shrink-0 space-y-1">
          {validWeight ? (
            <>
              <span className={cn("inline-block text-sm font-bold px-3 py-1 rounded-lg", colors.bg, colors.text)}>
                {dose.calculate(kg)}
              </span>
              {/* Frequency badge */}
              {dose.frequency && (
                <div className="flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{dose.frequency}</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground italic">Enter weight →</span>
              {dose.frequency && (
                <div className="flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{dose.frequency}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Oral concentration picker */}
      {isOral && (
        <ConcentrationPicker
          dose={dose}
          kg={kg}
          drugId={drug.id}
          doseIndex={index}
          concentrationMap={concentrationMap}
          setConcentrationMap={setConcentrationMap}
          colors={colors}
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DrugDosesPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const targetDrug = params.get("drug");

  const [weight, setWeight] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory>("Resuscitation");
  const [refreshKey, setRefreshKey] = useState(0);
  const [concentrationMap, setConcentrationMap] = useState<Record<string, string>>({});

  // Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<DrugEntry | undefined>(undefined);
  const [dialogCategory, setDialogCategory] = useState<DrugCategory>("Antibiotics");

  // Delete confirm state
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const drugRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const kg = parseFloat(weight);
  const validWeight = !isNaN(kg) && kg > 0 && kg <= 200;
  const weightWarning =
    !isNaN(kg) && kg > 0 && (kg < 1 || kg > 150)
      ? "Please verify — weight seems unusual for a paediatric patient."
      : null;

  const allDrugs = useMemo(() => getMergedDrugs(), [refreshKey]);
  const drugsInCategory = useMemo(
    () => allDrugs.filter((d) => d.category === activeCategory),
    [allDrugs, activeCategory],
  );
  const colors = CATEGORY_COLOR[activeCategory];

  useEffect(() => {
    if (targetDrug && drugRefs.current[targetDrug]) {
      const drug = allDrugs.find((d) => d.id === targetDrug);
      if (drug) setActiveCategory(drug.category);
      setTimeout(() => {
        drugRefs.current[targetDrug]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [targetDrug, allDrugs]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const openEdit = useCallback((drug: DrugEntry) => {
    setEditingDrug(drug);
    setDialogCategory(drug.category);
    setDialogOpen(true);
  }, []);

  const openAdd = useCallback((category: DrugCategory) => {
    setEditingDrug(undefined);
    setDialogCategory(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteCustomDrug(id);
    setConfirmDelete(null);
    refresh();
  }, [refresh]);

  const handleReset = useCallback((id: string) => {
    resetBuiltinDrug(id);
    refresh();
  }, [refresh]);

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
            Weight-based dosing with ml volume calculation. Tap the pencil icon to edit any drug or add new entries.
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
            Enter weight above to see calculated doses and ml volumes. Formulas are always shown.
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={cn("font-bold text-sm", colors.text)}>{drug.name}</h3>
                  {drug.isCustom && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                      Custom
                    </span>
                  )}
                  {drug.isEdited && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wide">
                      Edited
                    </span>
                  )}
                </div>
                {drug.indication && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{drug.indication}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(drug)}
                  title="Edit drug"
                  className="p-1.5 rounded-lg hover:bg-white/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {drug.isEdited && (
                  <button
                    onClick={() => handleReset(drug.id)}
                    title="Reset to default"
                    className="p-1.5 rounded-lg hover:bg-white/60 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                {drug.isCustom && (
                  confirmDelete === drug.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(drug.id)}
                        className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-[10px] text-muted-foreground hover:text-foreground px-1 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(drug.id)}
                      title="Delete drug"
                      className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )
                )}
              </div>
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
                <DoseRowDisplay
                  key={i}
                  dose={dose}
                  index={i}
                  drug={drug}
                  kg={kg}
                  validWeight={validWeight}
                  colors={colors}
                  concentrationMap={concentrationMap}
                  setConcentrationMap={setConcentrationMap}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Add drug button */}
        <button
          onClick={() => openAdd(activeCategory)}
          className={cn(
            "flex items-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-xl text-sm font-medium transition-colors",
            colors.border,
            `${colors.text} hover:${colors.bg}`,
            "border-opacity-50 hover:border-opacity-100",
          )}
        >
          <Plus className="h-4 w-4" />
          Add drug to {activeCategory}
        </button>
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

      {/* Edit/Add dialog */}
      <DrugEditDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingDrug(undefined); }}
        onSave={refresh}
        drug={editingDrug}
        defaultCategory={dialogCategory}
      />
    </div>
  );
}
