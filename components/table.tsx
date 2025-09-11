"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import {  ChevronDown,  } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { 
  DownloadOutlined,
  DeleteOutlined,
  FileTextOutlined
 } from '@ant-design/icons'

import { useDocuments, type Document as DocumentType } from "@/hooks/useDocuments"

export const columns: ColumnDef<DocumentType>[] = [
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
    id: "rowNumber",
    header: "ลำดับ",
    cell: ({ row }) => {
      // ใช้ row.index + 1 เพื่อให้ได้ลำดับที่ถูกต้องเสมอ
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
    accessorKey: "documentName",
    header: "ชื่อไฟล์",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue("documentName")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "ประเภทของเอกสาร",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "year",
    header: "ปีงบประมาณ",
    cell: ({ row }) => (
      <div className="">{row.getValue("year")}</div>
    ),
  },
  {
    accessorKey: "dateUploaded",
    header: "วัน/เวลาที่บันทึก",
    cell: ({ row }) => (
      <div className="">{row.getValue("dateUploaded")}</div>
    ),
  },
  {
    accessorKey: "fileType",
    header: "รูปแบบไฟล์",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded">
          <FileTextOutlined />{row.getValue("fileType")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "การดำเนินการ",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">ดาวน์โหลด</span>
            <DownloadOutlined />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">ลบ</span>
           <DeleteOutlined />
          </Button>
        </div>
      )
    },
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchValue, setSearchValue] = React.useState("")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState<boolean>(false)
  const [selectedYear, setSelectedYear] = React.useState<string>("2568")
  const [filterSelections, setFilterSelections] = React.useState<Record<string, boolean>>({})

  // Filter options
  const filterOptions = {
    auditTypes: [
      'ทั้งหมด',
      'แผนการปฏิบัติงาน สกท.',
      'แผนการกำกับดูแล สกท.',
      'ข้อสังเกตการตรวจสอบทั้งหมด',
      'แผนงานดีการบริหารทีมที่มีข้อสังเกตการตรวจสอบทั้งหมด',
      'บัญชีกิจกรรมแผนตรวจสอบต่างๆที่มีกิจกรรมกำหนดกรอบค่าตรวจสอบปรับปรุง',
      'บัญชีกิจกรรมแผนตรวจสอบต่างๆที่มีกิจกรรมกำหนดกรอบค่าปฏิบัติงาน',
      'สถานการณ์มีความเสี่ยงจำจัดยังมีความเปลี่ยนแปลงทั้งหมด',
      'สถานการณ์มีการบริหารจัดการเสี่ยงยังยเพื่อการบำไว้ยทั้งหมด',
      'สถานการณ์บริหารการบริหารจัดการเสี่ยงการส่งการหารบำไว้ต่อการบริหาร',
      'แผนการตรวจสอบแรงงานดี',
      'แผนการตรวจสอบแรงงานสาธารณ',
      'แผนการปฏิบัติงาน (Audit Program / Engagement Plan)'
    ],
    fileTypes: [
      'ทั้งหมด',
      'EXCEL',
      'PDF',
      'WORD'
    ]
  };

  // Handle filter checkbox changes
  const handleFilterChange = (key: string, checked: boolean) => {
    setFilterSelections(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // ใช้ useDocuments hook เพื่อดึงข้อมูลจาก API
  const { documents, loading, error, refetch } = useDocuments({
    search: searchValue
  })

  const table = useReactTable({
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

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          ข้อผิดพลาด: {error}
          <button 
            onClick={refetch}
            className="ml-2 text-red-800 underline hover:no-underline"
          >
            ลองใหม่
          </button>
        </div>
      )}
      
      <div className="flex items-center py-4">
        <Input
          placeholder="ค้นหาชื่อเอกสาร..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        />
        
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-[#3E52B9] ml-2">
              กรอง
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                กรอง
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Year Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">ปีงบประมาณ</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2567">2567</SelectItem>
                    <SelectItem value="2568">2568</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Audit Type Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">เลือกประเภทเอกสาร</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600"
                    onClick={() => setFilterSelections({})}
                  >
                    Reset
                  </Button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                  {filterOptions.auditTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`audit-${index}`}
                        checked={filterSelections[`audit-${index}`] || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange(`audit-${index}`, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`audit-${index}`} 
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Type Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">รูปแบบไฟล์</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600"
                    onClick={() => {
                      const newSelections = { ...filterSelections };
                      filterOptions.fileTypes.forEach((_, index) => {
                        delete newSelections[`file-${index}`];
                      });
                      setFilterSelections(newSelections);
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <div className="space-y-2">
                  {filterOptions.fileTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`file-${index}`}
                        checked={filterSelections[`file-${index}`] || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange(`file-${index}`, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`file-${index}`} 
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterDialogOpen(false)}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button 
                onClick={() => {
                  setIsFilterDialogOpen(false);
                  // Apply filter logic here
                  console.log('Applied filters:', filterSelections);
                }}
                className="bg-[#3E52B9] hover:bg-[#2A3A8F] text-white flex-1"
              >
                ปรับใช้
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
           
          <DropdownMenuTrigger asChild>
            
            <Button variant="outline" className="ml-auto">
              คอลัมน์ <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                // แปลชื่อคอลัมน์เป็นภาษาไทย
                const getColumnDisplayName = (columnId: string) => {
                  switch (columnId) {
                    case "documentName":
                      return "ชื่อไฟล์"
                    case "description":
                      return "ประเภทของเอกสาร"
                    case "year":
                      return "ปีงบประมาณ"
                    case "dateUploaded":
                      return "วัน/เวลาที่บันทึก"
                    case "fileType":
                      return "รูปแบบไฟล์"
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
            {table.getHeaderGroups().map((headerGroup) => (
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          เลือก {table.getFilteredSelectedRowModel().rows.length} จาก{" "}
          {table.getFilteredRowModel().rows.length} แถว
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ก่อนหน้า
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ถัดไป
          </Button>
        </div>
      </div>
    </div>
  )
}
