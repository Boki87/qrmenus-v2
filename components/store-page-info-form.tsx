"use client";
import { useRouter } from "next/navigation";
import { Store, Food, FoodCategory } from "@prisma/client";
import { FormEvent, SyntheticEvent, useState } from "react";
import ButtonOutline from "./ui/button-outline";
import InputGroup from "./ui/input-group";
import TextareaGroup from "./textarea-group";

interface StorePageInfoProps {
  store: Store;
}

export default function StorePageInfoFrom({ store }: StorePageInfoProps) {
  const router = useRouter();
  const [storeData, setStoreData] = useState<
    Store & { foodCategory?: FoodCategory[]; foods?: Food[] }
  >(store);
  const [isSaving, setIsSaving] = useState(false);

  function handleStoreDataChange(name: string, val: string) {
    setStoreData((old) => {
      return { ...old, [name]: val };
    });
  }

  async function updateStoreHandler(e: FormEvent) {
    e.preventDefault();
    const { id, createdAt, foodCategory, foods, updatedAt, ...changes } =
      storeData;
    setIsSaving(true);
    const response = await fetch(`/api/stores/${store.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    });
    if (!response?.ok) {
      //TODO: add toast message here
      window.alert("Something went wrong");
    }
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="w-full flex">
      <form className="flex-1" onSubmit={updateStoreHandler}>
        <InputGroup
          label="Store Name"
          value={storeData.name}
          onInput={(val) => handleStoreDataChange("name", val)}
        />
        <InputGroup
          label="Email"
          value={storeData.email || ""}
          placeholder="store@email.com"
          onInput={(val) => handleStoreDataChange("email", val)}
        />
        <TextareaGroup
          label="Address"
          value={storeData.address || ""}
          placeholder="London, UK"
          onInput={(val) => handleStoreDataChange("address", val)}
        />
        <TextareaGroup
          label="Working Hours"
          value={storeData.workingHours || ""}
          placeholder="Mon 13-20h"
          onInput={(val) => handleStoreDataChange("workingHours", val)}
        />
        <TextareaGroup
          label="Description"
          value={storeData.description || ""}
          placeholder=""
          onInput={(val) => handleStoreDataChange("description", val)}
        />
        <TextareaGroup
          label="Announcement"
          value={storeData.annoucement || ""}
          placeholder=""
          onInput={(val) => handleStoreDataChange("annoucement", val)}
        />
        <div className="form-control mb-8">
          <label className="label">
            <span className="label-text">Currency</span>
          </label>
          <label className="input-group flex">
            <span>$</span>
            <select
              className="select select-bordered flex-1"
              value={storeData.currency || "EUR"}
              onChange={(e: SyntheticEvent) => {
                const select = e.target as HTMLSelectElement;
                setStoreData((old) => {
                  return { ...old, currency: select.value };
                });
              }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </div>
        <div>
          <ButtonOutline isLoading={isSaving} className="w-full" type="submit">
            SAVE
          </ButtonOutline>
        </div>
      </form>
      <div className="flex-1 h-full items-center justify-center pt-8 hidden md:flex ">
        <div className="mockup-phone">
          <div className="camera"></div>
          <div className="display">
            <div className="artboard artboard-demo phone-1">
              <div className="h-full w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
