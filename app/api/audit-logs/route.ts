import { prisma } from "@/lib/prisma";import { apiUser,ok,pagination } from "@/lib/api";
export async function GET(request:Request){const auth=await apiUser(["ADMIN"]);if("error"in auth)return auth.error;const{page,pageSize,skip}=pagination(request.url);const[items,total]=await prisma.$transaction([prisma.auditLog.findMany({include:{user:{select:{firstName:true,lastName:true,email:true}}},orderBy:{createdAt:"desc"},skip,take:pageSize}),prisma.auditLog.count()]);return ok({items,total,page,pageSize})}

