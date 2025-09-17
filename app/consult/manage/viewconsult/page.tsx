"use client";

import * as React from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigationHistory } from '@/hooks/navigation-history';
import { useConsultDocuments } from '@/hooks/useConsultDocuments';
import { Badge, ChevronLeft, Edit, LoaderIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@radix-ui/react-label";
import DropzoneComponent from "@/components/dropzone/dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignatureComponent } from "@/components/signature-component";
import { useRouter } from "next/navigation"


export default function ViewConsult() {
    const { goBack } = useNavigationHistory();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { documents, loading, error } = useConsultDocuments({
        id: Number(searchParams.get('id'))
      })
      console.log(searchParams.get('id'))
      console.log(documents.at(0))
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

    return (
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
                    ทะเบียนคุมเกร็ดความรู้
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
            <h1 className='text-lg'>เพิ่มเกร็ดความรู้</h1>
            <p className="text-muted-foreground text-sm text-balance pt-1 ">
            นำเสนอเกร็ดความรู้ให้แก่ผู้ใช้งาน
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
                onClick={handlePrerviewConsult}
                >ดูภาพรวม
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
            <h1 className='text-lg'>รายละเอียดของหัวข้อเกร็ดความรู้</h1>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            ชื่อเรื่อง 
            </p>
            <Input 
                name="input_Titile"
                placeholder= {data?.title === "" ? "ระบุชื่อเรื่อง..." : data?.title}
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            รายละเอียดของข้อมูล 
            </p>
            <Input 
                name="input_Detial"
                placeholder= {data?.detial === "" ? "ระบุเนื้อหา..." : data?.detial}
                className="max-w-300"
            />
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            วันที่จัดทำ
            </p>
            <Input 
                name="input_Createdate"
                placeholder="วว/ดด/ปป"
                className="max-w-300"
                type="date"
                defaultValue={new Date().toLocaleString()}
            />
            </div>
        </Card>
        <Card className="shadow-lg mt-4">
            <div className='content-left ml-4'>
            <h1 className='text-lg'>จัดประเภทหมวดหมู่</h1>
            <p className="text-muted-foreground text-sm text-balance pt-4 ">
            หมวดหมู่ 
            </p>
            <div className="grid gap-3 pt-4">
            <Select>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectItem value="1">Category1</SelectItem>
                    <SelectItem value="2">Category2</SelectItem>
                    <SelectItem value="3">Category3</SelectItem>
                    <SelectItem value="4">Category4</SelectItem>
                    <SelectItem value="5">Category5</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            </div>
            </div>
        </Card>
        <Card className="shadow-lg mt-4">
            <div className='content-left ml-4'>
            <h1 className='text-lg'>อัปโหลดวีดิโอเนื้อหาหรือสื่อรูปภาพที่ต้องการแสดง</h1>
                <Label className="pt-4" htmlFor="username-1">ประเภทเอกสาร</Label>
                    <Select>
                    <SelectTrigger className="w-[200px]">
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
                <div className="w-200 pt-4">
                    <DropzoneComponent />
                    <div className="flex gap-4 mt-4">
                      <Button variant="outline" className="flex-1">ยกเลิก</Button>
                      <Button className="flex-1 bg-[#3E52B9]"
                      onClick={handleSaved}
                      >บันทึก</Button>
                    </div>
                </div>
            </div>
        </Card>
        {/* dialog box here */}
        {/* dialog for preview */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog} >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-semibold">
                        Preview
                </DialogTitle>
                <h1>{data?.title}</h1>
            </DialogHeader>
            <div className="mt-4">
                {data?.detial}
            </div>
            <div className="mt-4 text-sm " 
            style={
                        {
                            textAlignLast:"right"
                        } as React.CSSProperties
                      }
            >
               วันที่ {new Date().toLocaleString()}
            </div>
            <div className="flex gap-4 mt-4">
                      <Button className="flex-1 bg-[#3E52B9]"
                      onClick={handleSaved}
                      >เสร็จสิ้น</Button>
                    </div>
            </DialogContent>
        </Dialog>
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
                       รายละเอียดของข้อมูล : {data?.detial}
                    </div>
                    <div className="text-sm text-balance ml-2">
                       หมวดหมู่ : {data?.department}
                    </div>
                </Card>
                <Card className="shadow-lg mt-4">
                    <div className="text-sm text-balance ml-2">
                       วันที่สร้าง : {new Date().toLocaleString()}
                    </div>
                </Card>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                อัปโหลดวิดีโอเนื้อหาหรือสื่อรูปภาพ 
                </p>
                <Card className="shadow-lg">
                    <div className="text-sm text-balance ml-2">
                       Pig00000.png
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
        {/* dialog for signed */}
        <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
            <DialogContent className="sm:max-w-lg">
                <DialogTitle className="font-semibold">
                        ลงลายมือชื่อ
                </DialogTitle>
                <p className="text-muted-foreground text-sm text-balance pt-4 ">
                ลงลายมือชื่อเพื่อพิจารณาอนุมัติ 
                </p>
                 {signatureChoice === 'new' && (
                        <div className="mt-4">
                        <SignatureComponent
                            onSignatureChange={setSignatureData}
                            initialName="ผู้อนุมัติ"
                        />
                        </div>
                    )}
                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" className="flex-1">ยกเลิก</Button>
                        <Button className="flex-1 bg-[#3E52B9]"
                        onClick={handleSignedConfirm}
                        >ยืนยัน</Button>
                </div>
            </DialogContent>
        </Dialog>
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