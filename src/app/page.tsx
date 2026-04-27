"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { allProtocols } from "@/lib/protocols";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import { Search } from "lucide-react";

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
      className="block h-full group"
      onClick={onClick}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card hover:ring-2 hover:ring-primary">
        <CardHeader className="p-4">
          <CardTitle className="font-headline text-lg">
            {protocol.name}
          </CardTitle>
          <CardDescription className="text-sm mt-1 line-clamp-3">
            {protocol.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

function SystemProtocols({
  system,
  onProtocolClick,
}: {
  system: string;
  onProtocolClick?: () => void;
}) {
  const protocolsForSystem = useMemo(() => {
    return allProtocols
      .filter((p) => p.system === system)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [system]);

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          {system}
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a protocol to begin assessment.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

function PageContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm("");
  }, [searchParams]);

  const handleProtocolClick = () => {
    setSearchTerm("");
  };

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const selectedSystem =
    searchParams.get("system") || (systems.length > 0 ? systems[0] : "");

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
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-8">
      <section className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all protocols by name, keyword, or system..."
            className="w-full pl-12 py-3 text-base rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {searchTerm ? (
        <section>
          <h2 className="text-2xl font-bold font-headline mb-4">
            Search Results for &quot;{searchTerm}&quot;
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((protocol) => (
                <ProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  onClick={handleProtocolClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No protocols found for your search.</p>
            </div>
          )}
        </section>
      ) : (
        <SystemProtocols
          system={selectedSystem}
          onProtocolClick={handleProtocolClick}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p>Loading categories...</p>}>
      <PageContent />
    </Suspense>
  );
}