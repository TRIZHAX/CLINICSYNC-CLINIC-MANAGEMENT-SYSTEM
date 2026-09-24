import type { Metadata, Viewport } from "next";import "./globals.css";
export const metadata:Metadata={title:{default:"ClinicSync",template:"%s · ClinicSync"},description:"Smart, Simple, Connected Clinic Management",applicationName:"ClinicSync",robots:{index:false,follow:false}};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:[{media:"(prefers-color-scheme: light)",color:"#f4f7f5"},{media:"(prefers-color-scheme: dark)",color:"#0d1514"}]};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}

