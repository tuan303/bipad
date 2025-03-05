import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import type { Device, Period, Booking } from "@shared/schema";
import { DeviceStatus } from "@/components/device-status";

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

  const isBooked = (deviceId: number, periodId: number) => {
    return bookings.some(b => 
      b.deviceId === deviceId && 
      b.periodId === periodId &&
      new Date(b.bookedDate).toDateString() === selectedDate.toDateString()
    );
  };

  const getBookingDetails = (deviceId: number, periodId: number) => {
    return bookings.find(b => 
      b.deviceId === deviceId && 
      b.periodId === periodId &&
      new Date(b.bookedDate).toDateString() === selectedDate.toDateString()
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="p-3 text-left font-medium border-b">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Devices
              </div>
            </th>
            {periods.map(period => (
              <th key={period.id} className="p-3 text-left font-medium border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <div>{period.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {period.startTime} - {period.endTime}
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id} className="hover:bg-muted/30">
              <td className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <DeviceStatus status={device.status} />
                  <div>
                    <div className="font-medium">{device.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {device.status}
                    </div>
                  </div>
                </div>
              </td>
              {periods.map(period => {
                const booked = isBooked(device.id, period.id);
                const bookingDetails = getBookingDetails(device.id, period.id);
                
                return (
                  <td 
                    key={period.id} 
                    className={`p-3 border-b ${
                      booked 
                        ? 'bg-muted/50' 
                        : 'hover:bg-accent/10 cursor-pointer'
                    }`}
                    onClick={() => !booked && onCellClick(device.id, period.id)}
                  >
                    {booked ? (
                      <div className="space-y-1">
                        <Badge variant="secondary">
                          Booked by {bookingDetails?.borrowerName}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {bookingDetails?.purpose}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-background">
                        Available
                      </Badge>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
