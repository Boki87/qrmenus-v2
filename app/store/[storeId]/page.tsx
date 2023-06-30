import StorePublicPageContainer from "@/components/storePublicPage/StorePublicPageContainer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface StorePublicPageProps {
  params: {
    storeId: string;
  };
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

export default async function StorePublicPage({
  params,
}: StorePublicPageProps) {
  const store = await fetchStoreData(params.storeId);

  if (!store) notFound();
  return <StorePublicPageContainer storeData={store} />;
}
