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
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  FileText,
  Sparkles,
  Copy,
  EyeOff,
  Eye,
  RotateCcw,
} from "lucide-react";

export default function ProtocolListPage() {
  const [, navigate] = useLocation();
  const { rawCustomProtocols, hiddenBuiltInIds, refetch, deleteProtocol, hideBuiltIn, unhideBuiltIn } =
    useProtocolsContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [hideTarget, setHideTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [openSystems, setOpenSystems] = useState<Set<string>>(new Set());

  const builtInBySystem = useMemo(() => {
    const map: Record<string, typeof allProtocols> = {};
    allProtocols
      .filter(
        (p) =>
          !hiddenBuiltInIds.has(p.id) &&
          (!searchTerm ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.system.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .forEach((p) => {
        if (!map[p.system]) map[p.system] = [];
        map[p.system].push(p);
      });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [searchTerm, hiddenBuiltInIds]);

  const hiddenBuiltIns = useMemo(
    () => allProtocols.filter((p) => hiddenBuiltInIds.has(p.id)),
    [hiddenBuiltInIds]
  );

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

  const handleDeleteCustom = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      deleteProtocol(deleteTarget.id);
      toast({ title: "Protocol deleted", description: `"${deleteTarget.name}" has been removed.` });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete protocol." });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleHideBuiltIn = async () => {
    if (!hideTarget) return;
    setHiding(true);
    try {
      await hideBuiltIn(hideTarget.id);
      toast({ title: "Protocol hidden", description: `"${hideTarget.name}" is now hidden. You can restore it anytime.` });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to hide protocol." });
    } finally {
      setHiding(false);
      setHideTarget(null);
    }
  };

  const handleRestoreBuiltIn = async (id: string, name: string) => {
    await unhideBuiltIn(id);
    toast({ title: "Protocol restored", description: `"${name}" is visible again.` });
  };

  const visibleBuiltInCount = allProtocols.length - hiddenBuiltInIds.size;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Protocol Management</h1>
          <p className="text-muted-foreground mt-0.5">
            <span className="font-medium text-foreground">{visibleBuiltInCount}</span> built-in ·{" "}
            <span className="font-medium text-foreground">{rawCustomProtocols.length}</span> custom
            {hiddenBuiltInIds.size > 0 && (
              <span className="text-muted-foreground/70"> · {hiddenBuiltInIds.size} hidden</span>
            )}
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
              Create your first protocol using the builder or AI drafter, or clone a built-in protocol below.
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
                    onClick={() => setDeleteTarget({ id: protocol.id, name: protocol.name })}
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
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Built-in Protocols</h2>
          <Badge variant="secondary" className="ml-1">{visibleBuiltInCount}</Badge>
          <span className="text-xs text-muted-foreground">— clone to edit, or hide to remove from view</span>
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
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => navigate(`/admin/protocols/new?clone=${p.id}`)}
                          title="Clone this protocol and open in builder to customise"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Clone & Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setHideTarget({ id: p.id, name: p.name })}
                          title="Hide this protocol from the clinical interface"
                        >
                          <EyeOff className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Hidden Protocols */}
      {hiddenBuiltIns.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-muted-foreground/60" />
            <h2 className="text-base font-semibold text-muted-foreground">Hidden Protocols</h2>
            <Badge variant="outline" className="ml-1 text-[10px]">{hiddenBuiltIns.length}</Badge>
          </div>
          <div className="space-y-2">
            {hiddenBuiltIns.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-muted/20 border border-dashed border-border rounded-lg"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">{p.name}</span>
                    <Badge variant="outline" className="text-[10px] opacity-60">{p.system}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Hidden from clinical interface</p>
                </div>
                <div className="flex gap-1 ml-4 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => navigate(`/admin/protocols/new?clone=${p.id}`)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleRestoreBuiltIn(p.id, p.name)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete custom confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Protocol</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustom}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hide built-in confirmation */}
      <AlertDialog open={!!hideTarget} onOpenChange={(open) => !open && setHideTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide Protocol</AlertDialogTitle>
            <AlertDialogDescription>
              Hide <strong>"{hideTarget?.name}"</strong> from the clinical interface? It won't be visible to users but can be restored anytime from this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleHideBuiltIn} disabled={hiding}>
              {hiding ? "Hiding..." : "Hide Protocol"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
