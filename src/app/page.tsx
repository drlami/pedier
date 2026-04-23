"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { allProtocols } from "@/lib/protocols";
import type { DiseaseProtocol } from "@/lib/protocols/types";
import { Search } from "lucide-react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProtocols = allProtocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder="Search for a disease protocol..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProtocols.map((protocol: DiseaseProtocol) => (
            <Link key={protocol.id} href={`/diseases/${protocol.id}`} legacyBehavior>
              <a className="block h-full">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{protocol.name}</CardTitle>
                    <CardDescription>{protocol.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="aspect-w-16 aspect-h-9 mt-4 overflow-hidden rounded-md">
                       <Image
                        src={protocol.image.url}
                        alt={protocol.name}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={protocol.image.hint}
                      />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
        {filteredProtocols.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No protocols found for &quot;{searchTerm}&quot;.</p>
          </div>
        )}
      </section>
    </div>
  );
}
