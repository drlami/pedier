import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ClipboardList, Bot, Plus, Activity } from "lucide-react";
import { useProtocolsContext } from "@/contexts/protocols-context";
import { allProtocols } from "@/lib/protocols";

export default function AdminPage() {
  const { rawCustomProtocols } = useProtocolsContext();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage protocols, users, and clinical content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">Protocol Management</CardTitle>
                <CardDescription>
                  {allProtocols.length} built-in · {rawCustomProtocols.length} custom
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              View all protocols, create new ones using the form builder or AI assistant, and manage custom protocols.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/admin/protocols">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Protocols
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/protocols/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Protocol
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 border border-blue-200">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="font-headline">AI Protocol Drafter</CardTitle>
                <CardDescription>Generate protocols from text</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Describe a protocol or paste guideline text, and the AI will generate a structured protocol draft you can review, edit, and save.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/protocols/new?mode=ai">
                <Bot className="mr-2 h-4 w-4" />
                Open AI Drafter
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-50 border border-violet-200">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="font-headline">User Management</CardTitle>
                <CardDescription>Manage clinician accounts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add new users, assign roles (admin, specialist, resident), and manage access to the clinical decision support system.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="font-headline">Activity Log</CardTitle>
                <CardDescription>Track who has opened the app</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              View a chronological log of all user logins and app sessions — useful for monitoring usage across your clinical team.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/activity-logs">
                <Activity className="mr-2 h-4 w-4" />
                View Activity
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
