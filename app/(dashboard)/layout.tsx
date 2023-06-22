import { ReactNode } from "react";
import DashboardNav from "@/components/dashboard-nav";
import getCurrentUser from "@/lib/session";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="h-full bg-gray-50">
      <DashboardNav user={user} />
      <main className="h-full mx-auto container max-w-6xl p-4 overflow-y-auto pt-20">
        {children}
      </main>
    </div>
  );
}
