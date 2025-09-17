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


export default function FaqManageViewPage() {

    const { goBack } = useNavigationHistory();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { documents, loading, error } = useFaqDocuments({
            id: Number(searchParams.get('id'))
          })
    
    const data = documents.at(0)

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
    </div>
    )
}