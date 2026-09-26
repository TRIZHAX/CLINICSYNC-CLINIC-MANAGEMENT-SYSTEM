# ClinicSync database fix

The `/api/setup` 500 error was caused by an incomplete Prisma migration. The original initial migration created only PostgreSQL enum types; it did not create the ClinicSync tables such as `Clinic`, `User`, `Session`, and `AuditLog`.

This project now includes a second migration:
`prisma/migrations/20260925000000_complete_schema/migration.sql`

The production build also runs:
`prisma migrate deploy && prisma generate && next build`

## Vercel
1. Make sure `DATABASE_URL` is set in Vercel Project Settings → Environment Variables.
2. Deploy the updated project.
3. The build will apply the pending Prisma migrations automatically.
4. Open `/setup` again and create the first administrator.

If the old setup request already failed, the incomplete migration itself should not have created the clinic/admin because the required tables were missing.
