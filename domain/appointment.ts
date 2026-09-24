import type { AppointmentStatus } from "@prisma/client";

export interface Schedulable { conflictsWith(other: Appointment): boolean; }

export class Appointment implements Schedulable {
  constructor(
    public readonly doctorId: string,
    public readonly patientId: string,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
    public readonly status: AppointmentStatus = "PENDING"
  ) {
    if (endsAt <= startsAt) throw new Error("Appointment end time must be after its start time.");
  }
  conflictsWith(other: Appointment) {
    const inactive: AppointmentStatus[] = ["CANCELLED", "NO_SHOW"];
    if (inactive.includes(this.status) || inactive.includes(other.status)) return false;
    return this.doctorId === other.doctorId && this.startsAt < other.endsAt && this.endsAt > other.startsAt;
  }
}

