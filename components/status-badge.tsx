export function StatusBadge({status}:{status:string}){return <span className={`status status-${status.toLowerCase().replaceAll("_","-")}`}>{status.replaceAll("_"," ")}</span>}

