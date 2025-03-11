import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express) {
  // Set up authentication
  setupAuth(app);

  // Protected admin routes
  app.get("/api/bookings", isAuthenticated, async (_req, res) => {
    const bookings = await storage.getAllBookings();
    bookings.sort((a, b) => new Date(b.bookedDate).getTime() - new Date(a.bookedDate).getTime());
    res.json(bookings);
  });

  app.patch("/api/bookings/:id/status", isAuthenticated, async (req, res) => {
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

  // Public routes
  app.get("/api/devices", async (_req, res) => {
    const devices = await storage.getDevices();
    res.json(devices);
  });

  app.get("/api/periods", async (_req, res) => {
    const periods = await storage.getPeriods();
    res.json(periods);
  });

  app.get("/api/bookings/:date", async (req, res) => {
    const date = new Date(req.params.date);
    const bookings = await storage.getBookings(date);
    res.json(bookings);
  });

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

  const httpServer = createServer(app);
  return httpServer;
}