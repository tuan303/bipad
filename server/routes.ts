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
    // Sắp xếp theo thời gian giảm dần (mới nhất lên đầu)
    bookings.sort((a, b) => new Date(b.bookedDate).getTime() - new Date(a.bookedDate).getTime());
    res.json(bookings);
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const parseResult = insertBookingSchema.safeParse(req.body);

      if (!parseResult.success) {
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

  // Update booking status
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["active", "completed"].includes(status)) {
        return res.status(400).json({ error: "Trạng thái không hợp lệ" });
      }

      const booking = await storage.updateBookingStatus(id, status);
      if (status === "completed") {
        await storage.updateDeviceStatus(booking.deviceId, "available");
      }

      res.json(booking);
    } catch (error) {
      console.error("Update status error:", error);
      res.status(400).json({ 
        error: "Không thể cập nhật trạng thái",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}