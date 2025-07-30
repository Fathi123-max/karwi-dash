export type Service = {
  id: string;
  branchId: string;
  name: string;
  price: number;
  duration_min: number;
};

export type Review = {
  id: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
};

export type Promotion = {
  id: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: Date;
};

export type BranchHours = {
  id: string;
  branchId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
};

export type WasherSchedule = {
  id: string;
  washerId: string;
  branchId: string;
  startTime: Date;
  endTime: Date;
};
