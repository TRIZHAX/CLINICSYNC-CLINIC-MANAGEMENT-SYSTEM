import { requireUser } from "@/lib/auth";
import { BookOpen, ShieldCheck, ClipboardList, Pill, Siren, FileCheck2 } from "lucide-react";

const capabilities = [
  [ShieldCheck, "User Authentication and Access Control"],
  [ClipboardList, "Student Health Profile Management"],
  [ClipboardList, "Clinic Visit and Consultation Tracking"],
  [Pill, "Medicine Inventory Management"],
  [Siren, "Emergency Contact Display"],
  [FileCheck2, "Automated DepEd Compliance Reporting"],
] as const;

const limitations = [
  "No Direct Electronic Health Record",
  "No Automated SMS",
  "No Online Diagnostics",
  "Does not provide AI-driven medical diagnosis",
  "The application only relies on the local school environment's available hardware and local network infrastructure.",
];

const definitions = [
  ["Academic Institution", "Refers to an educational organization, specifically a public elementary or high school in San Miguel, Bulacan where the proposed system is implemented and evaluated."],
  ["Clinic Management System", "The software application is designed to automate healthcare tasks. In this study, it refers to the developed system that manages student health profiles, clinic visit logs, and medicine inventories."],
  ["Medicine Inventory", "This refers to the physical stock of medicine and first aid supplies kept in the school clinic. In this project, it refers to the digital module that monitors stock levels, tracks item expiration dates, and records medicine usage."],
  ["Object-Oriented Programming", "A software design paradigm based on the concept of objects containing data and code. In this study, it refers to the architectural approach used to structure the system's modules."],
  ["Paper-Based Operations", "It is the traditional method of recording data manually using physical notebooks, logbooks, and index cards. In this study, it represents the existing manual workflow in rural school clinics that the system aims to replace."],
] as const;

export default async function StudyScope() {
  await requireUser();
  return <>
    <div className="page-heading">
      <div><span className="eyebrow">Research documentation</span><h1>Scope of the Study</h1><p>ClinicSync for a selected public school clinic in San Miguel, Bulacan.</p></div>
    </div>
    <div className="dashboard-grid">
      <section className="section-card">
        <div className="section-heading"><div><span className="eyebrow">Scope</span><h2>Functional capabilities</h2></div><BookOpen size={20}/></div>
        <p>ClinicSync is designed specifically to automate the daily operations of public school clinics in rural academic institutions, focusing on a selected school in San Miguel, Bulacan.</p>
        <div className="simple-list" style={{marginTop:18}}>{capabilities.map(([Icon, label]) => <div key={label}><span style={{display:"flex",alignItems:"center",gap:9}}><Icon size={17}/>{label}</span><strong>Included</strong></div>)}</div>
      </section>
      <section className="section-card">
        <div className="section-heading"><div><span className="eyebrow">Limitations</span><h2>Not covered by the study</h2></div></div>
        <ul style={{paddingLeft:20,lineHeight:1.8,color:"var(--muted)"}}>{limitations.map(x=><li key={x}>{x}</li>)}</ul>
      </section>
    </div>
    <section className="section-card" style={{marginTop:20}}>
      <div className="section-heading"><div><span className="eyebrow">1.6 Definition of Terms</span><h2>Key concepts used in the study</h2></div></div>
      <div className="simple-list">{definitions.map(([term, definition])=><div key={term} style={{display:"block"}}><strong style={{display:"block",marginBottom:5}}>{term}</strong><span>{definition}</span></div>)}</div>
    </section>
  </>;
}
