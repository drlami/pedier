import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Info,
  ChevronLeft,
  FlaskConical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  labTests,
  LAB_CATEGORIES,
  ageDaysFrom,
  isRangeActive,
  arterialBloodGasPanel,
  bloodGasNote,
  lipidPanel,
  lipidPanelNote,
  bodyFluidPanels,
  nelsonPanels,
  type LabCategory,
  type LabTest,
  type FluidPanel,
} from "@/lib/pedialab-database";

// ─── category colours ────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<LabCategory, { bg: string; text: string; badge: string }> = {
  "Electrolytes & Renal":          { bg: "bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-800" },
  "Liver & Pancreas":              { bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-800" },
  "Calcium, Phosphate & Bone":     { bg: "bg-teal-50",   text: "text-teal-700",   badge: "bg-teal-100 text-teal-800" },
  "Inflammation & Blood Gas":      { bg: "bg-rose-50",   text: "text-rose-700",   badge: "bg-rose-100 text-rose-800" },
  Metabolic:                       { bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-100 text-violet-800" },
  "Iron Studies & Haematology":    { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100 text-orange-800" },
  "Vitamins & Trace Elements":     { bg: "bg-lime-50",   text: "text-lime-700",   badge: "bg-lime-100 text-lime-800" },
  "Haematology (CBC)":             { bg: "bg-red-50",    text: "text-red-700",    badge: "bg-red-100 text-red-800" },
  Endocrine:                       { bg: "bg-fuchsia-50",text: "text-fuchsia-700",badge: "bg-fuchsia-100 text-fuchsia-800" },
  Immunology:                      { bg: "bg-indigo-50", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-800" },
  "Screening & Specialized Tests": { bg: "bg-slate-50",  text: "text-slate-700",  badge: "bg-slate-100 text-slate-800" },
};

type SexFilter = "any" | "male" | "female";
type AgeUnit = "days" | "months" | "years";
type UnitMode = "conventional" | "si";

// ─── sub-components ──────────────────────────────────────────────────────────

function PatientBar({
  ageValue, setAgeValue,
  ageUnit, setAgeUnit,
  sex, setSex,
  unitMode, setUnitMode,
}: {
  ageValue: string; setAgeValue: (v: string) => void;
  ageUnit: AgeUnit; setAgeUnit: (v: AgeUnit) => void;
  sex: SexFilter; setSex: (v: SexFilter) => void;
  unitMode: UnitMode; setUnitMode: (v: UnitMode) => void;
}) {
  const isComplete = parseFloat(ageValue) >= 0 && ageValue.trim() !== "";
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b py-3 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[90px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Age</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 4"
              value={ageValue}
              onChange={(e) => setAgeValue(e.target.value)}
              className="h-10 text-base font-bold rounded-xl border-2 focus:border-teal-500"
            />
          </div>
          <div className="min-w-[110px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Unit</label>
            <Select value={ageUnit} onValueChange={(v) => setAgeUnit(v as AgeUnit)}>
              <SelectTrigger className="h-10 rounded-xl border-2 text-sm font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[110px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Sex</label>
            <Select value={sex} onValueChange={(v) => setSex(v as SexFilter)}>
              <SelectTrigger className="h-10 rounded-xl border-2 text-sm font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pb-0.5">
            {isComplete ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-black border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Highlighting matches
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-black">
                Enter age to highlight
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Units:</span>
          {(["conventional", "si"] as UnitMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setUnitMode(m)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-black transition-colors",
                unitMode === m ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {m === "conventional" ? "Conventional" : "SI"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabCard({ test, ageDays, hasAge, sex, unitMode }: {
  test: LabTest;
  ageDays: number;
  hasAge: boolean;
  sex: SexFilter;
  unitMode: UnitMode;
}) {
  const [expanded, setExpanded] = useState(false);
  const style = CATEGORY_STYLE[test.category];

  const activeRange = useMemo(() => {
    if (!hasAge) return null;
    return test.ranges.find((r) => isRangeActive(r, ageDays, sex)) ?? null;
  }, [hasAge, test.ranges, ageDays, sex]);

  const rangesToShow = expanded ? test.ranges : activeRange ? [activeRange] : [];

  return (
    <div className={cn(
      "rounded-2xl border bg-card overflow-hidden transition-all duration-200",
      expanded && "shadow-md",
    )}>
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className={cn("p-2 rounded-xl shrink-0 mt-0.5", style.bg)}>
          <FlaskConical className={cn("h-4 w-4", style.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-black text-base leading-tight">{test.name}</span>
            <span className={cn("text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg", style.badge)}>
              {test.category}
            </span>
          </div>
          {!hasAge && (
            <p className="text-xs text-muted-foreground font-medium">Enter patient age above to highlight the applicable range</p>
          )}
          {hasAge && !activeRange && !expanded && (
            <p className="text-xs text-amber-700 font-medium">No band in this table covers that age — tap to see all bands</p>
          )}
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground/40">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {rangesToShow.length > 0 && (
        <div className="px-4 pb-4 space-y-1.5">
          {rangesToShow.map((r, i) => {
            const isActive = hasAge && activeRange === r;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
                  isActive ? "bg-teal-50 border border-teal-200" : "bg-muted/40",
                )}
              >
                <span className={cn("text-xs font-bold", isActive ? "text-teal-800" : "text-foreground")}>{r.label}</span>
                <span className={cn("text-sm font-black text-right", isActive ? "text-teal-800" : "text-foreground")}>
                  {unitMode === "conventional"
                    ? (r.low === r.high ? `${r.low} ${r.unit}` : `${r.low}–${r.high} ${r.unit}`)
                    : (r.lowSI === r.highSI ? `${r.lowSI} ${r.unitSI}` : `${r.lowSI}–${r.highSI} ${r.unitSI}`)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          {test.crossReference && (
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <Info className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[11px] font-bold text-blue-800 leading-snug">{test.crossReference}</span>
            </div>
          )}
          {test.notes?.map((n, i) => (
            <p key={i} className="text-xs text-muted-foreground font-medium leading-relaxed">{n}</p>
          ))}
          <p className="text-[10px] text-muted-foreground font-medium">{test.references.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

function BloodGasCard({ ageDays, hasAge }: { ageDays: number; hasAge: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const activeIndex = useMemo(() => {
    if (!hasAge) return -1;
    // Rows are ordered by increasing postnatal age up to "Child/adult"; pick the last row whose
    // implied age this patient has reached, defaulting to the final (child/adult) row.
    if (ageDays >= 1) return arterialBloodGasPanel.length - 1;
    return -1; // cord blood / minutes-old bands aren't addressable via a days/months/years age input
  }, [hasAge, ageDays]);

  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden transition-all duration-200", expanded && "shadow-md")}>
      <button className="w-full text-left p-4 flex items-start gap-3" onClick={() => setExpanded((v) => !v)}>
        <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-rose-50">
          <FlaskConical className="h-4 w-4 text-rose-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-black text-base leading-tight">Arterial Blood Gas (Room Air)</span>
            <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800">
              Inflammation & Blood Gas
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">By postnatal age — pH, PaO₂, PaCO₂</p>
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground/40">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2 pr-2">Age</th>
                  <th className="pb-2 pr-2">pH</th>
                  <th className="pb-2 pr-2">PaO₂ (mmHg)</th>
                  <th className="pb-2">PaCO₂ (mmHg)</th>
                </tr>
              </thead>
              <tbody>
                {arterialBloodGasPanel.map((row, i) => (
                  <tr key={i} className={cn("border-t", i === activeIndex && "bg-rose-50")}>
                    <td className="py-1.5 pr-2 font-bold">{row.label}</td>
                    <td className="py-1.5 pr-2 font-black">{row.phLow}–{row.phHigh}</td>
                    <td className="py-1.5 pr-2 font-black">{row.pao2Low}–{row.pao2High}</td>
                    <td className="py-1.5 font-black">{row.paco2Low}–{row.paco2High}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{bloodGasNote}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Harriet Lane Handbook, Table 28.1 — Reference Values</p>
        </div>
      )}
    </div>
  );
}

function LipidCard() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden transition-all duration-200", expanded && "shadow-md")}>
      <button className="w-full text-left p-4 flex items-start gap-3" onClick={() => setExpanded((v) => !v)}>
        <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-violet-50">
          <FlaskConical className="h-4 w-4 text-violet-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-black text-base leading-tight">Lipid Panel</span>
            <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg bg-violet-100 text-violet-800">
              Metabolic
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Desirable / Borderline / High — cholesterol, LDL, HDL, triglycerides</p>
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground/40">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2 pr-2">Measure</th>
                  <th className="pb-2 pr-2">Desirable</th>
                  <th className="pb-2 pr-2">Borderline</th>
                  <th className="pb-2">High</th>
                </tr>
              </thead>
              <tbody>
                {lipidPanel.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1.5 pr-2 font-bold">{row.label}</td>
                    <td className="py-1.5 pr-2 font-black">{row.desirable}</td>
                    <td className="py-1.5 pr-2 font-black">{row.borderline}</td>
                    <td className="py-1.5 font-black">{row.high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{lipidPanelNote}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Harriet Lane Handbook, Table 28.1 — Reference Values</p>
        </div>
      )}
    </div>
  );
}

function FluidPanelCard({ panel }: { panel: FluidPanel }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden transition-all duration-200", expanded && "shadow-md")}>
      <button className="w-full text-left p-4 flex items-start gap-3" onClick={() => setExpanded((v) => !v)}>
        <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-cyan-50">
          <FlaskConical className="h-4 w-4 text-cyan-700" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-black text-base leading-tight">{panel.name}</span>
          <p className="text-xs text-muted-foreground font-medium">{panel.tables.length} table{panel.tables.length > 1 ? "s" : ""}</p>
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground/40">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-5 border-t pt-3">
          {panel.tables.map((table) => (
            <div key={table.id} className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{table.title}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {table.columns.map((col, i) => (
                        <th key={i} className={cn("pb-2", i < table.columns.length - 1 && "pr-3")}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className="border-t">
                        {row.map((cell, j) => (
                          <td key={j} className={cn("py-1.5", j === 0 ? "font-bold" : "font-black", j < row.length - 1 && "pr-3")}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {panel.notes?.map((n, i) => (
            <p key={i} className="text-xs text-muted-foreground font-medium leading-relaxed">{n}</p>
          ))}
          <p className="text-[10px] text-muted-foreground font-medium">{panel.references.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

type MainTab = "chemistry" | "fluids";

export default function PediaLabPage() {
  const [mainTab, setMainTab] = useState<MainTab>("chemistry");
  const [ageValue, setAgeValue] = useState("");
  const [ageUnit, setAgeUnit] = useState<AgeUnit>("years");
  const [sex, setSex] = useState<SexFilter>("any");
  const [unitMode, setUnitMode] = useState<UnitMode>("conventional");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<LabCategory | "All">("All");

  const hasAge = ageValue.trim() !== "" && !isNaN(parseFloat(ageValue));
  const ageDays = hasAge ? ageDaysFrom(parseFloat(ageValue), ageUnit) : 0;

  const filteredTests = useMemo(() => {
    let tests = labTests;
    if (activeCategory !== "All") {
      tests = tests.filter((t) => t.category === activeCategory);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      tests = tests.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return [...tests].sort((a, b) => a.name.localeCompare(b.name));
  }, [activeCategory, search]);

  const countByCategory = useMemo(() => {
    const m: Record<string, number> = { All: labTests.length };
    for (const t of labTests) {
      m[t.category] = (m[t.category] ?? 0) + 1;
    }
    return m;
  }, []);

  const showBloodGasLipid = !search.trim() && (activeCategory === "All" || activeCategory === "Inflammation & Blood Gas" || activeCategory === "Metabolic");
  const showDifferential = !search.trim() && (activeCategory === "All" || activeCategory === "Haematology (CBC)");
  const showLdhIsoenzymes = !search.trim() && (activeCategory === "All" || activeCategory === "Inflammation & Blood Gas");
  const showOgtt = !search.trim() && (activeCategory === "All" || activeCategory === "Metabolic");
  const leukocyteDifferential = nelsonPanels.find((p) => p.id === "leukocyte-differential")!;
  const ldhIsoenzymes = nelsonPanels.find((p) => p.id === "ldh-isoenzymes")!;
  const ogtt = nelsonPanels.find((p) => p.id === "ogtt")!;

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Back link */}
      <div className="px-2 sm:px-4 pt-4 pb-2">
        <Link href="/calculators" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
          Calculators
        </Link>
      </div>

      {/* Hero */}
      <div className="px-2 sm:px-4 pb-4">
        <div className="rounded-[28px] bg-teal-700 p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="h-6 w-6" />
              <span className="font-black text-2xl tracking-tight">PediaLab</span>
              <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-widest">LAB REFERENCE RANGES</Badge>
            </div>
            <p className="text-teal-100 text-sm font-medium max-w-lg">
              Paediatric (0–18y) blood chemistry reference ranges. Enter patient age (and sex, where the range differs) to highlight the applicable band.
            </p>
            <p className="text-teal-200/70 text-[11px] font-medium mt-2">
              ⚠ Reference ranges vary by lab and assay method — always confirm against your local laboratory's reported range before acting on a result.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Chemistry / Body Fluids tab */}
      <div className="px-2 sm:px-4 pb-2">
        <div className="flex gap-1.5">
          {(["chemistry", "fluids"] as MainTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={cn(
                "flex-1 px-3 py-2 rounded-xl text-sm font-black transition-colors",
                mainTab === t ? "bg-teal-700 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {t === "chemistry" ? "Blood Chemistry" : "Body Fluids"}
            </button>
          ))}
        </div>
      </div>

      {mainTab === "chemistry" ? (
        <>
          {/* Patient bar */}
          <PatientBar
            ageValue={ageValue} setAgeValue={setAgeValue}
            ageUnit={ageUnit} setAgeUnit={setAgeUnit}
            sex={sex} setSex={setSex}
            unitMode={unitMode} setUnitMode={setUnitMode}
          />

          {/* Category tabs */}
          <div className="px-2 sm:px-4 pt-4 pb-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveCategory("All")}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-colors",
                  activeCategory === "All" ? "bg-teal-700 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                All ({countByCategory.All})
              </button>
              {LAB_CATEGORIES.map((cat) => {
                const count = countByCategory[cat] ?? 0;
                if (!count) return null;
                const style = CATEGORY_STYLE[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-colors",
                      activeCategory === cat ? cn(style.bg, style.text, "ring-2 ring-current ring-offset-1") : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="px-2 sm:px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                type="search"
                placeholder="Search lab test (e.g. 'sodium', 'ALT', 'lactate')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl h-11 text-sm"
              />
            </div>
          </div>

          {/* Test list */}
          <div className="px-2 sm:px-4 space-y-3">
            {filteredTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-bold">No lab tests match your search.</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredTests.map((test) => (
                <LabCard key={test.id} test={test} ageDays={ageDays} hasAge={hasAge} sex={sex} unitMode={unitMode} />
              ))
            )}

            {showBloodGasLipid && (
              <>
                <BloodGasCard ageDays={ageDays} hasAge={hasAge} />
                <LipidCard />
              </>
            )}
            {showDifferential && <FluidPanelCard panel={leukocyteDifferential} />}
            {showLdhIsoenzymes && <FluidPanelCard panel={ldhIsoenzymes} />}
            {showOgtt && <FluidPanelCard panel={ogtt} />}
          </div>
        </>
      ) : (
        <div className="px-2 sm:px-4 pt-4 space-y-3">
          {bodyFluidPanels.map((panel) => (
            <FluidPanelCard key={panel.id} panel={panel} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-2 sm:px-4 pt-8">
        <div className="flex items-start gap-3 bg-muted/50 rounded-2xl p-4">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            <strong>Clinical disclaimer:</strong> PediaLab provides reference ranges based on the Harriet Lane Handbook. Normal ranges vary between laboratories and assay methods — always interpret results against your own lab's reported reference range, in the context of the patient's clinical picture. This tool does not replace clinical judgement.
          </p>
        </div>
      </div>
    </div>
  );
}
