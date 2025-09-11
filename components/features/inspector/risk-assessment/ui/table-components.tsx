import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Row } from "@/types/risk-assessment-results";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    กำลังประเมิน: "bg-blue-100 text-blue-700 border-blue-200",
    ประเมินแล้ว: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ยังไม่ได้ประเมิน: "bg-red-100 text-red-700 border-red-200",
    แก้ไข: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3", map[value] || "")}
    >
      {value}
    </Badge>
  );
}

export function GradeBadge({ grade }: { grade: Row["grade"] }) {
  if (!grade || grade === "-")
    return <span className="text-muted-foreground">-</span>;
  const map = {
    E: { txt: "Excellent", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    H: { txt: "High", cls: "bg-red-100 text-red-700 border-red-200" },
    M: { txt: "Medium", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    L: { txt: "Low", cls: "bg-sky-100 text-sky-700 border-sky-200" },
    N: { txt: "Needs Improvement", cls: "bg-slate-100 text-slate-700 border-slate-200" },
  } as const;
  const it = map[grade];
  return (
    <Badge variant="outline" className={cn("rounded-full px-2", it.cls)}>
      {it.txt}
    </Badge>
  );
}

export function ExpandBtn({
  id,
  expanded,
  setExpanded,
}: {
  id: string;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const isOpen = !!expanded[id];
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="แสดงหัวข้อย่อย"
      onClick={() => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
    >
      {isOpen ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
}

export function RowLoading({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        กำลังโหลดข้อมูล...
      </TableCell>
    </TableRow>
  );
}

export function RowError({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-red-600">
        โหลดข้อมูลไม่สำเร็จ
      </TableCell>
    </TableRow>
  );
}

export function RowEmpty({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        ไม่พบข้อมูล
      </TableCell>
    </TableRow>
  );
}
