"use client";

import { Folder, Forward, Logs, type LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();

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
                    <Link href="/planaudit">
                      <span className="text-sm">
                        ทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)
                        (ผู้ตรวจสอบ)
                      </span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link href="/planaudit/thetopics-manager">
                      <span className="text-sm">
                        ทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)
                        (หัวหน้ากลุ่มตรวจสอบภายใน)
                      </span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link href="/planaudit/theaudittopics">
                      <span className="text-sm">
                        จัดการหัวข้อของงานตรวจสอบ (ผู้ตรวจสอบ)
                      </span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link href="/summary">
                      <span className="text-sm">
                        สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด (ผู้ตรวจสอบภายใน)
                      </span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link href="/summary-manager">
                      <span className="text-sm">
                        สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด
                        (หัวหน้าหน่วยตรวจสอบ)
                      </span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link href="/comment">
                      <span className="text-sm">
                        แสดงความคิดเห็นหัวข้อของงานตรวจสอบ (หน่วยงานในสังกัด)
                      </span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link href="/planaudit/alltopics">
                      <span className="text-sm">
                        จัดการหัวข้องานตรวจสอบทั้งหมด (ผู้ตรวจสอบ)
                      </span>
                    </Link>
                  </SidebarMenuSub>
                </Collapsible>

                {/* 2. Annual Plan */}
                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>ประเมินแผนการตรวจสอบประจำปี</span>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    <a href="/risk-assessments">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง</span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <a href="/chief-internal-auditor">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง(หัวหน้าผู้ตรวจสอบ)</span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <a href="/risk-assessments">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง(หน่วยงานในสังกัด)</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="/risk-assessment">
                      <span className="text-sm">
                        การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
                        (ผู้ตรวจสอบ)
                      </span>
                      <Badge
                        className="h-5 w-5 rounded-full px-1 font-mono tabular-nums"
                        variant="destructive"
                      >
                        8
                      </Badge>
                    </a>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <a href="/chief-inspector-assessment-results">
                      <span className="text-sm">
                        การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
                        (หัวหน้าผู้ตรวจสอบ)
                      </span>
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
                      <span className="text-sm">
                        กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง
                      </span>
                    </a>
                  </SidebarMenuSub>
                  

                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง(หัวหน้าผู้ตรวจสอบ)</span>
                    </a>
                  </SidebarMenuSub>


                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง(หน่วยงานในสังกัด)</span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <a href="">
                      <span className="text-sm">กำหนดเกณฑ์โอกาส</span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link href="/audit-program-risk-evaluation">
                      <span className="text-sm">
                        ประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
                      </span>
                    </Link>
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
  );
}
