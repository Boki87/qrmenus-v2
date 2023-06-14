import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface ContextProps {
  params: {
    storeId: string;
  };
}

const postCategorySchema = z.object({
  operation: z.enum(["add", "delete"]),
  categoryId: z.string().optional(),
});

export async function POST(req: Request, context: ContextProps) {
  try {
    const { params } = context;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = postCategorySchema.parse(json);
    //workaround because nextjs has a error when method is DELETE
    //so need to handel delete here on post
    if (body.categoryId) {
      await db.foodCategory.delete({
        where: {
          id: body.categoryId,
        },
      });
      return new Response(null, { status: 204 });
    } else {
      const store = await db.foodCategory.create({
        data: {
          name: "Change me",
          storeId: params.storeId,
        },
        select: {
          id: true,
          name: true,
          updatedAt: true,
          createdAt: true,
        },
      });

      return new Response(JSON.stringify(store));
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

const categoryUpdateSchema = z.object({
  categoryId: z.string(),
  name: z.string(),
});

export async function PUT(req: Request, context: ContextProps) {
  try {
    const { params } = context;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = categoryUpdateSchema.parse(json);

    await db.foodCategory.update({
      data: {
        name: body.name,
      },
      where: {
        id: body.categoryId,
      },
    });
    return new Response(null, { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}
