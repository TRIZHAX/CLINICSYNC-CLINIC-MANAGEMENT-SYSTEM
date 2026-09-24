import { prisma } from "@/lib/prisma";
import { apiUser, fail, handleError, ok } from "@/lib/api";
import { canAccessPatient } from "@/lib/auth";
import { patientSchema } from "@/lib/validation";
import { audit } from "@/lib/audit";

export async function GET(_: Request, { params }: { params: Promise<{id:string}> }) {
  const auth = await apiUser(); if ("error" in auth) return auth.error; const { id } = await params;
  if (!canAccessPatient(auth.user, id)) return fail("Access denied.", 403);
  const patient = await prisma.patient.findFirst({ where: { id, clinicId: auth.user.clinicId }, include: { appointments: { include: { doctor: { include: { user: { select: { firstName:true,lastName:true } } } } }, orderBy: { startsAt:"desc" } }, consultations: { include: { doctor: { include: { user: { select: { firstName:true,lastName:true } } } }, prescriptions:true, vitalSigns:true }, orderBy: { consultationDate:"desc" } }, medicalRecords: { orderBy: { recordedAt:"desc" } }, vitalSigns: { orderBy: { recordedAt:"desc" } } } });
  return patient ? ok(patient) : fail("Patient not found.", 404);
}
export async function PATCH(request: Request, { params }: { params: Promise<{id:string}> }) {
  const auth = await apiUser(["ADMIN","NURSE","RECEPTIONIST"]); if ("error" in auth) return auth.error; const { id } = await params;
  try { const input = patientSchema.partial().parse(await request.json()); const patient = await prisma.patient.update({ where:{id,clinicId:auth.user.clinicId}, data:input }); await audit(auth.user.id,"PATIENT_UPDATED","Patient",id); return ok(patient); } catch(e){ return handleError(e); }
}

