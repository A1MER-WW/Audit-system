import React from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchTerm: string;
  filterStatus: string;
  filterYear: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export function FilterBar({
  searchTerm,
  filterStatus,
  filterYear,
  onSearchChange,
  onStatusChange,
  onYearChange
}: FilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ค้นหาหัวข้อการตรวจสอบหรือหน่วยงาน..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="draft">ร่าง</SelectItem>
                <SelectItem value="step1">ขั้นตอนที่ 1</SelectItem>
                <SelectItem value="step2">ขั้นตอนที่ 2</SelectItem>
                <SelectItem value="step3">ขั้นตอนที่ 3</SelectItem>
                <SelectItem value="step4">ขั้นตอนที่ 4</SelectItem>
                <SelectItem value="complete">เสร็จสิ้น</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterYear} onValueChange={onYearChange}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ปีงบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="2568">2568</SelectItem>
                <SelectItem value="2567">2567</SelectItem>
                <SelectItem value="2566">2566</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}