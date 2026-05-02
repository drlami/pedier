import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { allProtocols } from "@/lib/protocols";
import { DRUGS } from "@/lib/drug-doses";
import { Search, X, Stethoscope, Pill, HeartPulse, Brain, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
}

const QUICK_LINKS: SearchResult[] = [
  {
    id: "cardiac-arrest",
    title: "Cardiac Arrest Protocol",
    subtitle: "Quick Access",
    href: "/cardiac-arrest",
    icon: <HeartPulse className="h-4 w-4" />,
    accent: "text-red-600 bg-red-50",
  },
  {
    id: "diff-diag",
    title: "AI Differential Diagnosis",
    subtitle: "Quick Access",
    href: "/differential-diagnosis",
    icon: <Brain className="h-4 w-4" />,
    accent: "text-primary bg-primary/10",
  },
  {
    id: "drug-safety",
    title: "Drug Safety Checker",
    subtitle: "Quick Access",
    href: "/drug-safety",
    icon: <FlaskConical className="h-4 w-4" />,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "drug-doses",
    title: "Drug Dosing Calculator",
    subtitle: "Quick Access",
    href: "/drug-doses",
    icon: <Pill className="h-4 w-4" />,
    accent: "text-orange-600 bg-orange-50",
  },
];

function buildIndex(): SearchResult[] {
  const protocols: SearchResult[] = allProtocols.map((p) => ({
    id: `protocol-${p.id}`,
    title: p.name,
    subtitle: p.system,
    href: `/diseases/${p.id}`,
    icon: <Stethoscope className="h-4 w-4" />,
    accent: "text-blue-600 bg-blue-50",
  }));

  const drugs: SearchResult[] = DRUGS.map((d) => ({
    id: `drug-${d.id}`,
    title: d.name,
    subtitle: `${d.category}${d.indication ? ` — ${d.indication}` : ""}`,
    href: `/drug-doses?drug=${d.id}`,
    icon: <Pill className="h-4 w-4" />,
    accent: "text-orange-600 bg-orange-50",
  }));

  return [...protocols, ...drugs];
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
    return index.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q),
    ).slice(0, 10);
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
            placeholder="Search protocols, drugs…"
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{result.title}</div>
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
