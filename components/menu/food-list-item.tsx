import { Food } from "@prisma/client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";

interface FoodListItemProps {
  data: Food;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FoodListItem({
  data,
  currency,
  onEdit,
  onDelete,
}: FoodListItemProps) {
  return (
    <div
      className={`w-full h-14 bg-gray-100 rounded-lg flex items-center px-1 my-3 gap-3 relative ${
        !data.isLive ? "opacity-50" : ""
      }`}
    >
      {data.isFeatured && (
        <div className="absolute top-3 -left-4 w-16 h-4 bg-yellow-400 -rotate-45 text-white uppercase text-xs text-center">
          featured
        </div>
      )}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center overflow-hidden">
        {data.image ? (
          <img
            src={data.image}
            className="object-cover min-w-full min-h-full"
          />
        ) : (
          <MdFastfood />
        )}
      </div>
      <div className="flex-1 truncate">
        <span className="font-bold text-gray-700">{data.name}</span>
      </div>
      <div className="flex items-center space-x-3">
        <div>
          <span className="font-bold text-gray-700">
            {data.price} {currency}
          </span>
        </div>
        <div className="join h-full">
          <button onClick={onEdit} className="btn btn-outline join-item">
            <FaEdit />
          </button>
          <button onClick={onDelete} className="btn btn-outline join-item">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
