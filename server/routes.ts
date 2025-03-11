import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  // Get all devices
  app.get("/api/devices", async (_req, res) => {
    const devices = await storage.getDevices();
    res.json(devices);
  });

  // Get all periods
  app.get("/api/periods", async (_req, res) => {
    const periods = await storage.getPeriods();
    res.json(periods);
  });

  // Get bookings for a specific date
  app.get("/api/bookings/:date", async (req, res) => {
    const date = new Date(req.params.date);
    const bookings = await storage.getBookings(date);
    res.json(bookings);
  });

  // Get all bookings (for admin)
  app.get("/api/bookings", async (_req, res) => {
    const bookings = await storage.getAllBookings();
    res.json(bookings);
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const parseResult = insertBookingSchema.safeParse(req.body);

      if (!parseResult.success) {
        // Chuyển đổi lỗi Zod thành thông báo dễ đọc
        const errorMessage = fromZodError(parseResult.error);
        console.log("Validation error:", errorMessage);
        return res.status(400).json({ 
          error: "Dữ liệu không hợp lệ",
          details: errorMessage.message
        });
      }

      const booking = parseResult.data;
      const newBooking = await storage.createBooking(booking);
      await storage.updateDeviceStatus(booking.deviceId, "borrowed");
      res.json(newBooking);
    } catch (error) {
      console.error("Booking error:", error);
      res.status(400).json({ 
        error: "Không thể tạo đăng ký mượn",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}