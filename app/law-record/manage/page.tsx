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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { 
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,

} from "@tanstack/react-table";

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { lawRecordDocumentType, useLawRecordDocuments } from "@/hooks/useLawRecordDocument";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const columns: ColumnDef<lawRecordDocumentType>[] = [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    header: "ลำดับ",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.index + 1}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "หมวดหมู่",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "ประเภท",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "๊url",
    header: "URL",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("๊url")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => (
      <div className="flex max-w-[200px] text-left font-medium">
        <li className={row.getValue("status") == "Active" ? "text-green-500":"text-red-500"}/>
        {row.getValue("status")}
    </div>
    ),
  },
]

export default function LowRecordManagePage() {

    const { goBack } = useNavigationHistory();
    const [activeTab, setActiveTab] = useState("tab1")

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
    )
    const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [searchValue, setSearchValue] = React.useState("")
    const router = useRouter()

    // ใช้ useDocuments hook เพื่อดึงข้อมูลจาก API
    const { documents, loading, error, refetch } = useLawRecordDocuments({
    search: searchValue
    })

    //-----------Handle-------------------------

    const handleTabChange = (value: string) => {
            setActiveTab(value)
            localStorage.setItem("faq-active-tab", value)
        }
    const handleView = (id: number , name:string) => {
        router.push(`/faq/manage/view?id=${id}&name=${encodeURIComponent(name)}`)
    }
    const handleEdit = (id: number, name:string) => {
        console.log(" ID:", id)
        router.push(`/faq/manage/view?id=${id}&name=${encodeURIComponent(name)}`)
    }
    const handleDelete = (id: number) => {
        console.log(" ID:", id)
    }

    //------------------------------------------

    const tableView = useReactTable({
        data: documents,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
        pagination: {
            pageSize: 15, 
        },
        },
        state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        },
    })
 
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
                    ทะเบียนคุมฐานข้อมูลด้านกฎหมาย
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
                  <div>
        <h1>จัดการฐานข้อมูลทางด้านกฏหมาย</h1>
            <p className="text-muted-foreground text-sm text-balance pt-1 ">
            แก้ไขและบันทึกข้อสงสัยเกี่ยวกับกฏหมายที่เกี่ยวข้อง
            </p>
        </div>
        {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            ข้อผิดพลาด: {error}
            <button 
            // onClick={refetch}
            className="ml-2 text-red-800 underline hover:no-underline"
            >
            ลองใหม่
            </button>
        </div>
        )}
            <div className="flex item-center py-4">
                <div className="item-center mt-1 w-max-150">
                    หมวดหมู่
                </div>
                <div className="ml-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto ">
                            บริหารความเสี่ยงและควบคุมภายใน <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg" align="start">
                        <DropdownMenuCheckboxItem>
                            บริหารความเสี่ยงและควบคุมภายใน 
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                            บริหารความเสี่ยงและควบคุมภายใน 
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                            บริหารความเสี่ยงและควบคุมภายใน 
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
            <div className="flex items-center py-4">
                    <Input
                    placeholder="ค้นหาชื่อเอกสาร..."
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    className="max-w-sm"
                    />
                    {/* Filter Button */}
                    <div className="flex justify-end items-center ml-4">

                        <Button variant="outline" className="text-[#3E52B9] border-[#3E52B9]">
                            กรอง
                        </Button>
                    </div>
                    {/* add Button */}
                    <div className="flex justify-end items-center ml-4">

                        <Button variant="outline" className=" text-[#FFFFFF] border-[#3E52B9] bg-[#3E52B9]">
                            เพิ่มข้อมูล
                        </Button>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            คอลัมน์ <ChevronDown />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg" align="end">
                        {tableView
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            // แปลชื่อคอลัมน์เป็นภาษาไทย
                            const getColumnDisplayName = (columnId: string) => {
                            switch (columnId) {
                                case "notificationdate":
                                return "วันที่แจ้ง"
                                case "department":
                                return "หน่วยงาน"
                                case "category":
                                return "หมวดหมู่"
                                case "title":
                                return "ชื่อเรื่อง"
                                case "issue_question":
                                return "ประเด็นคำถาม"
                                case "issue_answer":
                                return "ประเด็นคำตอบ"
                                case "phonenumber":
                                return "เบอร์โทร"
                                case "email":
                                return "E-mail"
                                case "responsible_person":
                                return "ผู้รับผิดชอบ"
                                case "status":
                                return "สถานะ"
                                case "display":
                                return "การแสดงผล"
                                case "actions":
                                return "การดำเนินการ"
                                default:
                                return columnId
                            }
                            }

                            return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                                }
                            >
                                {getColumnDisplayName(column.id)}
                            </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                    </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {tableView.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
                            })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            // แสดง loading state
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                    <span className="ml-2">กำลังโหลดข้อมูล...</span>
                                </div>
                                </TableCell>
                            </TableRow>
                            ) : tableView.getRowModel().rows?.length ? (
                            tableView.getRowModel().rows.map((row) => (
                                <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                    {/* //-- view
                                        <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleView(row.index+1,row.original.title)
                                        }}
                                        title="ดูรายละเอียด"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button> */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit(row.index+1,row.original.category)
                                        }}
                                        title="แก้ไข"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    {/*  // --- delete
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(row.index+1)
                                        }}
                                        title="ลบ"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button> */}
                                </div>
                                </TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                                >
                                ไม่พบข้อมูล
                                </TableCell>
                            </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
    )
}