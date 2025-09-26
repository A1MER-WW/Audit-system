"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Components
function SortableObjective({
  objective,
  index,
  onRemove,
  onEdit,
}: {
  objective: string;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number, newText: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(objective);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(index, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(objective);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 bg-white border rounded-lg group hover:bg-gray-50 ${
        isDragging ? "shadow-xl border-blue-200 bg-blue-50" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        title="ลากเพื่อจัดลำดับ"
        disabled={isEditing}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <span className="text-sm font-medium text-blue-600">
          วัตถุประสงค์ที่ {index + 1}
        </span>
        {isEditing ? (
          <div className="mt-1 space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                บันทึก
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                ยกเลิก
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mt-1 cursor-pointer hover:bg-gray-100 p-1 rounded" onClick={() => setIsEditing(true)}>
            {objective}
          </p>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SortableScope({
  scope,
  index,
  onRemove,
  onEdit,
  onUpdateSubScope,
  onAddSubScope,
  onRemoveSubScope,
  newSubScope,
  setNewSubScope,
  sensors,
  onSubScopeDragEnd,
}: {
  scope: {
    id: number;
    text: string;
    subScopes: { id: number; text: string }[];
  };
  index: number;
  onRemove: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onUpdateSubScope: (
    scopeId: number,
    subScopeId: number,
    newText: string
  ) => void;
  onAddSubScope: (scopeId: number) => void;
  onRemoveSubScope: (scopeId: number, subScopeId: number) => void;
  newSubScope: { [key: number]: string };
  setNewSubScope: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  sensors: any;
  onSubScopeDragEnd: (scopeId: number) => (event: DragEndEvent) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(scope.text);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scope.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white border rounded-lg group hover:bg-gray-50 ${
        isDragging ? "shadow-xl border-blue-200 bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          title="ลากเพื่อจัดลำดับ"
          disabled={isEditing}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <span className="text-sm font-medium text-green-600">
            ขอบเขตที่ {index + 1}
          </span>
          {isEditing ? (
            <div className="mt-1 space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => {
                  if (editText.trim()) {
                    onEdit(scope.id, editText.trim());
                  }
                  setIsEditing(false);
                }}>
                  บันทึก
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setEditText(scope.text);
                  setIsEditing(false);
                }}>
                  ยกเลิก
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-1 cursor-pointer hover:bg-gray-100 p-1 rounded" onClick={() => setIsEditing(true)}>
              {scope.text}
            </p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(scope.id)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sub-scopes */}
      <div className="ml-8 space-y-2">
        {scope.subScopes.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onSubScopeDragEnd(scope.id)}
          >
            <SortableContext
              items={scope.subScopes.map((sub) => `${scope.id}-${sub.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {scope.subScopes.map((subScope, subIndex) => (
                <SortableSubScope
                  key={`subscope-${scope.id}-${subScope.id}-${subIndex}`}
                  subScope={subScope}
                  scopeId={scope.id}
                  subIndex={subIndex}
                  onUpdate={onUpdateSubScope}
                  onRemove={onRemoveSubScope}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {/* Add new sub-scope */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">{scope.subScopes.length + 1})</span>
          <Input
            value={newSubScope[scope.id] || ""}
            onChange={(e) =>
              setNewSubScope((prev) => ({
                ...prev,
                [scope.id]: e.target.value,
              }))
            }
            placeholder="เพิ่มรายละเอียดย่อย..."
            className="flex-1 text-sm"
            onKeyPress={(e) => {
              if (e.key === "Enter" && newSubScope[scope.id]?.trim()) {
                onAddSubScope(scope.id);
              }
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSubScope(scope.id)}
            disabled={!newSubScope[scope.id]?.trim()}
            className="text-green-600 hover:text-green-700"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortableSubScope({
  subScope,
  scopeId,
  subIndex,
  onUpdate,
  onRemove,
}: {
  subScope: { id: number; text: string };
  scopeId: number;
  subIndex: number;
  onUpdate: (scopeId: number, subScopeId: number, newText: string) => void;
  onRemove: (scopeId: number, subScopeId: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${scopeId}-${subScope.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 bg-gray-50 rounded border group hover:bg-gray-100 ${
        isDragging ? "shadow-xl border-blue-200 bg-blue-50" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        title="ลากเพื่อจัดลำดับ"
      >
        <GripVertical className="h-3 w-3" />
      </button>
      <span className="text-xs text-gray-500 w-8">{subIndex + 1})</span>
      <Input
        value={subScope.text}
        onChange={(e) => onUpdate(scopeId, subScope.id, e.target.value)}
        className="flex-1 text-sm border-none bg-transparent focus-visible:ring-0"
        placeholder="รายละเอียดย่อย..."
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(scopeId, subScope.id)}
        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

import { ArrowLeft, ArrowRight, Plus, GripVertical, X, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProgram } from "@/lib/mock-engagement-plan-programs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PersonSelectionDialog } from "@/components/features/engagement-plan/popup";
import { useEngagementPlan } from "@/hooks/useEngagementPlan";
import { DEFAULT_USERS } from "@/constants/default-users";
import SaveIndicator from "@/components/features/engagement-plan/SaveIndicator";
import TestDataLoader from "../test-data-loader";

export default function Step2EngagementPlanPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { state, dispatch, saveToStorage } = useEngagementPlan();

  // ดึงข้อมูลจาก engagement plan จริง
  const engagementPlan = getProgram(parseInt(id));

  const mockEngagementPlan = engagementPlan
    ? {
        title: engagementPlan.auditTopics.auditTopic,
        fiscalYear: engagementPlan.fiscalYear.toString(),
        department: engagementPlan.auditTopics.departments
          .map((d: any) => d.departmentName)
          .join(", "),
        status:
          engagementPlan.status === "AUDITOR_ASSESSING"
            ? "กำลังดำเนินการประเมิน"
            : engagementPlan.status === "PENDING"
            ? "รอดำเนินการ"
            : engagementPlan.status === "COMPLETED"
            ? "เสร็จสิ้น"
            : engagementPlan.status,
        objectives: ["ผู้ตรวจสอบที่ได้รับมอบหมายกิจกรรม (ผู้ตรวจสอบภายใน)"],
        generalObjectives: [
          "ประเมินประสิทธิภาพ และประสิทธิผลของโครงการ/งาน/กิจกรรม",
        ],
        specificObjectives: [
          "ประเมินความรู้ ความเข้าใจ ของเจ้าหน้าที่ผู้ปฏิบัติงานงาน/กิจกรรม",
        ],
      }
    : {
        title: "ไม่พบข้อมูลแผนการปฏิบัติงาน",
        fiscalYear: "2568",
        department: "ไม่ระบุ",
        status: "ไม่ระบุ",
        objectives: ["ไม่ระบุ"],
        generalObjectives: ["ไม่ระบุ"],
        specificObjectives: ["ไม่ระบุ"],
      };

  const [auditedUnit, setAuditedUnit] = useState<string>(state.step1?.basicInfo?.auditedUnit || "");
  const [auditCategory, setAuditCategory] = useState<string>(state.step1?.basicInfo?.auditCategory || "");
  const [preparer, setPreparer] = useState<string>(state.step1?.basicInfo?.preparer || DEFAULT_USERS.preparer);
  const [reviewer, setReviewer] = useState<string>(state.step1?.basicInfo?.reviewer || DEFAULT_USERS.reviewer);
  const [approver, setApprover] = useState<string>(state.step1?.basicInfo?.approver || DEFAULT_USERS.approver);
  const [auditResponsible, setAuditResponsible] = useState<string>(state.step2?.auditResponsible || DEFAULT_USERS.auditResponsible);
  const [supervisor, setSupervisor] = useState<string>(state.step2?.supervisor || DEFAULT_USERS.supervisor);

  // State สำหรับ popup dialog
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState<boolean>(false);
  const [currentField, setCurrentField] = useState<
    | "preparer"
    | "reviewer"
    | "approver"
    | "auditResponsible"
    | "supervisor"
    | null
  >(null);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleOpenPersonDialog = (
    field:
      | "preparer"
      | "reviewer"
      | "approver"
      | "auditResponsible"
      | "supervisor"
  ) => {
    setCurrentField(field);
    setIsPersonDialogOpen(true);
    setSearchTerm("");
    // ตั้งค่า selectedPerson ตามค่าปัจจุบัน
    if (field === "preparer") setSelectedPerson(preparer);
    if (field === "reviewer") setSelectedPerson(reviewer);
    if (field === "approver") setSelectedPerson(approver);
    if (field === "auditResponsible") setSelectedPerson(auditResponsible);
    if (field === "supervisor") setSelectedPerson(supervisor);
  };

  const handleSelectPerson = (personName: string, personStatus: string) => {
    setSelectedPerson(`${personName} (${personStatus})`);
  };

  const handleConfirmSelection = () => {
    if (currentField && selectedPerson) {
      if (currentField === "preparer") setPreparer(selectedPerson);
      if (currentField === "reviewer") setReviewer(selectedPerson);
      if (currentField === "approver") setApprover(selectedPerson);
      if (currentField === "auditResponsible")
        setAuditResponsible(selectedPerson);
      if (currentField === "supervisor") setSupervisor(selectedPerson);
    }
    setIsPersonDialogOpen(false);
    setCurrentField(null);
    setSelectedPerson("");
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // State for objectives and scope - Initialize from context
  const [auditIssues, setAuditIssues] = useState<string>(
    state.step2?.auditIssues || ""
  );
  const [objectives, setObjectives] = useState<string[]>(
    state.step2?.objectives || []
  );
  const [scopes, setScopes] = useState<
    { id: number; text: string; subScopes: { id: number; text: string }[] }[]
  >(state.step2?.scopes || []);
  const [auditDuration, setAuditDuration] = useState<string>(
    state.step2?.auditDuration || ""
  );
  const [auditMethodology, setAuditMethodology] = useState<string>(
    state.step2?.auditMethodology || ""
  );
  const [auditBudget, setAuditBudget] = useState<string>(state.step2?.auditBudget || "");

  // State for adding new items
  const [newObjective, setNewObjective] = useState("");
  const [newScope, setNewScope] = useState("");
  const [newSubScope, setNewSubScope] = useState<{ [key: number]: string }>({});

  // Counter for unique IDs - initialize based on existing data
  const [nextScopeId, setNextScopeId] = useState(() => {
    const maxScopeId = scopes.length > 0 ? Math.max(...scopes.map(s => s.id)) : 0;
    return maxScopeId + 1;
  });
  const [nextSubScopeId, setNextSubScopeId] = useState(() => {
    const allSubScopes = scopes.flatMap(s => s.subScopes);
    const maxSubScopeId = allSubScopes.length > 0 ? Math.max(...allSubScopes.map(s => s.id)) : 0;
    return maxSubScopeId + 1;
  });

  // Load data from context when component mounts
  useEffect(() => {
    if (state.step2) {
      setAuditIssues(state.step2.auditIssues || "");
      setObjectives(state.step2.objectives || []);
      setScopes(state.step2.scopes || []);
      setAuditDuration(state.step2.auditDuration || "");
      setAuditMethodology(state.step2.auditMethodology || "");
      setAuditBudget(state.step2.auditBudget || "");
      setAuditResponsible(state.step2.auditResponsible || DEFAULT_USERS.auditResponsible);
      setSupervisor(state.step2.supervisor || DEFAULT_USERS.supervisor);
    }
  }, [state.step2]);

  // Update counters when scopes change from context
  useEffect(() => {
    const maxScopeId = scopes.length > 0 ? Math.max(...scopes.map(s => s.id)) : 0;
    const allSubScopes = scopes.flatMap(s => s.subScopes);
    const maxSubScopeId = allSubScopes.length > 0 ? Math.max(...allSubScopes.map(s => s.id)) : 0;
    
    setNextScopeId(Math.max(nextScopeId, maxScopeId + 1));
    setNextSubScopeId(Math.max(nextSubScopeId, maxSubScopeId + 1));
  }, [scopes]);

  // Auto-save to context when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({
        type: "UPDATE_STEP2",
        payload: {
          auditIssues,
          objectives,
          scopes,
          auditDuration,
          auditMethodology,
          auditBudget,
          auditResponsible,
          supervisor,
        },
      });
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [auditIssues, objectives, scopes, auditDuration, auditMethodology, auditBudget, auditResponsible, supervisor, dispatch]);

  // Function to handle next step - save data to context
  const handleNextStep = () => {
    // Save all Step 2 data to context including auditIssues
    dispatch({
      type: "UPDATE_STEP2",
      payload: {
        auditIssues,
        objectives,
        scopes,
        auditDuration,
        auditMethodology,
        auditBudget,
        auditResponsible,
        supervisor,
      },
    });

    // Also sync the basic info from step 1 if it was updated in step 2
    dispatch({
      type: "UPDATE_STEP1",
      payload: {
        basicInfo: {
          auditedUnit,
          auditCategory,
          preparer,
          reviewer,
          approver,
        },
      },
    });

    // Navigate to Step 3
    router.push(`/audit-engagement-plan/${id}/step-3-audit-program`);
  };

  // Functions for objectives
  const addObjective = () => {
    if (newObjective.trim()) {
      const updatedObjectives = [...objectives, newObjective.trim()];
      setObjectives(updatedObjectives);
      setNewObjective("");

      // Auto-save to context
      dispatch({
        type: "UPDATE_STEP2",
        payload: {
          auditIssues,
          objectives: updatedObjectives,
          scopes,
          auditDuration,
          auditMethodology,
          auditBudget,
          auditResponsible,
          supervisor,
        },
      });
    }
  };

  const removeObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(updatedObjectives);

    // Auto-save to context
    dispatch({
      type: "UPDATE_STEP2",
      payload: {
        auditIssues,
        objectives: updatedObjectives,
        scopes,
        auditDuration,
        auditMethodology,
        auditBudget,
        auditResponsible,
        supervisor,
      },
    });
  };

  const editObjective = (index: number, newText: string) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index] = newText;
    setObjectives(updatedObjectives);

    // Auto-save to context
    dispatch({
      type: "UPDATE_STEP2",
      payload: {
        auditIssues,
        objectives: updatedObjectives,
        scopes,
        auditDuration,
        auditMethodology,
        auditBudget,
        auditResponsible,
        supervisor,
      },
    });
  };

  // Functions for scopes
  const addScope = () => {
    if (newScope.trim()) {
      const newScopeItem = {
        id: nextScopeId,
        text: newScope.trim(),
        subScopes: [],
      };
      setScopes([...scopes, newScopeItem]);
      setNewScope("");
      setNextScopeId(nextScopeId + 1);
      
      // Force save to context immediately
      setTimeout(() => {
        dispatch({
          type: "UPDATE_STEP2",
          payload: {
            auditIssues,
            objectives,
            scopes: [...scopes, newScopeItem],
            auditDuration,
            auditMethodology,
            auditResponsible,
            supervisor,
          },
        });
      }, 100);
    }
  };

  const removeScope = (scopeId: number) => {
    setScopes(scopes.filter((scope) => scope.id !== scopeId));
  };

  const editScope = (scopeId: number, newText: string) => {
    const updatedScopes = scopes.map((scope) => 
      scope.id === scopeId ? { ...scope, text: newText } : scope
    );
    setScopes(updatedScopes);

    // Auto-save to context
    dispatch({
      type: "UPDATE_STEP2",
      payload: {
        auditIssues,
        objectives,
        scopes: updatedScopes,
        auditDuration,
        auditMethodology,
        auditBudget,
        auditResponsible,
        supervisor,
      },
    });
  };

  const addSubScope = (scopeId: number) => {
    const subScopeText = newSubScope[scopeId]?.trim();
    if (subScopeText) {
      setScopes(
        scopes.map((scope) => {
          if (scope.id === scopeId) {
            return {
              ...scope,
              subScopes: [
                ...scope.subScopes,
                { id: nextSubScopeId, text: subScopeText },
              ],
            };
          }
          return scope;
        })
      );
      setNewSubScope({ ...newSubScope, [scopeId]: "" });
      setNextSubScopeId(nextSubScopeId + 1);
    }
  };

  const removeSubScope = (scopeId: number, subScopeId: number) => {
    setScopes(
      scopes.map((scope) => {
        if (scope.id === scopeId) {
          return {
            ...scope,
            subScopes: scope.subScopes.filter((sub) => sub.id !== subScopeId),
          };
        }
        return scope;
      })
    );
  };

  const updateSubScope = (
    scopeId: number,
    subScopeId: number,
    newText: string
  ) => {
    setScopes(
      scopes.map((scope) =>
        scope.id === scopeId
          ? {
              ...scope,
              subScopes: scope.subScopes.map((sub) =>
                sub.id === subScopeId ? { ...sub, text: newText } : sub
              ),
            }
          : scope
      )
    );
  };

  // Drag handlers
  const handleObjectiveDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = objectives.findIndex(
        (_, index) => index.toString() === active.id
      );
      const newIndex = objectives.findIndex(
        (_, index) => index.toString() === over?.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const newObjectives = arrayMove(objectives, oldIndex, newIndex);
        setObjectives(newObjectives);
      }
    }
  };

  const handleScopeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = scopes.findIndex(
        (scope) => scope.id.toString() === active.id
      );
      const newIndex = scopes.findIndex(
        (scope) => scope.id.toString() === over?.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const newScopes = arrayMove(scopes, oldIndex, newIndex);
        setScopes(newScopes);
      }
    }
  };

  const handleSubScopeDragEnd = (scopeId: number) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const scope = scopes.find((s) => s.id === scopeId);
      if (!scope) return;

      const activeId = active.id.toString().split("-")[1]; // Extract subScope id
      const overId = over?.id.toString().split("-")[1]; // Extract subScope id

      const oldIndex = scope.subScopes.findIndex(
        (sub) => sub.id.toString() === activeId
      );
      const newIndex = scope.subScopes.findIndex(
        (sub) => sub.id.toString() === overId
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSubScopes = arrayMove(scope.subScopes, oldIndex, newIndex);
        setScopes(
          scopes.map((s) =>
            s.id === scopeId ? { ...s, subScopes: newSubScopes } : s
          )
        );
      }
    }
  };

  return (
    <div className="px-6 py-4">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/audit-engagement-plan" className="hover:text-blue-600">
            การจัดทำ Audit Program / แผนการปฏิบัติงาน (Engagement plan)
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span>แผนการปฏิบัติงานตรวจสอบ</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              แผนการปฏิบัติงานตรวจสอบ (Audit Program)
            </h1>
            <div className="text-gray-600">
              ปีงบประมาณ พ.ศ. {mockEngagementPlan.fiscalYear}
              <span className="mx-2">•</span>
              {mockEngagementPlan.department}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SaveIndicator />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                ปริ้นท์
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                บันทึกแผนการปฏิบัติงานตรวจสอบ
              </Button>
            </div>
          </div>
        </div>

        {/* แผนการปฏิบัติงาน Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {mockEngagementPlan.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* หน่วยรับตรวจ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน่วยรับตรวจ
              </label>
              <Input
                value={auditedUnit}
                onChange={(e) => setAuditedUnit(e.target.value)}
                placeholder="-"
                className="w-full"
              />
            </div>

            {/* ประเภทของการตรวจ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทของการตรวจ
              </label>
              <Input
                value={auditCategory}
                onChange={(e) => setAuditCategory(e.target.value)}
                placeholder="-"
                className="w-full"
              />
            </div>

            {/* ผู้จัดทำ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้จัดทำ
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={preparer}
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "preparer"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("preparer")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {/* ผู้สอบทาน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้สอบทาน
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={reviewer}
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "reviewer"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("reviewer")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {/* ผู้อนุมัติ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ผู้อนุมัติ
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={approver}
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "approver"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("approver")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                การประเมินความเสี่ยงระดับกิจกรรม
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 whitespace-nowrap">
                แผนการปฏิบัติงาน (Engagement Plan)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                Audit Program
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                การรายงานผลการตรวจสอบ (Audit Reporting)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300"></div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                5
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                สรุปผลการดำเนินงาน
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-6">
          {/* ประเด็นการตรวจสอบ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ประเด็นการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ระบุประเด็นหรือเรื่องที่ต้องการตรวจสอบ เช่น ประสิทธิภาพการดำเนินงาน ความถูกต้องของข้อมูล การปฏิบัติตามระเบียบ..."
                value={auditIssues}
                onChange={(e) => {
                  setAuditIssues(e.target.value);
                }}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* วัตถุประสงค์การตรวจสอบ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  วัตถุประสงค์การตรวจสอบ
                </CardTitle>
                <Button onClick={addObjective} disabled={!newObjective.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มวัตถุประสงค์
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectives.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  ยังไม่มีวัตถุประสงค์ กดปุ่ม &quot;เพิ่มวัตถุประสงค์&quot;
                  เพื่อเริ่มต้น
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleObjectiveDragEnd}
                >
                  <SortableContext
                    items={objectives.map((_, index) => index.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {objectives.map((objective, index) => (
                        <SortableObjective
                          key={`objective-${index}-${objective.slice(0, 20)}`}
                          objective={objective}
                          index={index}
                          onRemove={removeObjective}
                          onEdit={editObjective}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="เพิ่มวัตถุประสงค์ใหม่..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addObjective();
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ขอบเขตการตรวจสอบ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  ขอบเขตการตรวจสอบ
                </CardTitle>
                <Button onClick={addScope} disabled={!newScope.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มขอบเขต
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {scopes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  ยังไม่มีขอบเขตการตรวจสอบ กดปุ่ม &quot;เพิ่มขอบเขต&quot;
                  เพื่อเริ่มต้น
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleScopeDragEnd}
                >
                  <SortableContext
                    items={scopes.map((scope) => scope.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {scopes.map((scope, index) => (
                        <SortableScope
                          key={`scope-${scope.id}-${index}`}
                          scope={scope}
                          index={index}
                          onRemove={removeScope}
                          onEdit={editScope}
                          onUpdateSubScope={updateSubScope}
                          onAddSubScope={addSubScope}
                          onRemoveSubScope={removeSubScope}
                          newSubScope={newSubScope}
                          setNewSubScope={setNewSubScope}
                          sensors={sensors}
                          onSubScopeDragEnd={handleSubScopeDragEnd}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="เพิ่มขอบเขตการตรวจสอบใหม่..."
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addScope();
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ระยะเวลาที่ใช้ในการตรวจสอบ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ระยะเวลาที่ใช้ในการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ระบุระยะเวลาที่ใช้ในการตรวจสอบ เช่น 12 สัปดาห์ หรือ 3 เดือน..."
                value={auditDuration}
                onChange={(e) => setAuditDuration(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* วิธีการตรวจสอบ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                วิธีการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ระบุวิธีการและเทคนิคที่ใช้ในการตรวจสอบ เช่น การสัมภาษณ์ การตรวจสอบเอกสาร การทดสอบการควบคุมภายใน..."
                value={auditMethodology}
                onChange={(e) => setAuditMethodology(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* งบประมาณที่ใช้ในการตรวจสอบ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                งบประมาณที่ใช้ในการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ระบุงบประมาณที่จะใช้ในการตรวจสอบ เช่น ค่าเดินทาง ค่าใช้จ่ายในการเก็บข้อมูล ค่าวัสดุอุปกรณ์ หรือระบุเป็นจำนวนเงิน..."
                value={auditBudget}
                onChange={(e) => setAuditBudget(e.target.value)}
                rows={3}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* ผู้รับผิดชอบในการตรวจสอบ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ผู้รับผิดชอบในการตรวจสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Input
                  value={auditResponsible}
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
                />
                <Dialog
                  open={
                    isPersonDialogOpen && currentField === "auditResponsible"
                  }
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("auditResponsible")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* ภายใต้การกำกับและควบคุมของ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ภายใต้การกำกับและควบคุมของ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Input
                  value={supervisor}
                  placeholder="-"
                  className="w-full bg-gray-50"
                  readOnly
                />
                <Dialog
                  open={isPersonDialogOpen && currentField === "supervisor"}
                  onOpenChange={setIsPersonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#3E52B9] hover:bg-[#3346a6]"
                      onClick={() => handleOpenPersonDialog("supervisor")}
                    >
                      เลือกผู้รับผิดชอบ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Link href={`/audit-engagement-plan/${id}/step-1-activity-risk`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ขั้นตอนก่อนหน้า: การประเมินความเสี่ยง
          </Button>
        </Link>
        <Button onClick={handleNextStep}>
          ขั้นตอนถัดไป: Audit Program
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Person Selection Dialog */}
      <PersonSelectionDialog
        isOpen={isPersonDialogOpen}
        onOpenChange={setIsPersonDialogOpen}
        selectedPerson={selectedPerson}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectPerson={handleSelectPerson}
        onConfirmSelection={handleConfirmSelection}
      />
    </div>
  );
}
