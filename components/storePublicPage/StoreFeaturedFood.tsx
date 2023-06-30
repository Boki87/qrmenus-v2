import { Food } from "@prisma/client";
import { MdFastfood } from "react-icons/md";
import { useStoreContext } from "./StorePublicPageContainer";

interface StoreFeaturedFoodProps {
  featuredFoods: Food[];
}

export default function StoreFeaturedFood({
  featuredFoods,
}: StoreFeaturedFoodProps) {
  return (
    <>
      <span className="text-gray-800 text-lg font-bold ml-2">Featured:</span>
      <div className="h-[150px] w-full overflow-y-auto mb-3">
        <div className="flex h-full py-2 space-x-3 px-2">
          {featuredFoods.map((food) => (
            <FeaturedFoodCard food={food} key={food.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export function FeaturedFoodCard({ food }: { food: Food }) {
  const { storeData } = useStoreContext();
  return (
    <div className="h-full min-w-[200px] max-w-[200px] flex flex-col justify-end cursor-pointer">
      <div className="w-full h-4/5 rounded-xl bg-slate-200 relative flex flex-col justify-end p-2">
        <div className="absolute h-[90px] w-[90px] rounded-full -top-[30px] left-1/2 bg-gray-300 -translate-x-1/2 overflow-hidden flex items-center justify-center shadow">
          {food.image ? (
            <img
              src={food.image}
              className="min-w-full min-h-full object-cover"
            />
          ) : (
            <MdFastfood className="text-3xl" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="truncate font-bold text-gray-700">{food.name}</div>
          <button className="btn btn-sm btn-neutral">
            {food.price} {storeData?.currency}
          </button>
        </div>
      </div>
    </div>
  );
}
