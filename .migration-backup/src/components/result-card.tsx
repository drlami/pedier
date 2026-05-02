import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ResultCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ResultCard({ title, icon: Icon, children, className }: ResultCardProps) {
  return (
    <Card className={cn("print-no-break-inside print-shadow-none print-border", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-headline text-primary">
          {Icon && <Icon className="h-5 w-5" />}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {children}
      </CardContent>
    </Card>
  );
}
