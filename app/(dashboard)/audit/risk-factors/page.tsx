import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function RiskFactorsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Construction className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>กำหนดปัจจัยเสี่ยงและเกณฑ์การพิจารณาความเสี่ยง</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              หน้านี้อยู่ระหว่างการพัฒนา<br />
              Coming Soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}