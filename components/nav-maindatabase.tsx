"use client"

import {
  Database,
  Folder,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"

export function NavMainDatabase({
  icondata = [],
}: {
  icondata?: {
    name: string
  }[]
}) {
  const { isMobile } = useSidebar()

  if (!icondata || icondata.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Database />
                  <span>ฐานข้อมูลหลัก</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-full p-5 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <span> ฐานข้อมูลหลัก</span>

                {/* 1. Audit Universe */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>หมวดหมู่ของ Audit Universe ที่กฏหมายกำหนด</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </Collapsible>

                {/* 2. Annual Plan */}
                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินแผนการตรวจสอบประจำปี</span>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    <Link href="/maindatabase/risk-factors" className="relative overflow-hidden group">
                      <span className="text-sm relative z-10">รายการด้านของปัจจัยเสี่ยง</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link href="/maindatabase/risk-criteria" className="relative overflow-hidden group">
                      <span className="text-sm relative z-10">รายการเกณฑ์พิจารณาความเสี่ยง</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                </Collapsible>

                {/* 3. Audit Plan */}
                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <Link href="/maindatabase/plan" className="relative overflow-hidden group">
                      <span className="relative z-10">แผนการใช้จ่ายงบประมาณที่ได้รับจัดสรร (หัวหน้ากลุ่มตรวจสอบภายใน)</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuButton>
                </Collapsible>

                {/* 4. Operational Risk */}
                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ชั่วโมงคน</span>
                  </SidebarMenuButton>
                </Collapsible>

                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินความเสี่ยงระดับแผนปฏิบัติงาน</span>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">รายการด้านของปัจจัยเสี่ยง</span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">รายการเกณฑ์พิจารณาความเสี่ยง</span>
                    </a>
                  </SidebarMenuSub>
                </Collapsible>

                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>หน่วยงานทั้งหมดที่เกี่ยวข้อง</span>
                  </SidebarMenuButton>
                </Collapsible>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
      <SidebarMenu>
        {icondata.map((item) => (
          <SidebarMenuItem key={item.name}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
              <Database />
            
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-full p-5 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <span> ฐานข้อมูลหลัก</span>


                {/* 1. Audit Universe */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>หมวดหมู่ของ Audit Universe ที่กฏหมายกำหนด</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </Collapsible>

                {/* 2. Annual Plan */}
                <Collapsible>

                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินแผนการตรวจสอบประจำปี</span>
                  </SidebarMenuButton>


                  <SidebarMenuSub>
                    <Link href="/maindatabase/risk-factors" className="relative overflow-hidden group">
                      <span className="text-sm relative z-10">รายการด้านของปัจจัยเสี่ยง</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <Link href="/maindatabase/risk-criteria" className="relative overflow-hidden group">
                      <span className="text-sm relative z-10">รายการเกณฑ์พิจารณาความเสี่ยง</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>

                  </SidebarMenuSub>

                </Collapsible>

                {/* 3. Audit Plan */}
                  
                <Collapsible>
              
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <Link href="/maindatabase/plan" className="relative overflow-hidden group">
                      <span className="relative z-10">แผนการใช้จ่ายงบประมาณที่ได้รับจัดสรร</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuButton>

                </Collapsible>

                {/* 4. Operational Risk */}
                <Collapsible>

                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ชั่วโมงคน</span>
                  </SidebarMenuButton>

                </Collapsible>
                <Collapsible>

                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินความเสี่ยงระดับแผนปฏิบัติงาน</span>
                  </SidebarMenuButton>


                  <SidebarMenuSub>
                    <Link href="/maindatabase/operational-risk-factors" className="relative overflow-hidden group">
                      <span className="text-sm relative z-10">รายการด้านของปัจจัยเสี่ยง</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <Link href="/maindatabase/operational-risk-criteria" className="relative overflow-hidden group">
                      <span className="text-sm relative z-10">รายการเกณฑ์พิจารณาความเสี่ยง</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>


                </Collapsible>

                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>หน่วยงานทั้งหมดที่เกี่ยวข้อง</span>
                  </SidebarMenuButton>
                </Collapsible>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
