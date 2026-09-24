"use client";
import Link from "next/link";import { usePathname } from "next/navigation";import { useState } from "react";
import { LayoutDashboard,UsersRound,Stethoscope,CalendarDays,ClipboardPlus,Pill,BarChart3,Bell,ShieldCheck,Settings,Menu,X,Search,UserCog } from "lucide-react";
import { Logo } from "./logo";import { ThemeToggle } from "./theme-toggle";import { LogoutButton } from "./logout-button";
const all=[
  {href:"/dashboard",label:"Overview",icon:LayoutDashboard,roles:["ADMIN","DOCTOR","NURSE","RECEPTIONIST","PATIENT"]},
  {href:"/patients",label:"Patients",icon:UsersRound,roles:["ADMIN","DOCTOR","NURSE","RECEPTIONIST"]},
  {href:"/doctors",label:"Doctors",icon:Stethoscope,roles:["ADMIN","NURSE","RECEPTIONIST","PATIENT"]},
  {href:"/staff",label:"Users & staff",icon:UserCog,roles:["ADMIN"]},
  {href:"/appointments",label:"Appointments",icon:CalendarDays,roles:["ADMIN","DOCTOR","NURSE","RECEPTIONIST","PATIENT"]},
  {href:"/consultations",label:"Consultations",icon:ClipboardPlus,roles:["ADMIN","DOCTOR","NURSE"]},
  {href:"/history",label:"Medical history",icon:Pill,roles:["PATIENT"]},
  {href:"/reports",label:"Reports",icon:BarChart3,roles:["ADMIN"]},
  {href:"/notifications",label:"Notifications",icon:Bell,roles:["ADMIN","DOCTOR","NURSE","RECEPTIONIST","PATIENT"]},
  {href:"/audit-logs",label:"Audit log",icon:ShieldCheck,roles:["ADMIN"]},
  {href:"/settings",label:"Settings",icon:Settings,roles:["ADMIN"]}
];
export function AppShell({children,user}:{children:React.ReactNode;user:{firstName:string;lastName:string;role:string}}){const path=usePathname(),[open,setOpen]=useState(false);const nav=all.filter(x=>x.roles.includes(user.role));return <div className="app-frame">
  <aside className={`sidebar ${open?"open":""}`}><div className="side-head"><Logo/><button className="mobile-close" onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button></div><nav>{nav.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className={`nav-link ${path===href||path.startsWith(href+"/")?"active":""}`}><Icon size={18}/><span>{label}</span></Link>)}</nav><div className="side-foot"><LogoutButton/><div className="privacy-note"><ShieldCheck size={15}/><span>Protected health workspace</span></div></div></aside>
  {open&&<button className="scrim" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
  <div className="main-column"><header className="topbar"><button className="menu-button" onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu/></button><div className="top-search"><Search size={17}/><span>Search this workspace</span><kbd>⌘ K</kbd></div><div className="top-actions"><ThemeToggle/><Link href="/notifications" className="icon-button" aria-label="Notifications"><Bell size={18}/></Link><div className="user-chip"><span>{user.firstName[0]}{user.lastName[0]}</span><div><strong>{user.firstName} {user.lastName}</strong><small>{user.role.toLowerCase()}</small></div></div></div></header><main className="page">{children}</main></div>
  </div>}
