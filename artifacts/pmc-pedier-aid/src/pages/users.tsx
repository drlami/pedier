import { useState, useEffect } from "react";
import { useAuth, getAuthToken, type UserRole } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Shield, Stethoscope, GraduationCap, Loader2, Users } from "lucide-react";

interface ManagedUser {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

const API_BASE = "/api";

const ROLE_META: Record<UserRole, { label: string; icon: typeof Shield; color: string }> = {
  admin:      { label: "Administrator", icon: Shield,       color: "bg-violet-100 text-violet-800 border-violet-200" },
  specialist: { label: "Specialist",    icon: Stethoscope,  color: "bg-blue-100 text-blue-800 border-blue-200" },
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
  const { toast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = (fd.get("username") as string).trim();
    const password = fd.get("password") as string;
    const role = fd.get("role") as UserRole;
    if (!username || !password || !role) return;
    setCreating(true);
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username, password, role }),
    });
    setCreating(false);
    if (res.ok) {
      toast({ title: "User created", description: `${username} has been added as ${role}.` });
      setDialogOpen(false);
      fetchUsers();
    } else {
      const data = await res.json();
      toast({ title: "Error", description: data.message, variant: "destructive" });
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast({ title: "Role updated" });
      fetchUsers();
    } else {
      const data = await res.json();
      toast({ title: "Error", description: data.message, variant: "destructive" });
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Remove user "${username}"? This cannot be undone.`)) return;
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok || res.status === 204) {
      toast({ title: "User removed", description: `${username} has been deleted.` });
      fetchUsers();
    } else {
      const data = await res.json();
      toast({ title: "Error", description: data.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-100 border border-violet-200 shrink-0">
            <Users className="h-4.5 w-4.5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Create accounts and manage access roles.</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-username">Username</Label>
                <Input id="new-username" name="username" placeholder="e.g. drsmith" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">Temporary Password</Label>
                <Input id="new-password" name="password" type="password" placeholder="Minimum 6 characters" required minLength={6} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger id="new-role">
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator — can edit protocols</SelectItem>
                    <SelectItem value="specialist">Specialist — read-only access</SelectItem>
                    <SelectItem value="resident">Resident — read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Username</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {u.username}
                    {u.id === currentUser?.userId && (
                      <span className="ml-2 text-[10px] text-muted-foreground font-normal">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.id === currentUser?.userId ? (
                      <RoleBadge role={u.role} />
                    ) : (
                      <Select
                        value={u.role}
                        onValueChange={(val) => handleRoleChange(u.id, val as UserRole)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-36 border-dashed">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="specialist">Specialist</SelectItem>
                          <SelectItem value="resident">Resident</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== currentUser?.userId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(u.id, u.username)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
