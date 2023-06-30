"use client";
import { FoodCategory } from "@prisma/client";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { useOutsideClick } from "@/lib/useOutsideClick";

interface CategoriesBarProps {
  storeId: string;
  categories: FoodCategory[];
  activeCategory: string;
  onSetActiveCategory: (categoryId: string) => void;
}

export default function CategoriesBar({
  categories: categoriesFromServer,
  storeId,
  activeCategory,
  onSetActiveCategory,
}: CategoriesBarProps) {
  const [categories, setCategories] = useState(() => categoriesFromServer);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function addCategory() {
    try {
      setIsAdding(true);
      const response = await fetch(`/api/stores/${storeId}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "add",
        }),
      });
      const newCat = await response.json();
      setCategories((old) => {
        return [...old, newCat];
      });
      setIsAdding(false);
    } catch (e) {
      console.log(e);
      setIsAdding(false);
    }
  }

  async function deleteCategory(categoryId: string) {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/stores/${storeId}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "delete",
          categoryId,
        }),
      });

      if (!response.ok) {
        //todo: add toast msg here
        window.alert("Could not delete category");
        return;
      }

      setCategories((old) => {
        return old.filter((cat) => cat.id !== categoryId);
      });
      setIsUpdating(false);
      if (categoryId === activeCategory) {
        console.log("set to none");
        onSetActiveCategory("");
      }
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  }

  async function updateCategory(newName: string, categoryId: string) {
    console.log("update to " + newName);
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/stores/${storeId}/categories`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          categoryId,
        }),
      });

      if (response.ok) {
        setCategories((old) => {
          return old.map((c) => {
            if (c.id === categoryId) {
              c.name = newName;
            }
            return c;
          });
        });
      }
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  }

  return (
    <div className="col-span-6 md:col-span-2">
      <div className="bg-white min-h-16 rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-200 w-full h-12 flex items-center px-4 font-bold text-gray-700">
          Menu Categories
        </div>
        <div className="p-4 relative">
          {isUpdating && (
            <div className="absolute top-0 right-0 w-full h-full bg-gray-300 bg-opacity-50 z-10 flex items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          )}
          {categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryItem
                onDelete={() => deleteCategory(cat.id)}
                onUpdate={(newName: string) => updateCategory(newName, cat.id)}
                onSetActive={() => onSetActiveCategory(cat.id)}
                activeCategory={activeCategory}
                name={cat.name}
                id={cat.id}
                key={cat.id}
              />
            ))
          ) : (
            <span>No Categories</span>
          )}
        </div>
        <div className="p-4">
          <button
            onClick={addCategory}
            className="btn w-full"
            disabled={isAdding}
          >
            {!isAdding ? (
              "Add new"
            ) : (
              <span className="loading loading-spinner loading-md"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CategoryItemProps {
  id: string;
  name: string;
  onDelete: () => void;
  onSetActive: () => void;
  onUpdate: (newName: string) => void;
  activeCategory: string;
  [x: string]: any;
}
function CategoryItem({
  id,
  name,
  onDelete,
  onUpdate,
  onSetActive,
  activeCategory,
  ...props
}: CategoryItemProps) {
  const submitBtn = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const isActive = activeCategory === id;
  const [updatedName, setUpdatedName] = useState(() => name);

  function updateHandler() {
    if (updatedName !== "") {
      onUpdate(updatedName);
    }
    setShowForm(false);
  }

  useOutsideClick(inputRef, () => {
    setShowForm(false);
    setUpdatedName(name);
  });

  const listenForEsc = useCallback((e: KeyboardEvent) => {
    if (e.code === "Escape" || e.key === "Escape") {
      setShowForm(false);
    }
  }, []);

  const listenForReturn = useCallback((e: KeyboardEvent) => {
    if (e.code === "Enter" || e.key === "Enter") {
      if (submitBtn.current) {
        submitBtn.current.click();
      }
    }
  }, []);

  useEffect(() => {
    if (showForm) {
      setUpdatedName(name);
      inputRef.current?.focus();
      document.addEventListener("keyup", listenForEsc);
      document.addEventListener("keyup", listenForReturn);
    } else {
      document.removeEventListener("keyup", listenForEsc);
      document.removeEventListener("keyup", listenForReturn);
    }
  }, [showForm]);

  return (
    <div
      className={`h-10 w-full rounded-lg bg-gray-50 flex items-center my-2 pl-2 ${
        isActive
          ? "border-l-4 border-blue-400"
          : "border-l-4 border-transparent"
      }
    ${showForm ? "ring ring-blue-400" : ""} 
      `}
      {...props}
    >
      {!showForm ? (
        <>
          <div onClick={onSetActive} className="flex-1 truncate cursor-pointer">
            {isActive}
            {name}
          </div>

          <div className="join h-full">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-sm join-item h-full"
            >
              <FaEdit />
            </button>

            <button onClick={onDelete} className="btn btn-sm join-item h-full">
              <FaTrash />
            </button>
          </div>
        </>
      ) : (
        <div className="join h-full w-full flex">
          <input
            ref={inputRef}
            onInput={(e: SyntheticEvent) => {
              const input = e.target as HTMLInputElement;
              setUpdatedName(input.value);
            }}
            value={updatedName}
            className="join-item bg-transparent outline-none flex-1 px-1"
          />
          <button
            ref={submitBtn}
            onClick={updateHandler}
            className="btn btn-sm join-item h-full"
            type="submit"
          >
            <FaSave />
          </button>
        </div>
      )}
    </div>
  );
}
