"use client";

import * as React from "react"
import { useNavigationHistory } from "@/hooks/navigation-history";

import {
  ChevronDown,
  ChevronLeft ,
  CircleGauge,
  Edit,
  Eye,
  Sidebar,
  Trash2,
  type LucideIcon
} from "lucide-react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import Image from 'next/image'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


export default function FaqPage() {

    const { goBack } = useNavigationHistory();

    const handleSaved =() => {
        console.log("Saved")
      }

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
                    กรอกแบบฟอร์มขอรับบริการ
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
                <Image
                    src="/images/Office_of_Agricultural_Economics_Logo.png"
                    alt="logoImage"
                    width={100}
                    height={70}
                    className=" max-w-md md:max-w-lg lg:max-w-xl"
                />
        </div>
        <div className='justify-center mt-4'>
        <h1 className='text-lg text-center'>แบบฟอร์มการขอรับบริการให้คำปรึกษา</h1>
        <p className="text-center text-muted-foreground text-sm text-balance pt-2 ">
        กลุ่มตรวจสอบภายใน สำนักงานเศรษฐกิจการเกษตร  
        </p>
        <Card className="shadow-lg ">
          <div className='content-left ml-4'>
            <h1 className='text-lg'>ผู้ขอรับบริการ</h1>
            <hr className="mt-4 w-[98%]"/>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            ชื่อ
            </p>
            <Input 
                name="name"
                placeholder= "ชื่อผู้ใช้"
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            นามสกุล
            </p>
            <Input 
                name="surname"
                placeholder= "นามสกุลผู้ใช้"
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            ตำแหน่ง
            </p>
            <Input 
                name="surname"
                placeholder= "ตำแหน่ง"
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            หน่วยงาน
            </p>
            <Input 
                name="surname"
                placeholder= "หน่วยงาน"
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            โทรศัพท์
            </p>
            <Input 
                name="surname"
                placeholder= "โทรศัพท์"
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            อีเมล
            </p>
            <Input 
                name="surname"
                placeholder= "อีเมล"
                className="max-w-300"
            />
            <h1 className='text-lg mt-4'>เรื่องที่ขอรับบริการ</h1>
            <hr className="mt-4 w-[98%]"/>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            โปรดระบุรายละเอียด
            </p>
            <Select>
                <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
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
            <h1 className='text-lg mt-4'>ประเด็นคำถาม</h1>
            <hr className="mt-4 w-[98%]"/>
            <Textarea className="mt-4 w-200"
            placeholder="โปรดระบุประเด็นคำถาม"
            >
            </Textarea>
            <h1 className='text-lg mt-4'>วัตถุประสงค์/ความคาดหวังของผู้ขอรับบริการ</h1>
            <hr className="mt-4 w-[98%]"/>
            <Textarea className="mt-4 w-200"
            placeholder="โปรดระบุวัตถุประสงค์/ความคาดหวังของผู้ขอรับบริการ"
            >
            </Textarea>
          </div>
          <div className="flex gap-4 mt-4 ml-4">
              <Button variant="outline" className="w-[100px]">ยกเลิก</Button>
              <Button className=" bg-[#3E52B9] w-[100px]"
              // onClick={handleSignedConfirm}
              >ยืนยัน</Button>
          </div>
        </Card>
        </div>
    </div>
    )
}