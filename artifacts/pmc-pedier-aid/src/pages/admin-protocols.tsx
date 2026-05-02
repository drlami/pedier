import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { allProtocols } from "@/lib/protocols";
import { useProtocolsContext } from "@/contexts/protocols-context";
import { getAuthToken } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  Lock,
  FileText,
  Sparkles,
} from "lucide-react";

const SYSTEM_ICONS: Record<string, string> = {};

export default function ProtocolListPage() {
  const [, navigate] = useLocation();
  const { rawCustomProtocols, refetch } = useProtocolsContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openSystems, setOpenSystems] = useState<Set<string>>(new Set());

  const builtInBySystem = useMemo(() => {
    const map: Record<string, typeof allProtocols> = {};
    allProtocols
      .filter(
        (p) =>
          !searchTerm ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.system.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .forEach((p) => {
        if (!map[p.system]) map[p.system] = [];
        map[p.system].push(p);
      });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [searchTerm]);

  const filteredCustom = useMemo(() => {
    if (!searchTerm) return rawCustomProtocols;
    const lower = searchTerm.toLowerCase();
    return rawCustomProtocols.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.system.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }, [rawCustomProtocols, searchTerm]);

  const toggleSystem = (system: string) => {
    setOpenSystems((prev) => {
      const next = new Set(prev);
      if (next.has(system)) next.delete(system);
      else next.add(system);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = getAuthToken();
    setDeleting(true);
    try {
      const res = await fetch(`/api/protocols/${deleteTarget}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast({ title: "Protocol deleted", description: "The protocol has been removed." });
        await refetch();
      } else {
        toast({ variant: "destructive", title: "Delete failed", description: "Could not delete the protocol." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to connect to server." });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Protocol Management</h1>
          <p className="text-muted-foreground mt-0.5">
            <span className="font-medium text-foreground">{allProtocols.length}</span> built-in ·{" "}
            <span className="font-medium text-foreground">{rawCustomProtocols.length}</span> custom protocol{rawCustomProtocols.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/protocols/new">
            <Plus className="mr-2 h-4 w-4" />
            New Protocol
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search protocols by name or system..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Custom Protocols */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Custom Protocols</h2>
          <Badge variant="secondary" className="ml-1">{filteredCustom.length}</Badge>
        </div>

        {filteredCustom.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground font-medium">No custom protocols yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Create your first protocol using the builder or AI drafter.
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" asChild>
                <Link href="/admin/protocols/new?mode=builder">
                  <FileText className="mr-2 h-3.5 w-3.5" />
                  Protocol Builder
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/protocols/new?mode=ai">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  AI Drafter
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCustom.map((protocol) => (
              <div
                key={protocol.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{protocol.name}</span>
                    <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 font-medium">
                      Custom
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{protocol.system}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{protocol.description}</p>
                </div>
                <div className="flex items-center gap-1 ml-4 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/protocols/${protocol.id}`)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(protocol.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Built-in Protocols */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Built-in Protocols</h2>
          <Badge variant="secondary" className="ml-1">{allProtocols.length}</Badge>
          <span className="text-xs text-muted-foreground">(read-only)</span>
        </div>

        <div className="space-y-2">
          {builtInBySystem.map(([system, protocols]) => (
            <Collapsible
              key={system}
              open={openSystems.has(system)}
              onOpenChange={() => toggleSystem(system)}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-3 bg-muted/40 border border-border rounded-lg hover:bg-muted/60 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{system}</span>
                    <Badge variant="outline" className="text-[10px]">{protocols.length}</Badge>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      openSystems.has(system) ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-1 ml-4 space-y-1 border-l-2 border-border pl-3">
                  {protocols.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-sm">{p.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => navigate(`/admin/protocols/${p.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Protocol</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this protocol? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
