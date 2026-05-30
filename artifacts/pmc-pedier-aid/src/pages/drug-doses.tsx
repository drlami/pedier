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
import { fetchCustomStore, saveCustomDrug, deleteCustomDrug, resetBuiltinDrug, type CustomDrugStore } from "@/lib/drug-store";
import DrugEditDialog from "@/components/drug-doses/DrugEditDialog";
import {
  AlertTriangle, Info, Pill, Weight, Pencil, Trash2, RotateCcw, Plus,
  FlaskConical, Clock, Search, X, ChevronRight, BookOpen, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcMlResult(dose: EnhancedDoseRow, kg: number, mgPerMl: number): { mg: number; ml: number } | null {
  if (!dose.dosePerKgMg || !mgPerMl || mgPerMl <= 0 || kg <= 0) return null;
  const rawMg = dose.dosePerKgMg * kg;
  const doseMg = dose.maxDoseMg ? Math.min(rawMg, dose.maxDoseMg) : rawMg;
  return { mg: Math.round(doseMg), ml: Math.round((doseMg / mgPerMl) * 10) / 10 };
}

// ── Components ───────────────────────────────────────────────────────────────

function DoseRowDisplay({
  dose,
  drug,
  kg,
  validWeight,
  colors,
  concentrationMap,
  setConcentrationMap,
}: {
  dose: EnhancedDoseRow;
  drug: DrugEntry;
  kg: number;
  validWeight: boolean;
  colors: { bg: string; text: string; border: string; iconBg: string };
  concentrationMap: Record<string, string>;
  setConcentrationMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const isSuspension = (dose.type === "oral" || dose.type === "oral-suspension") &&
    (dose.oralConcentrations?.length ?? 0) > 0;

  const concKey = `${drug.id}-${dose.route}`;
  const selectedConcValue = isSuspension ? (concentrationMap[concKey] ?? "") : "";
  const selectedMgPerMl = selectedConcValue ? parseFloat(selectedConcValue) : 0;
  const mlCalc = selectedMgPerMl > 0 ? calcMlResult(dose, kg, selectedMgPerMl) : null;

  const resultBadge = useMemo(() => {
    if (!validWeight) return null;
    if (isSuspension && mlCalc) return `${mlCalc.mg} mg (${mlCalc.ml} ml)`;
    return dose.calculate(kg);
  }, [validWeight, isSuspension, mlCalc, dose, kg]);

  return (
    <div className="group relative p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border shadow-sm", colors.bg, colors.text, colors.border)}>
              {dose.route}
            </span>
            {dose.frequency && (
              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {dose.frequency}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-foreground/80 leading-relaxed">
            {dose.formula}
          </p>
          {dose.caution && (
            <p className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {dose.caution}
            </p>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-start sm:items-end justify-center min-w-[120px]">
          {validWeight ? (
            <div className={cn("px-4 py-2 rounded-xl border-2 shadow-sm transition-transform group-hover:scale-105", colors.bg, colors.border)}>
              <span className={cn("text-lg font-black font-mono leading-none", colors.text)}>
                {resultBadge}
              </span>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-muted/30 border border-dashed border-muted-foreground/20 italic text-[11px] text-muted-foreground">
              Enter weight above
            </div>
          )}
        </div>
      </div>

      {isSuspension && validWeight && (
        <div className="mt-4 pt-4 border-t border-dashed flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <FlaskConical className="h-3 w-3" /> Concentration
          </div>
          <div className="flex flex-wrap gap-2">
            {dose.oralConcentrations?.map((c) => (
              <button
                key={c.label}
                onClick={() => setConcentrationMap(prev => ({ ...prev, [concKey]: String(c.mgPerMl) }))}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border transition-all",
                  selectedConcValue === String(c.mgPerMl)
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-background text-muted-foreground hover:border-primary/30"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DrugDosesPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const targetDrug = params.get("drug");

  const [weight, setWeight] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<DrugCategory>("Resuscitation");
  const [refreshKey, setRefreshKey] = useState(0);
  const [concentrationMap, setConcentrationMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const [customStore, setCustomStore] = useState<CustomDrugStore>({ additions: [], edits: {} });
  const [storeLoading, setStoreLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<DrugEntry | undefined>(undefined);
  const [dialogCategory, setDialogCategory] = useState<DrugCategory>("Antibiotics");

  const drugRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchCustomStore().then(store => {
      setCustomStore(store);
      setStoreLoading(false);
    });
  }, [refreshKey]);

  const kg = parseFloat(weight);
  const validWeight = !isNaN(kg) && kg > 0 && kg <= 200;

  const allDrugs = useMemo(() => getMergedDrugs(customStore), [customStore]);

  const filteredDrugs = useMemo(() => {
    let list = allDrugs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.indication?.toLowerCase().includes(q)
      );
    } else {
      list = list.filter(d => d.category === activeCategory);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [allDrugs, activeCategory, searchQuery]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-10 pb-40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-[22px] bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
            <Pill className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-headline tracking-tight">Drug PediCalc</h1>
            <p className="text-muted-foreground text-sm font-medium">Precision weight-based dosing for paediatrics.</p>
          </div>
        </div>
        
        {/* Weight Control */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-card border-2 border-primary/20 rounded-2xl p-1 shadow-sm">
            <div className="flex items-center gap-2 pl-4 pr-2">
              <Weight className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Weight</span>
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0"
              className="w-20 bg-transparent text-2xl font-black font-mono text-primary outline-none text-center"
            />
            <div className="pr-4 pl-2 text-xs font-black text-primary/40 uppercase">kg</div>
          </div>
        </div>
      </div>

      {/* Navigation & Search */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drugs by name or indication..."
            className="w-full pl-12 pr-12 py-4 bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl outline-none transition-all font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {!searchQuery && (
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {DRUG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2",
                  activeCategory === cat 
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-card border-muted/60 text-muted-foreground hover:border-primary/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drug List */}
      <div className="grid grid-cols-1 gap-8">
        {filteredDrugs.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-muted/20 border-4 border-dashed rounded-[40px]">
            <Search className="h-12 w-12 text-muted-foreground/20 mx-auto" />
            <h3 className="text-xl font-black text-muted-foreground/60">No drugs found</h3>
          </div>
        ) : (
          filteredDrugs.map(drug => {
            const dc = CATEGORY_COLOR[drug.category];
            return (
              <div key={drug.id} className="space-y-4">
                <div className="flex items-end justify-between px-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black tracking-tight">{drug.name}</h2>
                      <Badge variant="outline" className={cn("text-[10px] font-black uppercase border-2", dc.bg, dc.text, dc.border)}>
                        {drug.category}
                      </Badge>
                    </div>
                    {drug.indication && (
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" /> {drug.indication}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {drug.warning && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100">
                            <AlertTriangle className="h-5 w-5" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader className="mb-6">
                            <SheetTitle className="text-amber-600 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" /> Safety Guidelines
                            </SheetTitle>
                            <SheetDescription className="font-bold text-foreground">
                              {drug.name} Clinical Alerts
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm leading-relaxed font-medium">
                              {drug.warning}
                            </div>
                            {drug.contraindications && (
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contraindications</h4>
                                <p className="text-sm font-medium leading-relaxed">{drug.contraindications}</p>
                              </div>
                            )}
                            {drug.reference && (
                              <div className="pt-4 border-t border-dashed space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reference</h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                  <BookOpen className="h-3 w-3" /> {drug.reference}
                                </div>
                              </div>
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-xl hover:bg-muted"
                      onClick={() => { setEditingDrug(drug); setDialogCategory(drug.category); setDialogOpen(true); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {drug.doses.map((dose, i) => (
                    <DoseRowDisplay
                      key={i}
                      dose={dose}
                      drug={drug}
                      kg={kg}
                      validWeight={validWeight}
                      colors={dc}
                      concentrationMap={concentrationMap}
                      setConcentrationMap={setConcentrationMap}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Sticky Info */}
      {!validWeight && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md animate-in slide-in-from-bottom-full duration-500">
          <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
            <div className="p-2 bg-white/20 rounded-xl">
              <Weight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Weight Missing</p>
              <p className="text-xs font-medium opacity-90">Enter patient weight at the top to calculate precision doses.</p>
            </div>
            <ChevronRight className="h-5 w-5 ml-auto opacity-50" />
          </div>
        </div>
      )}

      {/* Edit/Add dialog */}
      <DrugEditDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingDrug(undefined); }}
        onSave={() => setRefreshKey(k => k + 1)}
        drug={editingDrug}
        defaultCategory={dialogCategory}
      />
    </div>
  );
}
