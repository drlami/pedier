import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import { Search, ChevronRight } from "lucide-react";
import { useAllProtocols } from "@/contexts/protocols-context";

function ProtocolCard({
  protocol,
  onClick,
}: {
  protocol: DiseaseProtocol;
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/diseases/${protocol.id}`}
      className="block group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-150 group min-h-[56px]">
        <div className="flex items-center gap-3">
          <span className="w-1 h-8 rounded-full bg-primary/30 group-hover:bg-primary transition-colors shrink-0" />
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {protocol.name}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 shrink-0 transition-colors" />
      </div>
    </Link>
  );
}

function SystemProtocols({
  system,
  allProtocols,
  onProtocolClick,
}: {
  system: string;
  allProtocols: DiseaseProtocol[];
  onProtocolClick?: () => void;
}) {
  const protocolsForSystem = useMemo(() => {
    return allProtocols
      .filter((p) => p.system === system)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [system, allProtocols]);

  if (protocolsForSystem.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-2xl font-bold font-headline text-foreground">{system}</h1>
          </div>
        </section>
        <section>
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-muted/20">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-lg font-bold font-headline text-foreground mb-1">Under Construction</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Protocols for <strong>{system}</strong> are coming soon. Check back later.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-2xl font-bold font-headline text-foreground">
            {system}
          </h1>
          <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {protocolsForSystem.length} protocol{protocolsForSystem.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a protocol to begin clinical assessment.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {protocolsForSystem.map((protocol) => (
            <ProtocolCard
              key={protocol.id}
              protocol={protocol}
              onClick={onProtocolClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const search = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const allProtocols = useAllProtocols();

  useEffect(() => {
    setSearchTerm("");
  }, [search]);

  const handleProtocolClick = () => {
    setSearchTerm("");
  };

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, [allProtocols]);

  const params = new URLSearchParams(search);
  const selectedSystem =
    params.get("system") || (systems.length > 0 ? systems[0] : "");

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return allProtocols
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lowercasedTerm) ||
          p.description.toLowerCase().includes(lowercasedTerm) ||
          p.system.toLowerCase().includes(lowercasedTerm)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, allProtocols]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <section className="w-full">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all protocols by name, keyword, or system..."
            className="w-full pl-10 py-2.5 text-sm rounded-lg bg-card border-border shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {searchTerm ? (
        <section>
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="text-xl font-bold font-headline">
              Search Results
            </h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchTerm}&quot;
            </span>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {searchResults.map((protocol) => (
                <ProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  onClick={handleProtocolClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No protocols found for your search.</p>
            </div>
          )}
        </section>
      ) : (
        <SystemProtocols
          system={selectedSystem}
          allProtocols={allProtocols}
          onProtocolClick={handleProtocolClick}
        />
      )}
    </div>
  );
}
