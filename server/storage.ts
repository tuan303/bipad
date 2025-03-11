import { type Device, type Period, type Booking, type InsertDevice, type InsertPeriod, type InsertBooking } from "@shared/schema";

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
  getAllBookings(): Promise<Booking[]>; // Thêm phương thức mới
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private devices: Map<number, Device>;
  private periods: Map<number, Period>;
  private bookings: Map<number, Booking>;
  private currentId: { [key: string]: number };

  constructor() {
    this.devices = new Map();
    this.periods = new Map();
    this.bookings = new Map();
    this.currentId = { devices: 1, periods: 1, bookings: 1 };

    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
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
}

export const storage = new MemStorage();