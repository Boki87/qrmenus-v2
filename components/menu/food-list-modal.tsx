"use client";
import { Food } from "@prisma/client";
import { motion } from "framer-motion";
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { IoScaleOutline } from "react-icons/io5";
import useImageWidget from "@/lib/useImageWidget";
import { MdFastfood } from "react-icons/md";

interface FoodsListModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAdd: (food: Food) => void;
  onUpdate: (food: Food) => void;
  foodId?: string;
  categoryId: string;
  storeId: string;
  currency: string;
}

type FoodType = Omit<Food, "createdAt" | "updatedAt" | "id">;

export default function FoodListModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  foodId,
  storeId,
  categoryId,
  currency,
}: FoodsListModalProps) {
  const { openWidget } = useImageWidget();
  const [isLoadingFood, setIsLoadingFood] = useState(false);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [food, setFood] = useState<FoodType>({
    name: "",
    image: "",
    description: "",
    comments: "",
    price: 0,
    size: 100,
    sizeUnit: "g",
    prepTime: 0,
    isLive: true,
    isFeatured: false,
    storeId,
    foodCategoryId: categoryId,
    orderIndex: 0,
  });

  async function fetchFood() {
    try {
      setIsLoadingFood(true);
      const response = await fetch(`/api/stores/${storeId}/${foodId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Server Error");
      }

      const data = await response.json();
      setFood(data);
      setIsLoadingFood(false);
    } catch (e) {
      console.log(e);
      setIsLoadingFood(false);
    }
  }

  async function addFood() {
    try {
      setIsAddingFood(true);
      const response = await fetch(`/api/stores/${storeId}/food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(food),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Server Error");
      }

      const data = await response.json();
      onAdd(data);
      onClose && onClose();
      setIsAddingFood(false);
    } catch (e) {
      console.log(e);
      setIsAddingFood(false);
    }
  }

  async function updateFood() {
    try {
      setIsAddingFood(true);
      const response = await fetch(`/api/stores/${storeId}/${foodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(food),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Server Error");
      }

      const data = await response.json();
      onUpdate(data);
      setIsAddingFood(false);
    } catch (e) {
      console.log(e);
      setIsAddingFood(false);
    }
  }

  function foodInputHandler(name: string, val: string | number) {
    setFood((prev) => {
      return { ...prev, [name]: val };
    });
  }

  function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (foodId && foodId !== "") {
      console.log("update food");
      updateFood();
    } else {
      console.log("add new food");
      addFood();
    }
  }

  function imageUploadHandler(url: string) {
    setFood((prev) => {
      return { ...prev, image: url };
    });
  }

  useEffect(() => {
    if (!foodId || foodId === "") {
      return;
    }
    fetchFood();
  }, [foodId]);

  const listenForEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose && onClose();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", listenForEscape);
    return () => window.removeEventListener("keyup", listenForEscape);
  }, []);

  return createPortal(
    <motion.div
      onClick={onClose}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-30 z-50 overflow-y-auto"
    >
      <div
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation();
        }}
        className="w-xl min-h-20 bg-white rounded-xl min-w-[250px] max-w-[600px] w-full min-h-[200px] p-8 m-auto my-10 relative"
      >
        {isLoadingFood ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <span className="loading loading-dots loading-md md:loading-lg"></span>
          </div>
        ) : (
          <form onSubmit={submitHandler}>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-1 right-1 btn btn-sm rounded-full w-8 h-8"
            >
              <FaTimes />
            </button>

            <div className="w-full h-36 md:h-60 bg-slate-200 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
              {food.image === "" && <MdFastfood className="text-5xl" />}
              {food.image && food.image !== "" && (
                <img
                  src={food.image}
                  className="min-w-full min-h-full object-cover"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => openWidget(imageUploadHandler)}
              className="btn"
            >
              Upload Image
            </button>
            <button
              onClick={() =>
                setFood((prev) => {
                  return { ...prev, image: "" };
                })
              }
              type="button"
              className="btn ml-2"
            >
              Remove Image
            </button>
            <InputGroup
              name="name"
              val={food.name}
              onInput={foodInputHandler}
              placeholder="Item Name"
              required
              label="Name"
            />
            <InputGroupTextarea
              name="description"
              val={food.description || ""}
              onInput={foodInputHandler}
              placeholder="Description"
              label="Description"
            />
            <InputGroupTextarea
              name="comments"
              val={food.comments || ""}
              onInput={foodInputHandler}
              placeholder="Additional comments"
              label="Additional comments"
            />
            <InputGroup
              name="price"
              type="number"
              val={food.price || 0}
              onInput={foodInputHandler}
              leftElement={<span>{currency}</span>}
              label="Price"
            />
            <InputGroup
              name="size"
              type="number"
              val={food.size || 0}
              onInput={foodInputHandler}
              rightElement={<span className="italic font-bold">grams</span>}
              leftElement={
                <span>
                  <IoScaleOutline />
                </span>
              }
              label="Size"
            />
            <InputGroup
              name="prepTime"
              type="number"
              val={food.prepTime || 0}
              onInput={foodInputHandler}
              leftElement={
                <span>
                  <BsClockHistory />
                </span>
              }
              rightElement={<span className="italic font-bold">mins</span>}
              label="Preparation time"
            />
            <div className="form-group flex items-center space-x-2 my-3">
              <label className="label" htmlFor="isLive">
                <span className="label-text">Is Live</span>
              </label>
              <input
                id="isLive"
                type="checkbox"
                className="toggle"
                checked={food.isLive}
                onChange={(e: SyntheticEvent) => {
                  const toggle = e.target as HTMLInputElement;
                  setFood((prev) => {
                    return { ...prev, isLive: toggle.checked };
                  });
                }}
              />
            </div>
            <div className="form-group flex items-center space-x-2 my-3">
              <label className="label" htmlFor="isFeatured">
                <span className="label-text">Is Featured</span>
              </label>
              <input
                id="isFeatured"
                type="checkbox"
                className="toggle"
                checked={food.isFeatured}
                onChange={(e: SyntheticEvent) => {
                  const toggle = e.target as HTMLInputElement;
                  setFood((prev) => {
                    return { ...prev, isFeatured: toggle.checked };
                  });
                }}
              />
            </div>
            <div className="text-center mt-10">
              <button
                className={`btn disabled:pointer-events-none disabled:btn-disabled`}
                disabled={isAddingFood}
                type="submit"
              >
                {isAddingFood && (
                  <span className="loading loading-spinner"></span>
                )}
                {foodId !== "" ? "SAVE" : "ADD"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>,
    document.getElementsByTagName("body")[0]
  );
}

interface InputGroupProps {
  name: string;
  val: string | number;
  onInput: (name: string, val: string | number) => void;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  label?: string;
  type?: "text" | "number";
  [x: string]: any;
}

function InputGroup({
  name,
  val,
  onInput,
  leftElement,
  rightElement,
  label,
  type = "text",
  ...props
}: InputGroupProps) {
  return (
    <div className="form-control my-3">
      {label && (
        <label className="label" htmlFor={`input-group-${name}`}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className={`${leftElement || rightElement ? "input-group" : ""}`}>
        {leftElement}
        <input
          className="input input-bordered w-full"
          value={val}
          name={name}
          id={`input-group-${name}`}
          type={type}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            if (type === "number") {
              onInput(name, parseInt(input.value));
            } else {
              onInput(name, input.value);
            }
          }}
          {...props}
        />
        {rightElement}
      </div>
    </div>
  );
}

function InputGroupTextarea({
  name,
  val,
  onInput,
  label,
  ...props
}: InputGroupProps) {
  return (
    <div className="my-3 form-control">
      {label && (
        <label className="label" htmlFor={`input-group-${name}`}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea
        className="textarea textarea-bordered w-full"
        value={val}
        name={name}
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          onInput(name, input.value);
        }}
        {...props}
      />
    </div>
  );
}
