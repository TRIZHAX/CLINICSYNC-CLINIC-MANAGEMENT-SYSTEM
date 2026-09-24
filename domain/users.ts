import type { UserRole } from "@prisma/client";

export type SafeUserData = {
  id: string; firstName: string; middleName?: string | null; lastName: string;
  email: string; phone?: string | null; role: UserRole; status: string;
};

export interface Informative {
  getUserInformation(): Record<string, string | null>;
}

export abstract class User implements Informative {
  readonly #id: string;
  readonly #email: string;
  protected constructor(protected readonly data: SafeUserData) {
    this.#id = data.id;
    this.#email = data.email;
  }
  get id() { return this.#id; }
  get displayName() { return [this.data.firstName, this.data.middleName, this.data.lastName].filter(Boolean).join(" "); }
  protected maskedEmail() {
    const [name, host] = this.#email.split("@");
    return `${name.slice(0, 2)}***@${host}`;
  }
  abstract getUserInformation(): Record<string, string | null>;
}

export class Admin extends User {
  getUserInformation() { return { name: this.displayName, role: "Administrator", email: this.data.email }; }
}
export class Doctor extends User {
  constructor(data: SafeUserData, private readonly specialization: string, private readonly licenseNumber: string) { super(data); }
  getUserInformation() { return { name: `Dr. ${this.displayName}`, role: "Doctor", specialization: this.specialization, license: this.licenseNumber }; }
}
export class Nurse extends User {
  constructor(data: SafeUserData, private readonly employeeId: string) { super(data); }
  getUserInformation() { return { name: this.displayName, role: "Nurse", employeeId: this.employeeId }; }
}
export class Receptionist extends User {
  constructor(data: SafeUserData, private readonly employeeId: string) { super(data); }
  getUserInformation() { return { name: this.displayName, role: "Receptionist", employeeId: this.employeeId }; }
}
export class Patient extends User {
  constructor(data: SafeUserData, private readonly patientId: string) { super(data); }
  getUserInformation() { return { name: this.displayName, role: "Patient", patientId: this.patientId, email: this.maskedEmail() }; }
}

export function userFactory(data: SafeUserData & { doctor?: { specialization: string; licenseNumber: string } | null; nurse?: { employeeId: string } | null; receptionist?: { employeeId: string } | null; patient?: { patientId: string } | null }): User {
  switch (data.role) {
    case "ADMIN": return new Admin(data);
    case "DOCTOR": return new Doctor(data, data.doctor?.specialization ?? "Unassigned", data.doctor?.licenseNumber ?? "Unassigned");
    case "NURSE": return new Nurse(data, data.nurse?.employeeId ?? "Unassigned");
    case "RECEPTIONIST": return new Receptionist(data, data.receptionist?.employeeId ?? "Unassigned");
    case "PATIENT": return new Patient(data, data.patient?.patientId ?? "Unassigned");
  }
}

