import { requireUser } from "@/lib/auth";import { PatientForm } from "@/components/patient-form";
export default async function NewPatient(){await requireUser(["ADMIN","NURSE","RECEPTIONIST"]);return <><div className="page-heading"><div><span className="eyebrow">New record</span><h1>Register a patient</h1><p>Create a verified patient profile. No clinical data is assumed or prefilled.</p></div></div><PatientForm/></>}

