'use client';

import { Button } from "@/components/ui/button";
import { useNavigationHistory } from "@/hooks/navigation-history";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbItem,BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import {
  ChevronLeft ,
  Edit,
  Eye,
  Trash2,
  type LucideIcon
} from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// TempData
const TempData1 = [
    {
        id: 1,
        department:"หน่วยงาน",
        title:"เกร็ดความรู้ การเบิกค่าใช้จ่ายในการเดินทางไปยังต่างประเทศ",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ยังไม่ได้ดำเนินการ",
        display:"Inactive",
        lastModified: "20/06/2568 14:00 น."
    },
   {
        id: 2,
        department:"หน่วยงาน",
        title:"โครงสร้างแผนงานตามยุทธศาสตร์",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "รออนุมัติ",
        display:"Inactive",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 3,
        department:"หน่วยงาน",
        title:"ข้อกำหนดค่าใช้จ่ายสำหรับเดินทาง",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 4,
        department:"หน่วยงาน",
        title:"แนวทางการขออนุมัติให้ข้าราชการเดินทางไปจ่างประเทศชั่วคราว",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 5,
        department:"หน่วยงาน",
        title:"4หลักการ จัดซื้อจัดจ้างให้ถูกตามเกรฑ์ที่กำหนด",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
        lastModified: "20/06/2568 14:00 น."
    }
]


export default function ConsultPage() {

  const [ consultTable, SetConsultTable] = useState(TempData1)
  const router = useRouter()
  // ------HandleView
  const handleView = (id: number) => {
        // router.push(`/maindatabase/plan/budgetplan?id=${planId}&name=${encodeURIComponent(planName)}`)
    console.log(" ID:", id)  
  }
  const handleEdit = (id: number) => {
    console.log(" ID:", id)
  }
  const handleDelete = (id: number) => {
    console.log(" ID:", id)
  }
  //-------------------
  const { goBack } = useNavigationHistory();
  
  return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-start">
          <div className="w-24 flex-none ">
            <Button className="w-16 cursor-pointer" onClick={goBack} variant="ghost" size="icon" >
              <ChevronLeft /> 
              กลับ
            </Button>
          </div>
          <div className="w-64 flex-1 content-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem >
                  ระบบให้คำปรึกษา
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div>
         <h1>จัดการข้อมูลดูแลเกร็ดความรู้</h1>
          <p className="text-muted-foreground text-sm text-balance pt-1 ">
          แสดงข้อมูลต่างๆและเกร็ดความรู้แก่ผู้ใช้
          </p>
        </div>
        <div className="w-full h-full">
          {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm pt-1">
              <Table>
                 <TableHeader className="bg-gray-50">
                      <TableRow>
                          <TableHead className="w-[80px] text-center font-medium text-gray-700">
                              ลำดับ
                          </TableHead>
                          <TableHead className="w-[80px] font-medium text-gray-700">
                              หน่วยงาน
                          </TableHead>
                          <TableHead className="w-[250px] text-center font-medium text-gray-700">
                              ชื่อเรื่อง
                          </TableHead>
                          <TableHead className="w-[400px] text-center font-medium text-gray-700">
                              รายละเอียด
                          </TableHead>
                          <TableHead className="w-[100px] font-medium text-gray-700">
                              สถานะ
                          </TableHead>
                          <TableHead className="w-[100px] font-medium text-gray-700">
                              การแสดงผล
                          </TableHead>
                          <TableHead className="w-[200px] font-medium text-gray-700">
                              
                          </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultTable.map((item,index) => (
                      <TableRow 
                        key={item.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleView(item.id)}
                      >
                        <TableCell className="text-center font-medium">
                            {index + 1}
                        </TableCell>
                        <TableCell className="max-w-[80px]">
                            <div className="truncate" title={item.department}>
                              {item.department}
                            </div>
                        </TableCell>
                        <TableCell className="text-left max-w-[250px] truncate">
                            {item.title}
                        </TableCell>
                        <TableCell className="text-left max-w-[400px] truncate">
                            {item.detial}
                        </TableCell>
                        <TableCell className="text-left font-medium">
                            {item.status}
                        </TableCell>
                        <TableCell className="max-w-[200px] text-left font-medium">
                          <div className="flex pl-2">
                            <li className={item.display == "Active" ? "text-green-500":"text-red-500"}/>
                            {item.display}
                          </div> 
                        </TableCell>
                        <TableCell className="max-w-[200px] text-center">
                          <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleView(item.id)
                                            }}
                                            title="ดูรายละเอียด"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEdit(item.id)
                                            }}
                                            title="แก้ไข"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(item.id)
                                            }}
                                            title="ลบ"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
            </div>
        </div>
      </div>
      
  );
}
