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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";



export default function ConsultSystemPage() {

  const [showFormDialog, setShowFormDialog] = React.useState<boolean>(false);

  const handleShowForm =() => {
        setShowFormDialog(true);
      }

    return(
    <div className="w-full">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-end">
            <Button 
                  variant="outline" className=" mt-4 bg-[#3E52B9]"
                  onClick={handleShowForm}  
                  >กรอกแบบฟอรฺ์มรับบริการ
              </Button> 
          </div>
          <div>
            <table>
              <tr>
                  <table className="mt-6">
                    <tr>
                      <td className="w-80">
                        <div className="justify-start">
                        <h1 className='text-lg'>เกร็ดความรู้</h1>
                        <p className="text-muted-foreground text-sm text-balance pt-1 ">
                        แสดงรายการเกร็ดความรู้ล่าสุด 5 รายการ
                        </p>
                        <Button 
                            variant="outline" className=" w-30 mt-4 bg-[#3E52B9]"
                            // onClick={handleEditByPolicy}  
                            >ดูทั้งหมด
                        </Button> 
                        </div>
                      </td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                  </table>
              </tr>
              <tr>
                  <table className="mt-6">
                    <tr>
                      <td className="w-80">
                        <div className="justify-start">
                        <h1 className='text-lg'>รายการ FAQ</h1>
                        <p className="text-muted-foreground text-sm text-balance pt-1 ">
                        แสดงรายการเกร็ดความรู้ล่าสุด 5 รายการ
                        </p>
                        <Button 
                            variant="outline" className=" w-30 mt-4 bg-[#3E52B9]"
                            // onClick={handleEditByPolicy}  
                            >ดูทั้งหมด
                        </Button> 
                        </div>
                      </td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">

                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                  </table>
              </tr>
              <tr>
                  <table className="mt-6">
                    <tr>
                      <td className="w-80">
                        <div className="justify-start">
                        <h1 className='text-lg'>ข้อมูลทางด้านกฏหมาย</h1>
                        <p className="text-muted-foreground text-sm text-balance pt-1 ">
                        แสดงรายการเกร็ดความรู้ล่าสุด 5 รายการ
                        </p>
                        <Button 
                            variant="outline" className=" w-30 mt-4 bg-[#3E52B9]"
                            // onClick={handleEditByPolicy}  
                            >ดูทั้งหมด
                        </Button> 
                        </div>
                      </td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">

                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="w-300">
                        <Card className="w-200 shadow-lg mt-4">
                          <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                              tttttttttttttttttttt
                          </div>
                        </Card>
                      </td>
                    </tr>
                  </table>
              </tr>
            </table>
          </div>
        </div>
        {/* dialog box here */}
        {/* dialog for preview */}
        <Dialog open={showFormDialog} onOpenChange={setShowFormDialog} >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-semibold">
                        Form
                </DialogTitle>
                <h1>แบบฟอร์ม</h1>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </div>
    )
}