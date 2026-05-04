import { useState, useEffect } from "react";
import { X, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DRUG_CATEGORIES,
  type DrugCategory,
  type DrugEntry,
} from "@/lib/drug-doses";
import {
  saveCustomDrug,
  type StoredDrug,
  type StoredDoseRow,
  type DoseType,
  type OralConcentration,
} from "@/lib/drug-store";

// ── Draft types (all strings for inputs) ─────────────────────────────────────

interface DraftConcentration {
  id: string;
  label: string;
  mgPerMl: string;
}

interface DraftDoseRow {
  id: string;
  route: string;
  type: DoseType;
  dosePerKgMg: string;
  dosePerKgMgMax: string;
  maxDoseMg: string;
  frequency: string;
  oralConcentrations: DraftConcentration[];
  ivConcentrationMgPerMl: string;
  ivAdminRate: string;
  caution: string;
  expanded: boolean;
}

interface DraftDrug {
  name: string;
  category: DrugCategory;
  indication: string;
  warning: string;
  doses: DraftDoseRow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function inferType(route: string): DoseType {
  const r = route.toLowerCase();
  if (r.includes("suspension") || r.includes("syrup") || r.includes("liquid") || r.includes("susp")) return "oral-suspension";
  if (r.includes("tab") || r.includes("capsule") || r.includes("cap ") || r.includes("tablet")) return "oral-tablet";
  if (r.includes("oral") || r.includes(" po")) return "oral";
  if (r.includes("iv") || r.includes("intravenous") || r.includes("infusion")) return "iv";
  if (r.includes("im") || r.includes("intramuscular")) return "im";
  if (r.includes("io") || r.includes("intraosseous")) return "io";
  if (r.includes("neb") || r.includes("inhaled") || r.includes("inhal")) return "inhaled";
  if (r.includes("rectal") || r.includes(" pr ") || r.includes("pr)")) return "rectal";
  return "other";
}

function blankRow(): DraftDoseRow {
  return {
    id: uid(),
    route: "",
    type: "oral",
    dosePerKgMg: "",
    dosePerKgMgMax: "",
    maxDoseMg: "",
    frequency: "",
    oralConcentrations: [],
    ivConcentrationMgPerMl: "",
    ivAdminRate: "",
    caution: "",
    expanded: true,
  };
}

function blankDrug(defaultCategory: DrugCategory = "Antibiotics"): DraftDrug {
  return {
    name: "",
    category: defaultCategory,
    indication: "",
    warning: "",
    doses: [blankRow()],
  };
}

function drugEntryToForm(drug: DrugEntry & { isCustom?: boolean; isEdited?: boolean }): DraftDrug {
  return {
    name: drug.name,
    category: drug.category,
    indication: drug.indication ?? "",
    warning: drug.warning ?? "",
    doses: drug.doses.map((dose) => ({
      id: uid(),
      route: dose.route,
      type: dose.type ?? inferType(dose.route),
      dosePerKgMg: dose.dosePerKgMg !== undefined ? String(dose.dosePerKgMg) : "",
      dosePerKgMgMax: dose.dosePerKgMgMax !== undefined ? String(dose.dosePerKgMgMax) : "",
      maxDoseMg: dose.maxDoseMg !== undefined ? String(dose.maxDoseMg) : "",
      frequency: dose.frequency ?? "",
      oralConcentrations: (dose.oralConcentrations ?? []).map((c) => ({
        id: uid(),
        label: c.label,
        mgPerMl: String(c.mgPerMl),
      })),
      ivConcentrationMgPerMl:
        dose.ivConcentrationMgPerMl !== undefined ? String(dose.ivConcentrationMgPerMl) : "",
      ivAdminRate: dose.ivAdminRate ?? "",
      caution: dose.caution ?? "",
      expanded: true,
    })),
  };
}

function formToStored(draft: DraftDrug, originalId: string, isCustom: boolean): StoredDrug {
  const doses: StoredDoseRow[] = draft.doses.map((d) => {
    const base: StoredDoseRow = {
      id: d.id,
      route: d.route.trim(),
      type: d.type,
      dosePerKgMg: parseFloat(d.dosePerKgMg) || 0,
    };
    if (d.dosePerKgMgMax.trim()) base.dosePerKgMgMax = parseFloat(d.dosePerKgMgMax);
    if (d.maxDoseMg.trim()) base.maxDoseMg = parseFloat(d.maxDoseMg);
    if (d.frequency.trim()) base.frequency = d.frequency.trim();
    if (d.caution.trim()) base.caution = d.caution.trim();
    if (d.ivAdminRate.trim()) base.ivAdminRate = d.ivAdminRate.trim();
    if (d.ivConcentrationMgPerMl.trim())
      base.ivConcentrationMgPerMl = parseFloat(d.ivConcentrationMgPerMl);
    if (d.oralConcentrations.length > 0) {
      const concs: OralConcentration[] = d.oralConcentrations
        .filter((c) => c.label.trim() && c.mgPerMl.trim())
        .map((c) => ({ label: c.label.trim(), mgPerMl: parseFloat(c.mgPerMl) }));
      if (concs.length > 0) base.oralConcentrations = concs;
    }
    return base;
  });

  return {
    id: originalId,
    name: draft.name.trim(),
    category: draft.category,
    indication: draft.indication.trim() || undefined,
    warning: draft.warning.trim() || undefined,
    doses,
    isCustom,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<DoseType, string> = {
  "oral-suspension": "Oral Suspension (liquid/syrup)",
  "oral-tablet": "Oral Tab / Capsule",
  oral: "Oral (generic)",
  iv: "IV",
  im: "IM",
  io: "IO",
  inhaled: "Inhaled",
  rectal: "Rectal",
  other: "Other",
};

const FREQ_PRESETS = ["Once daily (OD)", "Twice daily (BD)", "Three times daily (TID)", "Every 6 hours (QID)", "Every 8 hours", "Every 12 hours", "As needed (PRN)", "Stat dose only"];

function Field({ label, fieldId, children, hint }: { label: string; fieldId?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, className, id, ariaLabel,
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string; id?: string; ariaLabel?: string }) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      className={cn(
        "w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors",
        className,
      )}
    />
  );
}

function NumberInput({
  value, onChange, placeholder, className, id, ariaLabel,
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string; id?: string; ariaLabel?: string }) {
  return (
    <input
      id={id}
      type="number"
      min="0"
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      className={cn(
        "w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors",
        className,
      )}
    />
  );
}

function DoseRowEditor({
  row,
  index,
  total,
  onChange,
  onDelete,
}: {
  row: DraftDoseRow;
  index: number;
  total: number;
  onChange: (updated: DraftDoseRow) => void;
  onDelete: () => void;
}) {
  const set = <K extends keyof DraftDoseRow>(key: K, value: DraftDoseRow[K]) =>
    onChange({ ...row, [key]: value });

  const isOral = row.type === "oral" || row.type === "oral-suspension";
  const isIV = row.type === "iv" || row.type === "im" || row.type === "io";

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-muted/20">
      {/* Row header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border-b border-border">
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs font-bold text-foreground flex-1">
          Dose {index + 1}
          {row.route && <span className="text-muted-foreground font-normal"> — {row.route}</span>}
        </span>
        <button
          type="button"
          onClick={() => set("expanded", !row.expanded)}
          className="p-1 hover:bg-muted rounded text-muted-foreground"
        >
          {row.expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {total > 1 && (
          <button
            type="button"
            onClick={onDelete}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded text-muted-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {row.expanded && (
        <div className="p-3 space-y-3">
          {/* Route + Type */}
          <div className="grid grid-cols-2 gap-2">
            <Field label="Route label" fieldId={`route-${row.id}`}>
              <TextInput
                id={`route-${row.id}`}
                ariaLabel="Route label"
                value={row.route}
                onChange={(v) => {
                  const updated = { ...row, route: v };
                  if (!row.route) updated.type = inferType(v);
                  onChange(updated);
                }}
                placeholder="e.g. Oral, IV slow"
              />
            </Field>
            <Field label="Type" fieldId={`type-${row.id}`}>
              <select
                id={`type-${row.id}`}
                aria-label="Dose type"
                value={row.type}
                onChange={(e) => set("type", e.target.value as DoseType)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              >
                {(Object.keys(TYPE_LABELS) as DoseType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Dose per kg */}
          <div className="grid grid-cols-3 gap-2">
            <Field label="Dose (mg/kg)" fieldId={`dose-per-kg-${row.id}`} hint="required">
              <NumberInput
                id={`dose-per-kg-${row.id}`}
                ariaLabel="Dose in mg per kg"
                value={row.dosePerKgMg}
                onChange={(v) => set("dosePerKgMg", v)}
                placeholder="e.g. 25"
              />
            </Field>
            <Field label="Max dose (mg/kg)" fieldId={`dose-per-kg-max-${row.id}`} hint="for ranges">
              <NumberInput
                id={`dose-per-kg-max-${row.id}`}
                ariaLabel="Maximum dose in mg per kg"
                value={row.dosePerKgMgMax}
                onChange={(v) => set("dosePerKgMgMax", v)}
                placeholder="e.g. 50"
              />
            </Field>
            <Field label="Absolute max (mg)" fieldId={`max-dose-mg-${row.id}`}>
              <NumberInput
                id={`max-dose-mg-${row.id}`}
                ariaLabel="Absolute maximum dose in mg"
                value={row.maxDoseMg}
                onChange={(v) => set("maxDoseMg", v)}
                placeholder="e.g. 1000"
              />
            </Field>
          </div>

          {/* Frequency */}
          <Field label="Frequency" fieldId={`frequency-${row.id}`}>
            <div className="flex gap-2">
              <TextInput
                id={`frequency-${row.id}`}
                ariaLabel="Frequency"
                value={row.frequency}
                onChange={(v) => set("frequency", v)}
                placeholder="e.g. Every 8 hours"
                className="flex-1"
              />
              <select
                value=""
                onChange={(e) => { if (e.target.value) set("frequency", e.target.value); }}
                className="px-2 py-2 text-xs border border-border rounded-lg bg-background text-muted-foreground outline-none"
              >
                <option value="">Presets…</option>
                {FREQ_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </Field>

          {/* Oral concentrations */}
          {isOral && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  Available concentrations (for ml calculation)
                </label>
                <button
                  type="button"
                  aria-label="Add concentration"
                  onClick={() =>
                    set("oralConcentrations", [
                      ...row.oralConcentrations,
                      { id: uid(), label: "", mgPerMl: "" },
                    ])
                  }
                  className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1.5 rounded-lg"
                >
                  <Plus className="h-3 w-3" /> Add concentration
                </button>
              </div>
              {row.oralConcentrations.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">
                  Add concentrations to enable ml volume calculation (e.g. 125 mg / 5 ml).
                </p>
              )}
              {row.oralConcentrations.map((conc, ci) => (
                <div key={conc.id} className="flex items-center gap-2">
                  <TextInput
                    value={conc.label}
                    ariaLabel={`Concentration label ${ci + 1}`}
                    onChange={(v) => {
                      const updated = row.oralConcentrations.map((c) =>
                        c.id === conc.id ? { ...c, label: v } : c,
                      );
                      set("oralConcentrations", updated);
                    }}
                    placeholder="e.g. 250 mg / 5 ml"
                    className="flex-1"
                  />
                  <NumberInput
                    value={conc.mgPerMl}
                    ariaLabel={`Concentration mg per ml ${ci + 1}`}
                    onChange={(v) => {
                      const updated = row.oralConcentrations.map((c) =>
                        c.id === conc.id ? { ...c, mgPerMl: v } : c,
                      );
                      set("oralConcentrations", updated);
                    }}
                    placeholder="mg/ml"
                    className="w-24"
                  />
                  <span className="text-[11px] text-muted-foreground shrink-0">mg/ml</span>
                  <button
                    type="button"
                    aria-label={`Remove concentration ${ci + 1}`}
                    onClick={() =>
                      set(
                        "oralConcentrations",
                        row.oralConcentrations.filter((_, i) => i !== ci),
                      )
                    }
                    className="p-1 hover:bg-red-100 hover:text-red-600 rounded text-muted-foreground shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* IV concentration + admin rate */}
          {isIV && (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Standard concentration (mg/ml)" hint="for volume calculation">
                <NumberInput
                  value={row.ivConcentrationMgPerMl}
                  onChange={(v) => set("ivConcentrationMgPerMl", v)}
                  placeholder="e.g. 100"
                />
              </Field>
              <Field label="Admin rate / method">
                <TextInput
                  value={row.ivAdminRate}
                  onChange={(v) => set("ivAdminRate", v)}
                  placeholder="e.g. over 30 min"
                />
              </Field>
            </div>
          )}

          {/* Caution */}
          <Field label="Caution note (optional)">
            <TextInput
              value={row.caution}
              onChange={(v) => set("caution", v)}
              placeholder="e.g. Monitor renal function"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

// ── Main dialog ───────────────────────────────────────────────────────────────

interface DrugEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  drug?: DrugEntry & { isCustom?: boolean; isEdited?: boolean };
  defaultCategory?: DrugCategory;
}

export default function DrugEditDialog({
  open,
  onClose,
  onSave,
  drug,
  defaultCategory = "Antibiotics",
}: DrugEditDialogProps) {
  const isNew = !drug;
  const isEditable = isNew || drug?.isCustom;

  const [draft, setDraft] = useState<DraftDrug>(() =>
    drug ? drugEntryToForm(drug) : blankDrug(defaultCategory),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(drug ? drugEntryToForm(drug) : blankDrug(defaultCategory));
      setError(null);
    }
  }, [open, drug, defaultCategory]);

  if (!open) return null;

  const setField = <K extends keyof DraftDrug>(key: K, value: DraftDrug[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const updateRow = (index: number, updated: DraftDoseRow) =>
    setDraft((prev) => {
      const doses = [...prev.doses];
      doses[index] = updated;
      return { ...prev, doses };
    });

  const deleteRow = (index: number) =>
    setDraft((prev) => ({
      ...prev,
      doses: prev.doses.filter((_, i) => i !== index),
    }));

  const addRow = () =>
    setDraft((prev) => ({ ...prev, doses: [...prev.doses, blankRow()] }));

  const handleSave = () => {
    if (!draft.name.trim()) { setError("Drug name is required."); return; }
    if (draft.doses.length === 0) { setError("At least one dose row is required."); return; }
    for (const row of draft.doses) {
      if (!row.route.trim()) { setError("All dose rows must have a route label."); return; }
      if (!row.dosePerKgMg.trim() || isNaN(parseFloat(row.dosePerKgMg))) {
        setError(`Dose row "${row.route}" needs a valid mg/kg dose.`);
        return;
      }
    }

    const originalId = drug?.id ?? `custom-${Date.now()}`;
    const isCustom = isNew ? true : (drug?.isCustom ?? false);
    const stored = formToStored(draft, originalId, isCustom);
    saveCustomDrug(stored);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12">
      <div className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isNew ? "Add New Drug" : `Edit — ${drug?.name}`}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isNew
                ? "New drugs are saved locally and appear in the drug list."
                : "Changes are saved locally and override the built-in entry."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Drug info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Drug Information</h3>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Drug name" fieldId="drug-name" hint="required">
                <TextInput
                  id="drug-name"
                  ariaLabel="Drug name"
                  value={draft.name}
                  onChange={(v) => setField("name", v)}
                  placeholder="e.g. Amoxicillin-Clavulanate"
                />
              </Field>
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) => setField("category", e.target.value as DrugCategory)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {DRUG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Indication" fieldId="drug-indication">
              <TextInput
                id="drug-indication"
                ariaLabel="Indication"
                value={draft.indication}
                onChange={(v) => setField("indication", v)}
                placeholder="e.g. Community-acquired pneumonia, otitis media"
              />
            </Field>

            <Field label="Warning / caution (shown prominently)">
              <textarea
                value={draft.warning}
                onChange={(e) => setField("warning", e.target.value)}
                placeholder="e.g. Check for penicillin allergy before administering."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </Field>
          </div>

          {/* Dose rows */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dose Rows</h3>
            {draft.doses.map((row, i) => (
              <DoseRowEditor
                key={row.id}
                row={row}
                index={i}
                total={draft.doses.length}
                onChange={(updated) => updateRow(i, updated)}
                onDelete={() => deleteRow(i)}
              />
            ))}
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" /> Add dose row
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isNew ? "Add Drug" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
