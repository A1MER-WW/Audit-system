"use client";

import * as React from "react"
import { useNavigationHistory } from "@/hooks/navigation-history";

import {
  ChevronDown,
  ChevronLeft ,
  Edit,
  Eye,
  Trash2,
  type LucideIcon
} from "lucide-react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


export default function LowRecordPage() {

    const { goBack } = useNavigationHistory();
 
    return(
    <div className="w-full">
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
                  <BreadcrumbSeparator />
                  <BreadcrumbItem >
                    ฐานข้อมูลกฏหมาย
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
        <Card className="shadow-lg">
          <div className='content-left ml-4'>
            <h1 className='text-lg text-center'>ฐานข้อมูลกฏหมาย</h1>
            <p className="text-muted-foreground text-center text-sm text-balance pt-1 ">
            ศูนย์รวมข้อมูลและคำตอบสำหรับทุกข้อสงสัยของคุณ ที่นี่คุณสามารถค้นพบคำแนะนำและข้อมูลที่ครอบคลุมเกี่ยวกับการตรวจสอบภายใน และบริการต่างๆ ของเรา รวมถึงข้อสงสัยเกี่ยวกับกฏหมายที่เกี่ยวข้อง เพื่อให้คุณมั่นใจในทุกการดำเนินการ
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex1"></div>
              <Input 
                  name="input_Titile"
                  placeholder= "search"
                  className=" flex1 w-100 mt-4"
              />
              <div className="flex1"></div>
              <Button 
                  variant="outline" className=" w-30 mt-4 "
                  // onClick={handleEditByPolicy}  
                  >filter
              </Button> 
              <Button 
                  variant="outline" className=" w-30 mt-4 bg-[#3E52B9]"
                  // onClick={handleEditByPolicy}  
                  >ค้นหา
              </Button> 
            </div>
          </div>
        </Card>
        <div className="mt-4">
          <table>
            <tr>
              <td className="w-70">
              <Card className="w-70 h-600 shadow-lg">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                  <ul className="space-y-2 font-medium">
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">ค่าใช้จ่ายในการเดินทางไปราชการ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">ค่าใช้จ่ายในการฝึกอบรมการจัดงานและการประชุมระหว่างประเทศ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">การบริหารความเสี่ยงและควบคุมภายใน</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">งบประมาณและการบริหารงบประมาณ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">การจัดซื้อจัดจ้างและการบริหารพัสดุ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">การเบิกจ่ายเงินช่วยเหลือสวัสดิการของรัฐ(ค่าเช่าบ้าน ค่ารักษาพยาบาล ค่าการศึกษาบุตร)</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">การบริหารงานโครงการสำคัญ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          <span className="flex-1 ms-3 whitespace-wrap text-wrap text-sm">อื่นๆ</span>
                        </a>
                    </li>
                  </ul>
                </div>
              </Card>
              </td>
              <td className="w-200">
              <Card className="w-200 h-600 shadow-lg ml-4">
                  {/* Content ที่ดึงออกมาแสดง */}
              </Card>
              </td>
            </tr>
          </table>
        </div>
    </div>
    )
}