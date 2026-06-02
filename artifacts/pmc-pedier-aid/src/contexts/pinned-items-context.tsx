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
  | { type: "calculator"; href: string };

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
      const alreadyPinned = prev.some(p => {
        if (p.type !== item.type) return false;
        if (p.type === "protocol" && item.type === "protocol") return p.id === item.id;
        if (p.type === "calculator" && item.type === "calculator") return p.href === item.href;
        return false;
      });
      
      const next = alreadyPinned 
        ? prev.filter(p => {
            if (p.type !== item.type) return true;
            if (p.type === "protocol" && item.type === "protocol") return p.id !== item.id;
            if (p.type === "calculator" && item.type === "calculator") return p.href !== item.href;
            return true;
          })
        : [item, ...prev];
        
      localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isPinned = useCallback((item: PinnedItem) => {
    return pinnedItems.some(p => {
      if (p.type !== item.type) return false;
      if (p.type === "protocol" && item.type === "protocol") return p.id === item.id;
      if (p.type === "calculator" && item.type === "calculator") return p.href === item.href;
      return false;
    });
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
