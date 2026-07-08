import {
  Search,
  Info,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  LevelGuidance,
  LevelTable,
  DoseAdjustmentTable,
} from "@/lib/nicu/neodose-database";

type RowSeverity = "ok" | "adjust" | "critical";

function getRowSeverity(label: string, action: string): RowSeverity {
  const text = `${label} ${action}`.toLowerCase();
  if (text.includes("withhold") && !text.includes("not withhold")) return "critical";
  if (text.includes("no adjustment") || text.includes("within goal") || text.includes("no change")) return "ok";
  return "adjust";
}

const ROW_SEVERITY_STYLE: Record<RowSeverity, { border: string; bg: string; label: string; Icon: typeof CheckCircle2 }> = {
  ok:       { border: "border-emerald-400", bg: "bg-emerald-50/50", label: "text-emerald-700", Icon: CheckCircle2 },
  adjust:   { border: "border-amber-400",   bg: "bg-amber-50/50",   label: "text-amber-700",   Icon: AlertTriangle },
  critical: { border: "border-red-400",     bg: "bg-red-50/60",     label: "text-red-700",     Icon: ShieldAlert },
};

function getTableAccent(title: string): { Icon: typeof Search; text: string; chipBg: string } {
  const lower = title.toLowerCase();
  if (lower.includes("empirical")) return { Icon: Search, text: "text-blue-700", chipBg: "bg-blue-50" };
  if (lower.includes("confirmed")) return { Icon: FlaskConical, text: "text-violet-700", chipBg: "bg-violet-50" };
  return { Icon: Info, text: "text-teal-700", chipBg: "bg-teal-50" };
}

export function DoseAdjustmentTableView({ table }: { table: DoseAdjustmentTable }) {
  const accent = getTableAccent(table.title);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={cn("flex items-center justify-center w-5 h-5 rounded-md shrink-0", accent.chipBg)}>
          <accent.Icon className={cn("h-3 w-3", accent.text)} />
        </span>
        <span className="text-xs font-black text-foreground leading-snug">{table.title}</span>
        <span className="text-[10px] font-bold text-muted-foreground ml-auto shrink-0 pl-2">{table.targetRange}</span>
      </div>
      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[420px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left text-[10px] font-black uppercase tracking-wide text-muted-foreground px-2.5 py-2 w-20">Trough</th>
              <th className="text-left text-[10px] font-black uppercase tracking-wide text-muted-foreground px-2.5 py-2 w-16">Freq.</th>
              <th className="text-left text-[10px] font-black uppercase tracking-wide text-muted-foreground px-2.5 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.flatMap((row, ri) => {
              if (row.action !== undefined) {
                const severity = getRowSeverity(row.range, row.action);
                const style = ROW_SEVERITY_STYLE[severity];
                return [
                  <tr key={`${ri}-single`} className={cn("border-t", style.bg)}>
                    <td className="align-top px-2.5 py-2 font-black text-foreground whitespace-nowrap">{row.range}</td>
                    <td className="align-top px-2.5 py-2 text-muted-foreground/60 text-xs">Any</td>
                    <td className="align-top px-2.5 py-2">
                      <div className="flex items-start gap-1.5">
                        <style.Icon className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", style.label)} />
                        <span className="text-foreground font-medium leading-snug">{row.action}</span>
                      </div>
                    </td>
                  </tr>,
                ];
              }
              const sevQ12 = getRowSeverity(row.range, row.ifQ12h ?? "");
              const styleQ12 = ROW_SEVERITY_STYLE[sevQ12];
              const sevQ8 = getRowSeverity(row.range, row.ifQ8h ?? "");
              const styleQ8 = ROW_SEVERITY_STYLE[sevQ8];
              return [
                <tr key={`${ri}-q12`} className={cn("border-t", styleQ12.bg)}>
                  <td rowSpan={2} className="align-top px-2.5 py-2 font-black text-foreground whitespace-nowrap border-r">{row.range}</td>
                  <td className="align-top px-2.5 py-2 text-muted-foreground text-xs font-bold whitespace-nowrap">q12h</td>
                  <td className="align-top px-2.5 py-2">
                    <div className="flex items-start gap-1.5">
                      <styleQ12.Icon className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", styleQ12.label)} />
                      <span className="text-foreground font-medium leading-snug">{row.ifQ12h}</span>
                    </div>
                  </td>
                </tr>,
                <tr key={`${ri}-q8`} className={cn("border-t", styleQ8.bg)}>
                  <td className="align-top px-2.5 py-2 text-muted-foreground text-xs font-bold whitespace-nowrap">q8h</td>
                  <td className="align-top px-2.5 py-2">
                    <div className="flex items-start gap-1.5">
                      <styleQ8.Icon className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", styleQ8.label)} />
                      <span className="text-foreground font-medium leading-snug">{row.ifQ8h}</span>
                    </div>
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LevelTableView({ table }: { table: LevelTable }) {
  const isActionTable = table.columns[1]?.toLowerCase() === "action";
  const accent = getTableAccent(table.title);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={cn("flex items-center justify-center w-5 h-5 rounded-md shrink-0", accent.chipBg)}>
          <accent.Icon className={cn("h-3 w-3", accent.text)} />
        </span>
        <span className="text-xs font-black text-foreground leading-snug">{table.title}</span>
      </div>
      <div className="rounded-xl border overflow-hidden divide-y">
        {table.rows.map((row, ri) => {
          if (!isActionTable) {
            return (
              <div key={ri} className="px-3 py-2 odd:bg-muted/30">
                <div className="text-[10px] font-black uppercase tracking-wide text-teal-700">{row[0]}</div>
                <div className="text-sm font-medium text-foreground leading-snug mt-0.5">{row[1]}</div>
              </div>
            );
          }
          const severity = getRowSeverity(row[0], row[1]);
          const style = ROW_SEVERITY_STYLE[severity];
          return (
            <div key={ri} className={cn("flex gap-2.5 px-3 py-2.5 border-l-4", style.border, style.bg)}>
              <style.Icon className={cn("h-4 w-4 shrink-0 mt-0.5", style.label)} />
              <div className="flex-1 min-w-0">
                <div className={cn("text-xs font-black uppercase tracking-wide", style.label)}>{row[0]}</div>
                <div className="text-sm font-medium text-foreground leading-snug mt-0.5">{row[1]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LevelGuidanceSection({ guidance }: { guidance: LevelGuidance }) {
  return (
    <div className="space-y-4">
      {guidance.targetTable && <LevelTableView table={guidance.targetTable} />}

      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
          Level Interpretation &amp; Dose Adjustment
        </div>
        <div className="space-y-4">
          {guidance.formula && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-3 py-2.5">
              <p className="text-xs font-black text-teal-800 font-mono leading-snug break-words">{guidance.formula}</p>
              {guidance.formulaNote && (
                <p className="text-[11px] text-teal-700/80 font-medium mt-1 leading-snug">{guidance.formulaNote}</p>
              )}
            </div>
          )}
          {guidance.doseAdjustmentTables?.map((table, ti) => (
            <DoseAdjustmentTableView key={`dat-${ti}`} table={table} />
          ))}
          {guidance.tables.map((table, ti) => (
            <LevelTableView key={ti} table={table} />
          ))}
        </div>
      </div>
    </div>
  );
}
