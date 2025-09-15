'use client';

import * as React from "react"
import { Button } from "@/components/ui/button";
import { useNavigationHistory } from "@/hooks/navigation-history";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbItem,BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import {
  ChevronDown,
  ChevronLeft ,
  Edit,
  Eye,
  Trash2,
  type LucideIcon
} from "lucide-react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

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
    accessorKey: "department",
    header: "หน่วยงาน",
    cell: ({ row }) => (
      <div className="max-w-[80px] truncate">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "ชื่อเรื่อง",
    cell: ({ row }) => (
      <div className="text-left max-w-[250px] truncate">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "detial",
    header: "รายละเอียด",
    cell: ({ row }) => (
      <div className="text-left max-w-[400px] truncate">{row.getValue("detial")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "display",
    header: "การแสดงผล",
    cell: ({ row }) => (
      <div className="max-w-[200px] text-left font-medium">
        <li className={row.getValue("display") == "Active" ? "text-green-500":"text-red-500"}/>
        {row.getValue("display")}
        </div>
    ),
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => {
      return (
          <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                    e.stopPropagation()
                    // handleView(item.id)
                }}
                title="ดูรายละเอียด"
            >
                <Eye className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                    e.stopPropagation()
                    // handleEdit(item.id)
                }}
                title="แก้ไข"
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                    e.stopPropagation()
                    // handleDelete(item.id)
                }}
                title="ลบ"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      )
    },
  }
]

// TempData
const TempData1 = [
    {
        id: 1,
        department:"หน่วยงาน",
        title:"เกร็ดความรู้ การเบิกค่าใช้จ่ายในการเดินทางไปยังต่างประเทศ",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ยังไม่ได้ดำเนินการ",
        display:"Inactive",
        lastModified: "20/06/2568 14:00 น."
    },
   {
        id: 2,
        department:"หน่วยงาน",
        title:"โครงสร้างแผนงานตามยุทธศาสตร์",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "รออนุมัติ",
        display:"Inactive",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 3,
        department:"หน่วยงาน",
        title:"ข้อกำหนดค่าใช้จ่ายสำหรับเดินทาง",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 4,
        department:"หน่วยงาน",
        title:"แนวทางการขออนุมัติให้ข้าราชการเดินทางไปจ่างประเทศชั่วคราว",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
        lastModified: "20/06/2568 14:00 น."
    },
    {
        id: 5,
        department:"หน่วยงาน",
        title:"4หลักการ จัดซื้อจัดจ้างให้ถูกตามเกรฑ์ที่กำหนด",
        detial: "ตามพระราชกฤษฎีกาค่าใชัจ่ายเดินทางไปราชการ พ.ศ.2526 และที่แก้ไขเพิ่มเติม า่ห้เกดา่หกา่ดา่ห้กดรหก้า่ดหากด้รหีกดาหก้ดรนหีกด้าห่กด้าห่กด้ากห่้ดาหก่้ด",
        status: "ดำเนินการแล้ว",
        display:"Active",
        lastModified: "20/06/2568 14:00 น."
    }
]


export default function ConsultPage() {

  const [ consultTable, SetConsultTable] = useState(TempData1)
  const router = useRouter()
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

  const { loading, error, refetch } = TempData1
  // ------HandleView
  const handleView = (id: number) => {
        // router.push(`/maindatabase/plan/budgetplan?id=${planId}&name=${encodeURIComponent(planName)}`)
    console.log(" ID:", id)  
  }
  const handleEdit = (id: number) => {
    console.log(" ID:", id)
  }
  const handleDelete = (id: number) => {
    console.log(" ID:", id)
  }
  //-------------------
  const { goBack } = useNavigationHistory();

  const tableView = useReactTable({
    data: TempData1,
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
                    ทะเบียนคุมเกร็ดความรู้
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div>
          <h1>จัดการข้อมูลดูแลเกร็ดความรู้</h1>
            <p className="text-muted-foreground text-sm text-balance pt-1 ">
            แสดงข้อมูลต่างๆและเกร็ดความรู้แก่ผู้ใช้
            </p>
          </div>
        </div>

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            
            <Button variant="outline" className="ml-auto">
              คอลัมน์ <ChevronDown />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            {tableView
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                // แปลชื่อคอลัมน์เป็นภาษาไทย
                const getColumnDisplayName = (columnId: string) => {
                  switch (columnId) {
                    case "department":
                      return "หน่วยงาน"
                    case "title":
                      return "ชื่อเรื่อง"
                    case "detial":
                      return "รายละเอียด"
                    case "status":
                      return "สถานะ"
                    case "display":
                      return "การแสดงผล"
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
  );
}
