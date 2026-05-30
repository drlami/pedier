import { HeartPulse, AlertTriangle } from "lucide-react";
import { ResuscitationCalculator } from "@/app/cardiac-arrest/resuscitation-calculator";
import { RsiCalculator } from "@/app/cardiac-arrest/rsi-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CardiacArrestPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 border border-red-200 shrink-0 mt-0.5">
          <HeartPulse className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold text-red-800 font-headline">
              Cardiac Arrest &amp; Intubation
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded flex items-center gap-1">
              <AlertTriangle className="h-2.5 w-2.5" />
              Emergency
            </span>
          </div>
          <p className="text-sm text-red-700/70">
            Pediatric weight-based resuscitation and rapid sequence intubation reference.
          </p>
        </div>
      </div>

      <Tabs defaultValue="resuscitation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resuscitation">Arrest / PALS</TabsTrigger>
          <TabsTrigger value="rsi">Airway / RSI</TabsTrigger>
        </TabsList>
        <TabsContent value="resuscitation" className="mt-6">
          <ResuscitationCalculator />
        </TabsContent>
        <TabsContent value="rsi" className="mt-6">
          <RsiCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
