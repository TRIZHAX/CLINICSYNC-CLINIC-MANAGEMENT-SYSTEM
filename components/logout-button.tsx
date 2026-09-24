"use client";
import { LogOut } from "lucide-react";
export function LogoutButton(){return <button className="nav-link logout" onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});location.href="/login"}}><LogOut size={18}/><span>Sign out</span></button>}

