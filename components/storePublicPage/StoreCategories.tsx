import { FoodCategory } from "@prisma/client";
import { useStoreContext } from "./StorePublicPageContainer";

interface StoreCategoriesProps {
  categories: FoodCategory[];
}

export default function StoreCategories({ categories }: StoreCategoriesProps) {
  const { activeCategory, setActiveCategory } = useStoreContext();

  return (
    <div className="h-16 w-full overflow-y-auto">
      <div className="flex space-x-2 px-2 h-12 mt-2">
        {categories.map((cat) => {
          return (
            <button
              onClick={() => setActiveCategory(cat)}
              className={`btn h-full ${
                activeCategory?.id === cat.id ? "btn-neutral" : ""
              }`}
              key={cat.id}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
