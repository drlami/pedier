import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth, getAuthToken } from "@/contexts/auth-context";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import { allProtocols, mergeProtocolsWithOverrides } from "@/lib/protocols";
import { adaptCustomProtocol } from "@/lib/custom-protocol-engine";
import type { CustomProtocol } from "@/lib/custom-protocol-types";

interface ProtocolsContextValue {
  rawCustomProtocols: CustomProtocol[];
  customProtocols: DiseaseProtocol[];
  allProtocolsMerged: DiseaseProtocol[];
  hiddenBuiltInIds: Set<string>;
  isLoading: boolean;
  refetch: () => Promise<void>;
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
  hideBuiltIn: async () => {},
  unhideBuiltIn: async () => {},
});

export function ProtocolsProvider({ children }: { children: ReactNode }) {
  const [rawCustomProtocols, setRawCustomProtocols] = useState<CustomProtocol[]>([]);
  const [hiddenBuiltInIds, setHiddenBuiltInIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const token = getAuthToken();
    if (!token) return;
    setIsLoading(true);
    try {
      const [customRes, hiddenRes] = await Promise.all([
        fetch("/api/protocols", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/hidden-protocols", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (customRes.ok) {
        const data: CustomProtocol[] = await customRes.json();
        setRawCustomProtocols(data);
      }
      if (hiddenRes.ok) {
        const ids: string[] = await hiddenRes.json();
        setHiddenBuiltInIds(new Set(ids));
      }
    } catch {
      // silent — built-in protocols still work
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const customProtocols = useMemo(
    () => rawCustomProtocols.map(adaptCustomProtocol),
    [rawCustomProtocols]
  );

  // Custom protocols with same ID override built-ins; hidden built-ins are removed
  const allProtocolsMerged = useMemo(() => {
    const customIds = new Set(customProtocols.map((p) => p.id));
    const visibleBuiltIns = allProtocols.filter(
      (p) => !customIds.has(p.id) && !hiddenBuiltInIds.has(p.id)
    );
    return [...visibleBuiltIns, ...customProtocols];
  }, [customProtocols, hiddenBuiltInIds]);

  const hideBuiltIn = useCallback(
    async (id: string) => {
      const token = getAuthToken();
      try {
        const res = await fetch("/api/hidden-protocols", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setHiddenBuiltInIds((prev) => new Set([...prev, id]));
        }
      } catch {}
    },
    []
  );

  const unhideBuiltIn = useCallback(
    async (id: string) => {
      const token = getAuthToken();
      try {
        const res = await fetch(`/api/hidden-protocols/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setHiddenBuiltInIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      } catch {}
    },
    []
  );

  return (
    <ProtocolsContext.Provider
      value={{
        rawCustomProtocols,
        customProtocols,
        allProtocolsMerged,
        hiddenBuiltInIds,
        isLoading,
        refetch: fetchAll,
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
