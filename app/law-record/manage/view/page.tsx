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

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { useLawRecordDocuments } from "@/hooks/useLawRecordDocument";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";


export default function LowRecordManageViewPage() {

    const { goBack } = useNavigationHistory();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { documents, loading, error } = useLawRecordDocuments({
            id: Number(searchParams.get('id'))
          })

    const data = documents.at(0)
    const [showConpleteDialog, setShowCompleteDialog] = React.useState<boolean>(false);
 
    const handleSignedConfirm =() => {
        console.log("Saved")
        setShowCompleteDialog(true)

        setTimeout(() =>{
            router.push('/law-record/manage')
        },2000)
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
                    {searchParams.values().toArray().at(1)}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
        <Card className="shadow-lg ">
          <div className='content-left ml-4'>
            <h1 className='text-lg'>ข้อมูลทางด้านกฏหมาย</h1>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            หมวดหมู่
            </p>
            <Input 
                name="category"
                placeholder= {data?.category === "" ? "ระบุหมวดหมู่..." : data?.category}
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            ประเภท
            </p>
            <Input 
                name="type"
                placeholder= {data?.type === "" ? "ระบุประเภท..." : data?.type}
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            URL
            </p>
            <Input 
                name="url"
                placeholder= {data?.url === "" ? "ระบุประเภท..." : data?.url}
                className="max-w-300"
            />
          </div>
        </Card>
        <Card className="shadow-lg ">
          <div className='content-left ml-4'>
            <h1 className='text-lg'>สถานะการใช้งาน</h1>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            อนุมัติใช้งาน
            </p>
            <Input 
                name="status"
                placeholder= {data?.status === "" ? "ระบุสถานะ..." : data?.status}
                className="max-w-300"
            />
            </div>
        </Card>
        <Card className="shadow-lg ">
          <div className='content-left ml-4'>
            <h1 className='text-lg'>ต้องการลบข้อมูลนี้ใช่หรือไม่</h1>
            <div className="flex">
              <p className="text-muted-foreground text-sm text-balance pt-4 ">
              ลบฐานข้อมูลด้านกฏหมายนี้
              </p>
              <Button variant="outline" className="mt-2 ml-4 bg-red-500">ลบข้อมูล</Button>
            </div>
          </div>
        </Card>
        <div className="flex gap-4 mt-4 ">
            <Button variant="outline" className="w-[100px]">ยกเลิก</Button>
            <Button className=" bg-[#3E52B9] w-[100px]"
            onClick={handleSignedConfirm}
            >ยืนยัน</Button>
        </div>
        {/* dialog for Complate */}
        <Dialog open={showConpleteDialog} onOpenChange={setShowCompleteDialog}>
            <DialogContent className="sm:max-w-lg">
                <DialogTitle className="font-semibold">
                        อนุมัติเรียบร้อย
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                </DialogTitle>
            </DialogContent>
        </Dialog>
    </div>
    )
}