import { ResuscitationCalculator } from "./resuscitation-calculator";
import { HeartPulse } from "lucide-react";

export default function CardiacArrestPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
       <div className="text-center mb-8 flex flex-col items-center">
         <HeartPulse className="h-16 w-16 text-destructive mb-2" />
         <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-destructive">
            Cardiac Arrest
         </h1>
         <p className="text-muted-foreground mt-2 text-lg">
            Pediatric Emergency Resuscitation Calculator
         </p>
       </div>
      <ResuscitationCalculator />
    </div>
  );
}
