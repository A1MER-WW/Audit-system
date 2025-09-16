import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  grade?: "E" | "H" | "M" | "L" | "N";
  category?: string;
  onClear: () => void;
};

export function ActiveFilters({ grade, category, onClear }: Props) {
  if (!grade && !category) return null;

  const gradeLabel = 
    grade === "E" ? "มากที่สุด" : 
    grade === "H" ? "มาก" : 
    grade === "M" ? "ปานกลาง" : 
    grade === "L" ? "น้อย" : 
    grade === "N" ? "ไม่ประเมิน" : "";
  
  return (
    <div className="p-4 border rounded-lg bg-white space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">ตัวกรองที่เลือก:</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          ล้างตัวกรองทั้งหมด
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {grade && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <span>ระดับความเสี่ยง: {gradeLabel}</span>
          </Badge>
        )}
        {category && (
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <span>หมวดหมู่: {category}</span>
          </Badge>
        )}
      </div>
    </div>
  );
}
