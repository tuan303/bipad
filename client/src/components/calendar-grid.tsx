import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Added import
import { useQuery } from "@tanstack/react-query";
import type { Device, Period, Booking } from "@shared/schema";

interface CalendarGridProps {
  selectedDate: Date;
  onCellClick: (deviceId: number, periodId: number) => void;
}

export function CalendarGrid({ selectedDate, onCellClick }: CalendarGridProps) {
  const { data: devices = [] } = useQuery<Device[]>({ 
    queryKey: ["/api/devices"]
  });

  const { data: periods = [] } = useQuery<Period[]>({
    queryKey: ["/api/periods"]
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", selectedDate.toISOString()]
  });

  const getBookingsForPeriod = (periodId: number) => {
    return bookings.filter(b => 
      b.periodId === periodId &&
      new Date(b.bookedDate).toDateString() === selectedDate.toDateString()
    );
  };

  const getTotalBookedDevices = (periodId: number) => {
    const periodBookings = getBookingsForPeriod(periodId);
    return periodBookings.reduce((sum, booking) => sum + booking.quantity, 0);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-muted text-left">Tiết học</th>
            <th className="p-2 border bg-muted text-center">Thời gian</th>
            <th className="p-2 border bg-muted text-center">iPad còn trống</th>
            <th className="p-2 border bg-muted text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {periods.map(period => {
            const totalBooked = getTotalBookedDevices(period.id);
            const available = 80 - totalBooked;

            return (
              <tr key={period.id}>
                <td className="p-2 border">
                  <div className="font-medium">{period.name}</div>
                </td>
                <td className="p-2 border text-center">
                  {period.startTime} - {period.endTime}
                </td>
                <td className="p-2 border text-center">
                  <Badge variant={available > 0 ? "success" : "destructive"}>
                    {available} / 80
                  </Badge>
                </td>
                <td className="p-2 border text-center">
                  <button
                    className={`px-4 py-2 rounded ${
                      available > 0 
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={() => available > 0 && onCellClick(1, period.id)}
                    disabled={available <= 0}
                  >
                    {available > 0 ? 'Đăng ký mượn' : 'Hết thiết bị'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}