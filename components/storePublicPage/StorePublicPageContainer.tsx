"use client";
import { Food, FoodCategory, Store } from "@prisma/client";
import StoreCoverHeader from "./StoreCoverHeader";
import StoreCategories from "./StoreCategories";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import StoreFeaturedFood from "./StoreFeaturedFood";
import StoreFoods from "./StoreFoods";
import StoreOrderInfoBar from "./StoreOrderInfoBar";

type StoreData = Store & { foodCategory: FoodCategory[]; foods: Food[] };

interface StorePublicPageContainerProps {
  storeData: StoreData;
}

interface IStoreContext {
  storeData: StoreData | null;
  activeCategory: FoodCategory | null;
  setActiveCategory: (val: FoodCategory | null) => void;
  order: Food[];
  addToOrder: (val: Food) => void;
  removeFromOrder: (val: string) => void;
  foodToView: Food | null;
  setFoodToView: (val: Food | null) => void;
}

const initialContext: IStoreContext = {
  storeData: null,
  activeCategory: null,
  setActiveCategory: () => {},
  order: [],
  addToOrder: () => {},
  removeFromOrder: () => {},
  foodToView: null,
  setFoodToView: () => {},
};
const StorePublicContext = createContext(initialContext);
export const useStoreContext = () => useContext(StorePublicContext);

export default function StorePublicPageContainer({
  storeData,
}: StorePublicPageContainerProps) {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(
    null
  );
  const [order, setOrder] = useState<Food[]>([]);
  const [foodToView, setFoodToView] = useState<Food | null>(null);

  function addToOrder(food: Food) {
    setOrder((prev) => {
      return [...prev, food];
    });
  }

  function removeFromOrder(id: string) {
    setOrder((prev) => {
      return prev.filter((f) => f.id !== id);
    });
  }

  const featuredFoods = useMemo(() => {
    return storeData.foods.filter((f) => f.isLive && f.isFeatured);
  }, [storeData.foods]);

  const categoryFoods = useMemo(() => {
    return storeData.foods.filter(
      (f) => f.isLive && f.foodCategoryId === activeCategory?.id
    );
  }, [storeData.foods, activeCategory]);

  useEffect(() => {
    setActiveCategory(() => {
      return storeData.foodCategory[0];
    });
  }, []);

  return (
    <StorePublicContext.Provider
      value={{
        storeData,
        activeCategory,
        setActiveCategory,
        order,
        addToOrder,
        removeFromOrder,
        foodToView,
        setFoodToView,
      }}
    >
      <div className="max-w-lg h-screen mx-auto overflow-x-auto rounded-none sm:rounded-xl pb-12">
        <StoreCoverHeader
          name={storeData.name}
          image={storeData.image || ""}
          description={storeData.description || ""}
        />
        <StoreCategories categories={storeData.foodCategory} />
        <StoreFeaturedFood featuredFoods={featuredFoods} />
        <StoreFoods foods={categoryFoods} />
        <StoreOrderInfoBar order={order} />
      </div>
    </StorePublicContext.Provider>
  );
}
