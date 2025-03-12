import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarGrid } from "@/components/calendar-grid";
import { BookingForm } from "@/components/booking-form";
import { HelpDialog } from "@/components/help-dialog";
import { ListChecks } from "lucide-react";

export default function Home() {
  const [date, setDate] = useState<Date>(new Date());
  const [bookingDetails, setBookingDetails] = useState<{
    deviceId: number;
    periodId: number;
  } | null>(null);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đăng ký mượn iPad</CardTitle>
            <HelpDialog
              title="Hướng dẫn đăng ký mượn iPad"
              description="Cách sử dụng hệ thống đăng ký mượn iPad"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Chọn ngày mượn</h4>
                    <p className="text-sm text-muted-foreground">
                      Sử dụng lịch để chọn ngày bạn muốn mượn iPad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Chọn tiết học</h4>
                    <p className="text-sm text-muted-foreground">
                      Trong bảng đăng ký, chọn tiết học bạn cần mượn iPad.
                      Mỗi tiết học sẽ hiển thị số lượng iPad còn trống.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Điền thông tin đăng ký</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhập đầy đủ thông tin cá nhân, số lượng iPad cần mượn và mục đích sử dụng.
                      Số điện thoại phải có 10 chữ số để tiện liên hệ.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ListChecks className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Xác nhận đăng ký</h4>
                    <p className="text-sm text-muted-foreground">
                      Sau khi điền đầy đủ thông tin, nhấn nút "Đăng ký mượn" để hoàn tất.
                      Bạn sẽ nhận được thông báo khi đăng ký thành công.
                    </p>
                  </div>
                </div>
              </div>
            </HelpDialog>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border w-full"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ngày đăng ký - {date.toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarGrid
            selectedDate={date}
            onCellClick={(deviceId, periodId) => 
              setBookingDetails({ deviceId, periodId })
            }
          />
        </CardContent>
      </Card>

      <Dialog 
        open={bookingDetails !== null}
        onOpenChange={() => setBookingDetails(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký mượn iPad</DialogTitle>
          </DialogHeader>
          {bookingDetails && (
            <BookingForm
              deviceId={bookingDetails.deviceId}
              periodId={bookingDetails.periodId}
              selectedDate={date}
              onSuccess={() => setBookingDetails(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
