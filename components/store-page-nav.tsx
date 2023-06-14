"use client";
import Link from "next/link";
import ButtonGhost from "./ui/button-ghost";
import ButtonOutline from "./ui/button-outline";
import { usePathname } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

interface StorePageNavProps {
  storeId: string;
}

export default function StorePageNav({ storeId }: StorePageNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex space-x-2 mb-6">
      <Link href={`/stores`}>
        <ButtonOutline>
          <FaChevronLeft />
        </ButtonOutline>
      </Link>
      <Link href={`/stores/${storeId}`}>
        <ButtonOutline isActive={isActive(`/stores/${storeId}`)}>
          Store Info
        </ButtonOutline>
      </Link>
      <Link href={`/stores/${storeId}/menu`}>
        <ButtonOutline isActive={isActive(`/stores/${storeId}/menu`)}>
          Edit Menu
        </ButtonOutline>
      </Link>
    </div>
  );
}
