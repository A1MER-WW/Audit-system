"use client"

import {
  Folder,
  Forward,
  Logs,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible"
import { Badge } from "@/components/ui/badge"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
      <SidebarGroupLabel>หัวข้อของงานตรวจสอบ</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Logs />
                  <span>{item.name}</span>
                  <Badge
                    className="h-5 w-5 rounded-full px-1 font-mono tabular-nums"
                    variant="destructive"
                  >
                    8
                  </Badge>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-full p-5 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <span>วางแผนงานตรวจสอบภายใน</span>


                {/* 1. Audit Universe */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>หัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">ทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด</span>
                    </a>
                  </SidebarMenuSub>

                </Collapsible>

                {/* 2. Annual Plan */}
                <Collapsible>

                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินแผนการตรวจสอบประจำปี</span>
                  </SidebarMenuButton>


                  <SidebarMenuSub>
                    <a href="/riskassessments">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง</span>
                      <Badge
                        className="h-5 w-5 rounded-full px-1 font-mono tabular-nums"
                        variant="destructive"
                      >
                        8
                      </Badge>
                    </a>

                  </SidebarMenuSub>

                </Collapsible>

                {/* 3. Audit Plan */}
                <Collapsible>

                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>จัดทำแผนการตรวจสอบ</span>
                  </SidebarMenuButton>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">จัดทำแผนการตรวจสอบประจำปี</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">จัดทำแผนการตรวจสอบระยะยาว</span>
                    </a>
                  </SidebarMenuSub>

                </Collapsible>

                {/* 4. Operational Risk */}
                <Collapsible>

                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินความเสี่ยงระดับแผนปฏิบัติงาน</span>
                  </SidebarMenuButton>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">กำหนดเกณฑ์โอกาส</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">ประเมินความเสี่ยงและการจัดลำดับความเสี่ยง</span>
                    </a>
                  </SidebarMenuSub>

                </Collapsible>

                {/* 5. Final Item */}
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Audit Program / Engagement plan</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>

  )
}
