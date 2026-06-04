import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle,
  Info,
  ChevronLeft,
  FlaskConical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  neonateDrugs,
  DRUG_CATEGORIES,
  type DrugCategory,
  type NeonateDrug,
  type DoseResult,
} from "@/lib/nicu/neodose-database";

// ─── category colours ────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<DrugCategory, { bg: string; text: string; badge: string }> = {
  Antibiotic:             { bg: "bg-blue-50",    text: "text-blue-700",    badge: "bg-blue-100 text-blue-800" },
  Antifungal:             { bg: "bg-violet-50",  text: "text-violet-700",  badge: "bg-violet-100 text-violet-800" },
  Antiviral:              { bg: "bg-pink-50",    text: "text-pink-700",    badge: "bg-pink-100 text-pink-800" },
  Anticonvulsant:         { bg: "bg-amber-50",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-800" },
  Cardiovascular:         { bg: "bg-red-50",     text: "text-red-700",     badge: "bg-red-100 text-red-800" },
  Respiratory:            { bg: "bg-teal-50",    text: "text-teal-700",    badge: "bg-teal-100 text-teal-800" },
  "Analgesic & Sedation":  { bg: "bg-orange-50",  text: "text-orange-700",  badge: "bg-orange-100 text-orange-800" },
  "Electrolyte & Metabolic": { bg: "bg-cyan-50",  text: "text-cyan-700",   badge: "bg-cyan-100 text-cyan-800" },
  "Vitamin & Supplement":  { bg: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
};

// ─── sub-components ──────────────────────────────────────────────────────────

function PatientBar({
  weight, setWeight,
  pma, setPma,
  pna, setPna,
}: {
  weight: string; setWeight: (v: string) => void;
  pma: string; setPma: (v: string) => void;
  pna: string; setPna: (v: string) => void;
}) {
  const isComplete = parseFloat(weight) > 0 && parseFloat(pma) > 0;
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b py-3 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[90px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Weight (kg)</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 1.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-10 text-base font-bold rounded-xl border-2 focus:border-teal-500"
            />
          </div>
          <div className="flex-1 min-w-[90px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">PMA (weeks)</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 30"
              value={pma}
              onChange={(e) => setPma(e.target.value)}
              className="h-10 text-base font-bold rounded-xl border-2 focus:border-teal-500"
            />
          </div>
          <div className="flex-1 min-w-[90px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">PNA (days)</label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 5"
              value={pna}
              onChange={(e) => setPna(e.target.value)}
              className="h-10 text-base font-bold rounded-xl border-2 focus:border-teal-500"
            />
          </div>
          <div className="pb-0.5">
            {isComplete ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-black border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Doses calculated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-black">
                Enter weight + PMA
              </span>
            )}
          </div>
        </div>

        {/* PMA / PNA explainer */}
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 px-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">PMA</span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Postmenstrual age = GA at birth + weeks of life.
            </span>
            <span className="text-[11px] text-muted-foreground italic">
              e.g. born 28 wks, now 14 days old → PMA&nbsp;30&nbsp;wks
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">PNA</span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Postnatal age = days since birth.
            </span>
            <span className="text-[11px] text-muted-foreground italic">
              e.g. born 14 days ago → PNA&nbsp;14&nbsp;d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoseRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("flex gap-3 py-1.5 border-b last:border-0", highlight && "bg-teal-50/60 -mx-4 px-4 rounded")}>
      <span className="text-xs font-black text-muted-foreground w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-bold text-foreground leading-snug">{value}</span>
    </div>
  );
}

