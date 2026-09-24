import type { LucideIcon } from "lucide-react";import Link from "next/link";
export function EmptyState({icon:Icon,title,message,action,href}:{icon:LucideIcon;title:string;message:string;action?:string;href?:string}){return <div className="empty-state"><span className="empty-icon"><Icon/></span><h3>{title}</h3><p>{message}</p>{action&&href&&<Link href={href} className="button primary">{action}</Link>}</div>}

