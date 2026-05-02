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
import { allProtocols } from "@/lib/protocols";
import { adaptCustomProtocol } from "@/lib/custom-protocol-engine";
import type { CustomProtocol } from "@/lib/custom-protocol-types";

interface ProtocolsContextValue {
  rawCustomProtocols: CustomProtocol[];
  customProtocols: DiseaseProtocol[];
  allProtocolsMerged: DiseaseProtocol[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const ProtocolsContext = createContext<ProtocolsContextValue>({
  rawCustomProtocols: [],
  customProtocols: [],
  allProtocolsMerged: allProtocols,
  isLoading: false,
  refetch: async () => {},
});

export function ProtocolsProvider({ children }: { children: ReactNode }) {
  const [rawCustomProtocols, setRawCustomProtocols] = useState<CustomProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchCustomProtocols = useCallback(async () => {
    if (!user) return;
    const token = getAuthToken();
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/protocols", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: CustomProtocol[] = await res.json();
        setRawCustomProtocols(data);
      }
    } catch {
      // silent fail — built-in protocols still work
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCustomProtocols();
  }, [fetchCustomProtocols]);

  const customProtocols = useMemo(
    () => rawCustomProtocols.map(adaptCustomProtocol),
    [rawCustomProtocols]
  );

  const allProtocolsMerged = useMemo(
    () => [...allProtocols, ...customProtocols],
    [customProtocols]
  );

  return (
    <ProtocolsContext.Provider
      value={{
        rawCustomProtocols,
        customProtocols,
        allProtocolsMerged,
        isLoading,
        refetch: fetchCustomProtocols,
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
