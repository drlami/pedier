import { Activity } from "lucide-react";

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <Activity className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-headline">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Who has opened the app and when.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          <Activity className="h-10 w-10 text-muted-foreground/20" />
          <div>
            <p className="font-medium text-foreground">Activity logging is not available</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              This app is running without a database. Activity logs are not recorded in this configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
