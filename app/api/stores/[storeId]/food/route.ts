import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Food } from "@prisma/client";

interface ContextProps {
  params: {
    storeId: string;
  };
}

const getFoodParser = z.object({
  categoryId: z.string(),
});

export async function GET(req: Request, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    //validate req
    const body = getFoodParser.parse(await req.json());

    const foods = await db.food.findMany({
      where: {
        foodCategoryId: body.categoryId,
      },
    });

    return new Response(JSON.stringify(foods));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

type FoodType = Omit<Food, "createdAt" | "updatedAt" | "id">;
const postFoodParser = z.object({
  name: z.string().min(3),
  storeId: z.string(),
  foodCategoryId: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  comments: z.string().optional(),
  price: z.number().optional(),
  size: z.number().optional(),
  sizeUnit: z.string().optional(),
  prepTime: z.number().optional(),
  isLive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().default(0),
});

export async function POST(req: Request, context: ContextProps) {
  try {
    const { params } = context;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = postFoodParser.parse(json);
    const newFood = await db.food.create({
      data: body,
    });
    return new Response(JSON.stringify(newFood));
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log(e);
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    console.log(e);
    return new Response(null, { status: 500 });
  }
}
