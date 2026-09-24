import { prisma } from "@/lib/prisma";import { apiUser,ok } from "@/lib/api";
export async function GET(){const auth=await apiUser();if("error"in auth)return auth.error;return ok(await prisma.notification.findMany({where:{userId:auth.user.id},orderBy:{createdAt:"desc"},take:50}))}
export async function PATCH(){const auth=await apiUser();if("error"in auth)return auth.error;await prisma.notification.updateMany({where:{userId:auth.user.id,readAt:null},data:{readAt:new Date()}});return ok({success:true})}

