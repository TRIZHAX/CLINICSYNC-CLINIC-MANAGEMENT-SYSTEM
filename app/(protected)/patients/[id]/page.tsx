import { canAccessPatient, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import {
  Activity,
  CalendarDays,
  ClipboardPlus,
  Droplets,
  Phone,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";

type PatientProfileProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientProfile({
  params,
}: PatientProfileProps) {
  const user = await requireUser();
  const { id } = await params;

  if (!canAccessPatient(user, id)) {
    redirect("/forbidden");
  }

  const patient = await prisma.patient.findFirst({
    where: {
      id,
      clinicId: user.clinicId,
    },
    include: {
      appointments: {
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          startsAt: "desc",
        },
        take: 8,
      },
      consultations: {
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
          prescriptions: true,
          vitalSigns: true,
        },
        orderBy: {
          consultationDate: "desc",
        },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  return (
    <>
      <div className="patient-hero">
        <div className="profile-avatar">
          {patient.firstName[0]}
          {patient.lastName[0]}
        </div>

        <div>
          <span className="eyebrow">
            Patient · {patient.patientId}
          </span>
          <h1>
            {patient.firstName} {patient.middleName} {patient.lastName}
          </h1>
          <p>
            {format(patient.dateOfBirth, "MMMM d, yyyy")} ·{" "}
            {patient.sex.replaceAll("_", " ").toLowerCase()}
          </p>
        </div>

        <span className="verified">
          <ShieldAlert size={16} />
          Protected medical record
        </span>
      </div>

      <div className="profile-grid">
        <aside className="section-card profile-facts">
          <h2>Profile</h2>

          <div>
            <Phone />
            <span>
              <small>Contact</small>
              {patient.contactNumber}
            </span>
          </div>

          <div>
            <MapPin />
            <span>
              <small>Address</small>
              {patient.address || "Not provided"}
            </span>
          </div>

          <div>
            <Droplets />
            <span>
              <small>Blood type</small>
              {patient.bloodType || "Not recorded"}
            </span>
          </div>

          <div>
            <ShieldAlert />
            <span>
              <small>Allergies</small>
              {patient.allergies || "None recorded"}
            </span>
          </div>

          <div>
            <Activity />
            <span>
              <small>Existing conditions</small>
              {patient.existingConditions || "None recorded"}
            </span>
          </div>
        </aside>

        <div className="profile-main">
          <section className="section-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Timeline</span>
                <h2>Medical history</h2>
              </div>
            </div>

            {patient.consultations.length ? (
              <div className="clinical-timeline">
                {patient.consultations.map((consultation) => (
                  <article key={consultation.id}>
                    <time>
                      {format(
                        consultation.consultationDate,
                        "MMM d, yyyy"
                      )}
                    </time>

                    <div className="timeline-dot" />

                    <div>
                      <span className="event-type">
                        Consultation · Dr.{" "}
                        {consultation.doctor.user.lastName}
                      </span>

                      <h3>{consultation.diagnosis}</h3>

                      <p>
                        <strong>Chief complaint:</strong>{" "}
                        {consultation.chiefComplaint}
                      </p>

                      {consultation.treatment && (
                        <p>
                          <strong>Treatment:</strong>{" "}
                          {consultation.treatment}
                        </p>
                      )}

                      {consultation.prescriptions.length > 0 && (
                        <div className="prescription-chips">
                          {consultation.prescriptions.map((prescription) => (
                            <span key={prescription.id}>
                              {prescription.medicationName} ·{" "}
                              {prescription.dosage}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ClipboardPlus}
                title="No consultations recorded"
                message="Authorized consultation records will appear here chronologically."
              />
            )}
          </section>

          <section className="section-card">
            <div className="section-heading">
              <h2>Appointments</h2>
            </div>

            {patient.appointments.length ? (
              <div className="appointment-stack">
                {patient.appointments.map((appointment) => (
                  <div
                    className="appointment-row"
                    key={appointment.id}
                  >
                    <time>
                      <strong>
                        {format(appointment.startsAt, "HH:mm")}
                      </strong>
                      <span>
                        {format(appointment.startsAt, "MMM d")}
                      </span>
                    </time>

                    <div>
                      <strong>
                        Dr. {appointment.doctor.user.firstName}{" "}
                        {appointment.doctor.user.lastName}
                      </strong>
                      <span>{appointment.reason}</span>
                    </div>

                    <StatusBadge status={appointment.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No appointments scheduled"
                message="Appointments for this patient will appear here."
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
