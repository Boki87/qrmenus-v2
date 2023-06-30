"use client";
import { useRouter } from "next/navigation";
import { Store, Food, FoodCategory } from "@prisma/client";
import {
  FormEvent,
  SyntheticEvent,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import ButtonOutline from "./ui/button-outline";
import InputGroup from "./ui/input-group";
import TextareaGroup from "./textarea-group";
import useCurrency from "@/lib/useCurrency";
import { MdFastfood } from "react-icons/md";
import UploadWidget from "./UploadWidget";
import StoreMockup from "./StoreMockup";
import PreviewModal from "./PreviewModal";
import { useStoreGlobalContext } from "@/context/StoreGlobalContext";

interface StorePageInfoProps {
  store: Store;
}

export default function StorePageInfoFrom({ store }: StorePageInfoProps) {
  const [isMobileView, setIsMobileView] = useState(false);
  const mockupIframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const { currencies } = useCurrency();
  const [storeData, setStoreData] = useState<
    Store & { foodCategory?: FoodCategory[]; foods?: Food[] }
  >(store);
  const [isSaving, setIsSaving] = useState(false);
  const { showPreview, setShowPreview } = useStoreGlobalContext();

  function handleStoreDataChange(name: string, val: string) {
    setStoreData((old) => {
      return { ...old, [name]: val };
    });
  }

  async function updateRequest(newData?: Partial<Food>) {
    const { id, createdAt, foodCategory, foods, updatedAt, ...changes } =
      storeData;
    const res = await fetch(`/api/stores/${store.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...changes, ...newData }),
    });

    if (!res?.ok) {
      //TODO: add toast message here
      window.alert("Something went wrong");
    }
  }

  async function updateStoreHandler(e: FormEvent) {
    e.preventDefault();
    const { id, createdAt, foodCategory, foods, updatedAt, ...changes } =
      storeData;
    try {
      setIsSaving(true);
      await updateRequest();
      setIsSaving(false);
      router.refresh();
      console.log(mockupIframeRef.current);
      if (mockupIframeRef.current) {
        mockupIframeRef.current.src = mockupIframeRef.current?.src;
      }
    } catch (e) {
      console.log(e);
      //TODO: add toast message here
      window.alert("Something went wrong");
    }
  }

  const checkForMobileWidth = useCallback((e: UIEvent) => {
    const window = e.target as Window;
    if (window.innerWidth < 769) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", checkForMobileWidth);
    return () => {
      window.removeEventListener("resize", checkForMobileWidth);
    };
  }, []);

  return (
    <div className="w-full flex">
      <form className="flex-1" onSubmit={updateStoreHandler}>
        <div className="w-full h-[200px] rounded-lg bg-slate-200 mb-3 flex items-center justify-center overflow-hidden">
          {storeData.image && storeData.image !== "" && (
            <img
              src={storeData.image}
              className="min-w-full min-h-full object-cover"
            />
          )}
          {(!storeData.image || storeData.image === "") && (
            <MdFastfood className="text-5xl" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <UploadWidget
            imageName={storeData.id + "-cover"}
            onUploadComplete={async (url: string) => {
              console.log(url);
              setStoreData((prev) => {
                return { ...prev, image: url };
              });
              await updateRequest({ image: url });
            }}
            options={{ folder: "qrmenus_store_covers" }}
          />
          <button
            onClick={async () => {
              setStoreData((prev) => {
                return { ...prev, image: "" };
              });
              await updateRequest({ image: "" });
            }}
            className="btn"
            type="button"
          >
            Remove Image
          </button>
        </div>
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
          <div className="input-group flex max-w-full">
            <span>{storeData.currency}</span>
            <select
              className="select select-bordered flex-1 max-w-[200px] sm:max-w-full"
              value={storeData.currency || "EUR"}
              onChange={(e: SyntheticEvent) => {
                const select = e.target as HTMLSelectElement;
                setStoreData((old) => {
                  return { ...old, currency: select.value };
                });
              }}
            >
              {currencies.map((currency) => {
                return (
                  <option value={currency.short} key={currency.short}>
                    {currency.long}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div>
          <ButtonOutline isLoading={isSaving} className="w-full" type="submit">
            SAVE
          </ButtonOutline>
        </div>
      </form>
      <div className="flex-1 h-full items-center justify-center pt-8 hidden md:flex ">
        <StoreMockup storeId={store.id} iframeRef={mockupIframeRef} />
      </div>
      <PreviewModal
        storeId={store.id}
        isOpen={isMobileView && showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
