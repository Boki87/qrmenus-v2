import { db } from "@/lib/db";
import StorePageInfoFrom from "@/components/store-page-info-form";
import { notFound } from "next/navigation";

interface StorePageProps {
  params: { storeId: string };
}

async function fetchStoreData(storeId: string) {
  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
    include: {
      foodCategory: true,
      foods: true,
    },
  });

  return store;
}

export default async function StorePage({ params }: StorePageProps) {
  const store = await fetchStoreData(params.storeId);

  if (!store) notFound();

  return <StorePageInfoFrom store={store} />;
}
