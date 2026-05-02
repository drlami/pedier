import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ResultCardVariant = "default" | "management" | "disposition" | "danger" | "drug" | "info";

interface ResultCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: ResultCardVariant;
}

const variantStyles: Record<ResultCardVariant, { border: string; icon: string; header: string }> = {
  default:     { border: "border-l-4 border-l-primary/40",       icon: "text-primary",        header: "text-primary" },
  management:  { border: "border-l-4 border-l-primary",          icon: "text-primary",        header: "text-primary" },
  disposition: { border: "border-l-4 border-l-emerald-500",      icon: "text-emerald-600",    header: "text-emerald-700" },
  danger:      { border: "border-l-4 border-l-destructive",      icon: "text-destructive",    header: "text-destructive" },
  drug:        { border: "border-l-4 border-l-violet-500",       icon: "text-violet-600",     header: "text-violet-700" },
  info:        { border: "border-l-4 border-l-slate-400",        icon: "text-slate-500",      header: "text-slate-700" },
};

export function ResultCard({ title, icon: Icon, children, className, variant = "default" }: ResultCardProps) {
  const styles = variantStyles[variant];
  return (
    <Card className={cn("shadow-sm print-no-break-inside print-shadow-none print-border", styles.border, className)}>
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-wide", styles.header)}>
          {Icon && <Icon className={cn("h-4 w-4 shrink-0", styles.icon)} />}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm px-4 pb-4">
        {children}
      </CardContent>
    </Card>
  );
}
