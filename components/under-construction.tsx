"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction } from 'lucide-react'

interface UnderConstructionProps {
  title?: string
  message?: string
  className?: string
}

export function UnderConstruction({
  title = "หน้านี้อยู่ระหว่างการพัฒนา",
  message = "Coming Soon...",
  className = ""
}: UnderConstructionProps) {
  return (
    <div className={`flex flex-1 flex-col gap-4 p-4 pt-0 ${className}`}>
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Construction className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              {message}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}