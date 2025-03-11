import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing tables remain unchanged
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("available"),
});

export const periods = pgTable("periods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  periodId: integer("period_id").notNull(),
  bookedDate: timestamp("booked_date").notNull(),
  borrowerName: text("borrower_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  purpose: text("purpose").notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("active"),
});

// Add users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

// Validation schemas
export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true });
export const insertPeriodSchema = createInsertSchema(periods).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings)
  .omit({ id: true })
  .extend({
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
    bookedDate: z.string().transform((str) => new Date(str))
  });

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, role: true });

// Types
export type Device = typeof devices.$inferSelect;
export type Period = typeof periods.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type InsertPeriod = z.infer<typeof insertPeriodSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;