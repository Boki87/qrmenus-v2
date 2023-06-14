import { classMerge } from "@/lib/utils";
import { is } from "date-fns/locale";
import { ReactNode } from "react";

interface ButtonOutlineProps {
  children: ReactNode;
  isLoading?: boolean;
  isActive?: boolean;
  [x: string]: any;
}

const btnStyles = {
  default: "btn btn-ghost btn-outline btn-sm sm:btn-md text-xs sm:text-md",
  loading: "cursor-not-allowed pointer-events-none opacity-50",
};

export default function ButtonOutline({
  children,
  className,
  isLoading = false,
  isActive = false,
  ...props
}: ButtonOutlineProps) {
  return (
    <button
      className={classMerge(
        btnStyles.default,
        isLoading ? btnStyles.loading : "",
        isActive ? "btn-active" : "",
        className
      )}
      {...props}
    >
      {!isLoading ? (
        children
      ) : (
        <span className="loading loading-spinner loading-sm"></span>
      )}
    </button>
  );
}
