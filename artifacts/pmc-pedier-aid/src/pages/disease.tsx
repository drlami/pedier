import { useParams } from "wouter";
import { useProtocolById, useProtocolsContext } from "@/contexts/protocols-context";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { AssessmentForm } from "@/app/diseases/[diseaseId]/assessment-form";
import { WardMMPView } from "@/app/diseases/[diseaseId]/ward-mmp-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stethoscope, Loader2, BookOpen, Activity, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { HFOVProtocol } from "@/app/hfov/hfov-protocol";

import { MechVentProtocol } from "@/app/mech-vent/mech-vent-protocol";

import { ARDSProtocol } from "@/app/ards/ards-protocol";

import { NIVProtocol } from "@/app/niv/niv-protocol";

import { VentTroubleshootingProtocol } from "@/app/vent-troubleshooting/vent-troubleshooting-protocol";

import { PicuGlossaryPanel } from "@/components/picu-glossary-panel";

export default function DiseasePage() {
  const params = useParams<{ diseaseId: string }>();
  const { isLoading } = useProtocolsContext();
  const { togglePin, isPinned } = usePinnedItems();
  const protocol = useProtocolById(params.diseaseId);

  if (isLoading && !protocol) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Protocol not found</h1>
        <p className="text-muted-foreground mt-2">The requested protocol does not exist.</p>
      </div>
    );
  }

  const isWard = protocol.unit === 'ward';
  // Any protocol carrying a Master Management Pathway renders the rich staged view,
  // regardless of unit (used by Ward and now PICU management protocols).
  const useMMPView = !!protocol.mmpData;
  const pinned = isPinned({ type: 'protocol', id: protocol.id });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 pb-5 border-b border-border">
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-2xl border shrink-0 mt-0.5 shadow-md",
          isWard ? "bg-slate-900 border-slate-800 text-blue-400" : "bg-primary/10 border-primary/20 text-primary"
        )}>
          {isWard ? <Activity className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black font-headline text-foreground leading-none tracking-tighter">
              {protocol.name}
            </h1>
            {isWard && (
              <Badge className="bg-blue-600 text-white border-none font-black text-[10px] tracking-[0.2em] px-2 py-0.5 rounded-md">
                PATHWAY
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-semibold max-w-3xl leading-relaxed">
            {protocol.description}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "rounded-xl transition-all duration-300 shrink-0",
              pinned ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100" : "text-muted-foreground"
            )}
            onClick={() => togglePin({ type: 'protocol', id: protocol.id })}
          >
            <Star className={cn("h-5 w-5", pinned && "fill-current")} />
          </Button>

          <div className="flex flex-col items-end gap-1 shrink-0 hidden lg:flex">
            <span className={cn(
              "text-[10px] font-black px-3 py-1.5 rounded-xl tracking-widest uppercase border shadow-sm",
              isWard ? "text-blue-400 bg-slate-900 border-slate-800" : "text-primary/70 bg-primary/8 border-primary/15"
            )}>
              {protocol.system}
            </span>
          </div>
        </div>
      </div>

      {protocol.id === 'iron-toxicity' && (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertTitle className="font-bold text-sm">Pediatric Toxic Dose Reference</AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <div>&lt;20 mg/kg → non-toxic</div>
            <div>20–40 mg/kg → mild toxicity possible</div>
            <div>≥40 mg/kg → toxic ingestion</div>
            <div>≥60 mg/kg → severe toxicity risk</div>
            <div>&gt;120 mg/kg → potentially lethal</div>
          </AlertDescription>
        </Alert>
      )}

      {protocol.id === 'picu-hfov' ? (
        <HFOVProtocol />
      ) : protocol.id === 'picu-mech-ventilation' ? (
        <MechVentProtocol />
      ) : protocol.id === 'picu-ards' ? (
        <ARDSProtocol />
      ) : protocol.id === 'picu-niv' ? (
        <NIVProtocol />
      ) : protocol.id === 'picu-vent-troubleshooting' ? (
        <VentTroubleshootingProtocol />
      ) : (isWard || useMMPView) ? (
        <WardMMPView protocol={protocol} />
      ) : (
        <AssessmentForm diseaseId={params.diseaseId} />
      )}

      {protocol.unit === 'picu' && <PicuGlossaryPanel protocol={protocol} />}
    </div>
  );
}
