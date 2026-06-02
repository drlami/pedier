import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ResultCardVariant = "default" | "management" | "decision" | "danger" | "drug" | "info";

interface ResultCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: ResultCardVariant;
}

const variantStyles: Record<ResultCardVariant, { card: string; icon: string; header: string; iconBg: string }> = {
  default:    { card: "border-slate-100 bg-card", icon: "text-primary",   header: "text-slate-900", iconBg: "bg-primary/10" },
  management: { card: "border-blue-100 bg-card",  icon: "text-blue-600",  header: "text-blue-900",  iconBg: "bg-blue-50" },
  decision:   { card: "border-emerald-100 bg-emerald-50/20", icon: "text-emerald-600", header: "text-emerald-900", iconBg: "bg-emerald-100/50" },
  danger:     { card: "border-red-200 bg-red-50/20", icon: "text-red-600",   header: "text-red-900",   iconBg: "bg-red-100" },
  drug:       { card: "border-violet-100 bg-card", icon: "text-violet-600", header: "text-violet-900", iconBg: "bg-violet-50" },
  info:       { card: "border-slate-100 bg-card", icon: "text-slate-600", header: "text-slate-900", iconBg: "bg-slate-100" },
};

export function ResultCard({ title, icon: Icon, children, className, variant = "default" }: ResultCardProps) {
  const styles = variantStyles[variant];
  return (
    <Card className={cn("rounded-[28px] border-2 shadow-sm transition-all hover:shadow-md print-no-break-inside print-shadow-none print-border", styles.card, className)}>
      <CardHeader className="pb-3 pt-4 px-6 border-b border-inherit bg-muted/20">
        <CardTitle className={cn("flex items-center gap-3 text-sm font-black uppercase tracking-widest", styles.header)}>
          {Icon && (
            <div className={cn("p-1.5 rounded-lg shrink-0", styles.iconBg)}>
              <Icon className={cn("h-4 w-4 shrink-0", styles.icon)} />
            </div>
          )}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm px-6 py-6">
        {children}
      </CardContent>
    </Card>
  );
}
