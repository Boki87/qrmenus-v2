import { Food } from "@prisma/client";
import { useStoreContext } from "./StorePublicPageContainer";
import { MdFastfood } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { BiAddToQueue } from "react-icons/bi";

interface StoreFoodsProps {
  foods: Food[];
}

export default function StoreFoods({ foods }: StoreFoodsProps) {
  const { activeCategory } = useStoreContext();
  if (!activeCategory) return null;
  return (
    <div className="p-2">
      <span className="text-lg font-bold text-gray-800">
        {activeCategory?.name}
      </span>
      <div>
        {foods.map((food) => (
          <StoreFoodCard food={food} key={food.id} />
        ))}
      </div>
    </div>
  );
}

export function StoreFoodCard({ food }: { food: Food }) {
  const { storeData, addToOrder } = useStoreContext();
  return (
    <div className="flex h-36 w-full my-2 relative justify-center">
      <div className="w-16 h-full">
        <div
          className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center absolute top-4 md:top-2 left-0 z-10`}
        >
          {food.image ? (
            <img
              src={food.image}
              className="min-w-full min-h-full object-cover"
            />
          ) : (
            <MdFastfood className="text-4xl" />
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center space-y-2 bg-slate-100 relative rounded-2xl overflow-hidden">
        <span className="text-xl font-bold text-gray-700">{food.name}</span>
        <div className="flex items-center space-x-2">
          <button className="btn btn-neutral btn-sm">
            {food.price} {storeData?.currency}
          </button>
          <span className="text-gray-500 font-bold">
            {food.size} {food.sizeUnit}
          </span>
        </div>
        <div
          className="h-full w-10 absolute top-0 right-0 bg-gray-200 flex flex-col"
          style={{ margin: "0px" }}
        >
          <div className="flex-1 flex items-center justify-center border-b border-gray-400 border-opacity-40 cursor-pointer hover:bg-gray-300">
            <BsInfoLg />
          </div>
          <div
            onClick={() => addToOrder(food)}
            className="flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-300"
          >
            <BiAddToQueue />
          </div>
        </div>
      </div>
    </div>
  );
}
