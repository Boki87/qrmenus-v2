import { classMerge } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonGhostProps {
  children: ReactNode;
  isLoading?: boolean;
  [x: string]: any;
}

const btnStyle = {
  default: "btn btn-ghost btn-sm sm:btn-md text-xs sm:text-md",
  loading: "btn btn ghost btn-sm sm:btn-md text-xs sm:text-md loading",
};

export default function ButtonGhost({
  children,
  className,
  isLoading = false,
  ...props
}: ButtonGhostProps) {
  return (
    <button
      className={classMerge(
        isLoading ? btnStyle.loading : btnStyle.default,
        className
      )}
      {...props}
    >
      {!isLoading ? children : "loading"}
    </button>
  );
}
