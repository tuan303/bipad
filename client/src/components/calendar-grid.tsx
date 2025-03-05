import { Card } from "@/components/ui/card";
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

  const isBooked = (deviceId: number, periodId: number) => {
    return bookings.some(b => 
      b.deviceId === deviceId && 
      b.periodId === periodId &&
      new Date(b.bookedDate).toDateString() === selectedDate.toDateString()
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-muted">Devices</th>
            {periods.map(period => (
              <th key={period.id} className="p-2 border bg-muted">
                {period.name}<br/>
                <span className="text-xs">
                  {period.startTime} - {period.endTime}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id}>
              <td className="p-2 border">
                <div className="font-medium">{device.name}</div>
                <div className="text-xs text-muted-foreground">
                  {device.status}
                </div>
              </td>
              {periods.map(period => {
                const booked = isBooked(device.id, period.id);
                return (
                  <td 
                    key={period.id} 
                    className={`p-2 border ${
                      booked 
                        ? 'bg-muted cursor-not-allowed' 
                        : 'hover:bg-accent cursor-pointer'
                    }`}
                    onClick={() => !booked && onCellClick(device.id, period.id)}
                  >
                    {booked ? "Booked" : "Available"}
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
