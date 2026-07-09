import { useState, useMemo } from "react";
import { Calculator, Search, ArrowRight, Pin, PinOff, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  type CalcCategory, type CalcTool, CATEGORY_METADATA, categoryOrder, colorClasses, CALCULATORS,
} from "@/lib/calculator-catalog";
import { usePinnedItems } from "@/contexts/pinned-items-context";

export default function CalculatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | CalcCategory>("all");
  const { togglePin: togglePinItem, isPinned: isPinnedItem } = usePinnedItems();

  const togglePin = (href: string) => togglePinItem({ type: "calculator", href });
  const isPinned = (href: string) => isPinnedItem({ type: "calculator", href });

  const pinnedTools = useMemo(
    () => CALCULATORS.filter(c => c.href && isPinnedItem({ type: "calculator", href: c.href })),
    [isPinnedItem]
  );

  const isSearching = searchQuery.trim().length > 0;

  const filteredCalculators = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CALCULATORS.filter(calc => {
      const matchesSearch = !q ||
        calc.name.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.tags.some(t => t.includes(q));
      const matchesCategory = activeCategory === "all" || calc.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CALCULATORS.length };
    CALCULATORS.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  const groupedCalculators = useMemo(() => {
    const groups: Record<string, CalcTool[]> = {};
    filteredCalculators.forEach(calc => {
      if (!groups[calc.category]) groups[calc.category] = [];
      groups[calc.category].push(calc);
    });
    return groups;
  }, [filteredCalculators]);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter mb-1">PediCalc Engine</h1>
          <p className="text-muted-foreground text-sm font-medium">
            {CALCULATORS.length} validated clinical calculators · {CALCULATORS.filter(c => c.isNew).length} newly added
          </p>
        </div>
        <div className="relative w-full sm:w-[420px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, condition, or tag…"
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-muted/40 border border-transparent focus:bg-background focus:border-primary/20 focus:outline-none shadow-none transition-all text-sm font-medium placeholder:text-muted-foreground/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {!isSearching && (
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            label="All Systems"
            count={categoryCounts["all"]}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            color="slate"
            Icon={Calculator}
          />
          {categoryOrder.map(cat => {
            const meta = CATEGORY_METADATA[cat];
            return (
              <CategoryPill
                key={cat}
                label={cat}
                count={categoryCounts[cat] || 0}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                color={meta.color}
                Icon={meta.icon}
              />
            );
          })}
        </div>
      )}

      {/* Search result count */}
      {isSearching && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="font-black text-foreground">{filteredCalculators.length}</span> result{filteredCalculators.length !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold text-primary">"{searchQuery}"</span>
          </p>
          <button onClick={() => setSearchQuery("")} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
            Clear
          </button>
        </div>
      )}

      {/* Pinned Section */}
      {pinnedTools.length > 0 && activeCategory === "all" && !isSearching && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 shadow-sm">
              <Pin className="h-4 w-4 fill-current" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Quick Access</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pinnedTools.map((calc) => (
              <PinnedToolCard
                key={`pinned-${calc.id}`}
                tool={calc}
                onTogglePin={() => togglePin(calc.href!)}
              />
            ))}
          </div>
          <div className="border-b border-dashed pt-2" />
        </section>
      )}

      {/* Calculator Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="space-y-12">
          {(isSearching ? categoryOrder : (activeCategory === "all" ? categoryOrder : [activeCategory])).map(cat => {
            const tools = groupedCalculators[cat];
            if (!tools || tools.length === 0) return null;
            const meta = CATEGORY_METADATA[cat];
            const Icon = meta.icon;
            const cc = colorClasses(meta.color, false);

            return (
              <div key={cat} className="space-y-5 animate-in fade-in duration-500">
                {(activeCategory === "all" || isSearching) && (
                  <div className="flex items-center gap-3 px-1">
                    <div className={cn("p-2 rounded-xl text-white shadow-lg", cc.header)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">{meta.label}</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {tools.length} tool{tools.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tools.map((calc) => (
                    <CalculatorCard
                      key={calc.id}
                      tool={calc}
                      isPinned={calc.href ? isPinned(calc.href) : false}
                      onTogglePin={calc.href ? () => togglePin(calc.href!) : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center border-4 border-dashed rounded-[48px] bg-muted/20">
          <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground/10" />
          <h3 className="text-2xl font-black text-muted-foreground/40 tracking-tight">No tools found</h3>
          <p className="text-sm text-muted-foreground/30 mt-1">Try a different search term or category</p>
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  label, count, active, onClick, color, Icon
}: {
  label: string; count: number; active: boolean;
  onClick: () => void; color: string; Icon: any;
}) {
  const cc = colorClasses(color, active);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold transition-all border select-none",
        active
          ? cn(cc.pill, "shadow-md")
          : "bg-background text-muted-foreground border-muted hover:border-muted-foreground/30 hover:bg-muted/40"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
      <span className={cn(
        "rounded-full px-1.5 py-px text-[9px] font-black",
        active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground/70"
      )}>
        {count}
      </span>
    </button>
  );
}

function CalculatorCard({ tool, isPinned, onTogglePin }: {
  tool: CalcTool; isPinned: boolean; onTogglePin?: () => void;
}) {
  const Icon = tool.icon;
  const meta = CATEGORY_METADATA[tool.category];
  const cc = colorClasses(meta.color, false);

  return (
    <Card className="group relative h-full transition-all border-2 rounded-[32px] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 bg-card overflow-hidden">
      <CardHeader className="pb-4 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-3 rounded-2xl transition-all duration-300",
            "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.isNew && (
              <Badge className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest border-none px-2">
                New
              </Badge>
            )}
            <Badge variant="secondary" className={cn("text-[9px] font-black uppercase tracking-[0.12em] border-none px-2", cc.bg)}>
              {tool.category}
            </Badge>
            {onTogglePin && !tool.comingSoon && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  isPinned ? "bg-amber-50 text-amber-500 shadow-sm" : "bg-muted/30 text-muted-foreground/30 hover:bg-muted"
                )}
              >
                {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
        <CardTitle className="text-lg font-black tracking-tight group-hover:text-primary transition-colors leading-snug mb-2">
          {tool.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed text-[13px] font-medium text-muted-foreground/80">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        {tool.comingSoon ? (
          <div className="flex items-center justify-between w-full p-3 rounded-2xl bg-muted/20 border border-dashed border-muted-foreground/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">In Development</span>
            <Clock className="h-4 w-4 text-muted-foreground/25" />
          </div>
        ) : (
          <Link href={tool.href || "#"} className="flex items-center justify-between w-full p-3 rounded-2xl bg-muted/30 hover:bg-primary/[0.03] transition-all group/link border border-transparent hover:border-primary/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Launch Tool</span>
            <ArrowRight className="h-4 w-4 text-primary group-hover/link:translate-x-1 transition-transform" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function PinnedToolCard({ tool, onTogglePin }: { tool: CalcTool; onTogglePin: () => void }) {
  const Icon = tool.icon;
  return (
    <Link href={tool.href || "#"}>
      <div className="group relative flex flex-col items-center justify-center p-2 min-h-[100px] aspect-square bg-card border-2 rounded-[28px] hover:border-amber-400/50 hover:bg-amber-50/30 transition-all text-center">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-100 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <PinOff className="h-3 w-3" />
        </button>
        <div className="p-2.5 rounded-2xl mb-2 transition-all duration-300 bg-muted text-muted-foreground group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-200">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tight leading-[1.1] line-clamp-2 px-1 max-w-[85%]">
          {tool.name.replace(/\s*\(.*?\)/g, "").trim()}
        </span>
      </div>
    </Link>
  );
}
