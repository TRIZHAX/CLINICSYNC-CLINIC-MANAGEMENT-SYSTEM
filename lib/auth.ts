import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "./prisma";
import { hashToken, randomToken } from "./security";

const COOKIE = "clinicsync_session";
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }

export async function createSession(userId: string) {
  const token = randomToken();
  await prisma.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + THIRTY_DAYS) } });
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: THIRTY_DAYS / 1000, path: "/" });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  jar.delete(COOKIE);
}

export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { doctor: true, nurse: true, receptionist: true, patient: true } } }
  });
  if (!session || session.expiresAt < new Date() || session.user.status !== "ACTIVE") return null;
  return session.user;
}

export async function requireUser(roles?: UserRole[]) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) redirect("/forbidden");
  return user;
}

export function canAccessPatient(user: Awaited<ReturnType<typeof currentUser>>, patientId: string) {
  if (!user) return false;
  if (["ADMIN", "DOCTOR", "NURSE"].includes(user.role)) return true;
  if (user.role === "RECEPTIONIST") return user.permissions.includes("VIEW_MEDICAL_RECORDS");
  return user.patient?.id === patientId;
}

