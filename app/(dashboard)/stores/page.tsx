import { db } from "@/lib/db";
import getCurrentUser from "@/lib/session";
import { redirect } from "next/navigation";
import StoreList from "@/components/store-list";

async function fetchStores(userId: string) {
  const stores = await db.store.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      image: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return stores;
}

export default async function StoresPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const stores = await fetchStores(user.id);

  return <StoreList stores={stores} />;
}
