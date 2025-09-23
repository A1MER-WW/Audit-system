"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TabNavigation } from "@/components/tab-navigation"
import { DataTableDemo } from "@/components/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DropzoneComponent from "@/components/dropzone/dropzone"

export default function Archive() {
  const [activeTab, setActiveTab] = useState("item01")

  useEffect(() => {
    const savedTab = localStorage.getItem("archive-active-tab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem("archive-active-tab", value)
  }

  const tabs = [
    { id: "item01", label: "ระบบการวางแผนงานตรวจสอบภายใน" },
    { id: "item02", label: "ระบบการปฏิบัติงานตรวจสอบ" },
    { id: "item03", label: "ระบบรายงานผลการตรวจสอบ" },
    { id: "item04", label: "ระบบการติดตามผลการตรวจสอบ" },
    { id: "item05", label: "ระบบการให้คำปรึกษา" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "item01":
        return (
          <div>
            <span className="flex justify-between w-full">
              ระบบการวางแผนงานตรวจสอบภายใน

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-[#3E52B9]">
                    นำเข้าเอกสาร
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>นำเข้าเอกสาร</DialogTitle>
                    <DialogDescription>
                      เอกสารการทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)
                    </DialogDescription>

                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">ปีงบประมาณ</Label>
                      
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="เลือกปีงบประมาณ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="apple">2568</SelectItem>
                            <SelectItem value="banana">2567</SelectItem>
                            <SelectItem value="blueberry">2566</SelectItem>
                            <SelectItem value="grapes">2563</SelectItem>
                            <SelectItem value="pineapple">2562</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                                        </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">ประเภทเอกสาร</Label>
                        <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="เลือกประเภทเอกสาร" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="apple">PDF</SelectItem>
                            <SelectItem value="banana">DOCX</SelectItem>
                            <SelectItem value="blueberry">XLSX</SelectItem>
                            <SelectItem value="grapes">PPTX</SelectItem>
                            <SelectItem value="pineapple">TXT</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      </div>
                    </div>
                    
                    <DropzoneComponent />
                   
                  </DialogHeader>
                   <div className="flex gap-4 mt-4">
                      <Button variant="outline" className="flex-1">ยกเลิก</Button>
                      <Button className="flex-1 bg-[#3E52B9]">บันทึก</Button>
                    </div>
                </DialogContent>
              </Dialog>
            </span>

            <DataTableDemo />
          </div>
        )
      case "item02":
        return <div>ระบบการปฏิบัติงานตรวจสอบ</div>
      case "item03":
        return <div>ระบบรายงานผลการตรวจสอบ</div>
      case "item04":
        return <div>ระบบการติดตามผลการตรวจสอบ</div>
      case "item05":
        return <div>ระบบการให้คำปรึกษา</div>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="w-full mt-4 mb-4">
        <span className="text-lg font-semibold">หมวดหมู่เอกสาร</span>
        <span className="text-lg font-semibold">(ผู้ตรวจสอบ)</span>
        
        <div className="w-full">
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
          <div className="mt-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}