import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface ContextProps {
  params: {
    foodId: string;
  };
}

export async function GET(req: Request, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const food = await db.food.findUnique({
      where: {
        id: context.params.foodId,
      },
    });

    return new Response(JSON.stringify(food));
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}

export async function PUT(req: Request, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const body = await req.json();

    const updatedFood = await db.food.update({
      data: body,
      where: {
        id: context.params.foodId,
      },
    });
    return new Response(JSON.stringify(updatedFood), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }
    const deletedFood = await db.food.delete({
      where: {
        id: context.params.foodId,
      },
    });
    return new Response(JSON.stringify(deletedFood), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 500 });
  }
}
