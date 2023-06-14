"use client";
import Link from "next/link";
import { format } from "date-fns";
import { RxDotsVertical } from "react-icons/rx";

interface StoreListCardProps {
  id: string;
  name: string;
  createdAt: Date;
  onDelete?: (storeId: string) => void;
}

export default function StoreListCard({
  id,
  name,
  createdAt,
  onDelete,
}: StoreListCardProps) {
  const formatedDate = format(new Date(createdAt), "MMMM d, y");

  return (
    <div className="w-full border border-gray-300 rounded-lg flex bg-white mb-3">
      <div className="flex flex-col justify-center space-y-2 px-4 py-4">
        <Link
          href={`/stores/${id}`}
          className="hover:underline capitalize text-gray-800 font-bold text-lg"
        >
          {name}
        </Link>
        <span className="text-gray-600 text-sm">{formatedDate}</span>
      </div>

      <div className="flex-1"></div>

      <div className="h-full p-4 flex items-center justify-center">
        <div className="dropdown dropdown-end">
          <label tabIndex={0}>
            <button className="btn btn-ghost btn-square border border-gray-200">
              <RxDotsVertical />
            </button>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 border border-gray-200 z-20"
          >
            <li>
              <Link href={`/stores/${id}`}>Edit</Link>
            </li>
            <li className="text-red-500">
              <button onClick={() => onDelete && onDelete(id)}>Delete</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
