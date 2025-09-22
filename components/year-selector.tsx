"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface YearOption {
  value: string
  label: string
}

interface YearSelectorProps {
  selectedYear: string
  onYearChange: (year: string) => void
  years?: YearOption[]
  label?: string
  placeholder?: string
  className?: string
}

const defaultYears: YearOption[] = [
  { value: "2566", label: "ปี 2566" },
  { value: "2567", label: "ปี 2567" },
  { value: "2568", label: "ปี 2568" },
  { value: "2569", label: "ปี 2569" },
  { value: "2570", label: "ปี 2570" }
]

export function YearSelector({
  selectedYear,
  onYearChange,
  years = defaultYears,
  label = "เลือกปีงบประมาณ:",
  placeholder = "เลือกปี",
  className = ""
}: YearSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}