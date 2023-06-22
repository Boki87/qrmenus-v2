"use client";
import { Food } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import FoodListModal from "./food-list-modal";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import FoodListItem from "./food-list-item";

interface FoodsListProps {
  storeId: string;
  foods: Food[];
  activeCategory: string;
  currency: string;
}

export default function FoodsList({
  foods: foodsFromServer,
  storeId,
  activeCategory,
  currency,
}: FoodsListProps) {
  const isFirstRender = useRef(true);
  const [loadingFoods, setIsLoadingFoods] = useState(false);
  const [foods, setFoods] = useState(() => foodsFromServer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodIdToEdit, setFoodIdToEdit] = useState("");

  async function fetchFoods() {
    setIsLoadingFoods(true);
    try {
      const response = await fetch(
        `/api/stores/${storeId}/food/${activeCategory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const resData = await response.json();
      // console.log(resData);
      setFoods(resData);
      setIsLoadingFoods(false);
    } catch (e) {
      //TODO: need to show a toast message here
      console.log(e);
      setIsLoadingFoods(false);
    }
  }

  async function deleteFood(foodId: string) {
    try {
      const response = await fetch(`/api/stores/${storeId}/${foodId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Could not delete food");
      }
      console.log(await response.json());
      setFoods((prev) => {
        return prev.filter((f) => f.id !== foodId);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteFoodHandler(foodId: string) {
    const r = window.confirm("Sure you want to delete this item?");
    if (!r) return;
    await deleteFood(foodId);
  }

  function addFoodHandler(food: Food) {
    setFoods((prev) => {
      return [...prev, food];
    });
  }

  function updateFoodHandler(food: Food) {
    setFoods((prev) => {
      return prev.map((f) => {
        if (f.id === food.id) {
          return food;
        }
        return f;
      });
    });
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (activeCategory === "") {
      setFoods([]);
      return;
    }
    fetchFoods();
  }, [activeCategory]);

  return (
    <>
      <div className="col-span-6 md:col-span-4 bg-white rounded-lg min-h-[200px] max-h-[800px] overflow-hidden border border-gray-200 overflow-y-auto relative flex flex-col">
        <div className="bg-gray-200 w-full min-h-12 flex items-center px-4 font-bold text-gray-700 justify-between">
          <span>Items</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-sm btn-outline"
          >
            <FaPlus />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!loadingFoods &&
            foods.map((food) => (
              <FoodListItem
                data={food}
                currency={currency}
                onEdit={() => {
                  setFoodIdToEdit(food.id);
                  setIsModalOpen(true);
                }}
                onDelete={() => deleteFoodHandler(food.id)}
                key={food.id}
              />
            ))}
          {!loadingFoods && foods.length === 0 && (
            <p className="text-center h-full w-full flex items-center justify-center text-lg text-gray-500 font-bold">
              No foods
            </p>
          )}
          {loadingFoods && (
            <>
              <div className="w-full h-14 bg-gray-100 rounded-lg flex items-center px-1 my-3 animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center overflow-hidden"></div>
              </div>
              <div className="w-full h-14 bg-gray-100 rounded-lg flex items-center px-1 my-3 animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center overflow-hidden"></div>
              </div>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <FoodListModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setFoodIdToEdit("");
            }}
            foodId={foodIdToEdit}
            storeId={storeId}
            categoryId={activeCategory}
            onAdd={addFoodHandler}
            onUpdate={updateFoodHandler}
            currency={currency}
          />
        )}
      </AnimatePresence>
    </>
  );
}
