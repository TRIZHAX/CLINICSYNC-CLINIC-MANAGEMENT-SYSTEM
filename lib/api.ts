import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { currentUser } from "./auth";

export function ok(data: unknown, status = 200) { return NextResponse.json(data, { status }); }
export function fail(message: string, status = 400, details?: unknown) { return NextResponse.json({ error: message, details }, { status }); }
export function handleError(error: unknown) {
  if (error instanceof ZodError) return fail("Please correct the highlighted information.", 422, error.flatten());
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return fail("A record with this unique value already exists.", 409);
  console.error(error);
  return fail("The request could not be completed.", 500);
}
export async function apiUser(roles?: string[]) {
  const user = await currentUser();
  if (!user) return { error: fail("Authentication required.", 401) } as const;
  if (roles && !roles.includes(user.role)) return { error: fail("You do not have permission to perform this action.", 403) } as const;
  return { user } as const;
}
export function pagination(url: string) {
  const p = new URL(url).searchParams;
  const page = Math.max(1, Number(p.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(10, Number(p.get("pageSize")) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

