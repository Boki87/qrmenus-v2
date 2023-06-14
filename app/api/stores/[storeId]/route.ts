import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Store } from "@prisma/client";

const routeContextSchema = z.object({
  params: z.object({
    storeId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    //Validate the route params
    const { params } = routeContextSchema.parse(context);

    //verify if user has access to store
    if (!(await verifyCurrentUserHasAccessToStore(params.storeId))) {
      return new Response(null, { status: 403 });
    }
    //delete the store
    await db.store.delete({
      where: {
        id: params.storeId as string,
      },
    });
    return new Response(null, { status: 204 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

const storePutSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  description: z.string().optional(),
  annoucement: z.string().optional(),
});

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    //Validate the route params
    const { params } = routeContextSchema.parse(context);

    //verify if user has access to store
    if (!(await verifyCurrentUserHasAccessToStore(params.storeId))) {
      return new Response(null, { status: 403 });
    }

    //get the request body and validate it
    const json = await req.json();
    // const body = storePutSchema.parse(json);
    const body = json;
    //update store
    await db.store.update({
      data: body,
      where: {
        id: params.storeId,
      },
    });

    return new Response(null, { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log(e);
      return new Response(JSON.stringify(e.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToStore(storeId: string) {
  const session = await getServerSession(authOptions);
  const count = await db.store.count({
    where: {
      id: storeId,
      ownerId: session?.user.id,
    },
  });

  return count > 0;
}
