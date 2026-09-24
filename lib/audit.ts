import { prisma } from "./prisma";
import { requestContext, safeMetadata } from "./security";

export async function audit(userId: string | null, action: string, entityType?: string, entityId?: string, metadata?: unknown) {
  const ctx = await requestContext();
  return prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata: safeMetadata(metadata), ...ctx } });
}

