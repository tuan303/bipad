import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBookingSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface BookingFormProps {
  deviceId: number;
  periodId: number;
  selectedDate: Date;
  onSuccess: () => void;
}

export function BookingForm({ deviceId, periodId, selectedDate, onSuccess }: BookingFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      deviceId,
      periodId,
      bookedDate: selectedDate.toISOString(), // Chuyển đổi Date sang ISO string
      borrowerName: "",
      phoneNumber: "",
      purpose: "",
      quantity: 1,
      status: "active"
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await apiRequest("POST", "/api/bookings", data);
        const result = await res.json();
        return result;
      } catch (error: any) {
        const errorData = await error.response?.json();
        throw new Error(errorData?.details || error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Thành công",
        description: "Đăng ký mượn iPad thành công",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đăng ký mượn iPad",
        variant: "destructive",
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="borrowerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người mượn</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder="Nhập số điện thoại (10 số)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng iPad cần mượn</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  max="80"
                  placeholder="Nhập số lượng" 
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mục đích sử dụng</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập mục đích sử dụng"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Đang đăng ký..." : "Đăng ký mượn"}
        </Button>
      </form>
    </Form>
  );
}