import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Booking } from "@shared/schema";

export default function Admin() {
  const [selectedDate] = useState<Date>(new Date());

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", selectedDate.toISOString()]
  });

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
