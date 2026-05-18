"use client";

import { useState, useCallback } from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProtocolsContext } from "@/contexts/protocols-context";
import type {
  CustomProtocol,
  CustomQuestion,
  SeverityRule,
  ManagementSection,
  DrugDoseEntry,
  DispositionEntry,
  CustomReference,
  SeverityLevel,
} from "@/lib/custom-protocol-types";
import {
  Save, Plus, Trash2, Pencil, ArrowLeft, Loader2, Check,
  FileText, ListChecks, AlertTriangle, ClipboardList, Pill, Hospital, BookOpen, X, Copy,
} from "lucide-react";

type BuilderState = {
  id: string;
  name: string;
  system: string;
  description: string;
  questions: CustomQuestion[];
  severityRules: SeverityRule[];
  defaultSeverity: SeverityLevel;
  management: ManagementSection[];
  disposition: DispositionEntry[];
  redFlagsText: string;
  drugDoses: DrugDoseEntry[];
  references: CustomReference[];
};

const SEVERITY_LEVELS: SeverityLevel[] = ["mild", "moderate", "severe", "some", "no", "unknown"];
const MAIN_SEVERITIES: SeverityLevel[] = ["mild", "moderate", "severe"];

const SEVERITY_COLORS: Record<string, string> = {
  mild: "bg-green-100 text-green-700 border-green-200",
  moderate: "bg-amber-100 text-amber-700 border-amber-200",
  severe: "bg-red-100 text-red-700 border-red-200",
  some: "bg-orange-100 text-orange-700 border-orange-200",
  no: "bg-gray-100 text-gray-600 border-gray-200",
  unknown: "bg-gray-100 text-gray-600 border-gray-200",
};

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeInitialState(data: Partial<CustomProtocol> | null): BuilderState {
  if (!data) {
    return {
      id: "", name: "", system: "", description: "",
      questions: [], severityRules: [], defaultSeverity: "mild",
      management: [], disposition: [], redFlagsText: "",
      drugDoses: [], references: [],
    };
  }
  return {
    id: data.id ?? "",
    name: data.name ?? "",
    system: data.system ?? "",
    description: data.description ?? "",
    questions: data.questions ?? [],
    severityRules: data.severityRules ?? [],
    defaultSeverity: data.defaultSeverity ?? "mild",
    management: data.management ?? [],
    disposition: data.disposition ?? [],
    redFlagsText: (data.redFlags ?? []).join("\n"),
    drugDoses: data.drugDoses ?? [],
    references: data.references ?? [],
  };
}

function SeverityBadge({ level }: { level: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-semibold capitalize ${SEVERITY_COLORS[level] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {level}
    </span>
  );
}

function SeveritySelector({
  value,
  onChange,
}: {
  value: SeverityLevel[] | null;
  onChange: (v: SeverityLevel[] | null) => void;
}) {
  const isAll = value === null;
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <label className="flex items-center gap-1.5 cursor-pointer text-sm font-medium">
        <Checkbox
          checked={isAll}
          onCheckedChange={(c) => onChange(c ? null : ["mild"])}
        />
        All Severities
      </label>
      {MAIN_SEVERITIES.map((level) => (
        <label
          key={level}
          className={`flex items-center gap-1.5 cursor-pointer text-sm capitalize ${isAll ? "opacity-40" : ""}`}
        >
          <Checkbox
            checked={!isAll && (value?.includes(level) ?? false)}
            disabled={isAll}
            onCheckedChange={(c) => {
              if (isAll) return;
              const curr = value || [];
              onChange(c ? [...curr, level] : curr.filter((l) => l !== level));
            }}
          />
          {level}
        </label>
      ))}
    </div>
  );
}

interface ProtocolBuilderProps {
  initialData: Partial<CustomProtocol> | null;
  onSaved?: () => void;
  /** True when initialData came from cloning a built-in — forces POST (new) even if id is set */
  isClone?: boolean;
}

