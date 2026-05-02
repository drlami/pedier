import { HeartPulse } from "lucide-react";
import { ResuscitationCalculator } from "@/app/cardiac-arrest/resuscitation-calculator";
import { RsiCalculator } from "@/app/cardiac-arrest/rsi-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CardiacArrestPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8 flex flex-col items-center">
        <HeartPulse className="h-16 w-16 text-destructive mb-2" />
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-destructive">
          Cardiac Arrest & Intubation
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Pediatric Emergency Reference
        </p>
      </div>
      <Tabs defaultValue="resuscitation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resuscitation">Resuscitation</TabsTrigger>
          <TabsTrigger value="rsi">Rapid Sequence Intubation</TabsTrigger>
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
