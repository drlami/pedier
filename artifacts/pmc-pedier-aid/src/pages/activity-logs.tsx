import { useState, useEffect } from "react";
import { getAuthToken } from "@/contexts/auth-context";
import { Activity, LogIn, Smartphone, Shield, Stethoscope, GraduationCap, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "specialist" | "resident";
type EventType = "login" | "app_open";

interface LogEntry {
  id: string;
  userId: string | null;
  username: string;
  role: string;
  event: EventType;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

const ROLE_META: Record<UserRole, { label: string; icon: typeof Shield; color: string }> = {
  admin:      { label: "Admin",      icon: Shield,        color: "bg-violet-100 text-violet-800 border-violet-200" },
  specialist: { label: "Specialist", icon: Stethoscope,   color: "bg-blue-100 text-blue-800 border-blue-200" },
  resident:   { label: "Resident",   icon: GraduationCap, color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role as UserRole] ?? { label: role, icon: Shield, color: "bg-muted text-muted-foreground border-border" };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${meta.color}`}>
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function EventBadge({ event }: { event: EventType }) {
  if (event === "login") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-800 border-amber-200">
        <LogIn className="h-3 w-3" />
        Login
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border bg-sky-50 text-sky-800 border-sky-200">
      <Smartphone className="h-3 w-3" />
      App Opened
    </span>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const token = getAuthToken();
    const res = await fetch("/api/activity-logs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setLogs(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            <Activity className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline">Activity Log</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Who has opened the app and when.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={fetchLogs} disabled={loading} className="gap-2 shrink-0">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            <Activity className="h-8 w-8 mx-auto mb-3 opacity-20" />
            No activity recorded yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Event</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{entry.username}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <RoleBadge role={entry.role} />
                  </td>
                  <td className="px-4 py-3">
                    <EventBadge event={entry.event} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-muted-foreground text-xs" title={new Date(entry.createdAt).toLocaleString()}>
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                    <span className="block text-[10px] text-muted-foreground/60 mt-0.5">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing the last 200 entries, most recent first. Login events and app-open sessions are both tracked.
      </p>
    </div>
  );
}
