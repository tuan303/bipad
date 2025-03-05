import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("available"),
});

export const periods = pgTable("periods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g. "Period 1"
  startTime: text("start_time").notNull(), // e.g. "08:00"
  endTime: text("end_time").notNull(), // e.g. "08:45" 
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  periodId: integer("period_id").notNull(),
  bookedDate: timestamp("booked_date").notNull(),
  borrowerName: text("borrower_name").notNull(),
  purpose: text("purpose").notNull(),
  quantity: integer("quantity").notNull(), // Số lượng iPad cần mượn
  status: text("status").notNull().default("active"), // active, completed, cancelled
});

export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true });
export const insertPeriodSchema = createInsertSchema(periods).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });

export type Device = typeof devices.$inferSelect;
export type Period = typeof periods.$inferSelect;
export type Booking = typeof bookings.$inferSelect;

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type InsertPeriod = z.infer<typeof insertPeriodSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;