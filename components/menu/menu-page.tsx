"use client";
import { Food, FoodCategory, Store } from "@prisma/client";
import CategoriesBar from "./categories-bar";
import FoodsList from "./foods-list";
import { useState } from "react";

interface MenuPageProps {
  storeData: Store & { foodCategory: FoodCategory[]; foods: Food[] };
}

export function MenuPage({ storeData }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState(
    () => storeData.foodCategory[0]?.id || ""
  );

  const foods = storeData.foods.filter(
    (f) => f.foodCategoryId === activeCategory
  );

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
      />
    </div>
  );
}
