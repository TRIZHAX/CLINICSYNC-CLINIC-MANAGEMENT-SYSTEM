import { prisma } from "@/lib/prisma";
import { apiUser, handleError, ok, pagination } from "@/lib/api";
import { audit } from "@/lib/audit";
import { hashPassword } from "@/lib/auth";
import { email, strongPassword } from "@/lib/validation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const doctorSchema = z.object({ doctorId:z.string().trim().min(2).max(40),firstName:z.string().trim().min(1).max(80),lastName:z.string().trim().min(1).max(80),email,password:strongPassword,phone:z.string().trim().max(30).optional(),specialization:z.string().trim().min(2).max(120),licenseNumber:z.string().trim().min(2).max(80),licenseExpiry:z.coerce.date().optional(),schedule:z.record(z.string(),z.unknown()).optional() });
export async function GET(request: Request) {
  const auth=await apiUser(); if("error" in auth)return auth.error; const {page,pageSize,skip}=pagination(request.url); const q=new URL(request.url).searchParams.get("q")?.trim();
  const where={user:{clinicId:auth.user.clinicId,...(q?{OR:[{firstName:{contains:q,mode:"insensitive" as const}},{lastName:{contains:q,mode:"insensitive" as const}}]}:{})},...(q?{OR:[{specialization:{contains:q,mode:"insensitive" as const}},{user:{firstName:{contains:q,mode:"insensitive" as const}}},{user:{lastName:{contains:q,mode:"insensitive" as const}}}]}:{})};
  const [items,total]=await prisma.$transaction([prisma.doctor.findMany({where,include:{user:{select:{firstName:true,lastName:true,email:true,phone:true,status:true}}},skip,take:pageSize,orderBy:{user:{lastName:"asc"}}}),prisma.doctor.count({where})]); return ok({items,total,page,pageSize});
}
export async function POST(request:Request){const auth=await apiUser(["ADMIN"]);if("error"in auth)return auth.error;try{const input=doctorSchema.parse(await request.json());const passwordHash=await hashPassword(input.password);const doctor=await prisma.$transaction(async tx=>{const user=await tx.user.create({data:{clinicId:auth.user.clinicId,email:input.email,passwordHash,firstName:input.firstName,lastName:input.lastName,phone:input.phone,role:"DOCTOR"}});return tx.doctor.create({data:{userId:user.id,doctorId:input.doctorId,specialization:input.specialization,licenseNumber:input.licenseNumber,licenseExpiry:input.licenseExpiry,schedule: input.schedule as Prisma.InputJsonValue},include:{user:true}})});await audit(auth.user.id,"DOCTOR_CREATED","Doctor",doctor.id,{doctorId:doctor.doctorId});return ok(doctor,201)}catch(e){return handleError(e)}}

