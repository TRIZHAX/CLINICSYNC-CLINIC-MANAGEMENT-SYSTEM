import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { strongPassword } from "@/lib/validation";
import { hashToken } from "@/lib/security";
import { fail, ok } from "@/lib/api";
import { z } from "zod";
const schema = z.object({ token: z.string().min(20), password: strongPassword });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return fail("Invalid reset request.", 422);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return fail("This reset link is invalid or expired.", 400);
  await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }), prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }), prisma.session.deleteMany({ where: { userId: record.userId } })]);
  return ok({ message: "Password updated. You can now sign in." });
}

