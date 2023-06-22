import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface ContextProps {
  params: {
    storeId: string;
    categoryId: string;
  };
}

export async function GET(req: Request, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const foods = await db.food.findMany({
      where: {
        foodCategoryId: context.params.categoryId,
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

export async function POST(req: Request, context: ContextProps) {
  try {
    const { params } = context;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    // return new Response(JSON.stringify(body));
    const newFood = await db.food.create({
      data: {
        name: "New Food",
        foodCategoryId: "asdf",
        storeId: "asdf",
      },
      select: {
        id: true,
        name: true,
      },
    });
    console.log(newFood);
    return new Response(JSON.stringify(newFood));
    // return new Response(JSON.stringify(newFood), { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request, context: ContextProps) {
  // await db.food.delete({
  //   where: {
  //     // id: "clixa8mig00019u86zm7ogmue",
  //   },
  // });

  return new Response(null, { status: 200 });
}
