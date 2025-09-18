"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GripVertical, RotateCcw, Save } from "lucide-react";

type AssessmentResult = {
  id: number;
  processName: string;
  dimension: string;
  riskFactor: string;
  totalScore: number;
  riskLevel: string;
  priority: number;
  probability: number;
  impact: number;
  uniqueKey?: string;
};

type DragDropRiskTableProps = {
  initialAssessments: AssessmentResult[];
  onSave: (reorderedAssessments: AssessmentResult[]) => void;
  onReset: () => void;
};

// Component สำหรับแถวที่สามารถ drag ได้
function SortableTableRow({ assessment, index }: { assessment: AssessmentResult; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: assessment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const riskLevelColor = (level: string) => {
    switch (level) {
      case "สูงมาก":
        return "bg-red-100 text-red-700 border-red-200";
      case "สูง":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "ปานกลาง":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "น้อย":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 ${isDragging ? "bg-blue-50 shadow-lg" : ""}`}
    >
      {/* Drag Handle + ลำดับ */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="font-medium">{index + 1}</span>
        </div>
      </TableCell>

      {/* กระบวนงาน */}
      <TableCell className="min-w-[160px]">
        <div className="font-medium text-sm">{assessment.processName}</div>
      </TableCell>

      {/* ด้าน */}
      <TableCell className="text-center">
        <Badge variant="outline" className="text-xs">
          {assessment.dimension}
        </Badge>
      </TableCell>

      {/* ความเสี่ยงและปัจจัยเสี่ยง */}
      <TableCell className="w-[560px] align-top">
        <div
          className="text-sm text-gray-900 whitespace-pre-line break-words"
          title={assessment.riskFactor}
        >
          {assessment.riskFactor}
        </div>
      </TableCell>

      {/* คะแนน */}
      <TableCell className="text-center">
        <div className="font-bold text-lg">{assessment.totalScore}</div>
      </TableCell>

      {/* ระดับความเสี่ยง */}
      <TableCell className="text-center">
        <Badge
          className={`${riskLevelColor(assessment.riskLevel)} border font-medium`}
        >
          {assessment.riskLevel}
        </Badge>
      </TableCell>

      {/* ลำดับความเสี่ยง */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center">
          <Badge
            variant="secondary"
            className="rounded-full w-8 h-8 flex items-center justify-center font-bold"
          >
            {index + 1}
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function DragDropRiskTable({
  initialAssessments,
  onSave,
  onReset,
}: DragDropRiskTableProps) {
  const [assessments, setAssessments] = useState<AssessmentResult[]>(initialAssessments);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAssessments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

  const handleSave = () => {
    // อัพเดท priority ตามลำดับใหม่
    const updatedAssessments = assessments.map((assessment, index) => ({
      ...assessment,
      priority: index + 1,
    }));
    
    onSave(updatedAssessments);
    setHasChanges(false);
    
    // แสดงข้อความแจ้งเตือนสำเร็จ
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    successMessage.innerHTML = `
      <strong>สำเร็จ!</strong> บันทึกลำดับความเสี่ยงใหม่เรียบร้อยแล้ว
    `;
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleReset = () => {
    setAssessments(initialAssessments);
    setHasChanges(false);
    onReset();
  };

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">
          <div className="text-lg font-medium mb-2">
            ยังไม่มีข้อมูลการประเมิน
          </div>
          <div className="text-sm">
            กรุณาไปทำการประเมินความเสี่ยงก่อน
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-blue-600" />
              จัดลำดับความเสี่ยง
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ลากไอคอน <GripVertical className="h-4 w-4 inline mx-1" /> และวางเพื่อเปลี่ยนลำดับความสำคัญของความเสี่ยง
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              ล้างการจัดลำดับ
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 ${
                hasChanges 
                  ? "bg-green-600 hover:bg-green-700 animate-pulse" 
                  : "bg-gray-400"
              }`}
            >
              <Save className="h-4 w-4" />
              อัพเดทลำดับความเสี่ยง
            </Button>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      {hasChanges && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                มีการเปลี่ยนแปลงลำดับที่ยังไม่ได้บันทึก
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                กดปุ่ม &ldquo;อัพเดทลำดับความเสี่ยง&rdquo; เพื่อบันทึกการเปลี่ยนแปลง
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Drag and Drop Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              {/* แถวที่ 1 */}
              <TableRow className="bg-white">
                <TableHead
                  className="text-center w-20 align-middle border-0"
                  rowSpan={2}
                >
                  ลำดับ
                </TableHead>

                <TableHead className="w-40 align-middle border-0" rowSpan={2}>
                  กระบวนงาน
                </TableHead>

                <TableHead
                  className="text-center w-40 align-middle border-0"
                  rowSpan={2}
                >
                  ด้าน
                </TableHead>

                <TableHead
                  className="w-[560px] align-middle border-0"
                  rowSpan={2}
                >
                  ความเสี่ยงและปัจจัยเสี่ยง
                </TableHead>

                {/* หัวข้อรวม */}
                <TableHead
                  className="text-center align-middle font-semibold border-0 !border-b-0 bg-white"
                  colSpan={3}
                >
                  การประเมินความเสี่ยงระดับกิจกรรม
                </TableHead>
              </TableRow>

              {/* แถวที่ 2 */}
              <TableRow className="bg-gray-50/70">
                <TableHead className="text-center w-20">คะแนน</TableHead>
                <TableHead className="text-center w-28">
                  ระดับความเสี่ยง
                </TableHead>
                <TableHead className="text-center w-24">
                  ลำดับความเสี่ยง
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={assessments.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {assessments.map((assessment, index) => (
                  <SortableTableRow
                    key={assessment.id}
                    assessment={assessment}
                    index={index}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}