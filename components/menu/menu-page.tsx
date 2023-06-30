"use client";
import { Food, FoodCategory, Store } from "@prisma/client";
import CategoriesBar from "./categories-bar";
import FoodsList from "./foods-list";
import { useEffect, useState } from "react";
import { useStoreGlobalContext } from "@/context/StoreGlobalContext";
import PreviewModal from "../PreviewModal";

interface MenuPageProps {
  storeData: Store & { foodCategory: FoodCategory[]; foods: Food[] };
}

export function MenuPage({ storeData }: MenuPageProps) {
  const { showPreview, setShowPreview } = useStoreGlobalContext();

  const [activeCategory, setActiveCategory] = useState(
    () => storeData.foodCategory[0]?.id || ""
  );

  const foods = storeData.foods.filter(
    (f) => f.foodCategoryId === activeCategory
  );

  useEffect(() => {
    setShowPreview(false);
    () => {
      setShowPreview(false);
    };
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4">
      <CategoriesBar
        storeId={storeData.id}
        categories={storeData.foodCategory}
        activeCategory={activeCategory}
        onSetActiveCategory={(categoryId: string) =>
          setActiveCategory(categoryId)
        }
      />
      <FoodsList
        storeId={storeData.id}
        foods={foods}
        activeCategory={activeCategory}
        currency={storeData.currency || "€"}
      />
      <PreviewModal
        storeId={storeData.id}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
        }}
      />
    </div>
  );
}
