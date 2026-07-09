import { BookOpen, Calculator, FlaskConical, Pill, Syringe, type LucideIcon } from "lucide-react";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import type { PinnedItem } from "@/contexts/pinned-items-context";
import { CALCULATORS } from "@/lib/calculator-catalog";
import { CALCULATOR_SHORTCUTS } from "@/lib/clinical-dashboard";
import { neonateDrugs } from "@/lib/nicu/neodose-database";
import { pediatricDrugs } from "@/lib/pediadose-database";
import { labTests } from "@/lib/pedialab-database";

export interface ResolvedPinnedItem {
  key: string;
  type: PinnedItem["type"];
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  item: PinnedItem;
}

/** Single source of truth for turning a stored PinnedItem into something renderable. */
export function resolvePinnedItems(
  pinnedItems: PinnedItem[],
  protocols: DiseaseProtocol[],
): ResolvedPinnedItem[] {
  const resolved: ResolvedPinnedItem[] = [];

  for (const item of pinnedItems) {
    if (item.type === "protocol") {
      const p = protocols.find(x => x.id === item.id);
      if (!p) continue;
      resolved.push({
        key: `protocol-${p.id}`,
        type: "protocol",
        title: p.name,
        subtitle: p.system,
        href: `/diseases/${p.id}`,
        icon: BookOpen,
        item,
      });
    } else if (item.type === "calculator") {
      const tool = CALCULATORS.find(c => c.href === item.href);
      if (tool) {
        resolved.push({
          key: `calculator-${item.href}`,
          type: "calculator",
          title: tool.name,
          subtitle: tool.category,
          href: item.href,
          icon: tool.icon ?? Calculator,
          item,
        });
        continue;
      }
      const shortcut = CALCULATOR_SHORTCUTS.find(c => c.href === item.href);
      if (!shortcut) continue;
      resolved.push({
        key: `calculator-${item.href}`,
        type: "calculator",
        title: shortcut.label,
        subtitle: "Calculator",
        href: item.href,
        icon: Calculator,
        item,
      });
    } else if (item.type === "drug") {
      const list = item.system === "neodose" ? neonateDrugs : pediatricDrugs;
      const drug = list.find(d => d.id === item.id);
      if (!drug) continue;
      const base = item.system === "neodose" ? "/nicu/drugs" : "/drug-doses";
      resolved.push({
        key: `drug-${item.system}-${item.id}`,
        type: "drug",
        title: drug.name,
        subtitle: item.system === "neodose" ? "NeoDose" : "PediaDose",
        href: `${base}?drug=${encodeURIComponent(item.id)}`,
        icon: item.system === "neodose" ? Syringe : Pill,
        item,
      });
    } else if (item.type === "lab") {
      const test = labTests.find(t => t.id === item.id);
      if (!test) continue;
      resolved.push({
        key: `lab-${item.id}`,
        type: "lab",
        title: test.name,
        subtitle: test.category,
        href: `/pedialab?test=${encodeURIComponent(item.id)}`,
        icon: FlaskConical,
        item,
      });
    }
  }

  return resolved;
}
