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
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);
    const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [searchValue, setSearchValue] = React.useState("")
    const [inputValue, setInputValue] = React.useState('');
    const [showFilterDialog, setShowFilterDialog] = React.useState<boolean>(false);
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
    const handleSearchClick = () => {
      setSearchValue(inputValue);
    };
    const handleAdd = () => {
    console.log(" Add ")
    router.push(`/law-record/manage/add`)
    }
    const handleFilter = () => {
    setShowFilterDialog(true)
    }
    const handleEdit = (id: number, name:string) => {
        console.log(" ID:", id)
        router.push(`/law-record/manage/edit?id=${id}&name=${encodeURIComponent(name)}`)
    }

    //------------------------------------------

    const tableView = useReactTable({
        data: documents,
        columns,
        state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        },
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
        <div className=" justify-items-end items-center py-4">
                <div className="flex">
                <Input
                placeholder="ค้นหา..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="max-w-sm"
                />
                {/* Search Button */}
                <div className="items-center ml-4">
    
                    <Button variant="outline" 
                    className="text-[#FFFFFF] border-[#3E52B9] bg-[#3E52B9]"
                    onClick={handleSearchClick}
                    >
                        ค้นหา
                    </Button>
                </div>
                {/* Filter Button */}
                <div className="flex justify-end items-center ml-4">
    
                    <Button variant="outline" 
                        className="text-[#3E52B9] border-[#3E52B9]"
                    onClick={handleFilter}
                        >
                            Filter
                    </Button>
                </div>
                {/* Add Button */}
                <div className="items-center ml-4">
    
                    <Button variant="outline" 
                    className="text-[#FFFFFF] border-[#3E52B9] bg-[#3E52B9]"
                    onClick={handleAdd}
                    >
                        เพิ่มข้อมูล
                    </Button>
                </div>
                </div>
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit(row.index+1,row.original.type)
                                        }}
                                        title="แก้ไข"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
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
        {/* Dialog session */}
        {/* filter Dialog */}
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base text-gray-900">
                        ตัวกรอง
                    </DialogTitle>
                </DialogHeader>
                <div className="w-full">
                    <h1>ข้อมูลทางด้านกฏหมาย</h1>
                    <p className="text-muted-foreground text-sm text-balance pt-4 ">
                    หมวดหมู่ 
                    </p> 
                    <Input 
                        name="category"
                        placeholder= "หมวดหมู่..."
                        className="max-w-300"
                    />    
                </div>
                <div className="w-full">
                    <p className="text-muted-foreground text-sm text-balance pt-4 ">
                    ประเภท 
                    </p> 
                    <Input 
                        name="category"
                        placeholder= "ประเภท..."
                        className="max-w-300"
                    />    
                </div>
                <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex-1">ยกเลิก</Button>
                    <Button className="flex-1 bg-[#3E52B9]"
                    // onClick={}
                    >กรองข้อมูล</Button>
                </div>
            </DialogContent>
        </Dialog>
        {/* dialog box here */}
       {/* dialog for preview */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog} >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-semibold">
                        ตัวกรอง
                </DialogTitle>
                <Card className="shadow-lg">
                  <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
                    <h1>หมวดหมู่</h1>
                    <div className="mt-2">
                      <Select>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="1">Category1</SelectItem>
                            <SelectItem value="2">Category2</SelectItem>
                            <SelectItem value="3">Category3</SelectItem>
                            <SelectItem value="4">Category4</SelectItem>
                            <SelectItem value="5">Category5</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    </div>
                    <h1 className="mt-4">ประเภท</h1>
                    <div className="mt-2">
                      <Select>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="1">Category1</SelectItem>
                            <SelectItem value="2">Category2</SelectItem>
                            <SelectItem value="3">Category3</SelectItem>
                            <SelectItem value="4">Category4</SelectItem>
                            <SelectItem value="5">Category5</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    </div>
                    <h1 className="mt-4">สถานะ</h1>
                    <div className="mt-2">
                      <Select>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="1">Category1</SelectItem>
                            <SelectItem value="2">Category2</SelectItem>
                            <SelectItem value="3">Category3</SelectItem>
                            <SelectItem value="4">Category4</SelectItem>
                            <SelectItem value="5">Category5</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
            </DialogHeader>
            <div className="justify-self-end items-center py-4">
                <Button className=" bg-[#3E52B9] w-[100px]"
                // onClick={handleSignedConfirm}
                >กรองข้อมูล</Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
    )
}