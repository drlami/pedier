import { Link } from "wouter";
import { useMemo } from "react";
import { allProtocols } from "@/lib/protocols";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

export default function ProtocolListPage() {
  const systems = useMemo(() => {
    const systemMap: { [key: string]: typeof allProtocols } = {};
    allProtocols.forEach((protocol) => {
      if (!systemMap[protocol.system]) {
        systemMap[protocol.system] = [];
      }
      systemMap[protocol.system].push(protocol);
    });
    return Object.entries(systemMap).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Protocols</h1>
          <p className="text-muted-foreground">
            Create, edit, or delete clinical protocols.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/protocols/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Protocol
          </Link>
        </Button>
      </div>

      {systems.map(([system, protocols]) => (
        <Card key={system}>
          <CardHeader>
            <CardTitle>{system}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{protocol.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {protocol.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/protocols/${protocol.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
