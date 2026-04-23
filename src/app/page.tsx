"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProtocols = useMemo(() => 
    allProtocols.filter((protocol) =>
      protocol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.system.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

  const groupedProtocols = useMemo(() =>
    filteredProtocols.reduce((acc, protocol) => {
      const system = protocol.system || "Uncategorized";
      if (!acc[system]) {
        acc[system] = [];
      }
      acc[system].push(protocol);
      return acc;
    }, {} as Record<string, DiseaseProtocol[]>), [filteredProtocols]);

    const systemOrder = ['Respiratory', 'Gastrointestinal', 'Fever & Infectious Diseases', 'Cardiovascular', 'Neurology'];
    const sortedSystems = useMemo(() => Object.keys(groupedProtocols).sort((a, b) => {
        const indexA = systemOrder.indexOf(a);
        const indexB = systemOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    }), [groupedProtocols]);

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          Pediatric ER Decision Support
        </h1>
        <p className="text-muted-foreground mt-2">
          Quick access to evidence-based pediatric emergency protocols.
        </p>
      </section>

      <div className="relative mx-auto w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search protocols by name, system, or keyword..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section>
        <Accordion type="multiple" className="w-full space-y-4" defaultValue={sortedSystems}>
          {sortedSystems.map((system) => (
            <AccordionItem value={system} key={system} className="border rounded-lg overflow-hidden bg-card">
              <AccordionTrigger className="text-xl font-headline text-primary px-6 py-4 hover:no-underline hover:bg-secondary/50">
                {system}
              </AccordionTrigger>
              <AccordionContent className="p-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(groupedProtocols[system] || []).map((protocol: DiseaseProtocol) => (
                    <Link key={protocol.id} href={`/diseases/${protocol.id}`} className="block h-full">
                      <Card className="h-full hover:shadow-md transition-shadow duration-300 flex flex-col bg-background hover:ring-2 hover:ring-primary">
                        <CardHeader>
                          <CardTitle className="font-headline text-base">{protocol.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">{protocol.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {filteredProtocols.length === 0 && searchTerm && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No protocols found for &quot;{searchTerm}&quot;.</p>
          </div>
        )}
      </section>
    </div>
  );
}
