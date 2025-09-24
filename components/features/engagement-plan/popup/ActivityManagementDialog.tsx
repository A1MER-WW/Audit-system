"use client";

import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  availableActivities,
  riskLevels,
  type Activity,
} from "@/lib/mock-activity-data";

// Risk score mapping
const riskScores = {
  น้อยมาก: { min: 1, max: 5 },
  น้อย: { min: 5, max: 10 },
  ปานกลาง: { min: 10, max: 15 },
  สูง: { min: 15, max: 20 },
  สูงมาก: { min: 20, max: 25 },
};

interface FilterState {
  minScore: string;
  maxScore: string;
}

interface ActivityManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tempSelectedActivities: Activity[];
  onToggleActivity: (activityId: number) => void;
  onConfirmSelection: () => void;
  onCancelSelection: () => void;
}

export function ActivityManagementDialog({
  isOpen,
  onOpenChange,
  searchTerm,
  onSearchChange,
  tempSelectedActivities,
  onToggleActivity,
  onConfirmSelection,
  onCancelSelection,
}: ActivityManagementDialogProps) {
  const [filterState, setFilterState] = useState<FilterState>({
    minScore: "",
    maxScore: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredActivities = availableActivities.filter((activity) => {
    // Text search filter
    const matchesSearch = activity.activity
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Score range filter
    let matchesScore = true;
    if (filterState.minScore || filterState.maxScore) {
      const activityScore =
        riskScores[activity.riskLevel as keyof typeof riskScores];
      const minScore = filterState.minScore
        ? parseInt(filterState.minScore)
        : 1;
      const maxScore = filterState.maxScore
        ? parseInt(filterState.maxScore)
        : 25;

      if (activityScore) {
        // กิจกรรมจะถูกแสดงถ้าช่วงคะแนนของมันทับซ้อนกับช่วงที่กรอก
        matchesScore = !(
          activityScore.max < minScore || activityScore.min > maxScore
        );
      }
    }

    return matchesSearch && matchesScore;
  });

  const handleResetFilter = () => {
    setFilterState({ minScore: "", maxScore: "" });
  };

  const hasActiveFilter = filterState.minScore || filterState.maxScore;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden z-50">
        <DialogHeader>
          <DialogTitle className="text-xl">
            เลือกกิจกรรม/เรื่องที่จะเข้าตรวจสอบ
          </DialogTitle>
          <div className="text-sm text-gray-600">
            สอบทานเอกสาร หลักฐานการเงินและบัญชี ของกองทุน FTA
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar and Filter */}
          <div className="flex gap-2 relative z-20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ค้นหากิจกรรมตรวจสอบ"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`relative z-10 ${
                    hasActiveFilter ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsFilterOpen(!isFilterOpen);
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  กรอง
                  {hasActiveFilter && (
                    <span className="ml-1 bg-blue-500 text-white rounded-full w-2 h-2"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 z-50"
                align="end"
                sideOffset={8}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <div className="font-medium">กรอง</div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      ระดับคะแนนความเสี่ยงกิจกรรม
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="16"
                        value={filterState.minScore}
                        onChange={(e) =>
                          setFilterState((prev) => ({
                            ...prev,
                            minScore: e.target.value,
                          }))
                        }
                        className="w-24 text-center"
                        min="1"
                        max="25"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-gray-700 font-medium">ถึง</span>
                      <Input
                        type="number"
                        placeholder="25"
                        value={filterState.maxScore}
                        onChange={(e) =>
                          setFilterState((prev) => ({
                            ...prev,
                            maxScore: e.target.value,
                          }))
                        }
                        className="w-24 text-center"
                        min="1"
                        max="25"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetFilter();
                      }}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFilterOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      ยืนยัน
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Activities List */}
          <div className="border rounded-lg max-h-96 overflow-y-auto relative z-10">
            <div className="space-y-0">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {hasActiveFilter
                    ? `ไม่พบกิจกรรมในช่วงคะแนน ${filterState.minScore || 1}-${
                        filterState.maxScore || 25
                      }`
                    : "ไม่พบกิจกรรมที่ตรงกับการค้นหา"}
                </div>
              ) : (
                filteredActivities.map((activity) => {
                  const isSelected = tempSelectedActivities.find(
                    (a) => a.id === activity.id
                  );
                  const riskLevelConfig = riskLevels.find(
                    (r) => r.value === activity.riskLevel
                  );
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                      onClick={(e) => {
                        // ตรวจสอบว่าไม่ได้กดที่ Popover หรือ children ของมัน
                        if (
                          e.target === e.currentTarget ||
                          (e.target as Element).closest(".popover-content") ===
                            null
                        ) {
                          onToggleActivity(activity.id);
                        }
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-relaxed mb-2">
                          {activity.activity}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {activity.riskDescription}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            riskLevelConfig?.color ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {activity.riskLevel}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancelSelection}>
              ยกเลิก
            </Button>
            <Button
              onClick={onConfirmSelection}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
