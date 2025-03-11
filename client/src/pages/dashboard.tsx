import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabletSmartphone } from "lucide-react";
import { HelpDialog } from "@/components/help-dialog";
import { ListChecks } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { Booking } from "@shared/schema";

export default function Dashboard() {
  const [selectedDate] = useState<Date>(new Date());

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"]
  });

  // Tính toán số lượng iPad đang được mượn
  const totalBorrowed = bookings.reduce((sum, booking) => 
    booking.status === 'active' ? sum + booking.quantity : sum, 0
  );

  const availableDevices = 80 - totalBorrowed;

  // Thống kê theo tiết học
  const bookingsByPeriod = Array.from({ length: 9 }, (_, i) => ({
    period: `Tiết ${i + 1}`,
    count: bookings.filter(b => b.periodId === i + 1).length
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thống kê sử dụng iPad</h1>
        <HelpDialog
          title="Hướng dẫn xem thống kê"
          description="Cách đọc và sử dụng các thống kê"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-medium">Tổng quan thiết bị</h4>
                <p className="text-sm text-muted-foreground">
                  Hiển thị số lượng iPad đang được mượn và số lượng còn trống.
                  Giúp theo dõi tình trạng sử dụng thiết bị theo thời gian thực.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-medium">Biểu đồ thống kê</h4>
                <p className="text-sm text-muted-foreground">
                  Biểu đồ cột thể hiện số lượt mượn theo từng tiết học.
                  Giúp phân tích thời gian cao điểm và lập kế hoạch phân bổ thiết bị.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-medium">Cập nhật dữ liệu</h4>
                <p className="text-sm text-muted-foreground">
                  Thống kê được cập nhật tự động khi có thay đổi trong đăng ký mượn.
                  Đảm bảo thông tin luôn chính xác và mới nhất.
                </p>
              </div>
            </div>
          </div>
        </HelpDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số iPad đang được mượn
            </CardTitle>
            <TabletSmartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBorrowed}</div>
            <p className="text-xs text-muted-foreground">
              trên tổng số 80 thiết bị
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Số iPad còn trống
            </CardTitle>
            <TabletSmartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDevices}</div>
            <p className="text-xs text-muted-foreground">
              có thể cho mượn ngay
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê lượt mượn theo tiết học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByPeriod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}