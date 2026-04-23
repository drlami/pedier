import { AlertCircle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <footer className="bg-yellow-100 border-t border-yellow-200 text-yellow-800 p-3 text-center text-xs no-print">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>
          Clinical support tool only. Final judgment remains with treating
          physician.
        </span>
      </div>
    </footer>
  );
}
