"use client"

import {
  ChevronRight,
  Folder,
  Forward,
  MoreHorizontal,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

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
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-full p-5 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <span>วางแผนงานตรวจสอบภายใน</span>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>หัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">ทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>



                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>ประเมิณแผนการตรวจสอบประจำปี</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>


                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>จัดทำแผนการตรวจสอบ</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">จัดทำแผนการตรวจสอบประจำปี</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">จัดทำแผนการตรวจสอบะยะยาว</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>


                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Folder className="text-muted-foreground" />
                      <span>ประเมินความเสี่ยงระดับแผนปฏิบัติงาน</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                        <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง</span>
                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                      <span className="text-sm">กำหนดเกณฑ์โอกาส</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="">
                    <span className="text-sm">ประเมินความเสี่ยงและการจัดลำดับความเสี่ยง</span>

                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>


                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />

                    <span>Audit Program / Engagement plan</span>

                </DropdownMenuItem>
{/*                 
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
