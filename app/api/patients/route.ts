import { prisma } from "@/lib/prisma";
import { apiUser, handleError, ok, pagination } from "@/lib/api";
import { patientSchema } from "@/lib/validation";
import { audit } from "@/lib/audit";

export async function GET(request: Request) {
  const auth = await apiUser(["ADMIN","DOCTOR","NURSE","RECEPTIONIST"]); if ("error" in auth) return auth.error;
  const { page, pageSize, skip } = pagination(request.url); const q = new URL(request.url).searchParams.get("q")?.trim();
  const where = { clinicId: auth.user.clinicId, ...(q ? { OR: [{ patientId: { contains: q, mode: "insensitive" as const } }, { firstName: { contains: q, mode: "insensitive" as const } }, { lastName: { contains: q, mode: "insensitive" as const } }, { contactNumber: { contains: q } }] } : {}) };
  const [items, total] = await prisma.$transaction([prisma.patient.findMany({ where, orderBy: [{ lastName: "asc" }, { firstName: "asc" }], skip, take: pageSize, select: { id:true,patientId:true,firstName:true,middleName:true,lastName:true,dateOfBirth:true,sex:true,contactNumber:true,email:true,registrationDate:true } }), prisma.patient.count({ where })]);
  return ok({ items, total, page, pageSize });
}
export async function POST(request: Request) {
  const auth = await apiUser(["ADMIN","NURSE","RECEPTIONIST"]); if ("error" in auth) return auth.error;
  try {
    const input = patientSchema.parse(await request.json());
    const patient = await prisma.patient.create({ data: { ...input, email: input.email || null, clinicId: auth.user.clinicId } });
    await audit(auth.user.id, "PATIENT_REGISTERED", "Patient", patient.id, { patientId: patient.patientId });
    return ok(patient, 201);
  } catch (e) { return handleError(e); }
}

