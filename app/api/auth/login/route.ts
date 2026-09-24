import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { fail, handleError, ok } from "@/lib/api";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail("Invalid request origin.", 403);
  const key = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`login:${key}`, 8, 15 * 60_000)) return fail("Too many login attempts. Try again later.", 429);
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash)) || user.status !== "ACTIVE") return fail("Invalid email or password.", 401);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession(user.id); await audit(user.id, "LOGIN", "User", user.id);
    return ok({ redirect: "/dashboard" });
  } catch (error) { return handleError(error); }
}

