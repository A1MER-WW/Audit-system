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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";


export default function FaqPage() {

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
                    ทะเบียนคุมเกร็ดความรู้
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
    </div>
    )
}