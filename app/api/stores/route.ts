import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const stores = await db.store.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        image: true,
      },
      where: {
        ownerId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return new Response(JSON.stringify(stores));
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    //TODO: check here if user is on pro plan to allow multiple stores
    const store = await db.store.create({
      data: {
        name: "Change me",
        ownerId: user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        image: true,
      },
    });
    return new Response(JSON.stringify(store));
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
