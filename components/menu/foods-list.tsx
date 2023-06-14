"use client";

import { Food } from "@prisma/client";
import { useState } from "react";

interface FoodsListProps {
  storeId: string;
  foods: Food[];
  activeCategory: string;
}

export default function FoodsList({
  foods: foodsFromServer,
  storeId,
  activeCategory,
}: FoodsListProps) {
  const [foods, setFoods] = useState(() => foodsFromServer);

  return (
    <div className="col-span-6 md:col-span-4 bg-white rounded-lg min-h-[500px]">
      Foods list {foods.length} {activeCategory}
      {/* Open the modal using ID.showModal() method */}
      <button className="btn" onClick={() => window.my_modal_2.showModal()}>
        open modal
      </button>
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
