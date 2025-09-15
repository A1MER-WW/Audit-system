import { DataTableDemo } from "@/components/table";

export default function Documentation() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1>หมวดหมู่เอกสาร</h1>
          <div className="w-full h-full">
            <DataTableDemo />
          </div>
        </div>
    )
}