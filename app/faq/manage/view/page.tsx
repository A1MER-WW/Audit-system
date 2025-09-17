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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useFaqDocuments } from "@/hooks/useFaqDocument";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export default function FaqManageViewPage() {

    const { goBack } = useNavigationHistory();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { documents, loading, error } = useFaqDocuments({
            id: Number(searchParams.get('id'))
          })
    
    const data = documents.at(0)

    const [showPreviewDialog, setShowPreviewDialog] = React.useState<boolean>(false);
    const [showApproveDialog, setShowApproveDialog] = React.useState<boolean>(false);
    const [showSignDialog, setShowSignDialog] = React.useState<boolean>(false);
    const [signatureData, setSignatureData] = React.useState<{name: string; signature: string | null}>({name: "", signature: null});
    const [signatureChoice, setSignatureChoice] = React.useState<'new' | 'saved' | null>(null);
    const [showConpleteDialog, setShowCompleteDialog] = React.useState<boolean>(false);


    //---Event Handle
      const handleEditByPolicy =() =>{
        console.log("EditByPolicy")
      }
      const handlePrerviewConsult = () =>{
        console.log("PrerviewConsult")
        setShowPreviewDialog(true)
      }
      const handleToApprove =() => {
        console.log("PrerviewConsult")
        setShowApproveDialog(true)
      }
      const handleApproved =() => {
        console.log("PrerviewConsult")
        setSignatureChoice('new')
        setShowSignDialog(true)
      }
      const handleSaved =() => {
        console.log("Saved")
        setSignatureData({name: "", signature: null});
      }

      const handleSignedConfirm =() => {
        console.log("Saved")
        setSignatureData({name: "", signature: null});
        setShowCompleteDialog(true)
        setShowApproveDialog(false)
        setShowSignDialog(false)

        setTimeout(() =>{
            router.push('/consult')
        },2000)
      }
    //--------------------

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
                    ทะเบียนคุมงานให้บริการและคำปรึกษา(FAQ)
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
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
            <h1 className='text-lg'>ข้อมูลทะเบียนคุมงานบริการให้คำปรึกษา</h1>
            <p className="text-muted-foreground text-sm text-balance pt-1 ">
            ตรวจสอบความถูกต้องของข้อมูล
            </p>
            <div className='flex'>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                สถานะการดำเนินงาน : 
                </p>
                <p className='text-blue-500 text-sm text-balance pt-4 ml-2'>
                {data?.status}
                </p>
            </div>
          </div>
        </Card>
        {/* ในส่วนนี้ต้องดึง policy มา check เพื่อให้หัวหน้างานพิจารณา */}
        <div className="w-400 flex flex-row-reverse gap-4 mt-4 ">
            <Button 
                className=" bg-[#3E52B9]" 
                onClick={handleToApprove}
                >เสนอหัวหน้าหน่วยพิจารณา
            </Button>
            <Button 
                variant="outline" className=" w-30"
                onClick={handleEditByPolicy}  
                >แก้ไขข้อมูล
            </Button> 
        </div>
        {/* ------------------------------------------------------- */}
        <Card className="shadow-lg mt-4">
        <div className='content-left ml-4'>
            <h1 className='text-lg'>รายละเอียดของการบริการให้คำปรึกษา</h1>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            วันที่รับแจ้ง 
            </p>
            <Input 
                name="notificationdate"
                placeholder="วว/ดด/ปป"
                className="max-w-300"
                type="date"
                defaultValue={new Date().toLocaleString()}
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            หน่วยงาน 
            </p>
            <Input 
                name="department"
                placeholder= {data?.department === "" ? "ระบุหน่วยงาน..." : data?.department}
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            E-mail
            </p>
            <Input 
                name="email"
                placeholder= {data?.email === "" ? "ระบุหน่วยงาน..." : data?.email}
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            เบอร์ติดต่อ
            </p>
            <Input 
                name="email"
                placeholder= {data?.email === "" ? "ระบุเบอร์ติดต่อ..." : data?.email}
                className="max-w-300"
            />
            </div>
        </Card>
        <Card className="shadow-lg mt-4">
            <div className='content-left ml-4'>
                <h1 className='text-lg'>ชื่อเรื่องและประเด็นการตอบคำถาม</h1>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ชื่อเรื่อง 
                </p>
                <Input 
                name="title"
                placeholder= {data?.title === "" ? "ระบุชื่อเรื่อง..." : data?.title}
                className="max-w-300"
                />
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ประเด็นคำถาม 
                </p>
                <Input 
                name="issue_question"
                placeholder= {data?.issue_question === "" ? "ระบุประเด็นคำถาม..." : data?.issue_question}
                className="max-w-300"
                />
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ประเด็นคำตอบ
                </p>
                <Input 
                name="issue_answer"
                placeholder= {data?.issue_answer === "" ? "ระบุประเด็นคำตอบ..." : data?.issue_answer}
                className="max-w-300"
                />
            </div>
        </Card>
        <Card className="shadow-lg mt-4">
            <div className='content-left ml-4'>
                <h1 className='text-lg'>ผู้ที่ได้รับมอบหมายหน้าที่ตอบคำถาม</h1>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ผู้รับผิดชอบให้คำปรึกษา 
                </p>
                <Input 
                name="responsible_person"
                placeholder= {data?.responsible_person === "" ? "ระบุชื่อผู้รับผิดชอบ..." : data?.responsible_person}
                className="max-w-300"
                />
            </div>
        </Card>
        <div className="w-200 pt-4">
            <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1">ยกเลิก</Button>
                <Button className="flex-1 bg-[#3E52B9]"
                onClick={handleSaved}
                >บันทึก</Button>
            </div>
        </div>
        {/* dialog for approve */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog} >
             <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                <DialogTitle className="font-semibold">
                        เสนอหัวหน้าหน่วยพิจารณาอนุมัติ
                </DialogTitle>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ตรวจสอบความถูกต้อง 
                </p>
                </DialogHeader>
                <Card className="shadow-lg mt-4">
                    <div className="text-sm text-balance ml-2">
                        เรื่อง : {data?.title}
                    </div>
                    <div className="text-sm text-balance ml-2">
                       ประเด็นคำถาม : {data?.issue_question}
                    </div>
                    <div className="text-sm text-balance ml-2">
                       ประเด็นคำตอบ : {data?.issue_answer}
                    </div>
                </Card>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ยืนยันเพื่อเสนอพิจารณาหัวข้อของงานตรวจสอบ 
                </p>
                <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex-1">ยกเลิก</Button>
                    <Button className="flex-1 bg-[#3E52B9]"
                    onClick={handleApproved}
                    >ยืนยัน</Button>
                </div>
             </DialogContent>
        </Dialog>
    </div>
    )
}