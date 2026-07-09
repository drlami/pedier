import { Link } from "wouter";
import { Star, PinOff, LayoutGrid, BookOpen, Calculator, Syringe, Pill, FlaskConical } from "lucide-react";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { useAllProtocols } from "@/contexts/protocols-context";
import { resolvePinnedItems, type ResolvedPinnedItem } from "@/lib/resolve-pinned-items";
import { cn } from "@/lib/utils";

const GROUPS: { type: ResolvedPinnedItem["type"]; label: string; icon: typeof BookOpen; accent: string }[] = [
  { type: "protocol", label: "Protocols", icon: BookOpen, accent: "bg-blue-50 text-blue-600" },
  { type: "calculator", label: "Calculators", icon: Calculator, accent: "bg-orange-50 text-orange-600" },
  { type: "drug", label: "Drugs (NeoDose / PediaDose)", icon: Syringe, accent: "bg-teal-50 text-teal-600" },
  { type: "lab", label: "Lab Tests (PediaLab)", icon: FlaskConical, accent: "bg-violet-50 text-violet-600" },
];

function ICON_FOR(item: ResolvedPinnedItem) {
  if (item.type === "drug" && item.item.type === "drug" && item.item.system === "pediadose") return Pill;
  return item.icon;
}

export default function FavoritesPage() {
  const { pinnedItems, togglePin } = usePinnedItems();
  const allProtocols = useAllProtocols();
  const resolved = resolvePinnedItems(pinnedItems, allProtocols);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 px-2 sm:px-4">
      <div className="flex items-center gap-3 pt-2">
        <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-500">
          <Star className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Protocols, calculators, drugs, and lab tests you've pinned for quick access.
          </p>
        </div>
      </div>

      {resolved.length === 0 ? (
        <div className="py-16 text-center bg-muted/20 border-2 border-dashed rounded-[32px] space-y-3">
          <LayoutGrid className="h-10 w-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm font-bold text-muted-foreground/60 px-6">
            Nothing pinned yet. Tap the star on any protocol, calculator, drug, or lab test to add it here.
          </p>
        </div>
      ) : (
        GROUPS.map(group => {
          const items = resolved.filter(r => r.type === group.type);
          if (items.length === 0) return null;
          const GroupIcon = group.icon;

          return (
            <section key={group.type} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <GroupIcon className="h-4 w-4 text-muted-foreground/60" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  {group.label}
                </h2>
                <span className="text-xs font-bold text-muted-foreground/40">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map(item => {
                  const Icon = ICON_FOR(item);
                  return (
                    <div
                      key={item.key}
                      className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/20 transition-all"
                    >
                      <Link href={item.href} className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={cn("p-2.5 rounded-xl shrink-0", group.accent)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => togglePin(item.item)}
                        className="shrink-0 p-2 rounded-lg text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove from Favorites"
                      >
                        <PinOff className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
