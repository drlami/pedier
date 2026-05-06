import { AlertCircle, Wrench } from "lucide-react";

export default function CalculatorsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
        <Wrench className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold font-headline mb-3">Calculators</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        This section is under construction and will contain clinical calculators soon.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-md mx-auto">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>Check back soon.</span>
      </div>
    </div>
  );
}
