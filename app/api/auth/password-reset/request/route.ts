import { prisma } from "@/lib/prisma";
import { email } from "@/lib/validation";
import { hashToken, randomToken } from "@/lib/security";
import { fail, ok } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const key = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`reset:${key}`, 4, 60 * 60_000)) return fail("Too many requests.", 429);
  const parsed = email.safeParse((await request.json()).email);
  if (parsed.success) {
    const user = await prisma.user.findUnique({ where: { email: parsed.data } });
    if (user) { const token = randomToken(); await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 60_000) } }); console.info("Password reset requested for user", user.id); }
  }
  return ok({ message: "If the account exists, password reset instructions will be sent." });
}

