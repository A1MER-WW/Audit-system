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
                    <Link
                      href="/planaudit"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        ทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)
                        (ผู้ตรวจสอบ)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link
                      href="/planaudit/thetopics-manager"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        ทบทวนหัวข้อของงานตรวจสอบทั้งหมด (Audit Universe)
                        (หัวหน้ากลุ่มตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link
                      href="/planaudit/theaudittopics"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        จัดการหัวข้อของงานตรวจสอบ (ผู้ตรวจสอบ)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link
                      href="/reports/summary"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด (ผู้ตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link
                      href="/reports/summary-manager"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        สรุปความเห็นหัวข้อของงานตรวจสอบทั้งหมด
                        (หัวหน้าหน่วยตรวจสอบ)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/comment"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        แสดงความคิดเห็นหัวข้อของงานตรวจสอบ (หน่วยงานในสังกัด)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link
                      href="/planaudit/alltopics"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        จัดการหัวข้องานตรวจสอบทั้งหมด (ผู้ตรวจสอบ)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
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
                    <a
                      href="/risk-evaluation"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm">
                        การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
                        (ผู้ตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <a
                      href="/chief-inspector-evaluation-results"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm">
                        การประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
                        (หัวหน้ากลุ่มตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </a>
                  </SidebarMenuSub>
                </Collapsible>

                {/* 3. Audit Plan */}
                <Collapsible>
                  <SidebarMenuButton>
                    <Folder className="text-muted-foreground" />
                    <span>จัดทำแผนการตรวจสอบ</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    <Link
                      href="/audit/annual-plan"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        จัดทำแผนการตรวจสอบประจำปี (ผู้ตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/audit/annual-manager"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        จัดทำแผนการตรวจสอบประจำปี (หัวหน้ากลุ่มตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/audit/inspection-plan"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        จัดทำแผนการตรวจสอบระยะยาว (หัวหน้ากลุ่มตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/audit/inspection-plan-agencies"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        จัดทำแผนการตรวจสอบระยะยาว (หน่วยงานในสังกัด)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
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
                      <span className="text-sm">กำหนดเกณฑ์โอกาส</span>
                    </a>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/audit-program-risk-evaluation"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        ประเมินความเสี่ยงและการจัดลำดับความเสี่ยง(ผู้ตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <Link
                      href="/chief-audit-program-risk-evaluation"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        ประเมินความเสี่ยงและการจัดลำดับความเสี่ยง(หัวหน้ากลุ่มตรวจสอบภายใน)
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/audit/opportunity-criteria"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        กำหนดเกณฑ์โอกาส
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>

                  <SidebarMenuSub>
                    <Link
                      href="/audit/operational-risk-assessment"
                      className="relative overflow-hidden group"
                    >
                      <span className="text-sm relative z-10">
                        ประเมินความเสี่ยงและการจัดลำดับความเสี่ยง
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3E52B9] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </SidebarMenuSub>
                </Collapsible>

                {/* 5. Final Item */}
                <Link href="/audit-engagement-plan">
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Audit Program / Engagement plan</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
