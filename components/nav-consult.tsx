"use client"

import {
  Folder,
  MessageCircleQuestionMark,
  FileSearch2 ,
  NotebookPen ,
  FilePen,
  Globe ,
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Item } from "@radix-ui/react-dropdown-menu"

export function NavConsults({
    consults = [],
}: {
    consults?:{
        name: string
    }[]
}){
    const { isMobile } = useSidebar()

    if (!consults || consults.length === 0) {
        return(
           <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                            <MessageCircleQuestionMark />
                            <span>ระบบให้คำปรึกษา</span>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                         <DropdownMenuContent
                            className="w-full p-5 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                        >
                            <span> ระบบให้คำปรึกษา</span>

                            {/* 1.  Knowledge Control Register*/}
                            <Collapsible>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                <FileSearch2 className="text-muted-foreground" />
                                <Link href="/consult/manage" key="consult">
                                <span>ทะเบียนคุมเกร็ดความรู้</span>
                                </Link>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            </Collapsible>

                            {/* 2.  FAQ*/}
                            <Collapsible>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                <NotebookPen className="text-muted-foreground" />
                                <Link href="/faq/manage" key="faq">
                                <span>ทะเบียนคุมงานให้บริการและคำปรึกษา (FAQ)</span>
                                </Link>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            </Collapsible>

                            {/* 3.  Legal database control register*/}
                            <Collapsible>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                <FilePen className="text-muted-foreground" />
                                <Link href="/law-record/manage" key="law-record">
                                <span>ทะเบียนคุมฐานข้อมูลด้านกฎหมาย</span>
                                </Link>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            </Collapsible>

                            {/* 4.  ETC*/}
                            <Collapsible>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                <Globe  className="text-muted-foreground" />
                                <Link href="/" key="">
                                <span>เว็ปไซต์ระบบให้คำปรึกษา</span>
                                </Link>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            </Collapsible>
                            
                         </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
           </SidebarGroup> 
        )
    }

    return(
        <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
            <SidebarGroupLabel>ระบบให้คำปรึกษา</SidebarGroupLabel>
            <SidebarMenu>
                {consults.map((item) => (
          <SidebarMenuItem key={item.name}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
              <FileSearch2 />
            
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            
              
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
            </SidebarMenu>
        </SidebarGroup>
    )

}