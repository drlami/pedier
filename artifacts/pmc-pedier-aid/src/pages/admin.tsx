import { ProtocolDrafter } from "@/app/admin/protocol-drafter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">
                Admin-Assisted Protocol Drafting
              </CardTitle>
              <CardDescription>
                Paste medical guidelines below to generate a structured JSON
                protocol draft using AI.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProtocolDrafter />
        </CardContent>
      </Card>
    </div>
  );
}
