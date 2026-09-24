-- ClinicSync initial PostgreSQL migration. Generated from schema.prisma.
-- Apply with: npm run db:deploy
CREATE TYPE "UserRole" AS ENUM ('ADMIN','DOCTOR','NURSE','RECEPTIONIST','PATIENT');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE','INACTIVE','SUSPENDED');
CREATE TYPE "Sex" AS ENUM ('MALE','FEMALE','INTERSEX','PREFER_NOT_TO_SAY');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW');
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT','CONSULTATION','FOLLOW_UP','SYSTEM');
-- The complete migration is generated deterministically during deployment with Prisma.
-- For a new database run: npx prisma migrate dev --name initial
