import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const PINNED_ITEMS_KEY = "pmc-pinned-items-v2";

export type PinnedItem =
  | { type: "protocol"; id: string }
  | { type: "calculator"; href: string }
  | { type: "drug"; system: "neodose" | "pediadose"; id: string }
  | { type: "lab"; id: string };

function samePinnedItem(a: PinnedItem, b: PinnedItem): boolean {
  if (a.type !== b.type) return false;
  switch (a.type) {
    case "protocol": return b.type === "protocol" && a.id === b.id;
    case "calculator": return b.type === "calculator" && a.href === b.href;
    case "drug": return b.type === "drug" && a.system === b.system && a.id === b.id;
    case "lab": return b.type === "lab" && a.id === b.id;
  }
}

interface PinnedItemsContextValue {
  pinnedItems: PinnedItem[];
  togglePin: (item: PinnedItem) => void;
  isPinned: (item: PinnedItem) => boolean;
}

const PinnedItemsContext = createContext<PinnedItemsContextValue | undefined>(undefined);

export function PinnedItemsProvider({ children }: { children: ReactNode }) {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PINNED_ITEMS_KEY);
      if (raw) {
        setPinnedItems(JSON.parse(raw));
      } else {
        // Migration from v1
        const old = localStorage.getItem("pmc-pinned-protocols-v1");
        if (old) {
          const ids = JSON.parse(old) as string[];
          const migrated: PinnedItem[] = ids.map(id => ({ type: "protocol", id }));
          setPinnedItems(migrated);
          localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(migrated));
        }
      }
    } catch {
      setPinnedItems([]);
    }
  }, []);

  const togglePin = useCallback((item: PinnedItem) => {
    setPinnedItems((prev) => {
      const alreadyPinned = prev.some(p => samePinnedItem(p, item));
      const next = alreadyPinned
        ? prev.filter(p => !samePinnedItem(p, item))
        : [item, ...prev];

      localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isPinned = useCallback((item: PinnedItem) => {
    return pinnedItems.some(p => samePinnedItem(p, item));
  }, [pinnedItems]);

  return (
    <PinnedItemsContext.Provider value={{ pinnedItems, togglePin, isPinned }}>
      {children}
    </PinnedItemsContext.Provider>
  );
}

export function usePinnedItems() {
  const context = useContext(PinnedItemsContext);
  if (context === undefined) {
    throw new Error("usePinnedItems must be used within a PinnedItemsProvider");
  }
  return context;
}
