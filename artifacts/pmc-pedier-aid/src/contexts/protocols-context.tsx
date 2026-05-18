import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import { allProtocols, mergeProtocolsWithOverrides } from "@/lib/protocols";
import { adaptCustomProtocol } from "@/lib/custom-protocol-engine";
import type { CustomProtocol } from "@/lib/custom-protocol-types";

const PROTOCOLS_KEY = "pmc-custom-protocols-v1";
const HIDDEN_KEY = "pmc-hidden-protocols-v1";

function loadCustomProtocols(): CustomProtocol[] {
  try {
    const raw = localStorage.getItem(PROTOCOLS_KEY);
    return raw ? (JSON.parse(raw) as CustomProtocol[]) : [];
  } catch {
    return [];
  }
}

function loadHiddenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

interface ProtocolsContextValue {
  rawCustomProtocols: CustomProtocol[];
  customProtocols: DiseaseProtocol[];
  allProtocolsMerged: DiseaseProtocol[];
  hiddenBuiltInIds: Set<string>;
  isLoading: boolean;
  refetch: () => Promise<void>;
  saveProtocol: (protocol: CustomProtocol) => void;
  deleteProtocol: (id: string) => void;
  hideBuiltIn: (id: string) => Promise<void>;
  unhideBuiltIn: (id: string) => Promise<void>;
}

const ProtocolsContext = createContext<ProtocolsContextValue>({
  rawCustomProtocols: [],
  customProtocols: [],
  allProtocolsMerged: allProtocols,
  hiddenBuiltInIds: new Set(),
  isLoading: false,
  refetch: async () => {},
  saveProtocol: () => {},
  deleteProtocol: () => {},
  hideBuiltIn: async () => {},
  unhideBuiltIn: async () => {},
});

export function ProtocolsProvider({ children }: { children: ReactNode }) {
  const [rawCustomProtocols, setRawCustomProtocols] = useState<CustomProtocol[]>([]);
  const [hiddenBuiltInIds, setHiddenBuiltInIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRawCustomProtocols(loadCustomProtocols());
    setHiddenBuiltInIds(loadHiddenIds());
  }, []);

  const refetch = useCallback(async () => {
    setRawCustomProtocols(loadCustomProtocols());
    setHiddenBuiltInIds(loadHiddenIds());
  }, []);

  const saveProtocol = useCallback((protocol: CustomProtocol) => {
    setRawCustomProtocols((prev) => {
      const idx = prev.findIndex((p) => p.id === protocol.id);
      const next = idx >= 0
        ? prev.map((p, i) => (i === idx ? protocol : p))
        : [...prev, protocol];
      localStorage.setItem(PROTOCOLS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteProtocol = useCallback((id: string) => {
    setRawCustomProtocols((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(PROTOCOLS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const hideBuiltIn = useCallback(async (id: string) => {
    setHiddenBuiltInIds((prev) => {
      const next = new Set([...prev, id]);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const unhideBuiltIn = useCallback(async (id: string) => {
    setHiddenBuiltInIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const customProtocols = useMemo(
    () => rawCustomProtocols.map(adaptCustomProtocol),
    [rawCustomProtocols],
  );

  const allProtocolsMerged = useMemo(() => {
    const customIds = new Set(customProtocols.map((p) => p.id));
    const visibleBuiltIns = allProtocols.filter(
      (p) => !customIds.has(p.id) && !hiddenBuiltInIds.has(p.id),
    );
    return [...visibleBuiltIns, ...customProtocols];
  }, [customProtocols, hiddenBuiltInIds]);

  return (
    <ProtocolsContext.Provider
      value={{
        rawCustomProtocols,
        customProtocols,
        allProtocolsMerged,
        hiddenBuiltInIds,
        isLoading,
        refetch,
        saveProtocol,
        deleteProtocol,
        hideBuiltIn,
        unhideBuiltIn,
      }}
    >
      {children}
    </ProtocolsContext.Provider>
  );
}

export function useProtocolsContext() {
  return useContext(ProtocolsContext);
}

export function useAllProtocols(): DiseaseProtocol[] {
  return useContext(ProtocolsContext).allProtocolsMerged;
}

export function useProtocolById(id: string): DiseaseProtocol | undefined {
  const all = useContext(ProtocolsContext).allProtocolsMerged;
  return useMemo(() => all.find((p) => p.id === id), [all, id]);
}
