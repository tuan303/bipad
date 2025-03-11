import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Booking } from "@shared/schema";

export default function Admin() {
  const [selectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", selectedDate.toISOString()]
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái đăng ký mượn",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (id: number) => {
    updateStatusMutation.mutate({ id, status: "completed" });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý đăng ký mượn iPad</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người mượn</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Tiết học</TableHead>
                <TableHead>Ngày mượn</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Mục đích sử dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.borrowerName}</TableCell>
                  <TableCell>{booking.phoneNumber}</TableCell>
                  <TableCell>Tiết {booking.periodId}</TableCell>
                  <TableCell>
                    {new Date(booking.bookedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.quantity} iPad</TableCell>
                  <TableCell>{booking.purpose}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={booking.status === 'active' ? 'default' : 'secondary'}
                    >
                      {booking.status === 'active' ? 'Đang mượn' : 'Đã trả'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(booking.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        Đánh dấu đã trả
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}