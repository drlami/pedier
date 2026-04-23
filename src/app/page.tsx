"use client";

import { useState, useMemo, Suspense } from "react";
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

function ProtocolGrid() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const systems = useMemo(() => {
    const systemSet = new Set(allProtocols.map((p) => p.system));
    return Array.from(systemSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const selectedSystem = searchParams.get("system") || (systems.length > 0 ? systems[0] : "");

  const filteredProtocols = useMemo(() => {
    return allProtocols
      .filter((p) => p.system === selectedSystem)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSystem, searchTerm]);

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          {selectedSystem}
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a protocol to begin assessment.
        </p>
      </section>

      <div className="relative mx-auto w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search protocols in this category..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProtocols.map((protocol: DiseaseProtocol) => {
            return (
            <Link
              key={protocol.id}
              href={`/diseases/${protocol.id}`}
              className="block h-full group"
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
          )})}
        </div>
        {filteredProtocols.length === 0 && searchTerm && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No protocols found for &quot;{searchTerm}&quot; in {selectedSystem}.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}


export default function Home() {
    return (
        <Suspense fallback={<p>Loading categories...</p>}>
            <ProtocolGrid />
        </Suspense>
    );
}