function DrugCard({ drug, weightKg, pmaWeeks, pnaDays }: {
  drug: NeonateDrug;
  weightKg: number;
  pmaWeeks: number;
  pnaDays: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasPatient = weightKg > 0 && pmaWeeks > 0;
  const style = CATEGORY_STYLE[drug.category];

  const result: DoseResult | null = useMemo(() => {
    if (!hasPatient) return null;
    try {
      return drug.calculate(weightKg, pmaWeeks, pnaDays);
    } catch {
      return null;
    }
  }, [hasPatient, drug, weightKg, pmaWeeks, pnaDays]);

  return (
    <div className={cn(
      "rounded-2xl border bg-card overflow-hidden transition-all duration-200",
      expanded && "shadow-md",
    )}>
      {/* Header */}
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className={cn("p-2 rounded-xl shrink-0 mt-0.5", style.bg)}>
          <FlaskConical className={cn("h-4 w-4", style.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-black text-base leading-tight">{drug.name}</span>
            {drug.brandName && (
              <span className="text-xs text-muted-foreground font-medium">({drug.brandName})</span>
            )}
            <span className={cn("text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg", style.badge)}>
              {drug.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-snug line-clamp-1">
            {drug.indications.join(" · ")}
          </p>
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground/40">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Calculated dose preview (collapsed) */}
      {!expanded && result && (
        <div className="px-4 pb-3 -mt-1">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Dose</div>
              <div className="text-sm font-black text-foreground leading-tight">{result.totalDose}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{result.dosePerKg}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Interval</div>
              <div className="text-sm font-black text-foreground leading-tight">{result.interval}</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Volume</div>
              <div className="text-sm font-black text-foreground leading-tight">{result.volumePerDose}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{result.concentration}</div>
            </div>
          </div>
          {result.warningNote && (
            <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-[11px] font-bold text-amber-800 leading-snug">{result.warningNote}</span>
            </div>
          )}
        </div>
      )}

      {!expanded && !hasPatient && (
        <div className="px-4 pb-3 -mt-1">
          <div className="bg-muted/40 rounded-xl px-3 py-2 text-center">
            <span className="text-xs text-muted-foreground font-medium">Enter weight + PMA above to calculate dose</span>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t mt-0 space-y-4">

          {/* Full dose table */}
          {result ? (
            <div className="pt-3 space-y-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Calculated Dose</div>
              <DoseRow label="Dose / kg" value={result.dosePerKg} />
              <DoseRow label="Total dose" value={result.totalDose} highlight />
              <DoseRow label="Interval" value={result.interval} />
              <DoseRow label="Route" value={result.route} />
              <DoseRow label="Concentration" value={result.concentration} />
              <DoseRow label="Volume" value={result.volumePerDose} highlight />
              {result.basisNote && <DoseRow label="Basis" value={result.basisNote} />}
              {result.maxDose && <DoseRow label="Max dose" value={result.maxDose} />}
              {result.infusionNote && (
                <div className="pt-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Infusion rates</div>
                  <div className="bg-muted/40 rounded-xl px-3 py-2">
                    <p className="text-xs font-bold text-foreground leading-relaxed">{result.infusionNote}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Verify concentration with local pharmacy before preparation.</p>
                  </div>
                </div>
              )}
              {result.warningNote && (
                <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-amber-800 leading-snug">{result.warningNote}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-3 bg-muted/40 rounded-xl px-3 py-3 text-center">
              <span className="text-xs text-muted-foreground font-medium">Enter patient weight + PMA to calculate dose</span>
            </div>
          )}

          {/* Administration */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Administration</div>
            <p className="text-sm font-medium text-foreground leading-relaxed">{drug.administration}</p>
          </div>

          {/* Monitoring */}
          {drug.monitoring.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Monitoring</div>
              <ul className="space-y-1">
                {drug.monitoring.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cautions */}
          {drug.cautions.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Cautions & Notes</div>
              <ul className="space-y-1">
                {drug.cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* References */}
          {drug.references.length > 0 && (
            <div className="border-t pt-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">References</div>
              <p className="text-xs text-muted-foreground font-medium">{drug.references.join(" · ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function NicuDrugsPage() {
  const [weight, setWeight] = useState("");
  const [pma, setPma] = useState("");
  const [pna, setPna] = useState("0");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory | "All">("All");

  const weightKg = parseFloat(weight) || 0;
  const pmaWeeks = parseFloat(pma) || 0;
  const pnaDays = parseFloat(pna) || 0;

  const filteredDrugs = useMemo(() => {
    let drugs = neonateDrugs;
    if (activeCategory !== "All") {
      drugs = drugs.filter((d) => d.category === activeCategory);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      drugs = drugs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.brandName?.toLowerCase().includes(q) ?? false) ||
          d.indications.some((i) => i.toLowerCase().includes(q)) ||
          d.category.toLowerCase().includes(q),
      );
    }
    return drugs;
  }, [activeCategory, search]);

  const countByCategory = useMemo(() => {
    const m: Record<string, number> = { All: neonateDrugs.length };
    for (const d of neonateDrugs) {
      m[d.category] = (m[d.category] ?? 0) + 1;
    }
    return m;
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Back link */}
      <div className="px-2 sm:px-4 pt-4 pb-2">
        <Link href="/nicu" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
          NICU Dashboard
        </Link>
      </div>

      {/* Hero */}
      <div className="px-2 sm:px-4 pb-4">
        <div className="rounded-[28px] bg-teal-600 p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="h-6 w-6" />
              <span className="font-black text-2xl tracking-tight">NeoDose</span>
              <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-widest">NICU DRUG REFERENCE</Badge>
            </div>
            <p className="text-teal-100 text-sm font-medium max-w-lg">
              NEOFAX-style neonatal IV drug calculator. Enter patient weight, PMA, and PNA — doses, intervals, and volumes are calculated automatically per drug.
            </p>
            <p className="text-teal-200/70 text-[11px] font-medium mt-2">
              ⚠ Verify all doses against local formulary and pharmacy policy before clinical use.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Patient bar */}
      <PatientBar
        weight={weight} setWeight={setWeight}
        pma={pma} setPma={setPma}
        pna={pna} setPna={setPna}
      />

      {/* Category tabs */}
      <div className="px-2 sm:px-4 pt-4 pb-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("All")}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-colors",
              activeCategory === "All"
                ? "bg-teal-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            All ({countByCategory.All})
          </button>
          {DRUG_CATEGORIES.map((cat) => {
            const count = countByCategory[cat] ?? 0;
            if (!count) return null;
            const style = CATEGORY_STYLE[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-colors",
                  activeCategory === cat
                    ? cn(style.bg, style.text, "ring-2 ring-current ring-offset-1")
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
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
            placeholder="Search drug name or indication (e.g. 'gentamicin', 'sepsis', 'PDA')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11 text-sm"
          />
        </div>
      </div>

      {/* Drug list */}
      <div className="px-2 sm:px-4 space-y-3">
        {filteredDrugs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-bold">No drugs match your search.</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Group by category when showing All */}
            {activeCategory === "All" && !search.trim() ? (
              DRUG_CATEGORIES.map((cat) => {
                const drugs = filteredDrugs.filter((d) => d.category === cat);
                if (!drugs.length) return null;
                const style = CATEGORY_STYLE[cat];
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex items-center gap-2 px-1 pt-2">
                      <span className={cn("text-xs font-black uppercase tracking-[0.15em]", style.text)}>{cat}</span>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[10px] text-muted-foreground font-medium">{drugs.length} drugs</span>
                    </div>
                    {drugs.map((drug) => (
                      <DrugCard
                        key={drug.id}
                        drug={drug}
                        weightKg={weightKg}
                        pmaWeeks={pmaWeeks}
                        pnaDays={pnaDays}
                      />
                    ))}
                  </div>
                );
              })
            ) : (
              filteredDrugs.map((drug) => (
                <DrugCard
                  key={drug.id}
                  drug={drug}
                  weightKg={weightKg}
                  pmaWeeks={pmaWeeks}
                  pnaDays={pnaDays}
                />
              ))
            )}
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-2 sm:px-4 pt-8">
        <div className="flex items-start gap-3 bg-muted/50 rounded-2xl p-4">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            <strong>Clinical disclaimer:</strong> NeoDose provides starting doses based on NNF 9th ed. (2024), BNFc, and Neofax 2023. All doses must be verified against your institution's formulary and validated by a neonatologist or clinical pharmacist before administration. Weight, PMA, and clinical context may alter appropriate dosing. This tool does not replace clinical judgement.
          </p>
        </div>
      </div>
    </div>
  );
}
