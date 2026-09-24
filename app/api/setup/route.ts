import { prisma } from "@/lib/prisma";
import { setupSchema } from "@/lib/validation";
import { createSession, hashPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { fail, handleError, ok } from "@/lib/api";
import { sameOrigin } from "@/lib/security";

export async function GET() {
  try { return ok({ available: await prisma.clinic.count() === 0 }); } catch { return ok({ available: true }); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail("Invalid request origin.", 403);
  try {
    const input = setupSchema.parse(await request.json());
    if (await prisma.clinic.count() > 0) return fail("Initial setup is already complete.", 409);
    const passwordHash = await hashPassword(input.password);
    const admin = await prisma.$transaction(async tx => {
      const clinic = await tx.clinic.create({ data: { name: input.clinicName, setupComplete: true } });
      return tx.user.create({ data: { clinicId: clinic.id, email: input.email, passwordHash, firstName: input.firstName, lastName: input.lastName, role: "ADMIN" } });
    });
    await createSession(admin.id); await audit(admin.id, "INITIAL_SETUP", "Clinic", admin.clinicId);
    return ok({ redirect: "/dashboard" }, 201);
  } catch (error) { return handleError(error); }
}

