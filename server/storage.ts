import { type Device, type Period, type Booking, type User, type InsertDevice, type InsertPeriod, type InsertBooking, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Devices
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDeviceStatus(id: number, status: string): Promise<Device>;

  // Periods
  getPeriods(): Promise<Period[]>;
  createPeriod(period: InsertPeriod): Promise<Period>;

  // Bookings
  getBookings(date: Date): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private devices: Map<number, Device>;
  private periods: Map<number, Period>;
  private bookings: Map<number, Booking>;
  private users: Map<number, User>;
  private currentId: { [key: string]: number };
  public sessionStore: session.Store;

  constructor() {
    this.devices = new Map();
    this.periods = new Map();
    this.bookings = new Map();
    this.users = new Map();
    this.currentId = { devices: 1, periods: 1, bookings: 1, users: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired entries every 24h
    });

    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin",
      role: "admin"
    });

    // Add 80 iPads
    const sampleDevices: InsertDevice[] = Array.from({ length: 80 }, (_, i) => ({
      name: `iPad ${i + 1}`,
      status: "available"
    }));
    sampleDevices.forEach(device => this.createDevice(device));

    // Add 9 school periods
    const samplePeriods: InsertPeriod[] = [
      { name: "Tiết 1", startTime: "07:00", endTime: "07:45" },
      { name: "Tiết 2", startTime: "07:50", endTime: "08:35" },
      { name: "Tiết 3", startTime: "08:50", endTime: "09:35" },
      { name: "Tiết 4", startTime: "09:50", endTime: "10:35" },
      { name: "Tiết 5", startTime: "10:40", endTime: "11:25" },
      { name: "Tiết 6", startTime: "13:30", endTime: "14:15" },
      { name: "Tiết 7", startTime: "14:20", endTime: "15:05" },
      { name: "Tiết 8", startTime: "15:20", endTime: "16:05" },
      { name: "Tiết 9", startTime: "16:10", endTime: "16:55" }
    ];
    samplePeriods.forEach(period => this.createPeriod(period));
  }

  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const id = this.currentId.devices++;
    const newDevice = { ...device, id };
    this.devices.set(id, newDevice);
    return newDevice;
  }

  async updateDeviceStatus(id: number, status: string): Promise<Device> {
    const device = await this.getDevice(id);
    if (!device) throw new Error("Device not found");

    const updatedDevice = { ...device, status };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async getPeriods(): Promise<Period[]> {
    return Array.from(this.periods.values());
  }

  async createPeriod(period: InsertPeriod): Promise<Period> {
    const id = this.currentId.periods++;
    const newPeriod = { ...period, id };
    this.periods.set(id, newPeriod);
    return newPeriod;
  }

  async getBookings(date: Date): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => {
      const bookingDate = new Date(booking.bookedDate);
      return bookingDate.toDateString() === date.toDateString();
    });
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId.bookings++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = await this.getBooking(id);
    if (!booking) throw new Error("Booking not found");

    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser & { role?: string }): Promise<User> {
    const id = this.currentId.users++;
    const newUser = { ...user, id, role: user.role || "admin" };
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();