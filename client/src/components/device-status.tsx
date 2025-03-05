import { TabletSmartphone } from "lucide-react";

interface DeviceStatusProps {
  status: string;
}

export function DeviceStatus({ status }: DeviceStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'text-green-500';
      case 'borrowed':
        return 'text-amber-500';
      case 'maintenance':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-50';
      case 'borrowed':
        return 'bg-amber-50';
      case 'maintenance':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`
      inline-flex items-center justify-center
      w-10 h-10 rounded-full
      ${getStatusBackgroundColor(status)}
    `}>
      <TabletSmartphone className={`
        w-6 h-6
        ${getStatusColor(status)}
      `} />
    </div>
  );
}
