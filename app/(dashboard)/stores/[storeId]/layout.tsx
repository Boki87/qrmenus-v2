import { ReactNode } from "react";
import StorePageNav from "@/components/store-page-nav";

interface DashboardLayoutProps {
  children: ReactNode;
  params: { storeId: string };
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  return (
    <div className="w-full">
      <StorePageNav storeId={params.storeId} />
      {children}
    </div>
  );
}
