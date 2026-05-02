import { cn } from "@/lib/utils";
import type { SeverityLevel } from "@/lib/protocols/types";
import { Badge } from "@/components/ui/badge";

interface SeverityBadgeProps {
  level: SeverityLevel;
  className?: string;
}

const severityStyles: Record<SeverityLevel, string> = {
  no: "bg-green-100 text-green-800 border-green-200",
  mild: "bg-blue-100 text-blue-800 border-blue-200",
  some: "bg-yellow-100 text-yellow-800 border-yellow-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  severe: "bg-red-100 text-red-800 border-red-200",
  "impending respiratory failure": "bg-purple-100 text-purple-800 border-purple-200 animate-pulse",
  unknown: "bg-gray-100 text-gray-800 border-gray-200",
};

export function SeverityBadge({ level, className }: SeverityBadgeProps) {
  return (
    <Badge
      className={cn(
        "capitalize text-sm px-3 py-1",
        severityStyles[level] || severityStyles.unknown,
        className
      )}
    >
      {level}
    </Badge>
  );
}
