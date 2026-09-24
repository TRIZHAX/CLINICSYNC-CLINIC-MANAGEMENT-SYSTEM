import { requireUser } from "@/lib/auth";import { prisma } from "@/lib/prisma";import { redirect } from "next/navigation";
export default async function History(){const user=await requireUser(["PATIENT"]);if(!user.patient)redirect("/forbidden");redirect(`/patients/${user.patient.id}`)}

