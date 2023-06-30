interface StoreCoverHeaderProps {
  image?: string;
  name: string;
  description?: string;
}

export default function StoreCoverHeader({
  image,
  name,
  description,
}: StoreCoverHeaderProps) {
  return (
    <div className="w-full h-[220px] bg-slate-200 relative overflow-hidden">
      <div className="w-full h-full absolute top-0 left-0 z-10 flex items-center justify-center">
        {image && image !== "" && (
          <img src={image} className="min-w-full min-h-full object-cover" />
        )}
      </div>
      <div className="w-full h-full absolute top-0 left-0 z-20 bg-black/40 backdrop-blur-sm text-center p-4 flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl text-white mb-3 mt-6">{name}</h1>
        {description !== "" && (
          <p className="text-white max-w-md">{description}</p>
        )}
      </div>
    </div>
  );
}
