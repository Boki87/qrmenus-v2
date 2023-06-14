import { MenuPage } from "@/components/menu/menu-page";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface StoreEditPageProps {
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

export default async function StoreMenu({ params }: StoreEditPageProps) {
  const store = await fetchStoreData(params.storeId);

  if (!store) notFound();

  return (
    <div>
      <MenuPage storeData={store} />
    </div>
  );
}
