import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DoseBillboardProps {
  label: string;
  value: string | number;
  unit: string;
  subtitle?: string;
  color?: "red" | "amber" | "blue" | "green";
  className?: string;
}

export function DoseBillboard({
  label,
  value,
  unit,
  subtitle,
  color = "red",
  className,
}: DoseBillboardProps) {
  const colorClasses = {
    red: "border-red-500 bg-red-50 text-red-900",
    amber: "border-amber-500 bg-amber-50 text-amber-900",
    blue: "border-blue-500 bg-blue-50 text-blue-900",
    green: "border-green-500 bg-green-50 text-green-900",
  };

  const accentClasses = {
    red: "text-red-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <Card className={cn("border-2 shadow-sm", colorClasses[color], className)}>
      <CardContent className="p-4 flex flex-col items-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums">
            {value}
          </span>
          <span className="text-lg font-bold opacity-80">{unit}</span>
        </div>
        {subtitle && (
          <span className={cn("text-xs font-semibold mt-1", accentClasses[color])}>
            {subtitle}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
