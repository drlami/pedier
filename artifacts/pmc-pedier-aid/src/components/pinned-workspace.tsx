import { Link } from "wouter";
import { Star, BookOpen, Calculator, PinOff, LayoutGrid } from "lucide-react";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { useAllProtocols } from "@/contexts/protocols-context";
import { CALCULATOR_SHORTCUTS } from "@/lib/clinical-dashboard";
import { cn } from "@/lib/utils";

export function PinnedWorkspace() {
  const { pinnedItems, togglePin } = usePinnedItems();
  const allProtocols = useAllProtocols();

  const resolvedPinned = pinnedItems.map(p => {
    if (p.type === "protocol") {
      return allProtocols.find(prot => prot.id === p.id);
    }
    return CALCULATOR_SHORTCUTS.find(c => c.href === p.href);
  }).filter(Boolean);

  if (resolvedPinned.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Star className="h-4 w-4 text-muted-foreground/60" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">My Workspace</h3>
        </div>
        <div className="py-8 text-center bg-muted/20 border-2 border-dashed rounded-[32px] space-y-3 mx-2">
          <LayoutGrid className="h-8 w-8 text-muted-foreground/20 mx-auto" />
          <p className="text-[11px] font-bold text-muted-foreground/60 px-6">Your pinned protocols and tools will appear here for quick access.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">My Workspace</h3>
        </div>
      </div>

      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex overflow-x-auto pb-4 gap-3 px-2 no-scrollbar lg:grid lg:grid-cols-4 xl:grid-cols-6 lg:overflow-visible lg:pb-0">
        {resolvedPinned.map((item: any) => {
          const isCalc = 'href' in item;
          const title = item.label || item.name;
          const href = isCalc ? item.href : `/diseases/${item.id}`;
          const Icon = isCalc ? Calculator : BookOpen;

          return (
            <div 
              key={isCalc ? item.href : item.id} 
              className="flex-shrink-0 w-[140px] lg:w-auto group relative p-4 rounded-[24px] border-2 bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <Link href={href} className="block space-y-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isCalc ? "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-[12px] leading-tight tracking-tight line-clamp-2">
                    {title.replace("(OI)", "").replace("(Bedside Schwartz)", "").replace("(QTc)", "").replace("(Burn Fluids)", "").trim()}
                  </h4>
                  <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider truncate">
                    {isCalc ? "Calculator" : item.system}
                  </p>
                </div>
              </Link>
              <button 
                onClick={() => togglePin(isCalc ? { type: "calculator", href: item.href } : { type: "protocol", id: item.id })}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm text-muted-foreground hover:text-rose-500 opacity-0 lg:group-hover:opacity-100 transition-opacity"
              >
                <PinOff className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
