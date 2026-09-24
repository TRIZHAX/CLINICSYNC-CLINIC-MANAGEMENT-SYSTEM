import { requireUser } from "@/lib/auth";import { ReportView } from "@/components/report-view";
export default async function Reports(){await requireUser(["ADMIN"]);return <><div className="page-heading"><div><span className="eyebrow">Database reporting</span><h1>Reports</h1><p>Operational totals calculated from records inside the selected period.</p></div></div><ReportView/></>}

