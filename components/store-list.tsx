"use client";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import StoreListCard from "./store-list-card";
import { Store } from "@prisma/client";
import { useState } from "react";
import ButtonOutline from "./ui/button-outline";

interface StoreListProps {
  stores: Pick<Store, "name" | "createdAt" | "id">[];
}

export default function StoreList({ stores }: StoreListProps) {
  const router = useRouter();
  const [storesList, setStoresList] = useState(() => stores);
  const [addingNewStore, setAddingNewStore] = useState(false);

  async function addNewStoreHandler() {
    setAddingNewStore(true);

    const response = await fetch(`/api/stores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });

    setAddingNewStore(false);

    if (!response?.ok) {
      //TODO: add toast here
      window.alert("Something went wrong");
    }

    const store = await response.json();

    setStoresList((old) => {
      const newStores = [store, ...old];
      newStores.sort((a: Store, b: Store) => {
        let timestamp1 = +new Date(a.updatedAt);
        let timestamp2 = +new Date(b.updatedAt);
        return timestamp1 - timestamp2;
      });
      return newStores;
    });
  }

  async function deleteHandler(storeId: string) {
    const r = window.confirm("Sure you want to delete this store?");
    if (!r) return;

    const response = await fetch(`/api/stores/${storeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response?.ok) {
      //TODO: add toast here
      window.alert("Something went wrong");
    }

    setStoresList((old) => {
      return old.filter((s) => s.id !== storeId);
    });
  }

  return (
    <div className="h-full">
      <div className="mb-4 mt-6 flex flex-wrap">
        <div className="flex-1">
          <h1 className="font-extrabold text-4xl text-gray-900">Stores</h1>
          <p className="text-gray-500 text-lg">Create and manage stores.</p>
        </div>
        <ButtonOutline onClick={addNewStoreHandler} isLoading={addingNewStore}>
          <FaPlus className="mr-2" />
          new store
        </ButtonOutline>
      </div>
      <div>
        {storesList.map((store) => (
          <StoreListCard
            id={store.id}
            name={store.name}
            createdAt={store.createdAt}
            onDelete={deleteHandler}
            key={store.id}
          />
        ))}
      </div>
    </div>
  );
}
