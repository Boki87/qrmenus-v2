"use client";
import Link from "next/link";
import ButtonGhost from "./ui/button-ghost";
import ButtonOutline from "./ui/button-outline";
import { usePathname } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { BsFillPhoneFill } from "react-icons/bs";
import { useStoreGlobalContext } from "@/context/StoreGlobalContext";

interface StorePageNavProps {
  storeId: string;
}

export default function StorePageNav({ storeId }: StorePageNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const { setShowPreview } = useStoreGlobalContext();

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
      <ButtonOutline onClick={() => setShowPreview(true)}>
        Preview
        <BsFillPhoneFill />
      </ButtonOutline>
    </div>
  );
}
