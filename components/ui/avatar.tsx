import { classMerge } from "@/lib/utils";

interface AvatarProps {
  image?: string;
  name?: string;
  className?: string;
}

export default function Avatar({
  image,
  name,
  className,
  ...props
}: AvatarProps) {
  let initials = name
    ?.split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div
      className={classMerge("btn btn-ghost btn-circle avatar", className || "")}
      {...props}
    >
      {image ? (
        <div className="w-10 rounded-full">
          <img src={image} referrerPolicy="no-referrer" />
        </div>
      ) : (
        <div
          className="w-10 rounded-full bg-slate-100 flex items-center justify-center"
          style={{ display: "flex" }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
