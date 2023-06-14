import { ReactNode } from "react";
import DashboardNav from "@/components/dashboard-nav";
import getCurrentUser from "@/lib/session";
import { redirect } from "next/navigation";

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
    <div className="flex flex-col h-full bg-gray-50">
      <DashboardNav user={user} />
      <main className="flex-1 h-full mx-auto container max-w-6xl p-4">
        {children}
      </main>
    </div>
  );
}
