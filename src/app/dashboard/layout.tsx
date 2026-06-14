import type { ReactNode } from "react";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { Sidebar, MobileHeader } from "@/components/dashboard/Sidebar";
import "@/app/dashboard/dashboard.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <MobileHeader />
      <Sidebar />
      <main className="main">{children}</main>
    </DashboardProvider>
  );
}