export function ProtocolBuilder({ initialData, onSaved, isClone = false }: ProtocolBuilderProps) {
  const { toast } = useToast();
  const { saveProtocol } = useProtocolsContext();
  const [form, setForm] = useState<BuilderState>(() => makeInitialState(initialData));
  const [activeTab, setActiveTab] = useState("basics");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [idAutoFilled, setIdAutoFilled] = useState(!initialData?.id || isClone);

  // isEditing = has an existing custom protocol to PUT (not a clone, not empty)
  const isEditing = !!initialData?.id && !isClone;

  const update = useCallback(<K extends keyof BuilderState>(key: K, value: BuilderState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      id: idAutoFilled ? slugify(name) : prev.id,
    }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Protocol name is required.");
    if (!form.id.trim()) errs.push("Protocol ID is required.");
    if (!form.system.trim()) errs.push("Clinical system is required.");
    if (!form.description.trim()) errs.push("Description is required.");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setActiveTab("basics");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      redFlags: form.redFlagsText.split("\n").map((s) => s.trim()).filter(Boolean),
      severityRules: form.severityRules.map((r, i) => ({ ...r, priority: i + 1 })),
    };
    delete (payload as any).redFlagsText;

    try {
      saveProtocol(payload as any);
      toast({ title: isEditing ? "Protocol updated!" : "Protocol saved!", description: `"${form.name}" is now live.` });
      onSaved?.();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to save protocol." });
    } finally {
      setSaving(false);
    }
  };

  /* ---- PER-SECTION INLINE EDIT STATE ---- */
  type QuestionForm = { id: string; questionText: string; type: CustomQuestion["type"]; unit: string; optionsText: string };
  const [qEdit, setQEdit] = useState<{ idx: number | null; data: QuestionForm } | null>(null);

  type RuleForm = { condition: string; level: SeverityLevel; detail: string };
  const [ruleEdit, setRuleEdit] = useState<{ idx: number | null; data: RuleForm } | null>(null);

  type MgmtForm = { title: string; recsText: string; severities: SeverityLevel[] | null };
  const [mgmtEdit, setMgmtEdit] = useState<{ idx: number | null; data: MgmtForm } | null>(null);

  type DoseForm = { drugName: string; dose: string; maxDose: string; notes: string; severities: SeverityLevel[] | null };
  const [doseEdit, setDoseEdit] = useState<{ idx: number | null; data: DoseForm } | null>(null);

  type DispForm = { text: string; type: DispositionEntry["type"]; severities: SeverityLevel[] | null };
  const [dispEdit, setDispEdit] = useState<{ idx: number | null; data: DispForm } | null>(null);

  type RefForm = { title: string; url: string };
  const [refEdit, setRefEdit] = useState<{ idx: number | null; data: RefForm } | null>(null);

  /* ---- HELPERS ---- */
  const saveQuestion = () => {
    if (!qEdit) return;
    const { idx, data } = qEdit;
    const options = (data.type === "select" || data.type === "radio")
      ? data.optionsText.split("\n").filter(Boolean).map((line) => {
          const [val, ...rest] = line.split("|");
          return { value: val.trim(), label: rest.join("|").trim() || val.trim() };
        })
      : undefined;
    const q: CustomQuestion = { id: data.id, questionText: data.questionText, type: data.type, unit: data.unit || undefined, options };
    if (idx === null) update("questions", [...form.questions, q]);
    else { const u = [...form.questions]; u[idx] = q; update("questions", u); }
    setQEdit(null);
  };

  const saveRule = () => {
    if (!ruleEdit) return;
    const { idx, data } = ruleEdit;
    const rule: SeverityRule = { id: uid(), priority: idx === null ? form.severityRules.length + 1 : (form.severityRules[idx]?.priority ?? idx + 1), ...data };
    if (idx === null) update("severityRules", [...form.severityRules, rule]);
    else { const u = [...form.severityRules]; u[idx] = rule; update("severityRules", u); }
    setRuleEdit(null);
  };

  const saveMgmt = () => {
    if (!mgmtEdit) return;
    const { idx, data } = mgmtEdit;
    const section: ManagementSection = {
      id: idx !== null ? form.management[idx]?.id || uid() : uid(),
      title: data.title,
      recommendations: data.recsText.split("\n").map((s) => s.trim()).filter(Boolean),
      severities: data.severities,
    };
    if (idx === null) update("management", [...form.management, section]);
    else { const u = [...form.management]; u[idx] = section; update("management", u); }
    setMgmtEdit(null);
  };

  const saveDose = () => {
    if (!doseEdit) return;
    const { idx, data } = doseEdit;
    const dose: DrugDoseEntry = {
      id: idx !== null ? form.drugDoses[idx]?.id || uid() : uid(),
      drugName: data.drugName, dose: data.dose,
      maxDose: data.maxDose || undefined, notes: data.notes || undefined,
      severities: data.severities,
    };
    if (idx === null) update("drugDoses", [...form.drugDoses, dose]);
    else { const u = [...form.drugDoses]; u[idx] = dose; update("drugDoses", u); }
    setDoseEdit(null);
  };

  const saveDisp = () => {
    if (!dispEdit) return;
    const { idx, data } = dispEdit;
    const entry: DispositionEntry = { id: idx !== null ? form.disposition[idx]?.id || uid() : uid(), ...data };
    if (idx === null) update("disposition", [...form.disposition, entry]);
    else { const u = [...form.disposition]; u[idx] = entry; update("disposition", u); }
    setDispEdit(null);
  };

  const saveRef = () => {
    if (!refEdit) return;
    const { idx, data } = refEdit;
    const ref: CustomReference = { id: idx !== null ? form.references[idx]?.id || uid() : uid(), ...data };
    if (idx === null) update("references", [...form.references, ref]);
    else { const u = [...form.references]; u[idx] = ref; update("references", u); }
    setRefEdit(null);
  };

  const qIds = form.questions.map((q) => q.id).filter(Boolean);

  const TABS = [
    { key: "basics", label: "Basics", icon: FileText },
    { key: "questions", label: "Questions", icon: ListChecks, count: form.questions.length },
    { key: "severity", label: "Severity", icon: AlertTriangle, count: form.severityRules.length },
    { key: "management", label: "Management", icon: ClipboardList, count: form.management.length },
    { key: "drugs", label: "Drug Doses", icon: Pill, count: form.drugDoses.length },
    { key: "outcomes", label: "Outcomes", icon: Hospital },
    { key: "references", label: "References", icon: BookOpen, count: form.references.length },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/protocols">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold font-headline truncate">
              {isEditing ? `Edit: ${form.name || "Protocol"}` : isClone ? `Clone: ${form.name || "Protocol"}` : "Protocol Builder"}
            </h1>
            {form.id && <p className="text-xs text-muted-foreground font-mono">ID: {form.id}</p>}
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="shrink-0">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Protocol"}
        </Button>
      </div>

      {/* Clone notice */}
      {isClone && (
        <Alert className="border-blue-200 bg-blue-50">
          <Copy className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Cloned from a built-in protocol.</strong> Questions are pre-filled. Add severity rules, management sections, and drug doses to complete the protocol.
            If you keep the same ID, this custom version will automatically replace the built-in one.
            You can also hide the original from the Protocol Management page.
          </AlertDescription>
        </Alert>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-1.5 text-xs">
              <Icon className="h-3.5 w-3.5" />
              {label}
              {count !== undefined && count > 0 && (
                <span className="ml-0.5 bg-primary/15 text-primary text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ BASICS TAB ═══ */}
        <TabsContent value="basics" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="name">Protocol Name <span className="text-destructive">*</span></Label>
              <Input id="name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Pediatric Asthma Management" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="id">Protocol ID <span className="text-destructive">*</span></Label>
              <Input
                id="id"
                value={form.id}
                disabled={isEditing}
                onChange={(e) => { setIdAutoFilled(false); update("id", slugify(e.target.value)); }}
                placeholder="e.g. pediatric-asthma"
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                {isEditing ? "ID cannot be changed after saving." : "Auto-filled from name. Using the same ID as a built-in will override it."}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="system">Clinical System <span className="text-destructive">*</span></Label>
              <Input id="system" value={form.system} onChange={(e) => update("system", e.target.value)} placeholder="e.g. Respiratory, Neurology" list="system-list" />
              <datalist id="system-list">
                {["Respiratory", "Neurology", "Infectious Disease", "Cardiology", "Endocrinology", "Nephrology", "Gastroenterology", "Toxicology & Envenomation", "Emergency Management"].map(s => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="One or two sentences describing this protocol." rows={3} />
            </div>
          </div>
        </TabsContent>

        {/* ═══ QUESTIONS TAB ═══ */}
        <TabsContent value="questions" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">Define assessment questions. Use camelCase IDs (e.g. <code className="bg-muted px-1 rounded text-xs">weight</code>, <code className="bg-muted px-1 rounded text-xs">oxygenSat</code>). These IDs are used in severity rule conditions.</p>
          {form.questions.length === 0 && <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No questions yet. Add your first question below.</div>}
          {form.questions.map((q, i) => (
            <div key={q.id || i} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-primary/10 text-primary px-1.5 rounded font-mono">{q.id}</code>
                  <Badge variant="outline" className="text-[10px] capitalize">{q.type}</Badge>
                  {q.unit && <span className="text-xs text-muted-foreground">({q.unit})</span>}
                </div>
                <p className="text-sm mt-0.5 truncate">{q.questionText}</p>
                {q.options && q.options.length > 0 && <p className="text-xs text-muted-foreground">{q.options.map(o => o.label).join(" · ")}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setQEdit({ idx: i, data: { id: q.id, questionText: q.questionText, type: q.type, unit: q.unit || "", optionsText: q.options?.map(o => `${o.value} | ${o.label}`).join("\n") || "" } })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => update("questions", form.questions.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {qEdit ? (
            <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/[0.02]">
              <h3 className="font-semibold text-sm">{qEdit.idx === null ? "Add Question" : "Edit Question"}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Question ID (camelCase)</Label>
                  <Input value={qEdit.data.id} onChange={(e) => setQEdit(p => p && ({ ...p, data: { ...p.data, id: e.target.value } }))} placeholder="e.g. weight, oxygenSat" className="font-mono text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select value={qEdit.data.type} onValueChange={(v) => setQEdit(p => p && ({ ...p, data: { ...p.data, type: v as CustomQuestion["type"] } }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Yes / No</SelectItem>
                      <SelectItem value="select">Select (Dropdown)</SelectItem>
                      <SelectItem value="radio">Radio Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Question Text</Label>
                <Input value={qEdit.data.questionText} onChange={(e) => setQEdit(p => p && ({ ...p, data: { ...p.data, questionText: e.target.value } }))} placeholder="e.g. What is the patient's weight?" />
              </div>
              {qEdit.data.type === "number" && (
                <div className="space-y-1">
                  <Label className="text-xs">Unit (optional)</Label>
                  <Input value={qEdit.data.unit} onChange={(e) => setQEdit(p => p && ({ ...p, data: { ...p.data, unit: e.target.value } }))} placeholder="e.g. kg, %, mmHg" className="max-w-xs" />
                </div>
              )}
              {(qEdit.data.type === "select" || qEdit.data.type === "radio") && (
                <div className="space-y-1">
                  <Label className="text-xs">Options (one per line: <code>value | Label</code>)</Label>
                  <Textarea value={qEdit.data.optionsText} onChange={(e) => setQEdit(p => p && ({ ...p, data: { ...p.data, optionsText: e.target.value } }))} placeholder={"mild | Mild\nmoderate | Moderate\nsevere | Severe"} rows={4} className="font-mono text-xs" />
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={saveQuestion}><Check className="mr-1.5 h-3.5 w-3.5" />Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setQEdit(null)}><X className="mr-1.5 h-3.5 w-3.5" />Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setQEdit({ idx: null, data: { id: "", questionText: "", type: "number", unit: "", optionsText: "" } })}>
              <Plus className="mr-2 h-4 w-4" />Add Question
            </Button>
          )}
        </TabsContent>

        {/* ═══ SEVERITY TAB ═══ */}
        <TabsContent value="severity" className="mt-4 space-y-4">
          <div className="space-y-1.5 max-w-xs">
            <Label>Default Severity (if no rule matches)</Label>
            <Select value={form.defaultSeverity} onValueChange={(v) => update("defaultSeverity", v as SeverityLevel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SEVERITY_LEVELS.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Rules are evaluated top-to-bottom. First matching rule wins.</p>
            {qIds.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center text-xs text-muted-foreground">
                <span>Available variables:</span>
                {qIds.map(id => <code key={id} className="bg-muted px-1.5 py-0.5 rounded font-mono">{id}</code>)}
              </div>
            )}
            {form.severityRules.length === 0 && <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No severity rules yet. All assessments will use the default severity.</div>}
            {form.severityRules.map((r, i) => (
              <div key={r.id || i} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                <span className="text-xs text-muted-foreground font-mono w-4 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <code className="text-xs bg-muted px-2 py-0.5 rounded block truncate">{r.condition || "(no condition)"}</code>
                  {r.detail && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.detail}</p>}
                </div>
                <span className="text-xs text-muted-foreground">→</span>
                <SeverityBadge level={r.level} />
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setRuleEdit({ idx: i, data: { condition: r.condition, level: r.level, detail: r.detail } })}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => update("severityRules", form.severityRules.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {ruleEdit ? (
            <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/[0.02]">
              <h3 className="font-semibold text-sm">{ruleEdit.idx === null ? "Add Severity Rule" : "Edit Severity Rule"}</h3>
              <div className="space-y-1">
                <Label className="text-xs">Condition (JavaScript expression)</Label>
                <Input value={ruleEdit.data.condition} onChange={(e) => setRuleEdit(p => p && ({ ...p, data: { ...p.data, condition: e.target.value } }))} placeholder="e.g. oxygenSat < 92 || hasStridor === true" className="font-mono text-sm" />
                <p className="text-[11px] text-muted-foreground">Use question IDs as variables. Example: <code>weight &lt; 10 &amp;&amp; hasFever === true</code></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Triggered Severity Level</Label>
                  <Select value={ruleEdit.data.level} onValueChange={(v) => setRuleEdit(p => p && ({ ...p, data: { ...p.data, level: v as SeverityLevel } }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEVERITY_LEVELS.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Detail (shown to clinician)</Label>
                  <Input value={ruleEdit.data.detail} onChange={(e) => setRuleEdit(p => p && ({ ...p, data: { ...p.data, detail: e.target.value } }))} placeholder="e.g. O2 sat < 92%" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveRule}><Check className="mr-1.5 h-3.5 w-3.5" />Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setRuleEdit(null)}><X className="mr-1.5 h-3.5 w-3.5" />Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setRuleEdit({ idx: null, data: { condition: "", level: "mild", detail: "" } })}>
              <Plus className="mr-2 h-4 w-4" />Add Severity Rule
            </Button>
          )}
        </TabsContent>

        {/* ═══ MANAGEMENT TAB ═══ */}
        <TabsContent value="management" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">Define management sections. Use <code className="bg-muted px-1 rounded text-xs">{"{{weight * 0.1}}"}</code> for weight-based calculations.</p>
          {form.management.length === 0 && <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No management sections yet.</div>}
          {form.management.map((m, i) => (
            <div key={m.id || i} className="p-3 bg-card border border-border rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{m.title}</p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {m.severities === null ? <Badge variant="secondary" className="text-[10px]">All Severities</Badge> : m.severities.map(s => <SeverityBadge key={s} level={s} />)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{m.recommendations.length} recommendation{m.recommendations.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setMgmtEdit({ idx: i, data: { title: m.title, recsText: m.recommendations.join("\n"), severities: m.severities } })}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => update("management", form.management.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {mgmtEdit ? (
            <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/[0.02]">
              <h3 className="font-semibold text-sm">{mgmtEdit.idx === null ? "Add Section" : "Edit Section"}</h3>
              <div className="space-y-1">
                <Label className="text-xs">Section Title</Label>
                <Input value={mgmtEdit.data.title} onChange={(e) => setMgmtEdit(p => p && ({ ...p, data: { ...p.data, title: e.target.value } }))} placeholder="e.g. IV Access & Fluid Management" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Recommendations (one per line)</Label>
                <Textarea value={mgmtEdit.data.recsText} onChange={(e) => setMgmtEdit(p => p && ({ ...p, data: { ...p.data, recsText: e.target.value } }))} placeholder={"Establish IV access\nNormal saline {{weight * 10}} mL over 20 min"} rows={5} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Applies to Severities</Label>
                <SeveritySelector value={mgmtEdit.data.severities} onChange={(v) => setMgmtEdit(p => p && ({ ...p, data: { ...p.data, severities: v } }))} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveMgmt}><Check className="mr-1.5 h-3.5 w-3.5" />Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setMgmtEdit(null)}><X className="mr-1.5 h-3.5 w-3.5" />Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setMgmtEdit({ idx: null, data: { title: "", recsText: "", severities: null } })}>
              <Plus className="mr-2 h-4 w-4" />Add Management Section
            </Button>
          )}
        </TabsContent>

        {/* ═══ DRUG DOSES TAB ═══ */}
        <TabsContent value="drugs" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Drug doses support weight-based expressions. Example: <code className="bg-muted px-1 rounded text-xs">{"{{weight * 0.01}} mg/kg IM"}</code>
          </p>
          {form.drugDoses.length === 0 && <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No drug doses yet.</div>}
          {form.drugDoses.map((d, i) => (
            <div key={d.id || i} className="flex items-start justify-between p-3 bg-card border border-border rounded-lg gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{d.drugName}</p>
                <code className="text-xs text-primary">{d.dose}</code>
                {d.maxDose && <span className="text-xs text-muted-foreground"> (max {d.maxDose})</span>}
                <div className="flex gap-1 flex-wrap mt-1">
                  {d.severities === null ? <Badge variant="secondary" className="text-[10px]">All</Badge> : d.severities.map(s => <SeverityBadge key={s} level={s} />)}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setDoseEdit({ idx: i, data: { drugName: d.drugName, dose: d.dose, maxDose: d.maxDose || "", notes: d.notes || "", severities: d.severities } })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => update("drugDoses", form.drugDoses.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {doseEdit ? (
            <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/[0.02]">
              <h3 className="font-semibold text-sm">{doseEdit.idx === null ? "Add Drug Dose" : "Edit Drug Dose"}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Drug Name</Label>
                  <Input value={doseEdit.data.drugName} onChange={(e) => setDoseEdit(p => p && ({ ...p, data: { ...p.data, drugName: e.target.value } }))} placeholder="e.g. Epinephrine" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Dose (optional)</Label>
                  <Input value={doseEdit.data.maxDose} onChange={(e) => setDoseEdit(p => p && ({ ...p, data: { ...p.data, maxDose: e.target.value } }))} placeholder="e.g. 0.5 mg" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Dose Formula</Label>
                <Input value={doseEdit.data.dose} onChange={(e) => setDoseEdit(p => p && ({ ...p, data: { ...p.data, dose: e.target.value } }))} placeholder="e.g. {{weight * 0.01}} mg/kg IM" className="font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Notes (optional)</Label>
                <Input value={doseEdit.data.notes} onChange={(e) => setDoseEdit(p => p && ({ ...p, data: { ...p.data, notes: e.target.value } }))} placeholder="e.g. Dilute before administration" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Applies to Severities</Label>
                <SeveritySelector value={doseEdit.data.severities} onChange={(v) => setDoseEdit(p => p && ({ ...p, data: { ...p.data, severities: v } }))} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveDose}><Check className="mr-1.5 h-3.5 w-3.5" />Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setDoseEdit(null)}><X className="mr-1.5 h-3.5 w-3.5" />Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setDoseEdit({ idx: null, data: { drugName: "", dose: "", maxDose: "", notes: "", severities: null } })}>
              <Plus className="mr-2 h-4 w-4" />Add Drug Dose
            </Button>
          )}
        </TabsContent>

        {/* ═══ OUTCOMES TAB ═══ */}
        <TabsContent value="outcomes" className="mt-4 space-y-6">
          <div className="space-y-2">
            <Label>Red Flags <span className="text-xs text-muted-foreground">(one per line)</span></Label>
            <Textarea
              value={form.redFlagsText}
              onChange={(e) => update("redFlagsText", e.target.value)}
              placeholder={"Deteriorating consciousness\nWorsening respiratory distress\nHypotension not responding to fluids"}
              rows={5}
              className="text-sm"
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Final Decision Statements</h3>
            {form.disposition.length === 0 && <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No final decision statements yet.</div>}
            {form.disposition.map((d, i) => (
              <div key={d.id || i} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg gap-3">
                <div className="min-w-0">
                  <p className="text-sm truncate">{d.text}</p>
                  <div className="flex gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-[10px] capitalize">{d.type}</Badge>
                    {d.severities === null ? <Badge variant="secondary" className="text-[10px]">All</Badge> : d.severities.map(s => <SeverityBadge key={s} level={s} />)}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setDispEdit({ idx: i, data: { text: d.text, type: d.type, severities: d.severities } })}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => update("disposition", form.disposition.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {dispEdit ? (
              <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/[0.02]">
                <h4 className="font-semibold text-sm">{dispEdit.idx === null ? "Add Final Decision" : "Edit Final Decision"}</h4>
                <div className="space-y-1">
                  <Label className="text-xs">Final Decision Text</Label>
                  <Input value={dispEdit.data.text} onChange={(e) => setDispEdit(p => p && ({ ...p, data: { ...p.data, text: e.target.value } }))} placeholder="e.g. Admit to PICU for monitoring" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select value={dispEdit.data.type} onValueChange={(v) => setDispEdit(p => p && ({ ...p, data: { ...p.data, type: v as DispositionEntry["type"] } }))}>
                    <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admission">Admission</SelectItem>
                      <SelectItem value="discharge">Discharge</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Applies to Severities</Label>
                  <SeveritySelector value={dispEdit.data.severities} onChange={(v) => setDispEdit(p => p && ({ ...p, data: { ...p.data, severities: v } }))} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveDisp}><Check className="mr-1.5 h-3.5 w-3.5" />Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setDispEdit(null)}><X className="mr-1.5 h-3.5 w-3.5" />Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setDispEdit({ idx: null, data: { text: "", type: "general", severities: null } })}>
                <Plus className="mr-2 h-4 w-4" />Add Final Decision Statement
              </Button>
            )}
          </div>
        </TabsContent>

        {/* ═══ REFERENCES TAB ═══ */}
        <TabsContent value="references" className="mt-4 space-y-3">
          {form.references.length === 0 && <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No references yet.</div>}
          {form.references.map((r, i) => (
            <div key={r.id || i} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.title}</p>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">{r.url}</a>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setRefEdit({ idx: i, data: { title: r.title, url: r.url || "" } })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => update("references", form.references.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {refEdit ? (
            <div className="border-2 border-primary/20 rounded-lg p-4 space-y-3 bg-primary/[0.02]">
              <h3 className="font-semibold text-sm">{refEdit.idx === null ? "Add Reference" : "Edit Reference"}</h3>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input value={refEdit.data.title} onChange={(e) => setRefEdit(p => p && ({ ...p, data: { ...p.data, title: e.target.value } }))} placeholder="e.g. WHO Pediatric Emergency Guidelines 2023" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL (optional)</Label>
                <Input value={refEdit.data.url} onChange={(e) => setRefEdit(p => p && ({ ...p, data: { ...p.data, url: e.target.value } }))} placeholder="https://..." type="url" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveRef}><Check className="mr-1.5 h-3.5 w-3.5" />Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setRefEdit(null)}><X className="mr-1.5 h-3.5 w-3.5" />Cancel</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setRefEdit({ idx: null, data: { title: "", url: "" } })}>
              <Plus className="mr-2 h-4 w-4" />Add Reference
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Protocol"}
        </Button>
      </div>
    </div>
  );
}
