import { currentUser, destroySession } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { ok } from "@/lib/api";
export async function POST() { const user = await currentUser(); if (user) await audit(user.id, "LOGOUT", "User", user.id); await destroySession(); return ok({ redirect: "/login" }); }

