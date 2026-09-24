-- Complete schema repair for ClinicSync.
-- 20260924000000_initial created the enum types only.

CREATE TABLE "Clinic" (
 "id" TEXT NOT NULL, "name" TEXT NOT NULL, "address" TEXT, "phone" TEXT, "email" TEXT,
 "timezone" TEXT NOT NULL DEFAULT 'UTC', "setupComplete" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "User" (
 "id" TEXT NOT NULL, "clinicId" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL,
 "firstName" TEXT NOT NULL, "middleName" TEXT, "lastName" TEXT NOT NULL, "phone" TEXT,
 "role" "UserRole" NOT NULL, "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
 "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], "lastLoginAt" TIMESTAMP(3),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Doctor" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "doctorId" TEXT NOT NULL, "specialization" TEXT NOT NULL,
 "licenseNumber" TEXT NOT NULL, "licenseExpiry" TIMESTAMP(3), "schedule" JSONB,
 CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Nurse" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "employeeId" TEXT NOT NULL, "licenseNumber" TEXT,
 CONSTRAINT "Nurse_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Receptionist" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "employeeId" TEXT NOT NULL,
 CONSTRAINT "Receptionist_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Patient" (
 "id" TEXT NOT NULL, "clinicId" TEXT NOT NULL, "userId" TEXT, "patientId" TEXT NOT NULL,
 "firstName" TEXT NOT NULL, "middleName" TEXT, "lastName" TEXT NOT NULL, "dateOfBirth" TIMESTAMP(3) NOT NULL,
 "sex" "Sex" NOT NULL, "contactNumber" TEXT NOT NULL, "email" TEXT, "address" TEXT,
 "emergencyContact" TEXT, "emergencyContactNumber" TEXT, "bloodType" TEXT, "allergies" TEXT,
 "existingConditions" TEXT, "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Appointment" (
 "id" TEXT NOT NULL, "clinicId" TEXT NOT NULL, "patientId" TEXT NOT NULL, "doctorId" TEXT NOT NULL,
 "startsAt" TIMESTAMP(3) NOT NULL, "endsAt" TIMESTAMP(3) NOT NULL, "reason" TEXT NOT NULL,
 "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING', "notes" TEXT, "createdById" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MedicalRecord" (
 "id" TEXT NOT NULL, "patientId" TEXT NOT NULL, "recordType" TEXT NOT NULL, "title" TEXT NOT NULL,
 "description" TEXT NOT NULL, "recordedById" TEXT NOT NULL, "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Consultation" (
 "id" TEXT NOT NULL, "appointmentId" TEXT, "patientId" TEXT NOT NULL, "doctorId" TEXT NOT NULL,
 "consultationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "chiefComplaint" TEXT NOT NULL,
 "symptoms" TEXT, "assessment" TEXT, "diagnosis" TEXT NOT NULL, "treatment" TEXT,
 "followUpInstructions" TEXT, "followUpDate" TIMESTAMP(3), "additionalNotes" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "VitalSign" (
 "id" TEXT NOT NULL, "patientId" TEXT NOT NULL, "consultationId" TEXT, "recordedById" TEXT NOT NULL,
 "nurseId" TEXT, "temperature" DECIMAL(4,1), "systolic" INTEGER, "diastolic" INTEGER, "pulse" INTEGER,
 "respiratoryRate" INTEGER, "oxygenSaturation" DECIMAL(5,2), "heightCm" DECIMAL(5,2), "weightKg" DECIMAL(6,2),
 "notes" TEXT, "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "VitalSign_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Prescription" (
 "id" TEXT NOT NULL, "consultationId" TEXT NOT NULL, "patientId" TEXT NOT NULL, "doctorId" TEXT NOT NULL,
 "medicationName" TEXT NOT NULL, "dosage" TEXT NOT NULL, "frequency" TEXT NOT NULL, "duration" TEXT NOT NULL,
 "instructions" TEXT, "prescribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Notification" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" "NotificationType" NOT NULL, "title" TEXT NOT NULL,
 "message" TEXT NOT NULL, "link" TEXT, "readAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditLog" (
 "id" TEXT NOT NULL, "userId" TEXT, "action" TEXT NOT NULL, "entityType" TEXT, "entityId" TEXT,
 "metadata" JSONB, "ipAddress" TEXT, "userAgent" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
 "id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PasswordResetToken" (
 "id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
 "usedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");
CREATE UNIQUE INDEX "Doctor_doctorId_key" ON "Doctor"("doctorId");
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");
CREATE UNIQUE INDEX "Nurse_userId_key" ON "Nurse"("userId");
CREATE UNIQUE INDEX "Nurse_employeeId_key" ON "Nurse"("employeeId");
CREATE UNIQUE INDEX "Receptionist_userId_key" ON "Receptionist"("userId");
CREATE UNIQUE INDEX "Receptionist_employeeId_key" ON "Receptionist"("employeeId");
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");
CREATE UNIQUE INDEX "Consultation_appointmentId_key" ON "Consultation"("appointmentId");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

CREATE INDEX "User_clinicId_role_idx" ON "User"("clinicId", "role");
CREATE INDEX "User_lastName_firstName_idx" ON "User"("lastName", "firstName");
CREATE INDEX "Patient_clinicId_lastName_firstName_idx" ON "Patient"("clinicId", "lastName", "firstName");
CREATE INDEX "Patient_contactNumber_idx" ON "Patient"("contactNumber");
CREATE INDEX "Appointment_clinicId_startsAt_status_idx" ON "Appointment"("clinicId", "startsAt", "status");
CREATE INDEX "Appointment_doctorId_startsAt_endsAt_idx" ON "Appointment"("doctorId", "startsAt", "endsAt");
CREATE INDEX "Appointment_patientId_startsAt_idx" ON "Appointment"("patientId", "startsAt");
CREATE INDEX "MedicalRecord_patientId_recordedAt_idx" ON "MedicalRecord"("patientId", "recordedAt");
CREATE INDEX "Consultation_patientId_consultationDate_idx" ON "Consultation"("patientId", "consultationDate");
CREATE INDEX "Consultation_doctorId_consultationDate_idx" ON "Consultation"("doctorId", "consultationDate");
CREATE INDEX "VitalSign_patientId_recordedAt_idx" ON "VitalSign"("patientId", "recordedAt");
CREATE INDEX "Prescription_patientId_prescribedAt_idx" ON "Prescription"("patientId", "prescribedAt");
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

ALTER TABLE "User" ADD CONSTRAINT "User_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Nurse" ADD CONSTRAINT "Nurse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Receptionist" ADD CONSTRAINT "Receptionist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VitalSign" ADD CONSTRAINT "VitalSign_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VitalSign" ADD CONSTRAINT "VitalSign_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VitalSign" ADD CONSTRAINT "VitalSign_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "Nurse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
