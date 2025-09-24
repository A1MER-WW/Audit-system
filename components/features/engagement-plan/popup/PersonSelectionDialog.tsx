"use client";

import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { peopleList, type Person } from "@/lib/mock-activity-data";

interface PersonSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPerson: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectPerson: (personName: string, personStatus: string) => void;
  onConfirmSelection: () => void;
}

export function PersonSelectionDialog({
  isOpen,
  onOpenChange,
  selectedPerson,
  searchTerm,
  onSearchChange,
  onSelectPerson,
  onConfirmSelection,
}: PersonSelectionDialogProps) {
  const filteredPeople = peopleList.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            เลือกผู้รับผิดชอบ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* People List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPerson === `${person.name} (${person.status})`
                    ? "bg-blue-50 border border-blue-200"
                    : "border border-gray-200"
                }`}
                onClick={() => onSelectPerson(person.name, person.status)}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedPerson === `${person.name} (${person.status})`
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPerson === `${person.name} (${person.status})` && (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {person.name}
                  </p>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                    {person.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onConfirmSelection}
              disabled={!selectedPerson}
              className="bg-[#3E52B9] hover:bg-[#3346a6]"
            >
              บันทึก
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}