import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { allProtocols } from "@/lib/protocols";
import { pediatricDrugs } from "@/lib/pediadose-database";
import { CALCULATORS } from "@/lib/calculator-catalog";
import { Search, X, Stethoscope, Pill, HeartPulse, Building2, Calculator, Activity, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
  unit?: "ER" | "Ward" | "PICU" | "NICU" | "PediCalc";
  keywords?: string;
}

const QUICK_LINKS: SearchResult[] = [
  {
    id: "cardiac-arrest",
    title: "Cardiac Arrest Protocol",
    subtitle: "Quick Access",
    href: "/cardiac-arrest",
    icon: <HeartPulse className="h-4 w-4" />,
    accent: "text-red-600 bg-red-50",
    unit: "ER",
  },
  {
    id: "drug-doses",
    title: "PediaDose Drug Reference",
    subtitle: "Quick Access",
    href: "/drug-doses",
    icon: <Pill className="h-4 w-4" />,
    accent: "text-orange-600 bg-orange-50",
    unit: "PediCalc",
  },
  {
    id: "calculators-home",
    title: "Browse All Calculators",
    subtitle: "Quick Access",
    href: "/calculators",
    icon: <Calculator className="h-4 w-4" />,
    accent: "text-orange-600 bg-orange-50",
    unit: "PediCalc",
  },
  {
    id: "nicu-home",
    title: "NICU Dashboard",
    subtitle: "Quick Access",
    href: "/nicu",
    icon: <Baby className="h-4 w-4" />,
    accent: "text-teal-600 bg-teal-50",
    unit: "NICU",
  },
  {
    id: "neodose",
    title: "NeoDose Drug Reference",
    subtitle: "Quick Access",
    href: "/nicu/drugs",
    icon: <Pill className="h-4 w-4" />,
    accent: "text-teal-600 bg-teal-50",
    unit: "NICU",
  },
];

const UNIT_STYLES: Record<"er" | "ward" | "picu" | "nicu", { icon: React.ReactNode; accent: string; label: "ER" | "Ward" | "PICU" | "NICU" }> = {
  er:    { icon: <Stethoscope className="h-4 w-4" />, accent: "text-blue-600 bg-blue-50",     label: "ER" },
  ward:  { icon: <Building2 className="h-4 w-4" />,   accent: "text-indigo-600 bg-indigo-50", label: "Ward" },
  picu:  { icon: <Activity className="h-4 w-4" />,    accent: "text-purple-600 bg-purple-50", label: "PICU" },
  nicu:  { icon: <Baby className="h-4 w-4" />,         accent: "text-teal-600 bg-teal-50",     label: "NICU" },
};

function buildIndex(): SearchResult[] {
  const protocols: SearchResult[] = allProtocols.map((p) => {
    const style = UNIT_STYLES[(p.unit as keyof typeof UNIT_STYLES) ?? "er"] ?? UNIT_STYLES.er;
    return {
      id: `protocol-${p.id}`,
      title: p.name,
      subtitle: p.system,
      href: `/diseases/${p.id}`,
      icon: style.icon,
      accent: style.accent,
      unit: style.label,
      keywords: p.system,
    };
  });

  const drugs: SearchResult[] = pediatricDrugs.map((d) => ({
    id: `drug-${d.id}`,
    title: d.name,
    subtitle: `${d.category}${d.indications.length ? ` — ${d.indications[0]}` : ""}`,
    href: `/drug-doses?drug=${d.id}`,
    icon: <Pill className="h-4 w-4" />,
    accent: "text-orange-600 bg-orange-50",
    unit: "PediCalc",
    keywords: d.category,
  }));

  const calculators: SearchResult[] = CALCULATORS.filter((c) => c.href && !c.comingSoon).map((c) => {
    const Icon = c.icon;
    return {
      id: `calc-${c.id}`,
      title: c.name,
      subtitle: c.category,
      href: c.href as string,
      icon: <Icon className="h-4 w-4" />,
      accent: "text-orange-600 bg-orange-50",
      unit: "PediCalc" as const,
      keywords: c.tags.join(" "),
    };
  });

  return [...protocols, ...drugs, ...calculators];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => buildIndex(), []);

  const results: SearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUICK_LINKS;

    const titleMatches: SearchResult[] = [];
    const otherMatches: SearchResult[] = [];
    for (const r of index) {
      if (r.title.toLowerCase().includes(q)) {
        titleMatches.push(r);
      } else if (
        r.subtitle.toLowerCase().includes(q) ||
        r.keywords?.toLowerCase().includes(q)
      ) {
        otherMatches.push(r);
      }
    }
    return [...titleMatches, ...otherMatches].slice(0, 14);
  }, [query, index]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setActiveIdx(0); }, [results]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIdx]) navigate(results[activeIdx].href);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, activeIdx]);

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function navigate(href: string) {
    setLocation(href);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search protocols, drugs, calculators…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono border border-border rounded text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results for "{query}"
            </div>
          ) : (
            <>
              {!query && (
                <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Quick Access
                </p>
              )}
              {results.map((result, idx) => (
                <button
                  key={result.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => navigate(result.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    idx === activeIdx ? "bg-muted" : "hover:bg-muted/50",
                  )}
                >
                  <span className={cn("flex items-center justify-center w-7 h-7 rounded-md shrink-0", result.accent)}>
                    {result.icon}
                  </span>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-foreground truncate">{result.title}</div>
                      {result.unit && (
                        <span className={cn(
                          "shrink-0 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                          result.unit === "Ward" ? "bg-indigo-100 text-indigo-700" :
                          result.unit === "ER" ? "bg-blue-100 text-blue-700" :
                          result.unit === "PICU" ? "bg-purple-100 text-purple-700" :
                          result.unit === "NICU" ? "bg-teal-100 text-teal-700" :
                          "bg-orange-100 text-orange-700"
                        )}>
                          {result.unit}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">{result.subtitle}</div>
                  </div>
                  {idx === activeIdx && (
                    <kbd className="hidden sm:inline text-[10px] font-mono text-muted-foreground border border-border rounded px-1 py-0.5">↵</kbd>
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
