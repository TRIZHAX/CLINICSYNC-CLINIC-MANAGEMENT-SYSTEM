import crypto from "node:crypto";
import { headers } from "next/headers";

export function randomToken(bytes = 32) { return crypto.randomBytes(bytes).toString("base64url"); }
export function hashToken(token: string) { return crypto.createHash("sha256").update(token).digest("hex"); }
export function safeMetadata(value: unknown) { return JSON.parse(JSON.stringify(value ?? {})); }

export async function requestContext() {
  const h = await headers();
  return {
    ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent")?.slice(0, 500) ?? null
  };
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

