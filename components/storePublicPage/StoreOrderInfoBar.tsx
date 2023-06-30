import { Food } from "@prisma/client";
import { useStoreContext } from "./StorePublicPageContainer";

interface StoreOrderInfoBar {
  order: Food[];
}

export default function StoreOrderInfoBar({ order }: StoreOrderInfoBar) {
  const { storeData } = useStoreContext();
  const num_of_items = order.length;
  const sum = order.reduce((prev, curr) => {
    return prev + parseFloat(curr.price || "0");
  }, 0);

  if (order.length === 0) return null;

  return (
    <div className="text-sm bg-orange-400 text-white fixed bottom-0 left-0 w-full h-10 z-40 flex items-center justify-between px-2">
      <span>Your order: {num_of_items} items</span>
      <button className="btn btn-neutral btn-sm">
        Total {sum} {storeData?.currency}
      </button>
    </div>
  );
}
