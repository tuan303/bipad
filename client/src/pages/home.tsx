import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarGrid } from "@/components/calendar-grid";
import { BookingForm } from "@/components/booking-form";

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
          <CardHeader>
            <CardTitle>iPad Booking System</CardTitle>
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
          <CardTitle>Booking Schedule - {date.toLocaleDateString()}</CardTitle>
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
            <DialogTitle>Book iPad</DialogTitle>
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
