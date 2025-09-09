import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">เข้าสู่ระบบปฏิบัติงานตรวจสอบ</h1>
        <p className="text-muted-foreground text-sm text-balance">
          เข้าสู่ระบบ
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required className="rounded-full" />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ลืมรหัสผ่าน?
            </a>
          </div>
          <Input id="password" type="password" required className="rounded-full"/>
        </div>
        <Link href="/dashboard">
         <Button type="submit" className="w-full bg-[#3E52B9] rounded-full">
          เข้าสู่ระบบ
        </Button>
        </Link>
       
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
       
      </div>
     
    </form>
  )
}
