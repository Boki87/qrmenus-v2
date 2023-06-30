import { ReactNode } from "react";
import StorePageNav from "@/components/store-page-nav";
import StoreGlobalProvider from "@/context/StoreGlobalContext";

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
      <StoreGlobalProvider>
        <StorePageNav storeId={params.storeId} />
        {children}
      </StoreGlobalProvider>
    </div>
  );
}
