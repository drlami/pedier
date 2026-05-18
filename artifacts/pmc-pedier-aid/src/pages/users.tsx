import { useAuth, type UserRole } from "@/contexts/auth-context";
import { Shield, Stethoscope, GraduationCap, Users } from "lucide-react";
import { STATIC_USERS } from "@/lib/static-users";

const ROLE_META: Record<UserRole, { label: string; icon: typeof Shield; color: string }> = {
  admin:      { label: "Administrator", icon: Shield,        color: "bg-violet-100 text-violet-800 border-violet-200" },
  specialist: { label: "Specialist",    icon: Stethoscope,   color: "bg-blue-100 text-blue-800 border-blue-200" },
  resident:   { label: "Resident",      icon: GraduationCap, color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

function RoleBadge({ role }: { role: UserRole }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${meta.color}`}>
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-100 border border-violet-200 shrink-0">
          <Users className="h-4.5 w-4.5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-headline text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Clinician accounts with access to this app.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        User accounts are configured directly in the app. To add or remove users, contact the app administrator.
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Username</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {STATIC_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">
                  {u.username}
                  {u.id === currentUser?.userId && (
                    <span className="ml-2 text-[10px] text-muted-foreground font-normal">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
        <Shield className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Role permissions:</strong> Administrators can edit protocols and manage users.
          Specialists and Residents have read-only access to all clinical content and AI tools.
        </span>
      </div>
    </div>
  );
}
